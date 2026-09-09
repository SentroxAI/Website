import { NextResponse } from "next/server";

import { newsletterSchema } from "@/lib/validations";
import {
    sendEmail,
    buildNewsletterWelcomeEmail,
} from "@/services/email";
import { createAdminClient } from "@/lib/supabase/server";

/* -------------------------------------------------------------------------- */
/*                       NEWSLETTER SUBSCRIBE API ROUTE                       */
/*                                                                            */
/*  1. Validates input with Zod                                               */
/*  2. Stores the subscription in `newsletter_subscribers` via Supabase       */
/*  3. Handles duplicate emails gracefully                                    */
/*  4. Sends welcome email                                                    */
/* -------------------------------------------------------------------------- */

export async function POST(request: Request) {
    try {
        const body = await request.json();

        /* ── Validate with Zod ─────────────────────────────────────────── */

        const result = newsletterSchema.safeParse(body);

        if (!result.success) {
            const firstError = result.error.issues[0];
            return NextResponse.json(
                { error: firstError?.message || "Invalid email" },
                { status: 400 },
            );
        }

        const { email } = result.data;

        /* ── Store in Supabase (with duplicate handling) ───────────────── */

        const supabase = createAdminClient();

        // Check for existing subscriber
        const { data: existing } = await supabase
            .from("newsletter_subscribers")
            .select("id, is_active")
            .eq("email", email)
            .single();

        if (existing) {
            if (existing.is_active) {
                return NextResponse.json(
                    { success: true, message: "You're already subscribed!" },
                    { status: 200 },
                );
            }

            // Re-activate a previously unsubscribed email
            await supabase
                .from("newsletter_subscribers")
                .update({ is_active: true })
                .eq("id", existing.id);
        } else {
            const { error: dbError } = await supabase
                .from("newsletter_subscribers")
                .insert({ email });

            if (dbError) {
                console.error("Failed to store subscriber:", dbError.message);
                // Continue with email even if DB fails
            }
        }

        /* ── Send welcome email ────────────────────────────────────────── */

        const welcome = buildNewsletterWelcomeEmail();
        const emailResult = await sendEmail({
            to: email,
            subject: welcome.subject,
            html: welcome.html,
        });

        if (!emailResult.success) {
            console.error("Failed to send welcome email:", emailResult.error);
        }

        /* ── Log subscription ──────────────────────────────────────────── */

        console.log("📧 Newsletter subscription:", {
            email,
            timestamp: new Date().toISOString(),
            reactivated: existing && !existing.is_active,
            welcomeSent: emailResult.success,
        });

        return NextResponse.json(
            { success: true, message: "Subscribed successfully" },
            { status: 200 },
        );
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
