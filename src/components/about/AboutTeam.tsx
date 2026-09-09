"use client";

import { motion } from "framer-motion";
import {
    FaGithub,
    FaLinkedin,
    FaXTwitter,
} from "react-icons/fa6";

import Container from "@/components/ui/layout/Container";
import Section from "@/components/ui/layout/Section";
import SectionHeading from "@/components/ui/section/SectionHeading";
import GlassCard from "@/components/ui/cards/GlassCard";
import GradientCard from "@/components/ui/cards/GradientCard";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import { fadeUp, hoverCard, staggerContainer, viewport } from "@/lib/animations";

/* -------------------------------------------------------------------------- */
/*                                 TEAM DATA                                  */
/* -------------------------------------------------------------------------- */

const team = [
    {
        name: "Sarthak",
        role: "Founder & Lead Developer",
        bio: "Full-stack developer & AI specialist with a passion for creating premium digital experiences.",
        initials: "SA",
        gradient: "from-blue-600/30 to-cyan-500/20",
        socials: { github: "#", linkedin: "#", twitter: "#" },
    },
    {
        name: "AI Design Lead",
        role: "UI/UX & Brand Design",
        bio: "Crafting pixel-perfect interfaces that combine aesthetics with functionality.",
        initials: "DL",
        gradient: "from-violet-600/30 to-pink-500/20",
        socials: { github: "#", linkedin: "#" },
    },
    {
        name: "AI Engineer",
        role: "AI & Automation",
        bio: "Building intelligent systems and custom AI agents that solve real business problems.",
        initials: "AE",
        gradient: "from-emerald-600/30 to-teal-500/20",
        socials: { github: "#", linkedin: "#" },
    },
];

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

export default function AboutTeam() {
    return (
        <Section id="about-team" spacing="md">
            <Container>
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                >
                    <SectionHeading
                        title="Meet the Team"
                        description="A small but mighty team building world-class AI-powered experiences."
                    />
                </motion.div>

                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
                >
                    {team.map((member) => (
                        <motion.div
                            key={member.name}
                            variants={fadeUp}
                            whileHover={hoverCard.whileHover}
                            whileTap={hoverCard.whileTap}
                        >
                            <GlassCard className="h-full overflow-hidden p-0">
                                {/* Avatar */}

                                <div
                                    className={`flex h-48 items-center justify-center bg-gradient-to-br ${member.gradient}`}
                                >
                                    <span className="text-5xl font-bold text-white/60">
                                        {member.initials}
                                    </span>
                                </div>

                                {/* Info */}

                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-white">
                                        {member.name}
                                    </h3>

                                    <p className="mt-1 text-sm font-medium text-blue-400">
                                        {member.role}
                                    </p>

                                    <p className="mt-3 text-sm leading-6 text-slate-400">
                                        {member.bio}
                                    </p>

                                    {/* Socials */}

                                    <div className="mt-5 flex gap-3">
                                        {member.socials.github && (
                                            <a
                                                href={member.socials.github}
                                                className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                                                aria-label="GitHub"
                                            >
                                                <FaGithub className="h-4 w-4" />
                                            </a>
                                        )}

                                        {member.socials.linkedin && (
                                            <a
                                                href={member.socials.linkedin}
                                                className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                                                aria-label="LinkedIn"
                                            >
                                                <FaLinkedin className="h-4 w-4" />
                                            </a>
                                        )}

                                        {member.socials.twitter && (
                                            <a
                                                href={member.socials.twitter}
                                                className="rounded-lg border border-white/10 bg-white/5 p-2 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                                                aria-label="Twitter"
                                            >
                                                <FaXTwitter className="h-4 w-4" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Join CTA */}

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mt-16"
                >
                    <GradientCard
                        gradient="subtle"
                        hover={false}
                        className="p-10 text-center"
                    >
                        <h3 className="text-2xl font-bold text-white">
                            Want to Join Our Team?
                        </h3>

                        <p className="mx-auto mt-3 max-w-xl text-slate-400">
                            We're always looking for talented designers,
                            developers, and AI enthusiasts. Get in touch!
                        </p>

                        <PrimaryButton href="/contact" className="mt-8">
                            Get in Touch
                        </PrimaryButton>
                    </GradientCard>
                </motion.div>
            </Container>
        </Section>
    );
}
