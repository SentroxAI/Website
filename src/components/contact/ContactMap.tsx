"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

import Container from "@/components/ui/layout/Container";
import Section from "@/components/ui/layout/Section";
import GlassCard from "@/components/ui/cards/GlassCard";
import { fadeUp, viewport } from "@/lib/animations";

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

export default function ContactMap() {
    return (
        <Section id="contact-map" spacing="md">
            <Container>
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                >
                    <GlassCard className="overflow-hidden p-0">
                        {/* Map Placeholder */}

                        <div className="relative flex h-[400px] items-center justify-center bg-gradient-to-br from-blue-600/5 to-cyan-500/5">
                            {/* Grid Pattern */}

                            <div
                                className="absolute inset-0 opacity-20"
                                style={{
                                    backgroundImage:
                                        "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                                    backgroundSize: "40px 40px",
                                }}
                            />

                            {/* Glow */}

                            <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/15 blur-[80px]" />

                            {/* Pin */}

                            <div className="relative text-center">
                                <motion.div
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 shadow-lg shadow-blue-500/25"
                                >
                                    <MapPin className="h-8 w-8 text-white" />
                                </motion.div>

                                <h3 className="mt-6 text-2xl font-bold text-white">
                                    Sentrox AI
                                </h3>

                                <p className="mt-2 text-slate-400">
                                    Serving clients worldwide from India
                                </p>
                            </div>
                        </div>
                    </GlassCard>
                </motion.div>
            </Container>
        </Section>
    );
}
