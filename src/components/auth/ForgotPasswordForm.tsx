"use client";

/* -------------------------------------------------------------------------- */
/*                       FORGOT PASSWORD FORM                                  */
/*                                                                            */
/*  Simple email form to request a password reset link.                       */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
    LuMail,
    LuLoaderCircle,
    LuArrowRight,
    LuArrowLeft,
    LuMailOpen,
    LuSend,
} from "react-icons/lu";
import { toast } from "sonner";

import { resetPassword } from "@/app/actions/auth";
import {
    resetPasswordSchema,
    type ResetPasswordFormData,
} from "@/lib/validations";
import { cn } from "@/lib/utils";

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

export default function ForgotPasswordForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.set("email", data.email);

            const result = await resetPassword(undefined, formData);

            if (result.success) {
                setIsSuccess(true);
                toast.success(result.message || "Reset link sent!");
            } else {
                toast.error(result.error || "Failed to send reset link");
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
                    className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl"
                >
                    <LuMailOpen className="h-10 w-10 text-blue-400" />
                </motion.div>

                <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-white">
                        Check your email
                    </h2>
                    <p className="mx-auto max-w-xs text-sm leading-relaxed text-slate-400">
                        We&apos;ve sent a password reset link to your email.
                        Click the link to set a new password.
                    </p>
                </div>

                <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 transition-colors hover:text-blue-300"
                >
                    <LuArrowLeft className="h-3.5 w-3.5" />
                    Back to Sign In
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
            className="space-y-6"
        >
            {/* ── Header ─────────────────────────────────────────────── */}
            <motion.div variants={fadeUp} className="space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight text-white">
                    Forgot password?
                </h1>
                <p className="text-sm text-slate-400">
                    Enter your email and we&apos;ll send you a reset link
                </p>
            </motion.div>

            {/* ── Form ───────────────────────────────────────────────── */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email */}
                <motion.div variants={fadeUp} className="space-y-2">
                    <label
                        htmlFor="reset-email"
                        className="block text-sm font-medium text-slate-300"
                    >
                        Email
                    </label>
                    <div className="relative">
                        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                            <LuMail className="h-4 w-4" />
                        </span>
                        <input
                            id="reset-email"
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
                                Send Reset Link
                                <LuSend className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            </>
                        )}
                    </motion.button>
                </motion.div>
            </form>

            {/* ── Footer link ─────────────────────────────────────────── */}
            <motion.p
                variants={fadeUp}
                className="text-center text-sm text-slate-500"
            >
                Remember your password?{" "}
                <Link
                    href="/login"
                    className="font-medium text-blue-400 transition-colors hover:text-blue-300"
                >
                    Sign in
                </Link>
            </motion.p>
        </motion.div>
    );
}
