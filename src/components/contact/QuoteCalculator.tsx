"use client";

import { useState, useRef, Fragment } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronDown,
    Check,
    Plus,
    Minus,
    Globe,
    ArrowRight,
    Send,
    CheckCircle2,
    Sparkles,
    Loader2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import Container from "@/components/ui/layout/Container";
import Section from "@/components/ui/layout/Section";
import SectionHeading from "@/components/ui/section/SectionHeading";
import GlassCard from "@/components/ui/cards/GlassCard";
import Input from "@/components/ui/inputs/Input";
import Textarea from "@/components/ui/inputs/Textarea";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import { fadeUp, viewport, staggerContainer } from "@/lib/animations";
import { cn } from "@/lib/utils";
import { quoteFormSchema, type QuoteFormData } from "@/lib/validations";
import useQuoteCalculator from "@/hooks/useQuoteCalculator";
import {
    type CalcItem,
    RETAINER_ITEM,
    groupByCategory,
    EMAILJS_SERVICE_ID,
    EMAILJS_ADMIN_TEMPLATE_ID,
    EMAILJS_CLIENT_TEMPLATE_ID,
    EMAILJS_PUBLIC_KEY,
    GOOGLE_SHEETS_WEBAPP_URL,
} from "@/data/quoteCalculatorData";

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                          CURRENCY SELECTOR                                 */
/* ═══════════════════════════════════════════════════════════════════════════ */

function CurrencySelector({
    currency,
    currencies,
    setCurrency,
    live,
}: {
    currency: { code: string; label: string; symbol: string };
    currencies: typeof import("@/data/quoteCalculatorData").CURRENCIES;
    setCurrency: (code: string) => void;
    live: boolean;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-slate-200 backdrop-blur-xl transition-all hover:border-cyan-400/40 hover:text-cyan-400"
            >
                <Globe className="h-4 w-4 text-cyan-400" />
                <span>{currency.code}</span>
                <ChevronDown
                    className={cn(
                        "h-4 w-4 transition-transform",
                        open && "rotate-180"
                    )}
                />
            </button>

            <AnimatePresence>
                {open && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setOpen(false)}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 z-50 mt-2 w-60 rounded-2xl border border-white/10 bg-slate-900/95 p-1.5 shadow-2xl backdrop-blur-2xl"
                        >
                            {currencies.map((c) => (
                                <button
                                    key={c.code}
                                    onClick={() => {
                                        setCurrency(c.code);
                                        setOpen(false);
                                    }}
                                    className={cn(
                                        "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-colors",
                                        c.code === currency.code
                                            ? "text-cyan-400"
                                            : "text-slate-300 hover:bg-white/5"
                                    )}
                                >
                                    <span className="flex items-center gap-3">
                                        <span className="inline-flex w-8 justify-center font-semibold">
                                            {c.symbol}
                                        </span>
                                        <span className="font-medium">
                                            {c.code}
                                            <span className="ml-2 text-xs text-slate-500">
                                                {c.label}
                                            </span>
                                        </span>
                                    </span>

                                    {c.code === currency.code && (
                                        <Check className="h-4 w-4 flex-shrink-0" />
                                    )}
                                </button>
                            ))}

                            {live && (
                                <div className="mt-1 border-t border-white/5 px-3 py-2 text-[11px] text-slate-500">
                                    Live exchange rates active
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                           RADIO SECTION                                    */
/* ═══════════════════════════════════════════════════════════════════════════ */

function RadioSection({
    stepNo,
    title,
    items,
    selectedId,
    onSelect,
    fmt,
}: {
    stepNo: string;
    title: string;
    items: CalcItem[];
    selectedId: number;
    onSelect: (id: number) => void;
    fmt: (amountINR: number) => string;
}) {
    return (
        <GlassCard hover={false} glow className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-baseline gap-3 sm:gap-4">
                <span className="font-display text-base sm:text-lg font-bold text-cyan-400">
                    {stepNo}
                </span>
                <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white lg:text-2xl">
                    {title}
                </h3>
            </div>

            <div className="mt-4 sm:mt-6 grid gap-3 sm:grid-cols-2">
                {items.map((it) => {
                    const active = selectedId === it.id;
                    const priceLabel =
                        it.price <= 0
                            ? it.suffix || "Included"
                            : `${fmt(it.price)}${it.unit === "mo" ? "/mo" : ""}${it.suffix ? it.suffix : ""}`;

                    return (
                        <button
                            key={it.id}
                            onClick={() => onSelect(it.id)}
                            className={cn(
                                "relative flex flex-col rounded-2xl border p-4 sm:p-5 text-left transition-all duration-200",
                                active
                                    ? "border-cyan-400/60 bg-cyan-400/[0.07]"
                                    : "border-white/10 bg-white/[0.02] hover:border-white/25"
                            )}
                        >
                            {it.popular && (
                                <span className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                                    Popular
                                </span>
                            )}

                            <div className="flex items-center gap-3">
                                {/* Radio dot */}
                                <span
                                    className={cn(
                                        "flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                                        active
                                            ? "border-cyan-400"
                                            : "border-white/25"
                                    )}
                                >
                                    {active && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="h-2.5 w-2.5 rounded-full bg-cyan-400"
                                        />
                                    )}
                                </span>

                                <span className="font-display text-[15px] font-semibold text-white">
                                    {it.name}
                                </span>
                            </div>

                            <span className="mt-2 pl-8 text-sm text-slate-400">
                                {it.description}
                            </span>

                            <span
                                className={cn(
                                    "mt-3 pl-8 text-sm font-semibold",
                                    active ? "text-cyan-400" : "text-slate-300"
                                )}
                            >
                                {priceLabel}
                            </span>
                        </button>
                    );
                })}
            </div>
        </GlassCard>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                           ADDON SECTION                                    */
/* ═══════════════════════════════════════════════════════════════════════════ */

function AddonSection({
    stepNo,
    title,
    items,
    checks,
    qty,
    onToggleCheck,
    onIncrement,
    onDecrement,
    fmt,
}: {
    stepNo: string;
    title: string;
    items: CalcItem[];
    checks: Record<number, boolean>;
    qty: Record<number, number>;
    onToggleCheck: (id: number) => void;
    onIncrement: (id: number) => void;
    onDecrement: (id: number) => void;
    fmt: (amountINR: number) => string;
}) {
    const categories = groupByCategory(items);

    return (
        <GlassCard hover={false} glow className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-baseline gap-3 sm:gap-4">
                <span className="font-display text-base sm:text-lg font-bold text-cyan-400">
                    {stepNo}
                </span>
                <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white lg:text-2xl">
                    {title}
                </h3>
            </div>

            <div className="mt-4 sm:mt-6 space-y-6">
                {categories.map(([cat, catItems]) => (
                    <div key={cat}>
                        {cat && (
                            <h4 className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                                {cat}
                            </h4>
                        )}

                        <div className="divide-y divide-white/5">
                            {catItems.map((it) => {
                                if (it.input_type === "checkbox") {
                                    const checked = !!checks[it.id];
                                    return (
                                        <div
                                            key={it.id}
                                            className="flex items-center gap-4 py-3.5"
                                        >
                                            <button
                                                onClick={() => onToggleCheck(it.id)}
                                                className={cn(
                                                    "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border transition-all",
                                                    checked
                                                        ? "border-cyan-400 bg-cyan-400 text-slate-900"
                                                        : "border-white/25 bg-transparent hover:border-cyan-400/60"
                                                )}
                                            >
                                                {checked && (
                                                    <Check className="h-4 w-4" strokeWidth={3} />
                                                )}
                                            </button>

                                            <div className="min-w-0 flex-1">
                                                <div className="text-[15px] font-medium text-slate-100">
                                                    {it.name}
                                                </div>
                                                <div className="truncate text-xs text-slate-500">
                                                    {it.description}
                                                </div>
                                            </div>

                                            <span className="whitespace-nowrap text-sm font-semibold text-cyan-400">
                                                {it.price <= 0
                                                    ? it.suffix || "Included"
                                                    : `${fmt(it.price)}${it.unit === "mo" ? "/mo" : ""}${it.suffix || ""}`}
                                            </span>
                                        </div>
                                    );
                                }

                                // Stepper
                                const q = qty[it.id] || 0;
                                return (
                                    <div
                                        key={it.id}
                                        className="flex items-center gap-4 py-3.5"
                                    >
                                        <span
                                            className={cn(
                                                "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md border",
                                                q > 0
                                                    ? "border-cyan-400 bg-cyan-400 text-slate-900"
                                                    : "border-white/25"
                                            )}
                                        >
                                            {q > 0 && (
                                                <Check className="h-4 w-4" strokeWidth={3} />
                                            )}
                                        </span>

                                        <div className="min-w-0 flex-1">
                                            <div className="text-[15px] font-medium text-slate-100">
                                                {it.name}
                                            </div>
                                            <div className="truncate text-xs text-slate-500">
                                                {it.description}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className="whitespace-nowrap text-sm font-semibold text-cyan-400">
                                                {fmt(it.price)} {it.suffix || ""}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => onDecrement(it.id)}
                                                    disabled={q === 0}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 text-slate-300 transition-colors hover:border-cyan-400/50 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="w-6 text-center text-sm font-semibold tabular-nums">
                                                    {q}
                                                </span>
                                                <button
                                                    onClick={() => onIncrement(it.id)}
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 text-slate-300 transition-colors hover:border-cyan-400/50 hover:text-cyan-400"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </GlassCard>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                          RETAINER TOGGLE                                   */
/* ═══════════════════════════════════════════════════════════════════════════ */

function RetainerSection({
    stepNo,
    title,
    active,
    onToggle,
    fmt,
}: {
    stepNo: string;
    title: string;
    active: boolean;
    onToggle: () => void;
    fmt: (amountINR: number) => string;
}) {
    if (!RETAINER_ITEM) return null;

    return (
        <GlassCard hover={false} glow className="p-4 sm:p-6 lg:p-8">
            <div className="flex items-baseline gap-3 sm:gap-4">
                <span className="font-display text-base sm:text-lg font-bold text-cyan-400">
                    {stepNo}
                </span>
                <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white lg:text-2xl">
                    {title}
                </h3>
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
                <div>
                    <div className="font-display text-base font-semibold text-white">
                        {RETAINER_ITEM.name}
                    </div>
                    <div className="mt-0.5 text-sm text-slate-400">
                        {RETAINER_ITEM.description}
                    </div>
                    <div className="mt-1 text-sm font-semibold text-cyan-400">
                        {fmt(RETAINER_ITEM.price)}/mo
                    </div>
                </div>

                <button
                    onClick={onToggle}
                    className={cn(
                        "relative h-8 w-14 flex-shrink-0 rounded-full transition-colors duration-300",
                        active
                            ? "bg-gradient-to-r from-cyan-400 to-violet-500"
                            : "bg-white/10"
                    )}
                >
                    <span
                        className={cn(
                            "absolute top-1 h-6 w-6 rounded-full bg-white shadow-md transition-all duration-300",
                            active ? "left-7" : "left-1"
                        )}
                    />
                </button>
            </div>
        </GlassCard>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                           QUOTE SUMMARY                                    */
/* ═══════════════════════════════════════════════════════════════════════════ */

function QuoteSummary({
    totals,
    fmt,
    convertFromINR,
    formatMoney,
    onScrollToForm,
}: {
    totals: { oneTime: number; monthly: number; lineItems: { name: string; amount: number; unit: string; qty?: number }[] };
    fmt: (amountINR: number) => string;
    convertFromINR: (amountINR: number) => number;
    formatMoney: (amount: number) => string;
    onScrollToForm: () => void;
}) {
    return (
        <div className="sticky top-28">
            <GlassCard hover={false} glow className="p-6">
                {/* Label */}
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    Your estimate
                </div>

                {/* One-time */}
                <div className="mt-3 text-sm text-slate-400">One-time investment</div>
                <motion.div
                    key={totals.oneTime}
                    initial={{ scale: 0.95, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mt-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 bg-clip-text font-display text-4xl font-extrabold tracking-tight text-transparent"
                >
                    {formatMoney(convertFromINR(totals.oneTime))}
                </motion.div>

                {/* Monthly */}
                <AnimatePresence>
                    {totals.monthly > 0 && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-4 overflow-hidden"
                        >
                            <div className="flex items-baseline justify-between rounded-xl bg-white/[0.03] px-4 py-3">
                                <span className="text-sm text-slate-400">
                                    Then monthly
                                </span>
                                <span className="font-display text-lg font-bold text-cyan-400">
                                    {fmt(totals.monthly)}/mo
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Line Items */}
                <div className="mt-5 border-t border-white/10 pt-4">
                    <div className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                        Included line items
                    </div>

                    {totals.lineItems.length === 0 ? (
                        <p className="mt-3 text-sm text-slate-500">
                            Select options to build your quote.
                        </p>
                    ) : (
                        <div className="mt-3 space-y-2.5">
                            {totals.lineItems.map((li, i) => (
                                <div
                                    key={`${li.name}-${i}`}
                                    className="flex items-start justify-between gap-3 text-sm"
                                >
                                    <span className="text-slate-300">
                                        {li.name}
                                        {li.qty && (
                                            <span className="text-slate-500">
                                                {" "}
                                                ×{li.qty}
                                            </span>
                                        )}
                                    </span>
                                    <span className="whitespace-nowrap font-medium text-slate-200">
                                        {fmt(li.amount)}
                                        {li.unit === "mo" ? "/mo" : ""}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* CTA */}
                <button
                    onClick={onScrollToForm}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 transition-transform hover:scale-[1.02]"
                >
                    Get my detailed quote
                    <ArrowRight className="h-4 w-4" />
                </button>

                <p className="mt-3 text-center text-[11px] text-slate-500">
                    Estimates are indicative. Final scope confirmed on a discovery call.
                </p>
            </GlassCard>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                       EMAILJS + GOOGLE SHEETS                              */
/* ═══════════════════════════════════════════════════════════════════════════ */

function emailjsConfigured() {
    return (
        !EMAILJS_SERVICE_ID.startsWith("YOUR_") &&
        !EMAILJS_PUBLIC_KEY.startsWith("YOUR_") &&
        !EMAILJS_ADMIN_TEMPLATE_ID.startsWith("YOUR_") &&
        !EMAILJS_CLIENT_TEMPLATE_ID.startsWith("YOUR_")
    );
}

async function sendEmailJS(
    templateId: string,
    templateParams: Record<string, string>
) {
    const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            service_id: EMAILJS_SERVICE_ID,
            template_id: templateId,
            user_id: EMAILJS_PUBLIC_KEY,
            template_params: templateParams,
        }),
    });
    if (!res.ok) throw new Error("EmailJS HTTP " + res.status);
    return res.text();
}

function buildQuoteTable(
    lineItems: { name: string; amount: number; unit: string; qty?: number }[],
    fmt: (n: number) => string
) {
    let html = `<table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;">
<thead><tr style="background:#0F62FE;color:white;">
<th style="padding:10px;border:1px solid #ddd;">Service</th>
<th style="padding:10px;border:1px solid #ddd;">Qty</th>
<th style="padding:10px;border:1px solid #ddd;">Price</th>
</tr></thead><tbody>`;

    lineItems.forEach((li) => {
        html += `<tr>
<td style="padding:10px;border:1px solid #ddd;">${li.name}</td>
<td style="padding:10px;border:1px solid #ddd;text-align:center;">${li.qty || 1}</td>
<td style="padding:10px;border:1px solid #ddd;text-align:right;">${fmt(li.amount)}${li.unit === "mo" ? "/mo" : ""}</td>
</tr>`;
    });

    html += `</tbody></table>`;
    return html;
}

async function saveToGoogleSheets(
    payload: Record<string, unknown>,
    lineItems: { name: string; amount: number; unit: string; qty?: number }[]
) {
    if (!GOOGLE_SHEETS_WEBAPP_URL || GOOGLE_SHEETS_WEBAPP_URL.startsWith("YOUR_"))
        return;

    const data = {
        name: payload.name,
        email: payload.email,
        company: payload.company || "",
        phone: payload.phone || "",
        notes: payload.notes || "",
        one_time_total: payload.one_time_total,
        monthly_total: payload.monthly_total,
        display_currency: payload.display_currency,
        line_items: lineItems.map(
            (li) =>
                li.name +
                (li.qty ? " x" + li.qty : "") +
                " - " +
                li.amount +
                (li.unit === "mo" ? "/mo" : "")
        ),
    };

    try {
        await fetch(GOOGLE_SHEETS_WEBAPP_URL, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify(data),
        });
    } catch (err) {
        console.warn("Google Sheets save failed (non-fatal):", err);
    }
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                       QUOTE CALCULATOR (MAIN)                              */
/* ═══════════════════════════════════════════════════════════════════════════ */

export default function QuoteCalculator() {
    const calc = useQuoteCalculator();
    const formRef = useRef<HTMLDivElement>(null);
    const [submitted, setSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<Pick<QuoteFormData, "name" | "email" | "phone" | "company" | "notes">>({
        resolver: zodResolver(
            quoteFormSchema.pick({
                name: true,
                email: true,
                phone: true,
                company: true,
                notes: true,
            })
        ),
    });

    const scrollToForm = () => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    const onSubmit = async (
        formData: Pick<QuoteFormData, "name" | "email" | "phone" | "company" | "notes">
    ) => {
        const payload = {
            ...formData,
            line_items: calc.totals.lineItems,
            one_time_total: calc.totals.oneTime,
            monthly_total: calc.totals.monthly,
            display_currency: calc.currency.code,
        };

        try {
            // 1) Server API (Supabase + Resend)
            const res = await fetch("/api/quote", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const result = await res.json();
                throw new Error(result.error || "Something went wrong");
            }

            // 2) EmailJS (client-side backup for your existing templates)
            if (emailjsConfigured()) {
                const currencyLabel = `${calc.currency.label} (${calc.currency.code})`;
                const quoteTable = buildQuoteTable(calc.totals.lineItems, calc.fmt);

                const adminParams = {
                    to_name: "Sentrox Team",
                    from_name: formData.name,
                    from_email: formData.email,
                    company: formData.company || "N/A",
                    phone: formData.phone || "N/A",
                    q_currency: currencyLabel,
                    q_one_time: calc.fmt(calc.totals.oneTime),
                    q_monthly:
                        calc.totals.monthly > 0
                            ? calc.fmt(calc.totals.monthly) + "/mo"
                            : "None",
                    q_items: quoteTable,
                    q_notes: formData.notes || "N/A",
                };

                const clientParams = {
                    to_email: formData.email,
                    to_name: formData.name.split(" ")[0],
                    company: formData.company || "N/A",
                    phone: formData.phone || "N/A",
                    proposal_id: `SA-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`,
                    proposal_date: new Date().toLocaleDateString(),
                    proposal_valid: "15 Days",
                    q_currency: currencyLabel,
                    q_one_time: calc.fmt(calc.totals.oneTime),
                    q_monthly:
                        calc.totals.monthly > 0
                            ? calc.fmt(calc.totals.monthly) + "/mo"
                            : "None",
                    q_items: quoteTable,
                    q_notes: formData.notes || "N/A",
                };

                try {
                    await Promise.all([
                        sendEmailJS(EMAILJS_ADMIN_TEMPLATE_ID, adminParams),
                        sendEmailJS(EMAILJS_CLIENT_TEMPLATE_ID, clientParams),
                    ]);
                } catch {
                    console.warn("EmailJS send failed (non-fatal)");
                }
            }

            // 3) Google Sheets (best-effort)
            saveToGoogleSheets(payload, calc.totals.lineItems);

            setSubmitted(true);
            toast.success("Quote sent successfully!");
            reset();

            setTimeout(() => setSubmitted(false), 8000);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again.";
            toast.error(message);
        }
    };

    /* ── Build sections ────────────────────────────────────────────────────── */

    let stepCounter = 0;

    return (
        <Section id="quote-calculator" spacing="md">
            <Container>
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                >
                    <SectionHeading
                        badge="Instant Estimate"
                        badgeIcon={<Sparkles className="h-4 w-4" />}
                        title="Build Your Quote"
                        description="Configure your project step by step. Your investment updates in real time — transparent pricing, no surprises."
                    />
                </motion.div>

                {/* Currency toolbar */}
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mb-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
                >
                    <span className="text-sm text-slate-400">
                        Prices shown in{" "}
                        <strong className="text-cyan-400">
                            {calc.currency.label} ({calc.currency.code})
                        </strong>
                        {calc.currency.code !== "INR" && (
                            <span className="text-slate-500">
                                {" "}
                                — converted from INR
                            </span>
                        )}
                        {calc.live && (
                            <span className="text-slate-500">
                                {" "}
                                · live rates
                            </span>
                        )}
                    </span>

                    <CurrencySelector
                        currency={calc.currency}
                        currencies={calc.currencies}
                        setCurrency={calc.setCurrency}
                        live={calc.live}
                    />
                </motion.div>

                {/* Two-column layout */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="grid gap-6 lg:grid-cols-[1fr_360px]"
                >
                    {/* Left — Step cards */}
                    <motion.div variants={fadeUp} className="flex flex-col gap-6">
                        {calc.sections.map((group) => {
                            const isRadio = group.items.every(
                                (i) => i.input_type === "radio"
                            );
                            const isRetainer =
                                group.items.length === 1 &&
                                group.items[0].input_type === "toggle";
                            const isAddon = group.items.some(
                                (i) =>
                                    i.input_type === "checkbox" ||
                                    i.input_type === "stepper"
                            );

                            stepCounter++;
                            const stepNo = String(stepCounter).padStart(2, "0");

                            if (isRadio) {
                                return (
                                    <RadioSection
                                        key={group.section}
                                        stepNo={stepNo}
                                        title={group.title}
                                        items={group.items}
                                        selectedId={
                                            calc.state.radio[group.section] ??
                                            group.items[0].id
                                        }
                                        onSelect={(id) =>
                                            calc.selectRadio(group.section, id)
                                        }
                                        fmt={calc.fmt}
                                    />
                                );
                            }

                            if (isAddon) {
                                return (
                                    <AddonSection
                                        key={group.section}
                                        stepNo={stepNo}
                                        title={group.title}
                                        items={group.items}
                                        checks={calc.state.checks}
                                        qty={calc.state.qty}
                                        onToggleCheck={calc.toggleCheck}
                                        onIncrement={calc.incrementQty}
                                        onDecrement={calc.decrementQty}
                                        fmt={calc.fmt}
                                    />
                                );
                            }

                            if (isRetainer) {
                                return (
                                    <RetainerSection
                                        key={group.section}
                                        stepNo={stepNo}
                                        title={group.title}
                                        active={calc.state.retainer}
                                        onToggle={calc.toggleRetainer}
                                        fmt={calc.fmt}
                                    />
                                );
                            }

                            return <Fragment key={group.section} />;
                        })}

                        {/* Step 5 — Contact Form */}
                        <div ref={formRef}>
                            <GlassCard hover={false} glow className="p-4 sm:p-6 lg:p-8">
                                <div className="flex items-baseline gap-3 sm:gap-4">
                                    <span className="font-display text-base sm:text-lg font-bold text-cyan-400">
                                        {String(stepCounter + 1).padStart(2, "0")}
                                    </span>
                                    <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight text-white lg:text-2xl">
                                        Get your quote
                                    </h3>
                                </div>

                                <p className="mt-3 text-sm text-slate-400">
                                    We&rsquo;ll send this exact estimate to our team and
                                    follow up within 24 hours.
                                </p>

                                {submitted ? (
                                    /* ── Success State ─────────────────── */
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="mt-8 flex flex-col items-center rounded-2xl bg-gradient-to-br from-cyan-400/15 to-violet-500/15 px-6 py-10 text-center"
                                    >
                                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-400/20">
                                            <CheckCircle2 className="h-9 w-9 text-cyan-400" />
                                        </div>

                                        <h4 className="mt-5 font-display text-xl font-bold text-white">
                                            Quote on its way!
                                        </h4>

                                        <p className="mt-3 max-w-md text-sm text-slate-300">
                                            Thanks — we&rsquo;ve saved your estimate and our
                                            team will reach out within{" "}
                                            <strong className="text-cyan-400">
                                                24 hours
                                            </strong>
                                            .
                                        </p>
                                    </motion.div>
                                ) : (
                                    /* ── Form ──────────────────────────── */
                                    <form
                                        onSubmit={handleSubmit(onSubmit)}
                                        className="mt-6 space-y-5"
                                    >
                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <Input
                                                label="Full Name"
                                                placeholder="John Doe"
                                                error={errors.name?.message}
                                                {...register("name")}
                                            />
                                            <Input
                                                label="Work Email"
                                                type="email"
                                                placeholder="john@company.com"
                                                error={errors.email?.message}
                                                {...register("email")}
                                            />
                                        </div>

                                        <div className="grid gap-5 sm:grid-cols-2">
                                            <Input
                                                label="Company"
                                                placeholder="Your Company"
                                                {...register("company")}
                                            />
                                            <Input
                                                label="Phone (optional)"
                                                type="tel"
                                                placeholder="+91 XXXXX XXXXX"
                                                {...register("phone")}
                                            />
                                        </div>

                                        <Textarea
                                            label="Tell us about your project (optional)"
                                            placeholder="What are you building? Any specific requirements, timeline, or goals?"
                                            maxLength={5000}
                                            {...register("notes")}
                                        />

                                        <PrimaryButton
                                            type="submit"
                                            size="lg"
                                            loading={isSubmitting}
                                            rightIcon={
                                                <Send className="h-5 w-5" />
                                            }
                                            className="w-full"
                                        >
                                            Send me this quote
                                        </PrimaryButton>
                                    </form>
                                )}
                            </GlassCard>
                        </div>
                    </motion.div>

                    {/* Right — Sticky Summary */}
                    <motion.div variants={fadeUp}>
                        <QuoteSummary
                            totals={calc.totals}
                            fmt={calc.fmt}
                            convertFromINR={calc.convertFromINR}
                            formatMoney={calc.formatMoney}
                            onScrollToForm={scrollToForm}
                        />
                    </motion.div>
                </motion.div>
            </Container>
        </Section>
    );
}
