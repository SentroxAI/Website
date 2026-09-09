"use client";

/* -------------------------------------------------------------------------- */
/*                         REFUND DIALOG                                      */
/*                                                                            */
/*  Sprint 4 — Module 1: Refund processing dialog for admin billing.         */
/*  Supports full and partial refunds via Razorpay.                          */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    AlertTriangle,
    IndianRupee,
    Loader2,
    Check,
    RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Payment } from "@/types/billing";

interface RefundDialogProps {
    payment: Payment | null;
    isOpen: boolean;
    onClose: () => void;
    onRefundComplete?: () => void;
}

export default function RefundDialog({
    payment,
    isOpen,
    onClose,
    onRefundComplete,
}: RefundDialogProps) {
    const [refundType, setRefundType] = useState<"full" | "partial">("full");
    const [amount, setAmount] = useState("");
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const maxRefundable = payment
        ? Number(payment.amount) - Number(payment.refund_amount || 0)
        : 0;

    const refundAmount = refundType === "full"
        ? maxRefundable
        : Math.min(Number(amount) || 0, maxRefundable);

    const handleSubmit = async () => {
        if (!payment) return;
        if (!reason.trim()) {
            setError("Please provide a reason for the refund");
            return;
        }
        if (refundType === "partial" && (!amount || Number(amount) <= 0)) {
            setError("Please enter a valid refund amount");
            return;
        }
        if (refundAmount > maxRefundable) {
            setError(`Maximum refundable amount is ₹${maxRefundable.toLocaleString("en-IN")}`);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/payments/webhook", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    action: "refund",
                    payment_id: payment.id,
                    razorpay_payment_id: payment.razorpay_payment_id,
                    amount: refundAmount,
                    reason,
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Refund failed");
            }

            setSuccess(true);
            setTimeout(() => {
                onRefundComplete?.();
                handleClose();
            }, 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Refund failed");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setRefundType("full");
        setAmount("");
        setReason("");
        setError(null);
        setSuccess(false);
        onClose();
    };

    if (!payment) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.4 }}
                        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2"
                    >
                        <div className="rounded-2xl border border-white/[0.08] bg-[#0c1220] shadow-2xl shadow-black/40">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                                        <RotateCcw className="h-5 w-5 text-amber-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-semibold text-white">
                                            Process Refund
                                        </h2>
                                        <p className="text-xs text-sx-text-muted">
                                            Payment {payment.razorpay_payment_id || payment.id.slice(0, 8)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-sx-text-subtle hover:bg-white/[0.06] hover:text-white transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Body */}
                            <div className="px-6 py-5 space-y-5">
                                {/* Success State */}
                                {success ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center py-8"
                                    >
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 mb-4">
                                            <Check className="h-8 w-8 text-emerald-400" />
                                        </div>
                                        <p className="text-lg font-semibold text-white">
                                            Refund Initiated
                                        </p>
                                        <p className="text-sm text-sx-text-muted mt-1">
                                            ₹{refundAmount.toLocaleString("en-IN")} will be refunded
                                        </p>
                                    </motion.div>
                                ) : (
                                    <>
                                        {/* Payment Summary */}
                                        <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-sx-text-muted">
                                                    Original Amount
                                                </span>
                                                <span className="text-sm font-semibold text-white">
                                                    ₹{Number(payment.amount).toLocaleString("en-IN")}
                                                </span>
                                            </div>
                                            {Number(payment.refund_amount) > 0 && (
                                                <div className="flex items-center justify-between mt-2">
                                                    <span className="text-xs text-sx-text-muted">
                                                        Already Refunded
                                                    </span>
                                                    <span className="text-sm font-medium text-amber-400">
                                                        -₹{Number(payment.refund_amount).toLocaleString("en-IN")}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.06]">
                                                <span className="text-xs text-sx-text-muted">
                                                    Max Refundable
                                                </span>
                                                <span className="text-sm font-bold text-white">
                                                    ₹{maxRefundable.toLocaleString("en-IN")}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Refund Type */}
                                        <div>
                                            <label className="text-xs font-medium text-sx-text-muted uppercase tracking-wider">
                                                Refund Type
                                            </label>
                                            <div className="mt-2 grid grid-cols-2 gap-2">
                                                {(["full", "partial"] as const).map((type) => (
                                                    <button
                                                        key={type}
                                                        onClick={() => setRefundType(type)}
                                                        className={cn(
                                                            "rounded-xl border px-4 py-3 text-sm font-medium transition-all",
                                                            refundType === type
                                                                ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
                                                                : "border-white/[0.06] bg-white/[0.02] text-sx-text-subtle hover:bg-white/[0.04]",
                                                        )}
                                                    >
                                                        {type === "full" ? "Full Refund" : "Partial Refund"}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Partial Amount */}
                                        {refundType === "partial" && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                            >
                                                <label className="text-xs font-medium text-sx-text-muted uppercase tracking-wider">
                                                    Refund Amount
                                                </label>
                                                <div className="mt-2 relative">
                                                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sx-text-subtle" />
                                                    <input
                                                        type="number"
                                                        value={amount}
                                                        onChange={(e) => setAmount(e.target.value)}
                                                        max={maxRefundable}
                                                        placeholder={`Max ₹${maxRefundable.toLocaleString("en-IN")}`}
                                                        className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-sx-text-subtle focus:border-cyan-500/30 focus:outline-none focus:ring-1 focus:ring-cyan-500/20"
                                                    />
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Reason */}
                                        <div>
                                            <label className="text-xs font-medium text-sx-text-muted uppercase tracking-wider">
                                                Reason for Refund
                                            </label>
                                            <textarea
                                                value={reason}
                                                onChange={(e) => setReason(e.target.value)}
                                                rows={3}
                                                placeholder="Explain why this refund is being processed..."
                                                className="mt-2 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-sx-text-subtle focus:border-cyan-500/30 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 resize-none"
                                            />
                                        </div>

                                        {/* Warning */}
                                        <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                                            <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                                            <p className="text-xs text-amber-300/80">
                                                Refunds are processed through Razorpay and may take 5-7 business days to reflect in the customer&apos;s account.
                                            </p>
                                        </div>

                                        {/* Error */}
                                        {error && (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-sm text-red-400"
                                            >
                                                {error}
                                            </motion.p>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* Footer */}
                            {!success && (
                                <div className="flex items-center justify-between border-t border-white/[0.06] px-6 py-4">
                                    <div className="text-sm">
                                        <span className="text-sx-text-muted">Refunding: </span>
                                        <span className="font-bold text-white">
                                            ₹{refundAmount.toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleClose}
                                            disabled={loading}
                                            className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2 text-sm font-medium text-sx-text-subtle hover:bg-white/[0.06] hover:text-white transition-all disabled:opacity-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={loading || refundAmount <= 0}
                                            className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-black hover:bg-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {loading ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <RotateCcw className="h-4 w-4" />
                                            )}
                                            {loading ? "Processing..." : "Process Refund"}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
