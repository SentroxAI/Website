"use client";

import { motion } from "framer-motion";
import {
    Mail,
    MapPin,
    Phone,
    Clock,
    Copy,
    Check,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import Container from "@/components/ui/layout/Container";
import Section from "@/components/ui/layout/Section";
import GlassCard from "@/components/ui/cards/GlassCard";
import SectionHeading from "@/components/ui/section/SectionHeading";
import { fadeUp, hoverCard, viewport } from "@/lib/animations";
import { copyToClipboard } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                  DATA                                      */
/* -------------------------------------------------------------------------- */

const contactMethods = [
    {
        icon: Mail,
        title: "Email Us",
        value: "founder.sentrox@gmail.com",
        description: "We'll respond within 24 hours",
        copyable: true,
    },
    {
        icon: Phone,
        title: "Call Us",
        value: "+91 XXXXX XXXXX",
        description: "Mon – Fri, 10 AM – 7 PM IST",
        copyable: true,
    },
    {
        icon: MapPin,
        title: "Location",
        value: "India",
        description: "Serving clients worldwide",
        copyable: false,
    },
    {
        icon: Clock,
        title: "Business Hours",
        value: "Mon – Fri, 10 AM – 7 PM",
        description: "IST (UTC +5:30)",
        copyable: false,
    },
];

/* -------------------------------------------------------------------------- */
/*                              COPY BUTTON                                   */
/* -------------------------------------------------------------------------- */

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        const success = await copyToClipboard(text);

        if (success) {
            setCopied(true);
            toast.success("Copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <button
            onClick={handleCopy}
            className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Copy to clipboard"
        >
            {copied ? (
                <Check className="h-4 w-4 text-emerald-400" />
            ) : (
                <Copy className="h-4 w-4" />
            )}
        </button>
    );
}

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

export default function ContactInfo() {
    return (
        <Section id="contact-info" spacing="md">
            <Container>
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                >
                    <SectionHeading
                        title="Other Ways to Reach Us"
                        description="Choose the method that works best for you."
                    />
                </motion.div>

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {contactMethods.map((method) => {
                        const Icon = method.icon;

                        return (
                            <motion.div
                                key={method.title}
                                whileHover={hoverCard.whileHover}
                                whileTap={hoverCard.whileTap}
                            >
                                <GlassCard className="h-full p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/15">
                                            <Icon className="h-6 w-6 text-blue-400" />
                                        </div>

                                        {method.copyable && (
                                            <CopyButton text={method.value} />
                                        )}
                                    </div>

                                    <h3 className="mt-5 text-lg font-semibold text-white">
                                        {method.title}
                                    </h3>

                                    <p className="mt-1 font-medium text-blue-400">
                                        {method.value}
                                    </p>

                                    <p className="mt-2 text-sm text-slate-400">
                                        {method.description}
                                    </p>
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </Container>
        </Section>
    );
}
