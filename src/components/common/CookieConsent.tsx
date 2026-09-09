"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";

import PrimaryButton from "@/components/ui/buttons/PrimaryButton";

const CONSENT_KEY = "sentrox-cookie-consent";

export default function CookieConsent() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem(CONSENT_KEY);

        if (!consent) {
            const timer = setTimeout(() => setShow(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const accept = () => {
        localStorage.setItem(CONSENT_KEY, "accepted");
        setShow(false);
    };

    const decline = () => {
        localStorage.setItem(CONSENT_KEY, "declined");
        setShow(false);
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="fixed bottom-6 left-6 right-6 z-50 mx-auto max-w-lg"
                >
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-2xl">
                        {/* Glass Highlight */}

                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />

                        {/* Close */}

                        <button
                            onClick={decline}
                            className="absolute right-4 top-4 text-slate-500 transition-colors hover:text-white"
                            aria-label="Close"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        <div className="relative flex items-start gap-4">
                            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500/15">
                                <Cookie className="h-5 w-5 text-blue-400" />
                            </div>

                            <div className="flex-1">
                                <h3 className="text-sm font-semibold text-white">
                                    Cookie Preferences
                                </h3>

                                <p className="mt-1 text-xs leading-5 text-slate-400">
                                    We use cookies to improve your experience
                                    and analyze site traffic. By clicking
                                    "Accept," you agree to our use of cookies.
                                </p>

                                <div className="mt-4 flex gap-3">
                                    <PrimaryButton
                                        onClick={accept}
                                        size="sm"
                                    >
                                        Accept
                                    </PrimaryButton>

                                    <button
                                        onClick={decline}
                                        className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                                    >
                                        Decline
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
