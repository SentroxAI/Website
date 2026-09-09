"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

import Container from "@/components/ui/layout/Container";
import Section from "@/components/ui/layout/Section";
import { fadeUp, viewport } from "@/lib/animations";

/* -------------------------------------------------------------------------- */
/*                                  TYPES                                     */
/* -------------------------------------------------------------------------- */

interface LegalLayoutProps {
    title: string;
    lastUpdated: string;
    children: ReactNode;
}

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

export default function LegalLayout({
    title,
    lastUpdated,
    children,
}: LegalLayoutProps) {
    return (
        <Section id="legal" className="pt-36 pb-24">
            {/* Background */}

            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(37,99,235,.06),transparent_65%)]" />

            <Container size="md">
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                >
                    {/* Header */}

                    <div className="border-b border-white/10 pb-10">
                        <h1 className="text-4xl font-bold text-white md:text-5xl">
                            {title}
                        </h1>

                        <p className="mt-4 text-slate-400">
                            Last updated: {lastUpdated}
                        </p>
                    </div>

                    {/* Content */}

                    <div className="prose-legal mt-12 space-y-10 text-slate-400 leading-8">
                        {children}
                    </div>
                </motion.div>
            </Container>
        </Section>
    );
}
