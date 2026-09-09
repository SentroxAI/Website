/* -------------------------------------------------------------------------- */
/*                              TYPOGRAPHY                                    */
/* -------------------------------------------------------------------------- */

export const typography = {
    /* ── Font Families ──────────────────────────────────────────────────── */

    fontFamily: {
        sans: "var(--font-geist-sans), system-ui, -apple-system, sans-serif",
        mono: "var(--font-geist-mono), monospace",
        heading: "var(--font-geist-sans), system-ui, -apple-system, sans-serif",
    },

    /* ── Font Sizes ────────────────────────────────────────────────────── */

    fontSize: {
        xs: ["0.75rem", { lineHeight: "1rem" }],
        sm: ["0.875rem", { lineHeight: "1.25rem" }],
        base: ["1rem", { lineHeight: "1.75rem" }],
        lg: ["1.125rem", { lineHeight: "2rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1.15" }],
        "6xl": ["3.75rem", { lineHeight: "1.1" }],
        "7xl": ["4.5rem", { lineHeight: "1.05" }],
    },

    /* ── Font Weights ──────────────────────────────────────────────────── */

    fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
    },

    /* ── Letter Spacing ────────────────────────────────────────────────── */

    letterSpacing: {
        tighter: "-0.05em",
        tight: "-0.025em",
        normal: "0",
        wide: "0.025em",
    },
} as const;
