"use client";

/* -------------------------------------------------------------------------- */
/*                        SOCIAL LOGIN BUTTONS                                 */
/*                                                                            */
/*  Google and GitHub OAuth buttons that trigger Supabase OAuth flow.          */
/*  Glass-style buttons with brand icons and hover effects.                    */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { LuLoaderCircle } from "react-icons/lu";

import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Provider = "google" | "github";

interface SocialLoginButtonsProps {
    className?: string;
}

export default function SocialLoginButtons({
    className,
}: SocialLoginButtonsProps) {
    const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null);

    const handleOAuth = async (provider: Provider) => {
        setLoadingProvider(provider);

        try {
            const supabase = createClient();

            await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: `${window.location.origin}/api/auth/callback`,
                },
            });
        } catch {
            // If OAuth fails to initiate, reset loading state
            setLoadingProvider(null);
        }
    };

    return (
        <div className={cn("space-y-3", className)}>
            {/* ── Divider ────────────────────────────────────────────── */}
            <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-white/[0.08]" />
                <span className="text-xs font-medium text-slate-500">
                    or continue with
                </span>
                <div className="h-px flex-1 bg-white/[0.08]" />
            </div>

            {/* ── Buttons ────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-3">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOAuth("google")}
                    disabled={loadingProvider !== null}
                    className={cn(
                        "flex h-12 items-center justify-center gap-2.5 rounded-2xl",
                        "border border-white/[0.08] bg-white/[0.03]",
                        "text-sm font-medium text-white",
                        "backdrop-blur-xl",
                        "transition-colors duration-200",
                        "hover:border-white/[0.15] hover:bg-white/[0.06]",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                    )}
                >
                    {loadingProvider === "google" ? (
                        <LuLoaderCircle className="h-5 w-5 animate-spin text-slate-400" />
                    ) : (
                        <>
                            <FcGoogle className="h-5 w-5" />
                            <span>Google</span>
                        </>
                    )}
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOAuth("github")}
                    disabled={loadingProvider !== null}
                    className={cn(
                        "flex h-12 items-center justify-center gap-2.5 rounded-2xl",
                        "border border-white/[0.08] bg-white/[0.03]",
                        "text-sm font-medium text-white",
                        "backdrop-blur-xl",
                        "transition-colors duration-200",
                        "hover:border-white/[0.15] hover:bg-white/[0.06]",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                    )}
                >
                    {loadingProvider === "github" ? (
                        <LuLoaderCircle className="h-5 w-5 animate-spin text-slate-400" />
                    ) : (
                        <>
                            <FaGithub className="h-5 w-5" />
                            <span>GitHub</span>
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
}
