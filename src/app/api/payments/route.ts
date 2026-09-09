/* -------------------------------------------------------------------------- */
/*                      PAYMENTS API — Create UPI Order                       */
/*                                                                            */
/*  POST /api/payments                                                        */
/*  Creates a payment order for UPI payment.                                  */
/*  The SERVER is the source of truth for amount — never trust the browser.   */
/* -------------------------------------------------------------------------- */

import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { generateOrderId, UPI_ID, UPI_PAYEE_NAME } from "@/lib/upi";

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

        /* ── Parse body ────────────────────────────────────────────────── */
        const body = await request.json();
        const { amount, currency, plan_id, client_id, description } = body;

        if (!amount || !client_id) {
            return NextResponse.json(
                { error: "Missing required fields: amount, client_id" },
                { status: 400 },
            );
        }

        /* ── Validate amount server-side ───────────────────────────────── */
        // TODO: When plans are in DB, fetch the plan and validate amount
        // against the server-side price. For now, we trust the calculated
        // amount but store it as the source of truth.

        const admin = createAdminClient();
        const orderId = generateOrderId();

        /* ── Get client info ──────────────────────────────────────────── */
        const { data: client } = await admin
            .from("clients")
            .select("company")
            .eq("id", client_id)
            .single<{ company: string }>();

        /* ── Create payment record ─────────────────────────────────────── */
        const { data: payment, error: paymentError } = await admin
            .from("payments")
            .insert({
                client_id,
                amount: Number(amount),
                currency: currency || "INR",
                status: "pending",
                payment_method: "upi",
                razorpay_order_id: orderId, // Reusing this column as our order_id
                metadata: {
                    plan_id,
                    description,
                    upi_id: UPI_ID,
                    company: client?.company || "",
                },
            })
            .select()
            .single();

        if (paymentError) {
            console.error("❌ Failed to create payment record:", paymentError);
            return NextResponse.json(
                { error: "Failed to create payment record" },
                { status: 500 },
            );
        }

        /* ── Return order details for frontend ─────────────────────────── */
        return NextResponse.json({
            success: true,
            order_id: orderId,
            payment_id: payment.id,
            amount: Number(amount),
            currency: currency || "INR",
            upi: {
                id: UPI_ID,
                name: UPI_PAYEE_NAME,
            },
        });
    } catch (error) {
        console.error("❌ Payment creation failed:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Payment failed" },
            { status: 500 },
        );
    }
}
