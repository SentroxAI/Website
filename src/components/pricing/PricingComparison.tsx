"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";

import Container from "@/components/ui/layout/Container";
import Section from "@/components/ui/layout/Section";
import SectionHeading from "@/components/ui/section/SectionHeading";
import { fadeUp, viewport } from "@/lib/animations";

/* -------------------------------------------------------------------------- */
/*                                  DATA                                      */
/* -------------------------------------------------------------------------- */

const features = [
    { category: "Design & Development", items: [
        { name: "Custom UI/UX Design", starter: true, professional: true, enterprise: true },
        { name: "Responsive / Mobile-First", starter: true, professional: true, enterprise: true },
        { name: "Number of Pages", starter: "Up to 5", professional: "Up to 15", enterprise: "Unlimited" },
        { name: "Custom Animations", starter: false, professional: true, enterprise: true },
        { name: "3D / Interactive Elements", starter: false, professional: false, enterprise: true },
        { name: "CMS Integration", starter: false, professional: true, enterprise: true },
    ]},
    { category: "AI Features", items: [
        { name: "AI Chatbot Integration", starter: false, professional: true, enterprise: true },
        { name: "AI Content Generation", starter: false, professional: true, enterprise: true },
        { name: "Custom AI Agents", starter: false, professional: false, enterprise: true },
        { name: "Workflow Automation", starter: false, professional: "Basic", enterprise: "Advanced" },
        { name: "AI Analytics Dashboard", starter: false, professional: false, enterprise: true },
    ]},
    { category: "Performance & SEO", items: [
        { name: "Technical SEO", starter: true, professional: true, enterprise: true },
        { name: "Speed Optimization", starter: true, professional: true, enterprise: true },
        { name: "Schema Markup", starter: false, professional: true, enterprise: true },
        { name: "Monthly SEO Reports", starter: false, professional: false, enterprise: true },
    ]},
    { category: "Support & Maintenance", items: [
        { name: "Delivery Time", starter: "2–3 weeks", professional: "4–6 weeks", enterprise: "6–12 weeks" },
        { name: "Revisions", starter: "2 rounds", professional: "5 rounds", enterprise: "Unlimited" },
        { name: "Post-Launch Support", starter: "1 month", professional: "3 months", enterprise: "12 months" },
        { name: "Priority Support", starter: false, professional: true, enterprise: true },
        { name: "Dedicated Project Manager", starter: false, professional: false, enterprise: true },
    ]},
];

/* -------------------------------------------------------------------------- */
/*                              CELL RENDERER                                 */
/* -------------------------------------------------------------------------- */

function CellValue({ value }: { value: boolean | string }) {
    if (value === true)
        return <Check className="mx-auto h-5 w-5 text-emerald-400" />;

    if (value === false)
        return <Minus className="mx-auto h-5 w-5 text-slate-600" />;

    return (
        <span className="text-sm font-medium text-slate-300">{value}</span>
    );
}

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

export default function PricingComparison() {
    return (
        <Section id="pricing-comparison" spacing="md">
            <Container>
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                >
                    <SectionHeading
                        title="Compare Plans"
                        description="A detailed breakdown of what's included in each plan."
                    />
                </motion.div>

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mt-12 overflow-x-auto"
                >
                    <table className="w-full min-w-[700px] border-collapse">
                        {/* Header */}

                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="py-4 text-left text-sm font-medium text-slate-400">
                                    Feature
                                </th>

                                <th className="py-4 text-center text-sm font-semibold text-white">
                                    Starter
                                </th>

                                <th className="py-4 text-center">
                                    <span className="rounded-full bg-blue-600/20 px-3 py-1 text-sm font-semibold text-blue-400">
                                        Professional
                                    </span>
                                </th>

                                <th className="py-4 text-center text-sm font-semibold text-white">
                                    Enterprise
                                </th>
                            </tr>
                        </thead>

                        {/* Body */}

                        <tbody>
                            {features.map((group) => (
                                <React.Fragment key={group.category}>
                                    {/* Category Header */}

                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="pt-8 pb-3 text-sm font-semibold uppercase tracking-wider text-blue-400"
                                        >
                                            {group.category}
                                        </td>
                                    </tr>

                                    {/* Items */}

                                    {group.items.map((item) => (
                                        <tr
                                            key={item.name}
                                            className="border-b border-white/5 transition-colors hover:bg-white/[0.02]"
                                        >
                                            <td className="py-4 text-sm text-slate-300">
                                                {item.name}
                                            </td>

                                            <td className="py-4 text-center">
                                                <CellValue value={item.starter} />
                                            </td>

                                            <td className="py-4 text-center">
                                                <CellValue value={item.professional} />
                                            </td>

                                            <td className="py-4 text-center">
                                                <CellValue value={item.enterprise} />
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            </Container>
        </Section>
    );
}

