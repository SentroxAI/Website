"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Home, Search } from "lucide-react";

import Container from "@/components/ui/layout/Container";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import SecondaryButton from "@/components/ui/buttons/SecondaryButton";

export default function NotFound() {
    return (
        <main className="flex min-h-screen items-center">
            {/* Background */}

            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08),transparent_60%)]" />

            <Container>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="mx-auto max-w-2xl text-center"
                >
                    {/* 404 Number */}

                    <h1 className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-[10rem] font-extrabold leading-none tracking-tighter text-transparent sm:text-[14rem]">
                        404
                    </h1>

                    {/* Title */}

                    <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">
                        Page Not Found
                    </h2>

                    {/* Description */}

                    <p className="mt-4 text-lg text-slate-400">
                        The page you're looking for doesn't exist or has
                        been moved. Let's get you back on track.
                    </p>

                    {/* Actions */}

                    <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                        <PrimaryButton
                            href="/"
                            leftIcon={<Home size={18} />}
                        >
                            Go Home
                        </PrimaryButton>

                        <SecondaryButton
                            href="/contact"
                            leftIcon={<Search size={18} />}
                        >
                            Contact Support
                        </SecondaryButton>
                    </div>
                </motion.div>
            </Container>
        </main>
    );
}
