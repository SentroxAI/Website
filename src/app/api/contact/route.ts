import { NextResponse } from "next/server";

import { contactFormSchema } from "@/lib/validations";
import {
    sendEmail,
    buildContactNotificationEmail,
    buildContactAutoReplyEmail,
    NOTIFICATION_EMAIL,
} from "@/services/email";
import { createAdminClient } from "@/lib/supabase/server";

/* -------------------------------------------------------------------------- */
/*                         CONTACT FORM API ROUTE                             */
/*                                                                            */
/*  1. Validates input with Zod                                               */
/*  2. Stores the submission in the `leads` table via Supabase                */
/*  3. Sends notification email to team                                       */
/*  4. Sends auto-reply email to user                                         */
/* -------------------------------------------------------------------------- */

export async function POST(request: Request) {
    try {
        const body = await request.json();

        /* ── Validate with Zod ─────────────────────────────────────────── */

        const result = contactFormSchema.safeParse(body);

        if (!result.success) {
            const firstError = result.error.issues[0];
            return NextResponse.json(
                { error: firstError?.message || "Invalid form data" },
                { status: 400 },
            );
        }

        const data = result.data;

        /* ── Store lead in Supabase ────────────────────────────────────── */

        const supabase = createAdminClient();

        const { error: dbError } = await supabase.from("leads").insert({
            name: data.name,
            email: data.email,
            phone: data.phone || null,
            company: data.company || null,
            service: data.service,
            budget: data.budget || null,
            message: data.message,
            source: "contact_form",
        });

        if (dbError) {
            console.error("Failed to store lead:", dbError.message);
            // Continue with email even if DB fails — don't lose the lead
        }

        /* ── Send notification to team ─────────────────────────────────── */

        const notification = buildContactNotificationEmail(data);
        const notifResult = await sendEmail({
            to: NOTIFICATION_EMAIL,
            subject: notification.subject,
            html: notification.html,
            replyTo: data.email,
        });

        if (!notifResult.success) {
            console.error("Failed to send notification:", notifResult.error);
        }

        /* ── Send auto-reply to user ───────────────────────────────────── */

        const autoReply = buildContactAutoReplyEmail(data.name);
        const replyResult = await sendEmail({
            to: data.email,
            subject: autoReply.subject,
            html: autoReply.html,
        });

        if (!replyResult.success) {
            console.error("Failed to send auto-reply:", replyResult.error);
        }

        /* ── Log submission ────────────────────────────────────────────── */

        console.log("📬 Contact form submission:", {
            name: data.name,
            email: data.email,
            service: data.service,
            timestamp: new Date().toISOString(),
            savedToDb: !dbError,
            emailSent: notifResult.success,
        });

        return NextResponse.json(
            { success: true, message: "Message received successfully" },
            { status: 200 },
        );
    } catch (error) {
        console.error("❌ Contact form error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
