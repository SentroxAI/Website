"use client";

/* -------------------------------------------------------------------------- */
/*                            LOGIN FORM                                       */
/*                                                                            */
/*  Client component for sign-in with email/password.                         */
/*  Uses react-hook-form + Zod, server actions, and Framer Motion.            */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { LuMail, LuLock, LuEye, LuEyeOff, LuLoaderCircle, LuArrowRight } from "react-icons/lu";
import { toast } from "sonner";

import { signIn } from "@/app/actions/auth";
import { signInSchema, type SignInFormData } from "@/lib/validations";
import { cn } from "@/lib/utils";
import SocialLoginButtons from "./SocialLoginButtons";

const stagger = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
};

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" as const },
    },
};

export default function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect");

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInFormData>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = async (data: SignInFormData) => {
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.set("email", data.email);
            formData.set("password", data.password);

            const result = await signIn(undefined, formData, redirectTo || undefined);

            // signIn redirects on success, so we only reach here on error
            if (result && !result.success) {
                toast.error(result.error || "Sign in failed");
            }
        } catch {
            // redirect() throws NEXT_REDIRECT — this is expected on success
            // If it's a real error, it would have been caught above
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            {/* ── Header ─────────────────────────────────────────────── */}
            <motion.div variants={fadeUp} className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight text-white">
                    Welcome back
                </h1>
                <p className="text-sm text-slate-400">
                    Sign in to your account to continue
                </p>
            </motion.div>

            {/* ── Form ───────────────────────────────────────────────── */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email */}
                <motion.div variants={fadeUp} className="space-y-2">
                    <label
                        htmlFor="login-email"
                        className="block text-sm font-medium text-slate-300"
                    >
                        Email
                    </label>
                    <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                            <LuMail className="h-4 w-4" />
                        </span>
                        <input
                            id="login-email"
                            type="email"
                            autoComplete="email"
                            placeholder="you@example.com"
                            {...register("email")}
                            className={cn(
                                "w-full rounded-2xl border bg-white/[0.04] py-3.5 pl-11 pr-4",
                                "text-white placeholder:text-slate-600",
                                "outline-none backdrop-blur-xl",
                                "transition-all duration-300",
                                "focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20",
                                errors.email
                                    ? "border-red-500/50"
                                    : "border-white/[0.08] hover:border-white/[0.15]",
                            )}
                        />
                    </div>
                    {errors.email && (
                        <p className="text-xs text-red-400">
                            {errors.email.message}
                        </p>
                    )}
                </motion.div>

                {/* Password */}
                <motion.div variants={fadeUp} className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label
                            htmlFor="login-password"
                            className="block text-sm font-medium text-slate-300"
                        >
                            Password
                        </label>
                        <Link
                            href="/forgot-password"
                            className="text-xs font-medium text-blue-400 transition-colors hover:text-blue-300"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                            <LuLock className="h-4 w-4" />
                        </span>
                        <input
                            id="login-password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="current-password"
                            placeholder="••••••••"
                            {...register("password")}
                            className={cn(
                                "w-full rounded-2xl border bg-white/[0.04] py-3.5 pl-11 pr-12",
                                "text-white placeholder:text-slate-600",
                                "outline-none backdrop-blur-xl",
                                "transition-all duration-300",
                                "focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20",
                                errors.password
                                    ? "border-red-500/50"
                                    : "border-white/[0.08] hover:border-white/[0.15]",
                            )}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                        >
                            {showPassword ? (
                                <LuEyeOff className="h-4 w-4" />
                            ) : (
                                <LuEye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-xs text-red-400">
                            {errors.password.message}
                        </p>
                    )}
                </motion.div>

                {/* Submit */}
                <motion.div variants={fadeUp}>
                    <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        className={cn(
                            "group relative flex w-full items-center justify-center gap-2 rounded-2xl py-3.5",
                            "bg-gradient-to-r from-blue-600 to-blue-500",
                            "text-sm font-semibold text-white",
                            "shadow-[0_4px_20px_rgba(37,99,235,0.3)]",
                            "transition-all duration-300",
                            "hover:shadow-[0_8px_30px_rgba(37,99,235,0.4)]",
                            "disabled:cursor-not-allowed disabled:opacity-60",
                        )}
                    >
                        {isSubmitting ? (
                            <LuLoaderCircle className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                Sign In
                                <LuArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            </>
                        )}
                    </motion.button>
                </motion.div>
            </form>

            {/* ── Social Login ────────────────────────────────────────── */}
            <motion.div variants={fadeUp}>
                <SocialLoginButtons />
            </motion.div>

            {/* ── Footer link ─────────────────────────────────────────── */}
            <motion.p
                variants={fadeUp}
                className="text-center text-sm text-slate-500"
            >
                Don&apos;t have an account?{" "}
                <Link
                    href={redirectTo ? `/signup?redirect=${encodeURIComponent(redirectTo)}` : "/signup"}
                    className="font-medium text-blue-400 transition-colors hover:text-blue-300"
                >
                    Create one
                </Link>
            </motion.p>
        </motion.div>
    );
}
