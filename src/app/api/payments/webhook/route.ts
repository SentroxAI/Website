/* -------------------------------------------------------------------------- */
/*                      RAZORPAY WEBHOOK HANDLER                              */
/*                                                                            */
/*  ⚠️  DEPRECATED — Not currently in use.                                   */
/*  Kept for future reactivation when Razorpay is configured.                */
/*  Current payment method: Direct UPI with manual admin verification.       */
/*                                                                            */
/*  POST /api/payments/webhook                                                */
/*  Handles Razorpay webhooks for payment/subscription events.                */
/*  Verifies signature, processes events idempotently.                        */
/* -------------------------------------------------------------------------- */

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { verifyWebhookSignature } from "@/lib/razorpay";
import type { RazorpayWebhookEvent } from "@/types/billing";

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const signature = request.headers.get("x-razorpay-signature") || "";

        /* ── Verify webhook signature ──────────────────────────────────── */
        if (!verifyWebhookSignature(body, signature)) {
            console.error("❌ Invalid webhook signature");
            return NextResponse.json(
                { error: "Invalid signature" },
                { status: 400 },
            );
        }

        const event: RazorpayWebhookEvent = JSON.parse(body);
        const admin = createAdminClient();

        console.log(`📨 Webhook received: ${event.event}`);

        /* ── Process event ─────────────────────────────────────────────── */
        switch (event.event) {
            /* ── Payment captured ──────────────────────────────────────── */
            case "payment.captured": {
                const payment = event.payload.payment?.entity;
                if (!payment) break;

                // Idempotency check — skip if already processed
                const { data: existing } = await admin
                    .from("payments")
                    .select("id, status")
                    .eq("razorpay_payment_id", payment.id)
                    .maybeSingle();

                if (existing?.status === "completed") {
                    console.log("⏭️ Payment already processed:", payment.id);
                    break;
                }

                // Update payment record
                await admin
                    .from("payments")
                    .update({
                        status: "completed",
                        razorpay_payment_id: payment.id,
                        metadata: {
                            method: payment.method,
                            email: payment.email,
                            contact: payment.contact,
                            fee: payment.fee,
                            tax: payment.tax,
                        },
                    })
                    .eq("razorpay_order_id", payment.order_id);

                // Log transaction
                const clientId = payment.notes?.client_id;
                if (clientId) {
                    await admin.from("transactions").insert({
                        client_id: clientId,
                        type: "payment",
                        amount: payment.amount / 100,
                        description: `Payment captured (${payment.id})`,
                        metadata: { razorpay_payment_id: payment.id },
                    });
                }
                break;
            }

            /* ── Payment failed ────────────────────────────────────────── */
            case "payment.failed": {
                const payment = event.payload.payment?.entity;
                if (!payment) break;

                await admin
                    .from("payments")
                    .update({
                        status: "failed",
                        failure_reason: payment.error_description || "Payment failed",
                        metadata: {
                            error_code: payment.error_code,
                            error_description: payment.error_description,
                        },
                    })
                    .eq("razorpay_order_id", payment.order_id);
                break;
            }

            /* ── Subscription activated ────────────────────────────────── */
            case "subscription.activated": {
                const sub = event.payload.subscription?.entity;
                if (!sub) break;

                await admin
                    .from("subscriptions")
                    .update({
                        status: "active",
                        razorpay_subscription_id: sub.id,
                        current_period_start: sub.current_start
                            ? new Date(sub.current_start * 1000).toISOString()
                            : undefined,
                        current_period_end: sub.current_end
                            ? new Date(sub.current_end * 1000).toISOString()
                            : undefined,
                    })
                    .eq("razorpay_subscription_id", sub.id);

                const clientId = sub.notes?.client_id;
                if (clientId) {
                    await admin.from("transactions").insert({
                        client_id: clientId,
                        type: "subscription_renewed",
                        amount: 0,
                        description: `Subscription activated (${sub.id})`,
                    });
                }
                break;
            }

            /* ── Subscription cancelled ────────────────────────────────── */
            case "subscription.cancelled": {
                const sub = event.payload.subscription?.entity;
                if (!sub) break;

                await admin
                    .from("subscriptions")
                    .update({
                        status: "cancelled",
                        cancelled_at: new Date().toISOString(),
                    })
                    .eq("razorpay_subscription_id", sub.id);

                const clientId = sub.notes?.client_id;
                if (clientId) {
                    await admin.from("transactions").insert({
                        client_id: clientId,
                        type: "subscription_cancelled",
                        amount: 0,
                        description: `Subscription cancelled (${sub.id})`,
                    });
                }
                break;
            }

            /* ── Subscription halted (payment failed) ──────────────────── */
            case "subscription.halted": {
                const sub = event.payload.subscription?.entity;
                if (!sub) break;

                await admin
                    .from("subscriptions")
                    .update({ status: "past_due" })
                    .eq("razorpay_subscription_id", sub.id);
                break;
            }

            /* ── Refund processed ──────────────────────────────────────── */
            case "refund.processed": {
                const refund = event.payload.refund?.entity;
                if (!refund) break;

                await admin
                    .from("payments")
                    .update({
                        status: refund.amount === 0 ? "refunded" : "partially_refunded",
                        refund_amount: refund.amount / 100,
                        refunded_at: new Date().toISOString(),
                    })
                    .eq("razorpay_payment_id", refund.payment_id);

                await admin.from("transactions").insert({
                    type: "refund",
                    amount: refund.amount / 100,
                    description: `Refund processed for payment ${refund.payment_id}`,
                    metadata: { razorpay_refund_id: refund.id },
                });
                break;
            }

            default:
                console.log(`⚠️ Unhandled webhook event: ${event.event}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("❌ Webhook processing failed:", error);
        return NextResponse.json(
            { error: "Webhook processing failed" },
            { status: 500 },
        );
    }
}
