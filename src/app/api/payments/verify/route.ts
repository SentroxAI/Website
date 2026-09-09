/* -------------------------------------------------------------------------- */
/*                    PAYMENTS API — UPI Confirmation                          */
/*                                                                            */
/*  POST /api/payments/verify                                                 */
/*  Customer submits their UPI Transaction ID / UTR number.                   */
/*  Status changes to "submitted" — admin must verify separately.             */
/*  NEVER marks payment as "paid" — only admin can do that.                   */
/* -------------------------------------------------------------------------- */

import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { z } from "zod/v4";

const confirmSchema = z.object({
    order_id: z.string().min(1, "Order ID is required"),
    upi_transaction_id: z.string().min(1, "UPI Transaction ID is required"),
});

export async function POST(request: NextRequest) {
    try {
        /* ── Auth check ────────────────────────────────────────────────── */
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        /* ── Validate input ────────────────────────────────────────────── */
        const body = await request.json();
        const result = confirmSchema.safeParse(body);

        if (!result.success) {
            const firstError = result.error.issues[0];
            return NextResponse.json(
                { error: firstError?.message || "Invalid data" },
                { status: 400 },
            );
        }

        const { order_id, upi_transaction_id } = result.data;
        const admin = createAdminClient();

        /* ── Find the payment record ───────────────────────────────────── */
        const { data: payment, error: findError } = await admin
            .from("payments")
            .select("id, status, amount, client_id")
            .eq("razorpay_order_id", order_id) // We reuse this column for order_id
            .single();

        if (findError || !payment) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 },
            );
        }

        if (payment.status !== "pending") {
            return NextResponse.json(
                { error: `Payment already ${payment.status}` },
                { status: 400 },
            );
        }

        /* ── Update to "submitted" ─────────────────────────────────────── */
        const { error: updateError } = await admin
            .from("payments")
            .update({
                status: "processing", // "processing" = submitted, awaiting admin verification
                razorpay_payment_id: upi_transaction_id, // Reuse column for UTR
                metadata: {
                    upi_transaction_id,
                    submitted_at: new Date().toISOString(),
                    submitted_by: user.id,
                },
            })
            .eq("id", payment.id);

        if (updateError) {
            console.error("❌ Failed to update payment:", updateError);
            return NextResponse.json(
                { error: "Failed to update payment record" },
                { status: 500 },
            );
        }

        /* ── Log transaction ───────────────────────────────────────────── */
        await admin.from("transactions").insert({
            client_id: payment.client_id,
            payment_id: payment.id,
            type: "payment",
            amount: payment.amount,
            description: `UPI payment confirmation submitted (UTR: ${upi_transaction_id})`,
            metadata: { order_id, upi_transaction_id },
        });

        console.log("📬 UPI confirmation submitted:", {
            orderId: order_id,
            utr: upi_transaction_id,
            amount: payment.amount,
            userId: user.id,
        });

        return NextResponse.json({
            success: true,
            message: "Payment confirmation submitted. Our team will verify it within 24 hours.",
        });
    } catch (error) {
        console.error("❌ Payment confirmation failed:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Confirmation failed" },
            { status: 500 },
        );
    }
}
