"use client";

import { motion } from "framer-motion";
import { Users, Globe, Award, Rocket } from "lucide-react";

import Container from "@/components/ui/layout/Container";
import Section from "@/components/ui/layout/Section";
import MetricCard from "@/components/ui/cards/MetricCard";
import { fadeUp, staggerContainer, viewport } from "@/lib/animations";

const stats = [
    {
        label: "Projects Delivered",
        value: 150,
        suffix: "+",
        trend: { value: 35, label: "this year" },
        icon: <Rocket className="h-5 w-5" />,
    },
    {
        label: "Happy Clients",
        value: 80,
        suffix: "+",
        trend: { value: 28, label: "growth" },
        icon: <Users className="h-5 w-5" />,
    },
    {
        label: "Countries Served",
        value: 12,
        suffix: "+",
        icon: <Globe className="h-5 w-5" />,
    },
    {
        label: "Client Satisfaction",
        value: 98,
        suffix: "%",
        trend: { value: 2, label: "vs last year" },
        icon: <Award className="h-5 w-5" />,
    },
];

export default function AboutStats() {
    return (
        <Section id="about-stats" spacing="sm">
            <Container>
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
                >
                    {stats.map((stat) => (
                        <motion.div key={stat.label} variants={fadeUp}>
                            <MetricCard {...stat} />
                        </motion.div>
                    ))}
                </motion.div>
            </Container>
        </Section>
    );
}
