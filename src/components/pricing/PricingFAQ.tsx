"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import Container from "@/components/ui/layout/Container";
import Section from "@/components/ui/layout/Section";
import SectionHeading from "@/components/ui/section/SectionHeading";
import Accordion from "@/components/ui/navigation/Accordion";
import { fadeUp, viewport } from "@/lib/animations";

const pricingFAQs = [
    {
        id: "custom-quote",
        title: "Can I get a custom quote?",
        content:
            "Absolutely! Every business is unique. Contact us for a tailored quote based on your specific requirements, timeline, and budget.",
    },
    {
        id: "payment-plans",
        title: "Do you offer payment plans?",
        content:
            "Yes. For projects over $5,000, we offer milestone-based payment plans — typically 50% upfront, 25% at midpoint, and 25% on delivery.",
    },
    {
        id: "whats-included",
        title: "What's included in post-launch support?",
        content:
            "Post-launch support covers bug fixes, minor content updates, security patches, and performance monitoring for the specified period in your plan.",
    },
    {
        id: "upgrade",
        title: "Can I upgrade my plan later?",
        content:
            "Yes! You can upgrade at any time. We'll credit your existing investment toward the higher plan and scope the remaining work.",
    },
    {
        id: "refund",
        title: "What's your refund policy?",
        content:
            "We offer a full refund if you cancel before the design phase begins. After design approval, refunds are prorated based on work completed.",
    },
    {
        id: "hosting",
        title: "Is hosting included?",
        content:
            "We deploy on Vercel by default (free tier is included). For custom hosting, CDN, or enterprise infrastructure, we'll discuss options during the consultation.",
    },
];

export default function PricingFAQ() {
    return (
        <Section id="pricing-faq" spacing="md">
            <Container size="lg">
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                >
                    <SectionHeading
                        badge="FAQ"
                        badgeIcon={<Sparkles className="h-4 w-4" />}
                        title="Pricing Questions"
                        description="Everything you need to know about our pricing."
                    />
                </motion.div>

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mt-12"
                >
                    <Accordion items={pricingFAQs} variant="glass" />
                </motion.div>
            </Container>
        </Section>
    );
}
