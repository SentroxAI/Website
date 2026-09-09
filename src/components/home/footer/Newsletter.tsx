"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Check } from "lucide-react";

export default function Newsletter() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = () => {
        if (!email.trim()) return;

        setSubscribed(true);

        setTimeout(() => {
            setSubscribed(false);
            setEmail("");
        }, 3000);
    };

    return (
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-2xl">

            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-500/10" />

            <div className="relative">

                <div className="flex items-center gap-3">

                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500">
                        <Mail className="h-6 w-6 text-white" />
                    </div>

                    <div>
                        <h3 className="text-2xl font-bold text-white">
                            Stay Updated
                        </h3>

                        <p className="mt-1 text-slate-400">
                            Get the latest AI, design, and development insights.
                        </p>
                    </div>

                </div>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 rounded-2xl border border-white/10 bg-black/20 px-5 py-4 text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
                    />

                    <motion.button
                        whileHover={{
                            scale: 1.05,
                        }}
                        whileTap={{
                            scale: 0.98,
                        }}
                        onClick={handleSubscribe}
                        className="rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition-colors hover:bg-blue-500"
                    >
                        {subscribed ? (
                            <span className="flex items-center gap-2">
                                <Check className="h-5 w-5" />
                                Subscribed
                            </span>
                        ) : (
                            "Subscribe"
                        )}
                    </motion.button>

                </div>

            </div>

        </div>
    );
}