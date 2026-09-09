"use client";

import { motion } from "framer-motion";
import { CalendarDays, ArrowRight, Clock, Video, Sparkles } from "lucide-react";

import Container from "@/components/ui/layout/Container";
import Section from "@/components/ui/layout/Section";
import GradientCard from "@/components/ui/cards/GradientCard";
import GlassCard from "@/components/ui/cards/GlassCard";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import { fadeUp, hoverCard, viewport } from "@/lib/animations";

/* -------------------------------------------------------------------------- */
/*                                  DATA                                      */
/* -------------------------------------------------------------------------- */

const benefits = [
    {
        icon: Clock,
        title: "30-Minute Session",
        description: "Quick, focused discussion about your project goals.",
    },
    {
        icon: Sparkles,
        title: "Custom Recommendations",
        description: "Tailored advice on AI solutions for your business.",
    },
    {
        icon: Video,
        title: "Video or Phone",
        description: "Choose your preferred meeting format.",
    },
];

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

export default function BookingSection() {
    return (
        <Section id="booking" spacing="md">
            <Container>
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                >
                    <GradientCard
                        gradient="mixed"
                        padding="lg"
                        radius="3xl"
                        hover={false}
                        className="p-10 lg:p-14"
                    >
                        <div className="grid items-center gap-12 lg:grid-cols-2">
                            {/* Left */}

                            <div>
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500">
                                    <CalendarDays className="h-8 w-8 text-white" />
                                </div>

                                <h2 className="mt-8 text-4xl font-bold text-white">
                                    Book a Free
                                    <br />
                                    Consultation
                                </h2>

                                <p className="mt-6 max-w-lg leading-8 text-slate-400">
                                    Not sure where to start? Schedule a
                                    free 30-minute consultation with our
                                    team. We'll discuss your goals and
                                    recommend the best approach.
                                </p>

                                <PrimaryButton
                                    href="/contact"
                                    size="lg"
                                    className="mt-10"
                                    rightIcon={<ArrowRight size={20} />}
                                >
                                    Schedule a Call
                                </PrimaryButton>
                            </div>

                            {/* Right — Benefits */}

                            <div className="space-y-5">
                                {benefits.map((benefit) => {
                                    const Icon = benefit.icon;

                                    return (
                                        <motion.div
                                            key={benefit.title}
                                            whileHover={hoverCard.whileHover}
                                            whileTap={hoverCard.whileTap}
                                        >
                                            <GlassCard className="flex items-start gap-5 p-6">
                                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-blue-500/15">
                                                    <Icon className="h-6 w-6 text-blue-400" />
                                                </div>

                                                <div>
                                                    <h3 className="text-lg font-semibold text-white">
                                                        {benefit.title}
                                                    </h3>

                                                    <p className="mt-1 text-sm text-slate-400">
                                                        {benefit.description}
                                                    </p>
                                                </div>
                                            </GlassCard>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>
                    </GradientCard>
                </motion.div>
            </Container>
        </Section>
    );
}
