"use client";

/* -------------------------------------------------------------------------- */
/*                            SIGNUP FORM                                      */
/*                                                                            */
/*  Client component for creating a new account.                              */
/*  Uses react-hook-form + Zod, server actions, password strength,            */
/*  social login, and Framer Motion.                                          */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
    LuMail,
    LuLock,
    LuEye,
    LuEyeOff,
    LuUser,
    LuLoaderCircle,
    LuArrowRight,
    LuMailOpen,
} from "react-icons/lu";
import { toast } from "sonner";

import { signUp } from "@/app/actions/auth";
import { signUpSchema, type SignUpFormData } from "@/lib/validations";
import { cn } from "@/lib/utils";
import SocialLoginButtons from "./SocialLoginButtons";
import PasswordStrength from "./PasswordStrength";

const stagger = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.07, delayChildren: 0.1 },
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

export default function SignupForm() {
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<SignUpFormData>({
        resolver: zodResolver(signUpSchema),
    });

    const passwordValue = watch("password", "");

    const onSubmit = async (data: SignUpFormData) => {
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.set("full_name", data.full_name);
            formData.set("email", data.email);
            formData.set("password", data.password);
            formData.set("confirm_password", data.confirm_password);

            const result = await signUp(undefined, formData, redirectTo || undefined);

            if (result.success) {
                setIsSuccess(true);
                toast.success(result.message || "Account created!");
            } else {
                toast.error(result.error || "Sign up failed");
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ── Success state ───────────────────────────────────────────────── */
    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col items-center space-y-6 py-4 text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        delay: 0.2,
                    }}
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 backdrop-blur-xl"
                >
                    <LuMailOpen className="h-10 w-10 text-emerald-400" />
                </motion.div>

                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-white">
                        Check your email
                    </h2>
                    <p className="mx-auto max-w-xs text-sm leading-relaxed text-slate-400">
                        We&apos;ve sent you a verification link. Please check your
                        inbox and click the link to activate your account.
                    </p>
                </div>

                <Link
                    href={redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login"}
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
                >
                    Back to Sign In
                    <LuArrowRight className="h-3.5 w-3.5" />
                </Link>
            </motion.div>
        );
    }

    /* ── Form state ──────────────────────────────────────────────────── */
    return (
        <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="space-y-5"
        >
            {/* ── Header ─────────────────────────────────────────────── */}
            <motion.div variants={fadeUp} className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight text-white">
                    Create your account
                </h1>
                <p className="text-sm text-slate-400">
                    Get started with Sentrox AI today
                </p>
            </motion.div>

            {/* ── Form ───────────────────────────────────────────────── */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Full Name */}
                <motion.div variants={fadeUp} className="space-y-2">
                    <label
                        htmlFor="signup-name"
                        className="block text-sm font-medium text-slate-300"
                    >
                        Full Name
                    </label>
                    <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                            <LuUser className="h-4 w-4" />
                        </span>
                        <input
                            id="signup-name"
                            type="text"
                            autoComplete="name"
                            placeholder="John Doe"
                            {...register("full_name")}
                            className={cn(
                                "w-full rounded-2xl border bg-white/[0.04] py-3.5 pl-11 pr-4",
                                "text-white placeholder:text-slate-600",
                                "outline-none backdrop-blur-xl",
                                "transition-all duration-300",
                                "focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20",
                                errors.full_name
                                    ? "border-red-500/50"
                                    : "border-white/[0.08] hover:border-white/[0.15]",
                            )}
                        />
                    </div>
                    {errors.full_name && (
                        <p className="text-xs text-red-400">
                            {errors.full_name.message}
                        </p>
                    )}
                </motion.div>

                {/* Email */}
                <motion.div variants={fadeUp} className="space-y-2">
                    <label
                        htmlFor="signup-email"
                        className="block text-sm font-medium text-slate-300"
                    >
                        Email
                    </label>
                    <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                            <LuMail className="h-4 w-4" />
                        </span>
                        <input
                            id="signup-email"
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
                    <label
                        htmlFor="signup-password"
                        className="block text-sm font-medium text-slate-300"
                    >
                        Password
                    </label>
                    <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                            <LuLock className="h-4 w-4" />
                        </span>
                        <input
                            id="signup-password"
                            type={showPassword ? "text" : "password"}
                            autoComplete="new-password"
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
                    <PasswordStrength password={passwordValue} />
                    {errors.password && (
                        <p className="text-xs text-red-400">
                            {errors.password.message}
                        </p>
                    )}
                </motion.div>

                {/* Confirm Password */}
                <motion.div variants={fadeUp} className="space-y-2">
                    <label
                        htmlFor="signup-confirm"
                        className="block text-sm font-medium text-slate-300"
                    >
                        Confirm Password
                    </label>
                    <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                            <LuLock className="h-4 w-4" />
                        </span>
                        <input
                            id="signup-confirm"
                            type={showConfirm ? "text" : "password"}
                            autoComplete="new-password"
                            placeholder="••••••••"
                            {...register("confirm_password")}
                            className={cn(
                                "w-full rounded-2xl border bg-white/[0.04] py-3.5 pl-11 pr-12",
                                "text-white placeholder:text-slate-600",
                                "outline-none backdrop-blur-xl",
                                "transition-all duration-300",
                                "focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20",
                                errors.confirm_password
                                    ? "border-red-500/50"
                                    : "border-white/[0.08] hover:border-white/[0.15]",
                            )}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors hover:text-slate-300"
                        >
                            {showConfirm ? (
                                <LuEyeOff className="h-4 w-4" />
                            ) : (
                                <LuEye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    {errors.confirm_password && (
                        <p className="text-xs text-red-400">
                            {errors.confirm_password.message}
                        </p>
                    )}
                </motion.div>

                {/* Submit */}
                <motion.div variants={fadeUp} className="pt-1">
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
                                Create Account
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
                Already have an account?{" "}
                <Link
                    href={redirectTo ? `/login?redirect=${encodeURIComponent(redirectTo)}` : "/login"}
                    className="font-medium text-blue-400 transition-colors hover:text-blue-300"
                >
                    Sign in
                </Link>
            </motion.p>
        </motion.div>
    );
}
