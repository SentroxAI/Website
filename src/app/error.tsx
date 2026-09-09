"use client";

/* -------------------------------------------------------------------------- */
/*                       GLOBAL ERROR BOUNDARY (Enhanced)                     */
/*                                                                            */
/*  Sprint 4 — Module 10: Enhanced error boundary with monitoring             */
/*  integration, error digest display, and retry/reset controls.             */
/* -------------------------------------------------------------------------- */

import { useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Home, AlertTriangle, Bug } from "lucide-react";

import Container from "@/components/ui/layout/Container";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import SecondaryButton from "@/components/ui/buttons/SecondaryButton";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    /* ── Report error to monitoring ───────────────────────────────── */
    useEffect(() => {
        // Log error details for monitoring
        console.error("[ErrorBoundary]", {
            message: error.message,
            digest: error.digest,
            stack: error.stack,
        });

        // Dynamic import to avoid circular dependencies
        import("@/lib/monitoring").then(({ captureError }) => {
            captureError(error, {
                source: "error-boundary",
                metadata: {
                    digest: error.digest,
                    url: typeof window !== "undefined" ? window.location.href : "unknown",
                },
            });
        }).catch(() => {
            // Fail silently if monitoring module fails to load
        });
    }, [error]);

    return (
        <main className="flex min-h-screen items-center">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.06),transparent_60%)]" />

            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mx-auto max-w-2xl text-center"
                >
                    {/* Icon */}
                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-red-500/20 bg-red-500/10">
                        <AlertTriangle className="h-12 w-12 text-red-400" />
                    </div>

                    {/* Title */}
                    <h1 className="mt-8 text-3xl font-bold text-white sm:text-4xl">
                        Something Went Wrong
                    </h1>

                    {/* Description */}
                    <p className="mt-4 text-lg text-slate-400">
                        An unexpected error occurred. Our team has been
                        notified and we&apos;re working on a fix.
                    </p>

                    {/* Error Details */}
                    {(error.digest || error.message) && (
                        <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                            {error.digest && (
                                <p className="text-xs text-slate-500">
                                    Error ID:{" "}
                                    <code className="rounded bg-white/[0.04] px-1.5 py-0.5 font-mono text-slate-400">
                                        {error.digest}
                                    </code>
                                </p>
                            )}
                            {process.env.NODE_ENV === "development" && error.message && (
                                <div className="mt-2 flex items-start gap-2 text-left">
                                    <Bug className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                                    <p className="text-xs text-red-300 font-mono break-all">
                                        {error.message}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                        <PrimaryButton
                            onClick={reset}
                            leftIcon={<RefreshCw size={18} />}
                        >
                            Try Again
                        </PrimaryButton>

                        <SecondaryButton
                            href="/"
                            leftIcon={<Home size={18} />}
                        >
                            Go Home
                        </SecondaryButton>
                    </div>
                </motion.div>
            </Container>
        </main>
    );
}
