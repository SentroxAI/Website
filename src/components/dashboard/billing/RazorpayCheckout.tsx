"use client";

/* -------------------------------------------------------------------------- */
/*                       RAZORPAY CHECKOUT                                    */
/*                                                                            */
/*  ⚠️  DEPRECATED — Replaced by UpiCheckout.tsx                             */
/*  Kept for future reactivation when Razorpay credentials are configured.    */
/*                                                                            */
/*  Sprint 4 — Module 1: Razorpay checkout integration.                      */
/*  Loads Razorpay script, creates order, handles payment flow.              */
/* -------------------------------------------------------------------------- */

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Shield,
    Lock,
    CreditCard,
    Loader2,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/providers/AuthProvider";
import type { SubscriptionPlan, BillingCycle } from "@/types/billing";

/* ── Razorpay Window Type ──────────────────────────────────────────────────── */

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    theme?: {
        color?: string;
    };
    handler: (response: RazorpayResponse) => void;
    modal?: {
        ondismiss?: () => void;
    };
}

interface RazorpayInstance {
    open: () => void;
    close: () => void;
}

interface RazorpayResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

/* ── Props ─────────────────────────────────────────────────────────────────── */

interface RazorpayCheckoutProps {
    plan: SubscriptionPlan;
    billingCycle: BillingCycle;
    onClose: () => void;
    onSuccess?: () => void;
}

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function RazorpayCheckout({
    plan,
    billingCycle,
    onClose,
    onSuccess,
}: RazorpayCheckoutProps) {
    const { profile } = useAuthContext();
    const [status, setStatus] = useState<"loading" | "ready" | "processing" | "success" | "error">("loading");
    const [errorMessage, setErrorMessage] = useState("");
    const scriptLoaded = useRef(false);

    const amount = billingCycle === "monthly" ? plan.price_monthly : plan.price_yearly;

    /* ── Load Razorpay script ──────────────────────────────────────── */
    useEffect(() => {
        if (scriptLoaded.current) {
            setStatus("ready");
            return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => {
            scriptLoaded.current = true;
            setStatus("ready");
        };
        script.onerror = () => {
            setStatus("error");
            setErrorMessage("Failed to load payment gateway");
        };
        document.body.appendChild(script);

        return () => {
            // Don't remove script on unmount — keep it cached
        };
    }, []);

    /* ── Initiate Payment ──────────────────────────────────────────── */
    const handlePayment = async () => {
        setStatus("processing");

        try {
            /* Step 1: Create order on server */
            const orderResponse = await fetch("/api/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount,
                    currency: plan.currency || "INR",
                    plan_id: plan.id,
                    client_id: profile?.id || "", // Will need client_id from profile
                    description: `${plan.name} Plan — ${billingCycle}`,
                }),
            });

            const orderData = await orderResponse.json();

            if (!orderResponse.ok || !orderData.success) {
                throw new Error(orderData.error || "Failed to create order");
            }

            /* Step 2: Open Razorpay checkout */
            const rzp = new window.Razorpay({
                key: orderData.key,
                amount: orderData.order.amount,
                currency: orderData.order.currency,
                name: "Sentrox AI",
                description: `${plan.name} Plan — ${billingCycle === "monthly" ? "Monthly" : "Yearly"}`,
                order_id: orderData.order.id,
                prefill: {
                    name: profile?.full_name || "",
                    email: profile?.email || "",
                },
                theme: {
                    color: "#2563eb",
                },
                handler: async (response: RazorpayResponse) => {
                    /* Step 3: Verify payment on server */
                    try {
                        const verifyResponse = await fetch("/api/payments/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                payment_id: orderData.payment_id,
                            }),
                        });

                        const verifyData = await verifyResponse.json();

                        if (verifyData.success) {
                            setStatus("success");
                            onSuccess?.();
                        } else {
                            throw new Error(verifyData.error || "Verification failed");
                        }
                    } catch {
                        setStatus("error");
                        setErrorMessage("Payment verification failed. Contact support if amount was deducted.");
                    }
                },
                modal: {
                    ondismiss: () => {
                        setStatus("ready");
                    },
                },
            });

            rzp.open();
        } catch (error) {
            setStatus("error");
            setErrorMessage(error instanceof Error ? error.message : "Payment failed");
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0f1e] shadow-2xl"
                >
                    {/* ── Header ────────────────────────────────────────── */}
                    <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
                        <h3 className="text-lg font-semibold text-white">
                            Checkout
                        </h3>
                        <button
                            onClick={onClose}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-sx-text-subtle hover:bg-white/5 hover:text-white transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* ── Content ───────────────────────────────────────── */}
                    <div className="p-6">
                        {status === "success" ? (
                            /* Success state */
                            <div className="flex flex-col items-center py-8 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                    className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 mb-4"
                                >
                                    <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                                </motion.div>
                                <h4 className="text-lg font-bold text-white">Payment Successful!</h4>
                                <p className="mt-2 text-sm text-sx-text-muted">
                                    Your {plan.name} plan is now active. Thank you!
                                </p>
                                <button
                                    onClick={onClose}
                                    className="mt-6 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
                                >
                                    Done
                                </button>
                            </div>
                        ) : status === "error" ? (
                            /* Error state */
                            <div className="flex flex-col items-center py-8 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 mb-4">
                                    <AlertCircle className="h-8 w-8 text-red-400" />
                                </div>
                                <h4 className="text-lg font-bold text-white">Payment Failed</h4>
                                <p className="mt-2 text-sm text-sx-text-muted max-w-xs">
                                    {errorMessage}
                                </p>
                                <div className="mt-6 flex gap-3">
                                    <button
                                        onClick={() => setStatus("ready")}
                                        className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                                    >
                                        Try Again
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="rounded-xl bg-white/[0.06] px-6 py-2.5 text-sm font-medium text-sx-text-muted hover:bg-white/[0.1] transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* Ready state — order summary */
                            <>
                                {/* Plan summary */}
                                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 mb-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold text-white">{plan.name} Plan</h4>
                                        <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-400 capitalize">
                                            {billingCycle}
                                        </span>
                                    </div>
                                    <div className="space-y-2 border-t border-white/[0.06] pt-3">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-sx-text-muted">Subtotal</span>
                                            <span className="text-white">₹{amount.toLocaleString("en-IN")}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-sx-text-muted">GST (18%)</span>
                                            <span className="text-white">₹{Math.round(amount * 0.18).toLocaleString("en-IN")}</span>
                                        </div>
                                        <div className="flex justify-between border-t border-white/[0.06] pt-2 text-base font-bold">
                                            <span className="text-white">Total</span>
                                            <span className="text-white">
                                                ₹{Math.round(amount * 1.18).toLocaleString("en-IN")}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Security badges */}
                                <div className="flex items-center gap-4 mb-5">
                                    <div className="flex items-center gap-1.5 text-xs text-sx-text-muted">
                                        <Lock className="h-3.5 w-3.5 text-emerald-400" />
                                        256-bit SSL
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-sx-text-muted">
                                        <Shield className="h-3.5 w-3.5 text-blue-400" />
                                        PCI Compliant
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-sx-text-muted">
                                        <CreditCard className="h-3.5 w-3.5 text-violet-400" />
                                        Razorpay Secure
                                    </div>
                                </div>

                                {/* Pay button */}
                                <button
                                    onClick={handlePayment}
                                    disabled={status === "loading" || status === "processing"}
                                    className={cn(
                                        "flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white transition-all",
                                        status === "processing"
                                            ? "bg-blue-600/50 cursor-wait"
                                            : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-[1.01]",
                                    )}
                                >
                                    {status === "loading" || status === "processing" ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            {status === "loading" ? "Loading..." : "Processing..."}
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="h-4 w-4" />
                                            Pay ₹{Math.round(amount * 1.18).toLocaleString("en-IN")}
                                        </>
                                    )}
                                </button>

                                <p className="mt-3 text-center text-[10px] text-sx-text-subtle">
                                    By proceeding, you agree to our Terms of Service and Privacy Policy.
                                </p>
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
