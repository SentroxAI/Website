"use client";

import { motion } from "framer-motion";
import { ArrowRight, Rocket } from "lucide-react";

import Container from "@/components/ui/layout/Container";
import Section from "@/components/ui/layout/Section";
import GradientCard from "@/components/ui/cards/GradientCard";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import SecondaryButton from "@/components/ui/buttons/SecondaryButton";
import { fadeUp, viewport } from "@/lib/animations";

export default function ServiceCTA() {
    return (
        <Section id="service-cta" spacing="lg">
            <Container>
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                >
                    <GradientCard
                        gradient="mixed"
                        radius="3xl"
                        hover={false}
                        className="relative overflow-hidden p-12 text-center lg:p-20"
                    >
                        {/* Background Glow */}

                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.20),transparent_70%)]" />

                        <div className="relative">
                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500">
                                <Rocket className="h-10 w-10 text-white" />
                            </div>

                            <h2 className="mx-auto mt-8 max-w-3xl text-4xl font-bold text-white md:text-5xl">
                                Ready to Transform
                                <br />
                                Your Business with AI?
                            </h2>

                            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                                Let's discuss your project and find the
                                perfect solution. Book a free consultation
                                with our team today.
                            </p>

                            <div className="mt-10 flex flex-col justify-center gap-5 sm:flex-row">
                                <PrimaryButton
                                    href="/contact"
                                    size="lg"
                                    rightIcon={<ArrowRight size={18} />}
                                >
                                    Start Your Project
                                </PrimaryButton>

                                <SecondaryButton
                                    href="/portfolio"
                                    size="lg"
                                >
                                    View Our Work
                                </SecondaryButton>
                            </div>
                        </div>
                    </GradientCard>
                </motion.div>
            </Container>
        </Section>
    );
}
