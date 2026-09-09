/* -------------------------------------------------------------------------- */
/*                     SUBSCRIPTIONS API                                      */
/*                                                                            */
/*  POST /api/subscriptions — Create a subscription                           */
/*  PATCH /api/subscriptions — Cancel/update a subscription                   */
/*  GET /api/subscriptions — Get subscriptions for a client                   */
/* -------------------------------------------------------------------------- */

import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import {
    createSubscription as createRazorpaySubscription,
    cancelSubscription as cancelRazorpaySubscription,
} from "@/lib/razorpay";

/* ── POST — Create subscription ───────────────────────────────────────────── */

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const body = await request.json();
        const { client_id, plan_id, billing_cycle = "monthly" } = body;

        if (!client_id || !plan_id) {
            return NextResponse.json(
                { error: "Missing required fields: client_id, plan_id" },
                { status: 400 },
            );
        }

        const admin = createAdminClient();

        /* ── Get plan details ──────────────────────────────────────────── */
        const { data: plan, error: planError } = await admin
            .from("subscription_plans")
            .select("*")
            .eq("id", plan_id)
            .eq("is_active", true)
            .single();

        if (planError || !plan) {
            return NextResponse.json(
                { error: "Plan not found or inactive" },
                { status: 404 },
            );
        }

        /* ── Check for existing active subscription ────────────────────── */
        const { data: existingSub } = await admin
            .from("subscriptions")
            .select("id, status")
            .eq("client_id", client_id)
            .in("status", ["active", "trialing"])
            .maybeSingle();

        if (existingSub) {
            return NextResponse.json(
                { error: "Client already has an active subscription. Cancel it first." },
                { status: 409 },
            );
        }

        /* ── Create Razorpay subscription (if plan has Razorpay ID) ────── */
        const razorpayPlanId = billing_cycle === "yearly"
            ? plan.razorpay_plan_id_yearly
            : plan.razorpay_plan_id_monthly;

        let razorpaySubscription = null;
        if (razorpayPlanId) {
            try {
                razorpaySubscription = await createRazorpaySubscription({
                    planId: razorpayPlanId,
                    notes: { client_id, plan_id },
                });
            } catch (err) {
                console.error("❌ Razorpay subscription creation failed:", err);
                // Continue — we'll still create the local record
            }
        }

        /* ── Calculate period ──────────────────────────────────────────── */
        const now = new Date();
        const periodEnd = new Date(now);
        if (billing_cycle === "yearly") {
            periodEnd.setFullYear(periodEnd.getFullYear() + 1);
        } else {
            periodEnd.setMonth(periodEnd.getMonth() + 1);
        }

        /* ── Create subscription record ────────────────────────────────── */
        const { data: subscription, error: subError } = await admin
            .from("subscriptions")
            .insert({
                client_id,
                plan_id,
                status: "active",
                billing_cycle,
                current_period_start: now.toISOString(),
                current_period_end: periodEnd.toISOString(),
                razorpay_subscription_id: razorpaySubscription?.id || null,
                razorpay_customer_id: razorpaySubscription?.customer_id || null,
            })
            .select()
            .single();

        if (subError) {
            console.error("❌ Failed to create subscription:", subError);
            return NextResponse.json(
                { error: "Failed to create subscription" },
                { status: 500 },
            );
        }

        /* ── Log transaction ───────────────────────────────────────────── */
        await admin.from("transactions").insert({
            client_id,
            type: "subscription_created",
            amount: billing_cycle === "yearly"
                ? Number(plan.price_yearly)
                : Number(plan.price_monthly),
            description: `Subscription created for ${plan.name} (${billing_cycle})`,
            metadata: { plan_id, billing_cycle },
        });

        return NextResponse.json({
            success: true,
            subscription,
            razorpay_subscription: razorpaySubscription,
        });
    } catch (error) {
        console.error("❌ Subscription creation failed:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Subscription failed" },
            { status: 500 },
        );
    }
}

/* ── PATCH — Update/Cancel subscription ───────────────────────────────────── */

export async function PATCH(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const body = await request.json();
        const { subscription_id, action } = body;

        if (!subscription_id || !action) {
            return NextResponse.json(
                { error: "Missing required fields: subscription_id, action" },
                { status: 400 },
            );
        }

        const admin = createAdminClient();

        const { data: subscription, error: fetchError } = await admin
            .from("subscriptions")
            .select("*")
            .eq("id", subscription_id)
            .single();

        if (fetchError || !subscription) {
            return NextResponse.json(
                { error: "Subscription not found" },
                { status: 404 },
            );
        }

        switch (action) {
            case "cancel": {
                const cancelAtEnd = body.cancel_at_period_end ?? true;

                // Cancel on Razorpay
                if (subscription.razorpay_subscription_id) {
                    try {
                        await cancelRazorpaySubscription(
                            subscription.razorpay_subscription_id,
                            cancelAtEnd,
                        );
                    } catch (err) {
                        console.error("❌ Razorpay cancellation failed:", err);
                    }
                }

                await admin
                    .from("subscriptions")
                    .update({
                        status: cancelAtEnd ? "active" : "cancelled",
                        cancel_at_period_end: cancelAtEnd,
                        cancelled_at: cancelAtEnd ? null : new Date().toISOString(),
                    })
                    .eq("id", subscription_id);

                await admin.from("transactions").insert({
                    client_id: subscription.client_id,
                    type: "subscription_cancelled",
                    amount: 0,
                    description: `Subscription ${cancelAtEnd ? "set to cancel at period end" : "cancelled immediately"}`,
                });

                return NextResponse.json({
                    success: true,
                    message: cancelAtEnd
                        ? "Subscription will be cancelled at the end of the current period"
                        : "Subscription cancelled immediately",
                });
            }

            case "pause": {
                await admin
                    .from("subscriptions")
                    .update({ status: "paused" })
                    .eq("id", subscription_id);

                return NextResponse.json({
                    success: true,
                    message: "Subscription paused",
                });
            }

            case "resume": {
                await admin
                    .from("subscriptions")
                    .update({
                        status: "active",
                        cancel_at_period_end: false,
                    })
                    .eq("id", subscription_id);

                return NextResponse.json({
                    success: true,
                    message: "Subscription resumed",
                });
            }

            default:
                return NextResponse.json(
                    { error: `Unknown action: ${action}` },
                    { status: 400 },
                );
        }
    } catch (error) {
        console.error("❌ Subscription update failed:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Update failed" },
            { status: 500 },
        );
    }
}

/* ── GET — List subscriptions ─────────────────────────────────────────────── */

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 },
            );
        }

        const { searchParams } = new URL(request.url);
        const clientId = searchParams.get("client_id");

        const admin = createAdminClient();

        let query = admin
            .from("subscriptions")
            .select("*, plan:subscription_plans(*)")
            .order("created_at", { ascending: false });

        if (clientId) {
            query = query.eq("client_id", clientId);
        }

        const { data, error } = await query;

        if (error) {
            console.error("❌ Failed to fetch subscriptions:", error);
            return NextResponse.json(
                { error: "Failed to fetch subscriptions" },
                { status: 500 },
            );
        }

        return NextResponse.json({ subscriptions: data });
    } catch (error) {
        console.error("❌ Subscription fetch failed:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Fetch failed" },
            { status: 500 },
        );
    }
}
