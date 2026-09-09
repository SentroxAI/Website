/* -------------------------------------------------------------------------- */
/*                   PAYMENTS API — Admin Verify / Reject                     */
/*                                                                            */
/*  POST /api/payments/admin-verify                                           */
/*  Admin-only endpoint to verify or reject a pending UPI payment.            */
/*  Only users with role="admin" can call this.                               */
/* -------------------------------------------------------------------------- */

import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { z } from "zod/v4";

const adminVerifySchema = z.object({
    payment_id: z.string().uuid("Invalid payment ID"),
    action: z.enum(["verify", "reject"]),
    reason: z.string().optional(),
});

export async function POST(request: NextRequest) {
    try {
        /* ── Auth + admin role check ───────────────────────────────────── */
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const admin = createAdminClient();

        // Check admin role
        const { data: profile } = await admin
            .from("users")
            .select("role")
            .eq("id", user.id)
            .single<{ role: string }>();

        if (profile?.role !== "admin") {
            return NextResponse.json(
                { error: "Admin access required" },
                { status: 403 },
            );
        }

        /* ── Validate input ────────────────────────────────────────────── */
        const body = await request.json();
        const result = adminVerifySchema.safeParse(body);

        if (!result.success) {
            const firstError = result.error.issues[0];
            return NextResponse.json(
                { error: firstError?.message || "Invalid data" },
                { status: 400 },
            );
        }

        const { payment_id, action, reason } = result.data;

        /* ── Find payment ──────────────────────────────────────────────── */
        const { data: payment, error: findError } = await admin
            .from("payments")
            .select("id, status, amount, client_id, invoice_id, razorpay_payment_id")
            .eq("id", payment_id)
            .single();

        if (findError || !payment) {
            return NextResponse.json(
                { error: "Payment not found" },
                { status: 404 },
            );
        }

        if (payment.status !== "processing") {
            return NextResponse.json(
                { error: `Cannot ${action} a payment with status "${payment.status}"` },
                { status: 400 },
            );
        }

        /* ── Update payment status ─────────────────────────────────────── */
        const now = new Date().toISOString();

        if (action === "verify") {
            const { error: updateError } = await admin
                .from("payments")
                .update({
                    status: "completed",
                    metadata: {
                        upi_transaction_id: payment.razorpay_payment_id,
                        verified_at: now,
                        verified_by: user.id,
                    },
                })
                .eq("id", payment_id);

            if (updateError) {
                console.error("❌ Failed to verify payment:", updateError);
                return NextResponse.json(
                    { error: "Failed to verify payment" },
                    { status: 500 },
                );
            }

            // Update linked invoice if exists
            if (payment.invoice_id) {
                await admin
                    .from("invoices")
                    .update({
                        status: "paid",
                        paid_at: now,
                        payment_id: payment.id,
                    })
                    .eq("id", payment.invoice_id);
            }

            // Log transaction
            await admin.from("transactions").insert({
                client_id: payment.client_id,
                payment_id: payment.id,
                invoice_id: payment.invoice_id,
                type: "payment",
                amount: payment.amount,
                description: `UPI payment verified by admin (UTR: ${payment.razorpay_payment_id})`,
                metadata: { verified_by: user.id },
            });

            console.log("✅ Payment verified:", payment_id);
        } else {
            // Reject
            const { error: updateError } = await admin
                .from("payments")
                .update({
                    status: "failed",
                    failure_reason: reason || "Payment rejected by admin",
                    metadata: {
                        upi_transaction_id: payment.razorpay_payment_id,
                        rejected_at: now,
                        rejected_by: user.id,
                        rejection_reason: reason,
                    },
                })
                .eq("id", payment_id);

            if (updateError) {
                console.error("❌ Failed to reject payment:", updateError);
                return NextResponse.json(
                    { error: "Failed to reject payment" },
                    { status: 500 },
                );
            }

            console.log("❌ Payment rejected:", payment_id, reason);
        }

        return NextResponse.json({
            success: true,
            message: action === "verify"
                ? "Payment verified successfully"
                : "Payment rejected",
        });
    } catch (error) {
        console.error("❌ Admin verification failed:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Operation failed" },
            { status: 500 },
        );
    }
}
