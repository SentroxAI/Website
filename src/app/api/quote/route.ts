import { NextResponse } from "next/server";

import { quoteFormSchema } from "@/lib/validations";
import {
    sendEmail,
    buildQuoteNotificationEmail,
    buildQuoteAutoReplyEmail,
    NOTIFICATION_EMAIL,
} from "@/services/email";
import { createAdminClient } from "@/lib/supabase/server";

/* -------------------------------------------------------------------------- */
/*                         QUOTE FORM API ROUTE                               */
/*                                                                            */
/*  1. Validates input with Zod (quoteFormSchema)                             */
/*  2. Stores the submission in the `leads` table via Supabase                */
/*  3. Sends notification email to team (Resend)                              */
/*  4. Sends auto-reply email to user (Resend)                                */
/* -------------------------------------------------------------------------- */

export async function POST(request: Request) {
    try {
        const body = await request.json();

        /* ── Validate with Zod ─────────────────────────────────────────── */

        const result = quoteFormSchema.safeParse(body);

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

        const quoteDetails = data.line_items
            .map((li) => `${li.name}${li.qty ? ` ×${li.qty}` : ""}: ₹${li.amount}${li.unit === "mo" ? "/mo" : ""}`)
            .join("\n");

        const messageBody = [
            data.notes ? `Notes: ${data.notes}` : "",
            `\n--- Quote Details (${data.display_currency}) ---`,
            `One-time: ₹${data.one_time_total}`,
            data.monthly_total > 0 ? `Monthly: ₹${data.monthly_total}/mo` : "",
            `\nLine items:\n${quoteDetails}`,
        ].filter(Boolean).join("\n");

        const { error: dbError } = await supabase.from("leads").insert({
            name: data.name,
            email: data.email,
            phone: data.phone || null,
            company: data.company || null,
            service: "quote_calculator",
            budget: `₹${data.one_time_total.toLocaleString("en-IN")}`,
            message: messageBody,
            source: "quote_calculator",
        });

        if (dbError) {
            console.error("Failed to store quote lead:", dbError.message);
            // Continue with email even if DB fails — don't lose the lead
        }

        /* ── Send notification to team ─────────────────────────────────── */

        const notification = buildQuoteNotificationEmail(data);
        const notifResult = await sendEmail({
            to: NOTIFICATION_EMAIL,
            subject: notification.subject,
            html: notification.html,
            replyTo: data.email,
        });

        if (!notifResult.success) {
            console.error("Failed to send quote notification:", notifResult.error);
        }

        /* ── Send auto-reply to user ───────────────────────────────────── */

        const autoReply = buildQuoteAutoReplyEmail(data.name, {
            oneTime: data.one_time_total,
            monthly: data.monthly_total,
            currency: data.display_currency,
            lineItems: data.line_items,
        });
        const replyResult = await sendEmail({
            to: data.email,
            subject: autoReply.subject,
            html: autoReply.html,
        });

        if (!replyResult.success) {
            console.error("Failed to send quote auto-reply:", replyResult.error);
        }

        /* ── Log submission ────────────────────────────────────────────── */

        console.log("📬 Quote calculator submission:", {
            name: data.name,
            email: data.email,
            oneTime: data.one_time_total,
            monthly: data.monthly_total,
            currency: data.display_currency,
            itemCount: data.line_items.length,
            timestamp: new Date().toISOString(),
            savedToDb: !dbError,
            emailSent: notifResult.success,
        });

        return NextResponse.json(
            { success: true, message: "Quote received successfully" },
            { status: 200 },
        );
    } catch (error) {
        console.error("❌ Quote form error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 },
        );
    }
}
