/* -------------------------------------------------------------------------- */
/*                               GRADIENTS                                    */
/* -------------------------------------------------------------------------- */

export const gradients = {
    /* ── Brand Gradients ────────────────────────────────────────────────── */

    primary: "linear-gradient(135deg, #2563eb, #06b6d4)",
    primaryReverse: "linear-gradient(135deg, #06b6d4, #2563eb)",
    primarySubtle: "linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(6, 182, 212, 0.15))",

    /* ── Text Gradients (for use with bg-clip-text) ─────────────────────── */

    text: {
        primary: "linear-gradient(to right, #60a5fa, #22d3ee)",
        accent: "linear-gradient(to right, #06b6d4, #3b82f6)",
        white: "linear-gradient(to bottom, #ffffff, #94a3b8)",
    },

    /* ── Background Radials ─────────────────────────────────────────────── */

    radial: {
        primary: "radial-gradient(circle at center, rgba(37, 99, 235, 0.08), transparent 70%)",
        primaryTop: "radial-gradient(circle at top, rgba(37, 99, 235, 0.08), transparent 65%)",
        primaryStrong: "radial-gradient(circle at center, rgba(37, 99, 235, 0.15), transparent 60%)",
        accent: "radial-gradient(circle at center, rgba(6, 182, 212, 0.08), transparent 70%)",
    },

    /* ── Glass Overlays ─────────────────────────────────────────────────── */

    glass: {
        highlight: "linear-gradient(to bottom right, rgba(255, 255, 255, 0.10), transparent, transparent)",
        topEdge: "linear-gradient(to right, transparent, rgba(255, 255, 255, 0.30), transparent)",
        cta: "linear-gradient(to bottom right, rgba(37, 99, 235, 0.10), transparent, rgba(6, 182, 212, 0.10))",
    },

    /* ── Section Backgrounds ────────────────────────────────────────────── */

    section: {
        dark: "linear-gradient(to bottom, #030712, #0a0f1e, #030712)",
        subtle: "linear-gradient(to bottom, transparent, rgba(37, 99, 235, 0.03), transparent)",
    },

    /* ── Mesh Gradients ─────────────────────────────────────────────────── */

    mesh: {
        primary:
            "radial-gradient(at 40% 20%, rgba(37, 99, 235, 0.12) 0px, transparent 50%), " +
            "radial-gradient(at 80% 0%, rgba(6, 182, 212, 0.08) 0px, transparent 50%), " +
            "radial-gradient(at 0% 50%, rgba(37, 99, 235, 0.06) 0px, transparent 50%)",
    },
} as const;
