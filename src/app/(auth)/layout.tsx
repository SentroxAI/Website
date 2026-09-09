/* -------------------------------------------------------------------------- */
/*                          AUTH LAYOUT                                        */
/*                                                                            */
/*  Split-screen layout for all (auth) pages.                                 */
/*  Left: scrollable form area | Right: illustration (desktop only)           */
/*  Uses the (auth) route group — does not affect URL paths.                  */
/* -------------------------------------------------------------------------- */

import type { Metadata } from "next";

export const metadata: Metadata = {
    robots: {
        index: false,
        follow: false,
    },
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative flex min-h-dvh bg-[#030712]">
            {/* ── Ambient background gradients ───────────────────────── */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/[0.07] blur-[120px]" />
                <div className="absolute -right-40 bottom-0 h-[500px] w-[500px] rounded-full bg-cyan-600/[0.07] blur-[120px]" />
                <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/[0.04] blur-[100px]" />
            </div>

            {/* ── Subtle grid overlay ─────────────────────────────────── */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.02]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                    backgroundSize: "80px 80px",
                }}
            />

            {/* ── Form side ──────────────────────────────────────────── */}
            <div className="relative z-10 flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
                {children}
            </div>

            {/* ── Illustration side (desktop only) ────────────────────── */}
            <div className="relative z-10 hidden w-1/2 lg:block">
                <div className="absolute inset-y-6 right-6 left-0 overflow-hidden rounded-3xl border border-white/[0.06]">
                    <AuthIllustrationPanel />
                </div>
            </div>
        </div>
    );
}

/* ── Lazy-loaded illustration component ──────────────────────────────────── */
import AuthIllustration from "@/components/auth/AuthIllustration";

function AuthIllustrationPanel() {
    return <AuthIllustration />;
}
