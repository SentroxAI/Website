"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

import {
    type Currency,
    type CalcState,
    type QuoteTotals,
    CURRENCIES,
    FALLBACK_RATES,
    CALC_ITEMS,
    RETAINER_ITEM,
    STORAGE_KEY,
    getSections,
} from "@/data/quoteCalculatorData";

/* -------------------------------------------------------------------------- */
/*                          useQuoteCalculator Hook                            */
/*                                                                            */
/*  Encapsulates all calculator state, currency conversion, FX rates,         */
/*  and computed totals for the quote calculator.                              */
/* -------------------------------------------------------------------------- */

function getCurrency(code: string): Currency {
    return CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];
}

function detectDefault(): string {
    try {
        if (typeof window === "undefined") return "INR";

        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved && CURRENCIES.some((c) => c.code === saved)) return saved;

        const region = ((navigator.language || "").split("-")[1] || "").toUpperCase();
        const map: Record<string, string> = {
            IN: "INR", US: "USD", GB: "GBP", AE: "AED", SG: "SGD",
            AU: "AUD", CA: "CAD", JP: "JPY", DE: "EUR", FR: "EUR",
            ES: "EUR", IT: "EUR", NL: "EUR", IE: "EUR",
        };
        return map[region] || "INR";
    } catch {
        return "INR";
    }
}

export default function useQuoteCalculator() {
    /* ── Currency & FX ─────────────────────────────────────────────────────── */

    const [currency, setCurrencyRaw] = useState<Currency>(() =>
        getCurrency(detectDefault())
    );
    const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
    const [live, setLive] = useState(false);

    const setCurrency = useCallback((code: string) => {
        const cur = getCurrency(code);
        setCurrencyRaw(cur);
        try { localStorage.setItem(STORAGE_KEY, code); } catch { /* noop */ }
    }, []);

    // Fetch live FX rates on mount
    useEffect(() => {
        fetch("https://open.er-api.com/v6/latest/INR")
            .then((r) => { if (!r.ok) throw new Error("rates"); return r.json(); })
            .then((data) => {
                if (!data?.rates) return;
                const next: Record<string, number> = { INR: 1 };
                CURRENCIES.forEach((c) => {
                    next[c.code] =
                        typeof data.rates[c.code] === "number"
                            ? data.rates[c.code]
                            : FALLBACK_RATES[c.code];
                });
                setRates(next);
                setLive(true);
            })
            .catch(() => { /* keep fallback */ });
    }, []);

    /* ── Calculator State ──────────────────────────────────────────────────── */

    const sections = useMemo(() => getSections(), []);

    // Build default radio selections (pick the "popular" item in each radio section)
    const defaultRadio = useMemo(() => {
        const map: Record<number, number> = {};
        sections.forEach(({ section, items }) => {
            const radios = items.filter((i) => i.input_type === "radio");
            if (radios.length) {
                const popular = radios.find((r) => r.popular);
                map[section] = (popular || radios[0]).id;
            }
        });
        return map;
    }, [sections]);

    const [state, setState] = useState<CalcState>({
        radio: defaultRadio,
        checks: {},
        qty: {},
        retainer: false,
    });

    // Sync default radio selections once computed
    useEffect(() => {
        setState((prev) => ({
            ...prev,
            radio: { ...defaultRadio, ...prev.radio },
        }));
    }, [defaultRadio]);

    /* ── Actions ───────────────────────────────────────────────────────────── */

    const selectRadio = useCallback((section: number, id: number) => {
        setState((prev) => ({
            ...prev,
            radio: { ...prev.radio, [section]: id },
        }));
    }, []);

    const toggleCheck = useCallback((id: number) => {
        setState((prev) => ({
            ...prev,
            checks: { ...prev.checks, [id]: !prev.checks[id] },
        }));
    }, []);

    const incrementQty = useCallback((id: number) => {
        setState((prev) => ({
            ...prev,
            qty: { ...prev.qty, [id]: (prev.qty[id] || 0) + 1 },
        }));
    }, []);

    const decrementQty = useCallback((id: number) => {
        setState((prev) => ({
            ...prev,
            qty: { ...prev.qty, [id]: Math.max(0, (prev.qty[id] || 0) - 1) },
        }));
    }, []);

    const toggleRetainer = useCallback(() => {
        setState((prev) => ({
            ...prev,
            retainer: !prev.retainer,
        }));
    }, []);

    /* ── Currency Formatting ───────────────────────────────────────────────── */

    const convertFromINR = useCallback(
        (amountINR: number) => {
            const rate = rates[currency.code] || 1;
            return Math.round((amountINR * rate) / currency.step) * currency.step;
        },
        [rates, currency]
    );

    const formatMoney = useCallback(
        (amount: number) => {
            try {
                return new Intl.NumberFormat(currency.locale, {
                    style: "currency",
                    currency: currency.code,
                    maximumFractionDigits: 0,
                }).format(amount);
            } catch {
                return currency.symbol + amount.toLocaleString(currency.locale);
            }
        },
        [currency]
    );

    /** Format an INR amount in the selected currency */
    const fmt = useCallback(
        (amountINR: number) => formatMoney(convertFromINR(amountINR)),
        [formatMoney, convertFromINR]
    );

    /* ── Computed Totals ───────────────────────────────────────────────────── */

    const totals: QuoteTotals = useMemo(() => {
        let oneTime = 0;
        let monthly = 0;
        const lineItems: QuoteTotals["lineItems"] = [];

        sections.forEach(({ section, items }) => {
            items.forEach((it) => {
                if (it.input_type === "radio") {
                    if (state.radio[section] === it.id && it.price > 0) {
                        oneTime += it.price;
                        lineItems.push({ name: it.name, amount: it.price, unit: it.unit });
                    }
                } else if (it.input_type === "checkbox") {
                    if (state.checks[it.id]) {
                        if (it.unit === "mo") monthly += it.price;
                        else oneTime += it.price;
                        lineItems.push({ name: it.name, amount: it.price, unit: it.unit });
                    }
                } else if (it.input_type === "stepper") {
                    const q = state.qty[it.id] || 0;
                    if (q > 0) {
                        const amt = it.price * q;
                        if (it.unit === "mo") monthly += amt;
                        else oneTime += amt;
                        lineItems.push({ name: it.name, amount: amt, unit: it.unit, qty: q });
                    }
                }
            });
        });

        if (RETAINER_ITEM && state.retainer) {
            monthly += RETAINER_ITEM.price;
            lineItems.push({ name: RETAINER_ITEM.name, amount: RETAINER_ITEM.price, unit: "mo" });
        }

        return { oneTime, monthly, lineItems };
    }, [state, sections]);

    /* ── Return ─────────────────────────────────────────────────────────────── */

    return {
        // Currency
        currency,
        setCurrency,
        currencies: CURRENCIES,
        live,

        // State
        state,
        sections,

        // Actions
        selectRadio,
        toggleCheck,
        incrementQty,
        decrementQty,
        toggleRetainer,

        // Computed
        totals,

        // Formatting
        fmt,
        convertFromINR,
        formatMoney,
    };
}
