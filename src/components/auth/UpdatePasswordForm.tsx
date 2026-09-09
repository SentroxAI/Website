"use client";

/* -------------------------------------------------------------------------- */
/*                       UPDATE PASSWORD FORM                                  */
/*                                                                            */
/*  Set new password form after clicking a reset link.                        */
/*  Includes password strength indicator and redirect countdown.              */
/* -------------------------------------------------------------------------- */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
    LuLock,
    LuEye,
    LuEyeOff,
    LuLoaderCircle,
    LuCircleCheck,
    LuShieldCheck,
} from "react-icons/lu";
import { toast } from "sonner";

import { updatePassword } from "@/app/actions/auth";
import {
    updatePasswordSchema,
    type UpdatePasswordFormData,
} from "@/lib/validations";
import { cn } from "@/lib/utils";
import PasswordStrength from "./PasswordStrength";

const stagger = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" as const },
    },
};

export default function UpdatePasswordForm() {
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [countdown, setCountdown] = useState(5);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<UpdatePasswordFormData>({
        resolver: zodResolver(updatePasswordSchema),
    });

    const passwordValue = watch("password", "");

    // Countdown redirect after success
    useEffect(() => {
        if (!isSuccess) return;

        if (countdown <= 0) {
            router.push("/dashboard");
            return;
        }

        const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [isSuccess, countdown, router]);

    const onSubmit = async (data: UpdatePasswordFormData) => {
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.set("password", data.password);
            formData.set("confirm_password", data.confirm_password);

            const result = await updatePassword(undefined, formData);

            if (result.success) {
                setIsSuccess(true);
                toast.success(
                    result.message || "Password updated successfully!",
                );
            } else {
                toast.error(result.error || "Failed to update password");
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ── Success state ───────────────────────────────────────────────── */
    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center space-y-6 py-4 text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: 0.2,
                    }}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl"
                >
                    <LuCircleCheck className="h-10 w-10 text-emerald-400" />
                </motion.div>

                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-white">
                        Password updated!
                    </h2>
                    <p className="mx-auto max-w-xs text-sm leading-relaxed text-slate-400">
                        Your password has been changed successfully.
                        Redirecting to dashboard in{" "}
                        <span className="font-semibold text-white">
                            {countdown}s
                        </span>
                    </p>
                </div>

                {/* Progress bar */}
                <div className="h-1 w-48 overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500"
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: 5, ease: "linear" }}
                    />
                </div>
            </motion.div>
        );
    }

    /* ── Form state ──────────────────────────────────────────────────── */
    return (
        <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            {/* ── Header ─────────────────────────────────────────────── */}
            <motion.div variants={fadeUp} className="space-y-2">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl">
                    <LuShieldCheck className="h-6 w-6 text-blue-400" />
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-white">
                    Set new password
                </h1>
                <p className="text-sm text-slate-400">
                    Choose a strong password for your account
                </p>
            </motion.div>

            {/* ── Form ───────────────────────────────────────────────── */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Password */}
                <motion.div variants={fadeUp} className="space-y-2">
                    <label
                        htmlFor="update-password"
                        className="block text-sm font-medium text-slate-300"
                    >
                        New Password
                    </label>
                    <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                            <LuLock className="h-4 w-4" />
                        </span>
                        <input
                            id="update-password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="••••••••"
                            {...register("password")}
                            className={cn(
                                "w-full rounded-2xl border bg-white/[0.04] py-3.5 pl-11 pr-12",
                                "text-white placeholder:text-slate-600",
                                "outline-none backdrop-blur-xl",
                                "transition-all duration-300",
                                "focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20",
                                errors.password
                                    ? "border-red-500/50"
                                    : "border-white/[0.08] hover:border-white/[0.15]",
                            )}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                        >
                            {showPassword ? (
                                <LuEyeOff className="h-4 w-4" />
                            ) : (
                                <LuEye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    <PasswordStrength password={passwordValue} />
                    {errors.password && (
                        <p className="text-xs text-red-400">
                            {errors.password.message}
                        </p>
                    )}
                </motion.div>

                {/* Confirm Password */}
                <motion.div variants={fadeUp} className="space-y-2">
                    <label
                        htmlFor="update-confirm"
                        className="block text-sm font-medium text-slate-300"
                    >
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                            <LuLock className="h-4 w-4" />
                        </span>
                        <input
                            id="update-confirm"
                            type={showConfirm ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="••••••••"
                            {...register("confirm_password")}
                            className={cn(
                                "w-full rounded-2xl border bg-white/[0.04] py-3.5 pl-11 pr-12",
                                "text-white placeholder:text-slate-600",
                                "outline-none backdrop-blur-xl",
                                "transition-all duration-300",
                                "focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20",
                                errors.confirm_password
                                    ? "border-red-500/50"
                                    : "border-white/[0.08] hover:border-white/[0.15]",
                            )}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                        >
                            {showConfirm ? (
                                <LuEyeOff className="h-4 w-4" />
                            ) : (
                                <LuEye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    {errors.confirm_password && (
                        <p className="text-xs text-red-400">
                            {errors.confirm_password.message}
                        </p>
                    )}
                </motion.div>

                {/* Submit */}
                <motion.div variants={fadeUp}>
                    <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className={cn(
                            "group relative flex w-full items-center justify-center gap-2 rounded-2xl py-3.5",
                            "bg-gradient-to-r from-blue-600 to-blue-500",
                            "text-sm font-semibold text-white",
                            "shadow-[0_4px_20px_rgba(37,99,235,0.3)]",
                            "transition-all duration-300",
                            "hover:shadow-[0_8px_30px_rgba(37,99,235,0.4)]",
                            "disabled:cursor-not-allowed disabled:opacity-60",
                        )}
                    >
                        {isSubmitting ? (
                            <LuLoaderCircle className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                Update Password
                                <LuShieldCheck className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            </>
                        )}
                    </motion.button>
                </motion.div>
            </form>
        </motion.div>
    );
}
