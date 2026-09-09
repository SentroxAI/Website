"use client";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    ArrowRight,
    MessageCircle,
    Search,
    Sparkles,
} from "lucide-react";

import Container from "@/components/ui/layout/Container";
import Section from "@/components/ui/layout/Section";
import SectionHeading from "@/components/ui/section/SectionHeading";
import GlassCard from "@/components/ui/cards/GlassCard";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import SecondaryButton from "@/components/ui/buttons/SecondaryButton";

import { fadeUp, hoverCard, viewport } from "@/lib/animations";

import FAQItem from "./faq/FAQItem";
import { faqs } from "./faq/faqData";
import { FAQCategory } from "./faq/types";

const categories: (FAQCategory | "All")[] = [
    "All",
    "General",
    "Website",
    "AI",
    "SEO",
    "Pricing",
    "Support",
];

export default function FAQ() {
    const [openId, setOpenId] = useState<number>(1);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] =
        useState<(typeof categories)[number]>("All");

    const filteredFAQs = useMemo(() => {
        return faqs.filter((faq) => {
            const matchesCategory =
                selectedCategory === "All"
                    ? true
                    : faq.category === selectedCategory;

            const matchesSearch =
                faq.question
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                faq.answer
                    .toLowerCase()
                    .includes(search.toLowerCase());

            return matchesCategory && matchesSearch;
        });
    }, [search, selectedCategory]);

    return (
        <Section
            id="faq"
            className="overflow-hidden"
        >
            {/* Background */}

            <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top,rgba(37,99,235,.08),transparent_65%)]" />

            <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[150px]" />

            <Container>

                {/* Header */}

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                >
                    <SectionHeading
                        badge="Frequently Asked Questions"
                        badgeIcon={<Sparkles className="h-4 w-4" />}
                        title="Have Questions? We've Got Answers."
                        description="Everything you need to know about our services, pricing, process, AI solutions, website development, and ongoing support."
                        className="mb-20"
                    />
                </motion.div>

                {/* Search */}

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mx-auto mt-14 max-w-2xl"
                >
                    <GlassCard className="relative p-0">

                        <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

                        <input
                            type="text"
                            placeholder="Search a question..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full rounded-2xl bg-transparent py-4 pl-14 pr-5 text-white outline-none placeholder:text-slate-500"
                        />

                    </GlassCard>
                </motion.div>

                {/* Categories */}

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mt-10 flex flex-wrap justify-center gap-3"
                >

                    {categories.map((category) => (
                        <motion.button
                            whileHover={hoverCard.whileHover}
                            whileTap={hoverCard.whileTap}
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`rounded-full border px-5 py-2 text-sm font-medium transition-all duration-300 ${selectedCategory === category
                                ? "border-blue-500 bg-blue-600 text-white"
                                : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                                }`}
                        >
                            {category}
                        </motion.button>
                    ))}

                </motion.div>

                {/* FAQ List */}

                <div className="mx-auto mt-20 max-w-5xl space-y-6">

                    {filteredFAQs.length > 0 ? (
                        filteredFAQs.map((faq) => (
                            <FAQItem
                                key={faq.id}
                                faq={faq}
                                isOpen={openId === faq.id}
                                onToggle={() =>
                                    setOpenId(
                                        openId === faq.id ? 0 : faq.id
                                    )
                                }
                            />
                        ))
                    ) : (
                        <GlassCard className="p-12 text-center">
                            <h3 className="text-2xl font-semibold text-white">
                                No Results Found
                            </h3>

                            <p className="mt-4 text-slate-400">
                                Try searching with different keywords.
                            </p>
                        </GlassCard>
                    )}

                </div>

                {/* CTA */}

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mt-24"
                >
                    <GlassCard className="relative overflow-hidden bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-500/10 p-12 text-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-transparent to-cyan-500/10" />

                        <div className="relative">

                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500">

                                <MessageCircle className="h-10 w-10 text-white" />

                            </div>

                            <h3 className="mx-auto mt-8 max-w-3xl text-4xl font-bold text-white md:text-5xl">
                                Still Have Questions?
                            </h3>

                            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                                We'd love to discuss your project,
                                answer your questions, and help you
                                choose the perfect solution for your
                                business.
                            </p>


                            <div className="mt-10 flex flex-col justify-center gap-5 sm:flex-row">
                                <PrimaryButton
                                    href="/contact"
                                    size="lg"
                                    rightIcon={<ArrowRight size={18} />}
                                >
                                    Book Free Consultation
                                </PrimaryButton>

                                <SecondaryButton
                                    href="/contact"
                                    size="lg"
                                >
                                    Contact Us
                                </SecondaryButton>
                            </div>

                        </div>
                    </GlassCard>

                </motion.div>

            </Container>
        </Section>
    );
}