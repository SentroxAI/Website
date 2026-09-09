"use server";

/* -------------------------------------------------------------------------- */
/*                        AUTH SERVER ACTIONS                                  */
/*                                                                            */
/*  Server-side actions for authentication flows:                             */
/*  sign up, sign in, sign out, password reset, password update.              */
/*  Each action validates input with Zod and returns a typed result.          */
/* -------------------------------------------------------------------------- */

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import {
    signUpSchema,
    signInSchema,
    resetPasswordSchema,
    updatePasswordSchema,
} from "@/lib/validations";
import { checkLockout, recordFailedAttempt, clearAttempts } from "@/lib/security/lockout";
import { writeAuditLog } from "@/lib/security/audit";

/* ── Types ────────────────────────────────────────────────────────────────── */

export interface AuthActionResult {
    success: boolean;
    error?: string;
    message?: string;
}

/* ── Sign Up ──────────────────────────────────────────────────────────────── */

export async function signUp(
    _prevState: AuthActionResult | undefined,
    formData: FormData,
    redirectTo?: string,
): Promise<AuthActionResult> {
    const raw = {
        full_name: formData.get("full_name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
        confirm_password: formData.get("confirm_password") as string,
    };

    // Validate
    const result = signUpSchema.safeParse(raw);
    if (!result.success) {
        const firstError = result.error.issues[0];
        return { success: false, error: firstError?.message || "Invalid input" };
    }

    const { email, password, full_name } = result.data;
    const supabase = await createClient();

    // Build the email verification callback URL, preserving any redirect target
    const callbackUrl = redirectTo
        ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?next=${encodeURIComponent(redirectTo)}`
        : `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`;

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name,
            },
            emailRedirectTo: callbackUrl,
        },
    });

    if (error) {
        return { success: false, error: error.message };
    }

    return {
        success: true,
        message: "Check your email to verify your account.",
    };
}

/* ── Sign In ──────────────────────────────────────────────────────────────── */

export async function signIn(
    _prevState: AuthActionResult | undefined,
    formData: FormData,
    redirectTo?: string,
): Promise<AuthActionResult> {
    const raw = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    // Validate
    const result = signInSchema.safeParse(raw);

    if (!result.success) {
        return {
            success: false,
            error: result.error.issues[0]?.message ?? "Invalid input",
        };
    }

    const { email, password } = result.data;

    /* ── Check account lockout ────────────────────────────────────── */
    const lockoutStatus = checkLockout(email);

    if (lockoutStatus.locked) {
        // Log the locked attempt
        writeAuditLog({
            action: "auth.login_failed",
            severity: "warning",
            userEmail: email,
            details: {
                reason: "account_locked",
                lockedUntil: lockoutStatus.lockedUntil,
                lockoutMinutes: lockoutStatus.lockoutMinutes,
            },
        });

        return {
            success: false,
            error: `Account temporarily locked due to too many failed attempts. Try again in ${lockoutStatus.lockoutMinutes} minute${lockoutStatus.lockoutMinutes === 1 ? "" : "s"}.`,
        };
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        /* ── Record failed attempt ────────────────────────────────── */
        const updatedStatus = recordFailedAttempt(email);

        writeAuditLog({
            action: "auth.login_failed",
            severity: updatedStatus.locked ? "warning" : "info",
            userEmail: email,
            details: {
                reason: error.message,
                remainingAttempts: updatedStatus.remainingAttempts,
                locked: updatedStatus.locked,
            },
        });

        if (updatedStatus.locked) {
            return {
                success: false,
                error: `Too many failed login attempts. Account locked for ${updatedStatus.lockoutMinutes} minutes.`,
            };
        }

        const attemptsMsg = updatedStatus.remainingAttempts <= 2
            ? ` (${updatedStatus.remainingAttempts} attempt${updatedStatus.remainingAttempts === 1 ? "" : "s"} remaining)`
            : "";

        return {
            success: false,
            error: `${error.message}${attemptsMsg}`,
        };
    }

    /* ── Successful login — clear attempts ────────────────────────── */
    clearAttempts(email);

    revalidatePath("/", "layout");

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (user) {
        /* ── Audit log success ────────────────────────────────────── */
        writeAuditLog({
            action: "auth.login_success",
            userId: user.id,
            userEmail: email,
        });

        const { data: profile } = await supabase
            .from("users")
            .select("role")
            .eq("id", user.id)
            .single();

        const userProfile = profile as {
            role: "admin" | "client" | "team";
        } | null;

        if (userProfile?.role === "admin" && !redirectTo) {
            redirect("/admin");
        }
    }

    redirect(redirectTo || "/dashboard");

    // Unreachable, but satisfies TypeScript
    return {
        success: true,
    };
}


/* ── Sign Out ─────────────────────────────────────────────────────────────── */

export async function signOut(): Promise<void> {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath("/", "layout");
    redirect("/");
}

/* ── Reset Password (send email) ──────────────────────────────────────────── */

export async function resetPassword(
    _prevState: AuthActionResult | undefined,
    formData: FormData,
): Promise<AuthActionResult> {
    const raw = {
        email: formData.get("email") as string,
    };

    const result = resetPasswordSchema.safeParse(raw);
    if (!result.success) {
        const firstError = result.error.issues[0];
        return { success: false, error: firstError?.message || "Invalid input" };
    }

    const { email } = result.data;
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?next=/update-password`,
    });

    if (error) {
        return { success: false, error: error.message };
    }

    return {
        success: true,
        message: "Check your email for a password reset link.",
    };

}

/* ── Update Password (for logged-in users) ────────────────────────────────── */

export async function updatePassword(
    _prevState: AuthActionResult | undefined,
    formData: FormData,
): Promise<AuthActionResult> {
    const raw = {
        password: formData.get("password") as string,
        confirm_password: formData.get("confirm_password") as string,
    };

    const result = updatePasswordSchema.safeParse(raw);
    if (!result.success) {
        const firstError = result.error.issues[0];
        return { success: false, error: firstError?.message || "Invalid input" };
    }

    const { password } = result.data;
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
        return { success: false, error: error.message };
    }

    return {
        success: true,
        message: "Password updated successfully.",
    };
}
