"use client";

/* -------------------------------------------------------------------------- */
/*                          AUTH ILLUSTRATION                                   */
/*                                                                            */
/*  Right-side panel for the split-screen auth layout.                        */
/*  Features animated aurora gradients, floating shapes,                      */
/*  brand messaging, and social proof — hidden on mobile.                     */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { LuShieldCheck, LuZap, LuLock } from "react-icons/lu";

const floatingShapes = [
    {
        size: "h-64 w-64",
        color: "bg-blue-500/15",
        blur: "blur-[100px]",
        position: "top-[10%] left-[15%]",
        duration: 8,
        delay: 0,
    },
    {
        size: "h-48 w-48",
        color: "bg-cyan-500/15",
        blur: "blur-[80px]",
        position: "top-[40%] right-[10%]",
        duration: 10,
        delay: 1,
    },
    {
        size: "h-56 w-56",
        color: "bg-indigo-500/10",
        blur: "blur-[90px]",
        position: "bottom-[15%] left-[25%]",
        duration: 12,
        delay: 2,
    },
];

const features = [
    {
        icon: LuShieldCheck,
        title: "Enterprise Security",
        description: "Bank-grade encryption for your data",
    },
    {
        icon: LuZap,
        title: "Lightning Fast",
        description: "Optimized for peak performance",
    },
    {
        icon: LuLock,
        title: "Privacy First",
        description: "Your data never leaves your control",
    },
];

export default function AuthIllustration() {
    return (
        <div className="relative hidden h-full w-full overflow-hidden lg:flex lg:flex-col lg:items-center lg:justify-center">
            {/* ── Animated aurora background ───────────────────────── */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#030712] via-[#0a0f2e] to-[#030712]" />

            {/* ── Floating gradient orbs ───────────────────────────── */}
            {floatingShapes.map((shape, i) => (
                <motion.div
                    key={i}
                    className={`absolute rounded-full ${shape.size} ${shape.color} ${shape.blur} ${shape.position}`}
                    animate={{
                        y: [0, -30, 0],
                        x: [0, 15, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: shape.duration,
                        delay: shape.delay,
                        repeat: Infinity,
                        repeatType: "mirror",
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* ── Grid pattern overlay ─────────────────────────────── */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            {/* ── Content ─────────────────────────────────────────── */}
            <div className="relative z-10 flex max-w-md flex-col items-center px-12 text-center">
                {/* Brand mark */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-10"
                >
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(37,99,235,0.2)]">
                        <span className="bg-gradient-to-br from-blue-400 to-cyan-400 bg-clip-text text-2xl font-bold text-transparent">
                            S
                        </span>
                    </div>
                    <h2 className="text-2xl font-semibold text-white">
                        Sentrox AI
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                        AI-Powered Web & Automation Solutions
                    </p>
                </motion.div>

                {/* Feature cards */}
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: {},
                        visible: {
                            transition: { staggerChildren: 0.15, delayChildren: 0.5 },
                        },
                    }}
                    className="w-full space-y-4"
                >
                    {features.map((feature) => (
                        <motion.div
                            key={feature.title}
                            variants={{
                                hidden: { opacity: 0, x: 20 },
                                visible: {
                                    opacity: 1,
                                    x: 0,
                                    transition: { duration: 0.5, ease: "easeOut" },
                                },
                            }}
                            className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 backdrop-blur-xl transition-colors hover:border-white/[0.12] hover:bg-white/[0.05]"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 text-blue-400 transition-colors group-hover:from-blue-500/30 group-hover:to-cyan-500/30">
                                <feature.icon className="h-5 w-5" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-medium text-white">
                                    {feature.title}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Testimonial */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.2 }}
                    className="mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 backdrop-blur-xl"
                >
                    <p className="text-sm leading-relaxed text-slate-400 italic">
                        &ldquo;Sentrox AI transformed our digital presence completely. The
                        results exceeded every expectation.&rdquo;
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-xs font-semibold text-white">
                            JD
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-medium text-white">
                                James Drake
                            </p>
                            <p className="text-xs text-slate-500">CEO, TechFlow</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
