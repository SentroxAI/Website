/* -------------------------------------------------------------------------- */
/*                     QUOTE CALCULATOR DATA & TYPES                          */
/* -------------------------------------------------------------------------- */

/* ── Types ─────────────────────────────────────────────────────────────────── */

export interface Currency {
    code: string;
    label: string;
    symbol: string;
    locale: string;
    step: number;
}

export type CalcInputType = "radio" | "checkbox" | "stepper" | "toggle";

export interface CalcItem {
    id: number;
    section: number;
    section_title: string;
    category?: string;
    name: string;
    description: string;
    price: number;
    unit: "once" | "mo";
    input_type: CalcInputType;
    suffix: string | null;
    popular: boolean;
}

export interface LineItem {
    name: string;
    amount: number;
    unit: "once" | "mo";
    qty?: number;
}

export interface QuoteTotals {
    oneTime: number;
    monthly: number;
    lineItems: LineItem[];
}

export interface CalcState {
    radio: Record<number, number>;
    checks: Record<number, boolean>;
    qty: Record<number, number>;
    retainer: boolean;
}

/* ── Currencies ────────────────────────────────────────────────────────────── */

export const CURRENCIES: Currency[] = [
    { code: "INR", label: "Indian Rupee", symbol: "₹", locale: "en-IN", step: 1 },
    { code: "USD", label: "US Dollar", symbol: "$", locale: "en-US", step: 1 },
    { code: "EUR", label: "Euro", symbol: "€", locale: "de-DE", step: 1 },
    { code: "GBP", label: "British Pound", symbol: "£", locale: "en-GB", step: 1 },
    { code: "AED", label: "UAE Dirham", symbol: "AED", locale: "en-AE", step: 1 },
    { code: "SGD", label: "Singapore Dollar", symbol: "SGD", locale: "en-SG", step: 1 },
    { code: "AUD", label: "Australian Dollar", symbol: "A$", locale: "en-AU", step: 1 },
    { code: "CAD", label: "Canadian Dollar", symbol: "C$", locale: "en-CA", step: 1 },
    { code: "JPY", label: "Japanese Yen", symbol: "¥", locale: "ja-JP", step: 10 },
];

export const FALLBACK_RATES: Record<string, number> = {
    INR: 1,
    USD: 0.012,
    EUR: 0.011,
    GBP: 0.0095,
    AED: 0.044,
    SGD: 0.016,
    AUD: 0.0182,
    CAD: 0.0164,
    JPY: 1.85,
};

/* ── Calculator Items ──────────────────────────────────────────────────────── */

export const CALC_ITEMS: CalcItem[] = [
    // Section 1 — Choose your foundation (radio)
    {
        id: 1, section: 1, section_title: "Choose your foundation",
        name: "Landing Page Website", description: "Single high-converting page",
        price: 9999, unit: "once", input_type: "radio", suffix: null, popular: true,
    },
    {
        id: 2, section: 1, section_title: "Choose your foundation",
        name: "Business Website", description: "Multi-page marketing site",
        price: 19999, unit: "once", input_type: "radio", suffix: null, popular: false,
    },
    {
        id: 3, section: 1, section_title: "Choose your foundation",
        name: "Web Application", description: "Custom app with dashboards & auth",
        price: 59999, unit: "once", input_type: "radio", suffix: null, popular: false,
    },
    {
        id: 4, section: 1, section_title: "Choose your foundation",
        name: "Custom AI Platform", description: "AI-native product, built end-to-end",
        price: 99999, unit: "once", input_type: "radio", suffix: null, popular: false,
    },

    // Section 2 — How big is the build? (radio)
    {
        id: 5, section: 2, section_title: "How big is the build?",
        name: "Compact (up to 5 screens)", description: "Lean, focused scope",
        price: 0, unit: "once", input_type: "radio", suffix: "Included", popular: true,
    },
    {
        id: 6, section: 2, section_title: "How big is the build?",
        name: "Standard (6–15 screens)", description: "Most common project size",
        price: 15999, unit: "once", input_type: "radio", suffix: null, popular: false,
    },
    {
        id: 7, section: 2, section_title: "How big is the build?",
        name: "Large (16–30 screens)", description: "Feature-rich product",
        price: 29999, unit: "once", input_type: "radio", suffix: null, popular: false,
    },
    {
        id: 8, section: 2, section_title: "How big is the build?",
        name: "Enterprise (30+ screens)", description: "Complex, multi-module system",
        price: 49999, unit: "once", input_type: "radio", suffix: null, popular: false,
    },

    // Section 3 — Power-ups & add-ons (checkbox + stepper, by category)
    // Automation & Integration
    {
        id: 10, section: 3, section_title: "Power-ups & add-ons",
        category: "Automation & Integration",
        name: "WhatsApp + SMS Automation", description: "Two-way messaging & drip flows",
        price: 14999, unit: "once", input_type: "checkbox", suffix: null, popular: false,
    },
    {
        id: 11, section: 3, section_title: "Power-ups & add-ons",
        category: "Automation & Integration",
        name: "CRM Integration", description: "Sync leads & deals to your CRM",
        price: 11999, unit: "once", input_type: "stepper", suffix: "per platform", popular: false,
    },
    {
        id: 12, section: 3, section_title: "Power-ups & add-ons",
        category: "Automation & Integration",
        name: "Document Automation", description: "Auto-generate PDFs & contracts",
        price: 6999, unit: "once", input_type: "checkbox", suffix: null, popular: false,
    },
    {
        id: 13, section: 3, section_title: "Power-ups & add-ons",
        category: "Automation & Integration",
        name: "Custom API Integration", description: "Connect any third-party service",
        price: 13999, unit: "once", input_type: "checkbox", suffix: "+", popular: false,
    },

    // Design & Growth
    {
        id: 14, section: 3, section_title: "Power-ups & add-ons",
        category: "Design & Growth",
        name: "Branding & Visual Identity", description: "Logo, palette & design system",
        price: 11999, unit: "once", input_type: "checkbox", suffix: null, popular: false,
    },
    {
        id: 15, section: 3, section_title: "Power-ups & add-ons",
        category: "Design & Growth",
        name: "Technical SEO Setup", description: "Schema, speed & indexing",
        price: 8999, unit: "once", input_type: "checkbox", suffix: null, popular: false,
    },
    {
        id: 16, section: 3, section_title: "Power-ups & add-ons",
        category: "Design & Growth",
        name: "Monthly SEO & Content", description: "Ongoing content & optimization",
        price: 5799, unit: "mo", input_type: "checkbox", suffix: null, popular: false,
    },
    {
        id: 17, section: 3, section_title: "Power-ups & add-ons",
        category: "Design & Growth",
        name: "Additional Landing Page", description: "Extra campaign pages",
        price: 2999, unit: "once", input_type: "stepper", suffix: "each", popular: false,
    },

    // Section 4 — Ongoing partnership (toggle)
    {
        id: 30, section: 4, section_title: "Ongoing partnership",
        name: "Monthly retainer",
        description: "Continuous support, optimization & new development.",
        price: 20999, unit: "mo", input_type: "toggle", suffix: null, popular: false,
    },
];

/* ── EmailJS Config ────────────────────────────────────────────────────────── */

export const EMAILJS_SERVICE_ID = "service_jol7zau";
export const EMAILJS_ADMIN_TEMPLATE_ID = "template_ylalwbt";
export const EMAILJS_CLIENT_TEMPLATE_ID = "template_p4ths3g";
export const EMAILJS_PUBLIC_KEY = "tVCYcgc1VZoOKFep9";
export const ADMIN_EMAIL = "founder.sentrox@gmail.com";

/* ── Google Sheets ─────────────────────────────────────────────────────────── */

export const GOOGLE_SHEETS_WEBAPP_URL =
    "https://script.google.com/macros/s/AKfycbxXUu_4sTi-fn0aVg3Q9ON_a_cj3UyrXlzrkhU4FDTQCRrSvzVt-tKPZ6S1iTmsTq3zKQ/exec";

/* ── Helpers ───────────────────────────────────────────────────────────────── */

/** Group CALC_ITEMS by section number → { sectionNumber, title, items }[] */
export function getSections() {
    const map = new Map<number, { title: string; items: CalcItem[] }>();

    CALC_ITEMS.forEach((it) => {
        if (!map.has(it.section)) {
            map.set(it.section, { title: it.section_title, items: [] });
        }
        map.get(it.section)!.items.push(it);
    });

    return Array.from(map.entries())
        .sort((a, b) => a[0] - b[0])
        .map(([section, group]) => ({ section, ...group }));
}

/** Group addon items by category */
export function groupByCategory(items: CalcItem[]) {
    const map = new Map<string, CalcItem[]>();

    items.forEach((it) => {
        const key = it.category || "";
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push(it);
    });

    return Array.from(map.entries());
}

/** Find the retainer item */
export const RETAINER_ITEM = CALC_ITEMS.find((it) => it.input_type === "toggle") ?? null;

/** Local-storage key for persisted currency */
export const STORAGE_KEY = "sentrox.currency";
