"use client";

/* -------------------------------------------------------------------------- */
/*                           UPI CHECKOUT                                     */
/*                                                                            */
/*  UPI payment modal with QR code, copy-to-clipboard, deep-link,            */
/*  and confirmation form (UTR submission). Replaces RazorpayCheckout.        */
/* -------------------------------------------------------------------------- */

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Shield,
    Lock,
    Loader2,
    CheckCircle2,
    AlertCircle,
    Copy,
    Check,
    Smartphone,
    QrCode,
    Clock,
} from "lucide-react";
import QRCode from "qrcode";
import { cn } from "@/lib/utils";
import { buildUpiUri, UPI_ID, UPI_PAYEE_NAME, isMobileDevice, formatCurrency } from "@/lib/upi";
import { useAuthContext } from "@/providers/AuthProvider";
import type { SubscriptionPlan, BillingCycle } from "@/types/billing";
import { toast } from "sonner";

/* ── Props ─────────────────────────────────────────────────────────────────── */

interface UpiCheckoutProps {
    plan: SubscriptionPlan;
    billingCycle: BillingCycle;
    onClose: () => void;
    onSuccess?: () => void;
}

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function UpiCheckout({
    plan,
    billingCycle,
    onClose,
    onSuccess,
}: UpiCheckoutProps) {
    const { profile } = useAuthContext();
    const [status, setStatus] = useState<
        "loading" | "ready" | "confirming" | "submitted" | "success" | "error"
    >("loading");
    const [errorMessage, setErrorMessage] = useState("");
    const [qrDataUrl, setQrDataUrl] = useState("");
    const [copied, setCopied] = useState(false);
    const [orderId, setOrderId] = useState("");
    const [utrInput, setUtrInput] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [mobile, setMobile] = useState(false);

    const amount = billingCycle === "monthly" ? plan.price_monthly : plan.price_yearly;
    const gst = Math.round(amount * 0.18);
    const total = amount + gst;

    /* ── Create order and generate QR ──────────────────────────────── */
    const initPayment = useCallback(async () => {
        setStatus("loading");
        try {
            // Create order on server (source of truth for amount)
            const res = await fetch("/api/payments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: total,
                    currency: plan.currency || "INR",
                    plan_id: plan.id,
                    client_id: profile?.id || "",
                    description: `${plan.name} Plan — ${billingCycle}`,
                }),
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || "Failed to create order");
            }

            setOrderId(data.order_id);

            // Generate QR code
            const upiUri = buildUpiUri({
                pa: UPI_ID,
                pn: UPI_PAYEE_NAME,
                am: data.amount,
                tr: data.order_id,
                tn: `${plan.name} Plan`,
            });

            const qr = await QRCode.toDataURL(upiUri, {
                width: 256,
                margin: 2,
                color: { dark: "#000000", light: "#ffffff" },
            });
            setQrDataUrl(qr);
            setStatus("ready");
        } catch (err) {
            setStatus("error");
            setErrorMessage(err instanceof Error ? err.message : "Failed to initialize payment");
        }
    }, [total, plan, billingCycle, profile?.id]);

    useEffect(() => {
        initPayment();
        setMobile(isMobileDevice());
    }, [initPayment]);

    /* ── Copy UPI ID ──────────────────────────────────────────────── */
    const copyUpiId = async () => {
        try {
            await navigator.clipboard.writeText(UPI_ID);
            setCopied(true);
            toast.success("UPI ID copied!");
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Failed to copy");
        }
    };

    /* ── Open UPI app (mobile deep-link) ──────────────────────────── */
    const openUpiApp = () => {
        const uri = buildUpiUri({
            pa: UPI_ID,
            pn: UPI_PAYEE_NAME,
            am: total,
            tr: orderId,
            tn: `${plan.name} Plan`,
        });
        window.location.href = uri;
    };

    /* ── Submit payment confirmation ──────────────────────────────── */
    const submitConfirmation = async () => {
        if (!utrInput.trim()) {
            toast.error("Please enter your UPI Transaction ID / UTR number");
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch("/api/payments/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    order_id: orderId,
                    upi_transaction_id: utrInput.trim(),
                }),
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || "Failed to submit confirmation");
            }

            setStatus("submitted");
            toast.success("Payment confirmation submitted!");
            onSuccess?.();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Submission failed");
        } finally {
            setSubmitting(false);
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
                    className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#0a0f1e] shadow-2xl"
                >
                    {/* ── Header ────────────────────────────────────────── */}
                    <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
                        <h3 className="text-lg font-semibold text-white">
                            Checkout
                        </h3>
                        <button
                            onClick={onClose}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* ── Content ───────────────────────────────────────── */}
                    <div className="p-6">
                        {/* Loading */}
                        {status === "loading" && (
                            <div className="flex flex-col items-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                                <p className="mt-4 text-sm text-slate-400">Creating your order...</p>
                            </div>
                        )}

                        {/* Error */}
                        {status === "error" && (
                            <div className="flex flex-col items-center py-8 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 mb-4">
                                    <AlertCircle className="h-8 w-8 text-red-400" />
                                </div>
                                <h4 className="text-lg font-bold text-white">Something went wrong</h4>
                                <p className="mt-2 text-sm text-slate-400 max-w-xs">{errorMessage}</p>
                                <div className="mt-6 flex gap-3">
                                    <button
                                        onClick={initPayment}
                                        className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                                    >
                                        Try Again
                                    </button>
                                    <button
                                        onClick={onClose}
                                        className="rounded-xl bg-white/[0.06] px-6 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/[0.1] transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Submitted — waiting for admin verification */}
                        {status === "submitted" && (
                            <div className="flex flex-col items-center py-8 text-center">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                                    className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 mb-4"
                                >
                                    <Clock className="h-8 w-8 text-amber-400" />
                                </motion.div>
                                <h4 className="text-lg font-bold text-white">Payment Submitted!</h4>
                                <p className="mt-2 text-sm text-slate-400 max-w-xs">
                                    Your payment confirmation has been received. Our team will verify it within <strong className="text-white">24 hours</strong>.
                                </p>
                                <p className="mt-3 text-xs text-slate-500">
                                    Order ID: <span className="font-mono text-slate-400">{orderId}</span>
                                </p>
                                <button
                                    onClick={onClose}
                                    className="mt-6 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                                >
                                    Done
                                </button>
                            </div>
                        )}

                        {/* Ready — show payment details + QR + confirmation */}
                        {(status === "ready" || status === "confirming") && (
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
                                            <span className="text-slate-400">Subtotal</span>
                                            <span className="text-white">{formatCurrency(amount)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-slate-400">GST (18%)</span>
                                            <span className="text-white">{formatCurrency(gst)}</span>
                                        </div>
                                        <div className="flex justify-between border-t border-white/[0.06] pt-2 text-base font-bold">
                                            <span className="text-white">Total</span>
                                            <span className="text-white">{formatCurrency(total)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* QR Code */}
                                <div className="flex flex-col items-center mb-5">
                                    <div className="rounded-xl bg-white p-3 shadow-lg">
                                        {qrDataUrl ? (
                                            <img
                                                src={qrDataUrl}
                                                alt="UPI QR Code"
                                                width={200}
                                                height={200}
                                                className="rounded-lg"
                                            />
                                        ) : (
                                            <div className="flex h-[200px] w-[200px] items-center justify-center">
                                                <QrCode className="h-12 w-12 text-slate-300" />
                                            </div>
                                        )}
                                    </div>
                                    <p className="mt-2 text-xs text-slate-500">
                                        Scan with any UPI app to pay
                                    </p>
                                </div>

                                {/* UPI ID + Copy */}
                                <div className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 mb-4">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-slate-500">UPI ID</p>
                                        <p className="font-mono text-sm font-medium text-white truncate">
                                            {UPI_ID}
                                        </p>
                                    </div>
                                    <button
                                        onClick={copyUpiId}
                                        className={cn(
                                            "flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all",
                                            copied
                                                ? "bg-emerald-500/10 text-emerald-400"
                                                : "bg-white/[0.06] text-slate-300 hover:bg-white/[0.1]"
                                        )}
                                    >
                                        {copied ? (
                                            <><Check className="h-3.5 w-3.5" /> Copied</>
                                        ) : (
                                            <><Copy className="h-3.5 w-3.5" /> Copy</>
                                        )}
                                    </button>
                                </div>

                                {/* Mobile: Pay with UPI App */}
                                {mobile && (
                                    <button
                                        onClick={openUpiApp}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3.5 text-sm font-semibold text-white hover:shadow-lg hover:shadow-blue-500/20 transition-all mb-4"
                                    >
                                        <Smartphone className="h-4 w-4" />
                                        Pay with UPI App
                                    </button>
                                )}

                                {/* Divider */}
                                <div className="flex items-center gap-3 my-4">
                                    <div className="h-px flex-1 bg-white/[0.06]" />
                                    <span className="text-xs text-slate-500">After payment</span>
                                    <div className="h-px flex-1 bg-white/[0.06]" />
                                </div>

                                {/* Confirmation section */}
                                {status === "confirming" ? (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="space-y-3"
                                    >
                                        <div>
                                            <label className="block text-xs font-medium text-slate-400 mb-1.5">
                                                UPI Transaction ID / UTR Number
                                            </label>
                                            <input
                                                type="text"
                                                value={utrInput}
                                                onChange={(e) => setUtrInput(e.target.value)}
                                                placeholder="e.g. 625412345678"
                                                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-colors"
                                            />
                                            <p className="mt-1 text-[10px] text-slate-500">
                                                Find this in your UPI app&apos;s transaction history
                                            </p>
                                        </div>

                                        <button
                                            onClick={submitConfirmation}
                                            disabled={submitting || !utrInput.trim()}
                                            className={cn(
                                                "flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white transition-all",
                                                submitting
                                                    ? "bg-blue-600/50 cursor-wait"
                                                    : "bg-gradient-to-r from-emerald-600 to-cyan-600 hover:shadow-lg hover:shadow-emerald-500/20"
                                            )}
                                        >
                                            {submitting ? (
                                                <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
                                            ) : (
                                                <><CheckCircle2 className="h-4 w-4" /> Submit Payment Confirmation</>
                                            )}
                                        </button>
                                    </motion.div>
                                ) : (
                                    <button
                                        onClick={() => setStatus("confirming")}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-6 py-3.5 text-sm font-medium text-slate-300 hover:bg-white/[0.06] transition-colors"
                                    >
                                        <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                        I&apos;ve Made the Payment
                                    </button>
                                )}

                                {/* Security badges */}
                                <div className="flex items-center justify-center gap-4 mt-5">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                        <Lock className="h-3.5 w-3.5 text-emerald-400" />
                                        Secure Payment
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                        <Shield className="h-3.5 w-3.5 text-blue-400" />
                                        UPI Protected
                                    </div>
                                </div>

                                <p className="mt-3 text-center text-[10px] text-slate-500">
                                    Payment will be verified by our team within 24 hours.
                                    Order ID: <span className="font-mono">{orderId}</span>
                                </p>
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
