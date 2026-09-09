"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import Container from "@/components/ui/layout/Container";
import Section from "@/components/ui/layout/Section";
import SectionHeading from "@/components/ui/section/SectionHeading";
import Accordion from "@/components/ui/navigation/Accordion";
import { fadeUp, viewport } from "@/lib/animations";

/* -------------------------------------------------------------------------- */
/*                                  DATA                                      */
/* -------------------------------------------------------------------------- */

const contactFAQs = [
    {
        id: "response-time",
        title: "How quickly will you respond to my inquiry?",
        content:
            "We typically respond within 24 hours on business days. For urgent matters, feel free to call us directly during business hours.",
    },
    {
        id: "consultation",
        title: "What happens during a free consultation?",
        content:
            "During the 30-minute session, we'll discuss your business goals, current challenges, and how AI-powered solutions can help. We'll provide tailored recommendations and an estimated timeline and budget.",
    },
    {
        id: "remote",
        title: "Do you work with clients remotely?",
        content:
            "Absolutely! We serve clients worldwide. Our team uses video calls, Slack, and project management tools to maintain clear communication regardless of location or timezone.",
    },
    {
        id: "nda",
        title: "Can you sign an NDA before we discuss our project?",
        content:
            "Yes, we're happy to sign a Non-Disclosure Agreement before any discussion. Protecting your intellectual property is important to us.",
    },
    {
        id: "timeline",
        title: "How long does a typical project take?",
        content:
            "Timelines vary by project scope. A landing page can be delivered in 1–2 weeks, while a full AI-powered platform might take 4–12 weeks. We'll provide a detailed timeline during the consultation.",
    },
    {
        id: "payment",
        title: "What payment methods do you accept?",
        content:
            "We accept bank transfers, PayPal, and major credit cards. For larger projects, we offer milestone-based payment plans.",
    },
];

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

export default function ContactFAQ() {
    return (
        <Section id="contact-faq" spacing="md">
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
                        title="Common Questions"
                        description="Quick answers about working with us."
                    />
                </motion.div>

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mt-12"
                >
                    <Accordion
                        items={contactFAQs}
                        variant="glass"
                    />
                </motion.div>
            </Container>
        </Section>
    );
}
