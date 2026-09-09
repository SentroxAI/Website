"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    Mail,
    MapPin,
    Sparkles,
} from "lucide-react";

import Container from "@/components/ui/layout/Container";
import GlassCard from "@/components/ui/cards/GlassCard";

import {
    fadeUp,
    hoverCard,
    viewport,
} from "@/lib/animations";

import CTASection from "./footer/CTASection";
import FooterColumn from "./footer/FooterColumn";
import Newsletter from "./footer/Newsletter";
import SocialIcons from "./footer/SocialIcons";

import {
    footerColumns,
    socialLinks,
    contactInfo,
} from "./footer/footerData";

export default function Footer() {
    return (
        <footer className="relative overflow-hidden border-t border-white/10">

            {/* Background */}

            <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,rgba(37,99,235,.08),transparent_65%)]" />

            <div className="absolute left-1/2 top-0 -z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[160px]" />

            <Container className="py-28">

                {/* CTA */}

                <CTASection />

                {/* Newsletter */}

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mt-24"
                >
                    <Newsletter />
                </motion.div>

                {/* Footer Content */}

                <div className="mt-24 grid gap-14 lg:grid-cols-6">

                    {/* Contact */}

                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewport}
                        className="lg:col-span-2"
                    >
                        <GlassCard className="h-full p-8">

                            {/* Logo */}

                            <Link
                                href="/"
                                className="inline-flex items-center gap-3"
                            >
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500">

                                    <Sparkles className="h-6 w-6 text-white" />

                                </div>

                                <div>

                                    <h2 className="text-2xl font-bold text-white">
                                        Sentrox AI
                                    </h2>

                                    <p className="text-sm text-slate-400">
                                        AI Website Agency
                                    </p>

                                </div>

                            </Link>

                            {/* Description */}

                            <p className="mt-8 leading-8 text-slate-400">
                                {contactInfo.description}
                            </p>

                            {/* Contact */}

                            <div className="mt-8 space-y-5">

                                <div className="flex items-center gap-3">

                                    <Mail className="h-5 w-5 text-blue-400" />

                                    <a
                                        href={`mailto:${contactInfo.email}`}
                                        className="text-slate-300 transition-colors hover:text-blue-400"
                                    >
                                        {contactInfo.email}
                                    </a>

                                </div>

                                <div className="flex items-center gap-3">

                                    <MapPin className="h-5 w-5 text-blue-400" />

                                    <span className="text-slate-300">
                                        {contactInfo.location}
                                    </span>

                                </div>

                            </div>

                            {/* Social */}

                            <motion.div
                                whileHover={hoverCard.whileHover}
                                whileTap={hoverCard.whileTap}
                                className="mt-10"
                            >
                                <SocialIcons socials={socialLinks} />
                            </motion.div>

                        </GlassCard>
                    </motion.div>

                    {/* Navigation */}

                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewport}
                        className="grid gap-10 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-4"
                    >

                        {footerColumns.map((column, index) => (

                            <FooterColumn
                                key={column.title}
                                column={column}
                                index={index}
                            />

                        ))}
                    </motion.div>

                </div>

                {/* Bottom */}

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mt-24 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-10 text-center md:flex-row"
                >

                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} Sentrox AI.
                        All rights reserved.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm">

                        <Link
                            href="/privacy-policy"
                            className="text-slate-500 transition-colors hover:text-blue-400"
                        >
                            Privacy Policy
                        </Link>

                        <Link
                            href="/terms"
                            className="text-slate-500 transition-colors hover:text-blue-400"
                        >
                            Terms of Service
                        </Link>

                        <Link
                            href="/cookies"
                            className="text-slate-500 transition-colors hover:text-blue-400"
                        >
                            Cookie Policy
                        </Link>

                    </div>

                </motion.div>

            </Container>

        </footer >
    );
}