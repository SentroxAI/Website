"use client";

import { motion } from "framer-motion";
import {
    ArrowRight,
    Building2,
    Dumbbell,
    GraduationCap,
    Hotel,
    Scale,
    ShoppingBag,
    Stethoscope,
    UtensilsCrossed,
} from "lucide-react";

const industries = [
    {
        title: "Hotels",
        icon: Hotel,
        description:
            "Booking engines, AI concierge, room management, SEO.",
    },
    {
        title: "Restaurants",
        icon: UtensilsCrossed,
        description:
            "Online ordering, reservations, digital menus, reviews.",
    },
    {
        title: "Healthcare",
        icon: Stethoscope,
        description:
            "Appointment booking, patient portals, AI assistants.",
    },
    {
        title: "Gyms",
        icon: Dumbbell,
        description:
            "Membership systems, schedules, payments, automation.",
    },
    {
        title: "Real Estate",
        icon: Building2,
        description:
            "Property listings, CRM integration, lead capture.",
    },
    {
        title: "Education",
        icon: GraduationCap,
        description:
            "Admissions, LMS, student portals, automation.",
    },
    {
        title: "E-Commerce",
        icon: ShoppingBag,
        description:
            "Modern stores, payments, inventory, analytics.",
    },
    {
        title: "Law Firms",
        icon: Scale,
        description:
            "Client intake, consultation booking, document portals.",
    },
];

export default function Industries() {
    return (
        <section className="relative py-28">
            <div className="mx-auto max-w-7xl px-6">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mx-auto mb-16 max-w-3xl text-center"
                >
                    <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-5 py-2 text-sm text-cyan-400">
                        Industries We Serve
                    </span>

                    <h2 className="mt-6 text-4xl font-bold text-white md:text-5xl">
                        Tailored AI Solutions for Every Industry
                    </h2>

                    <p className="mt-6 text-lg text-slate-400">
                        Every business has unique challenges. We create AI-powered
                        websites and automation systems designed specifically for
                        your industry.
                    </p>
                </motion.div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                    {industries.map((industry, index) => {
                        const Icon = industry.icon;

                        return (
                            <motion.div
                                key={industry.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.08 }}
                                whileHover={{
                                    y: -8,
                                    scale: 1.02,
                                }}
                                className="group rounded-3xl border border-white/10 bg-white/5 p-7 backdrop-blur-xl"
                            >
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 transition group-hover:bg-blue-500/20">
                                    <Icon className="h-8 w-8 text-blue-400" />
                                </div>

                                <h3 className="mt-8 text-2xl font-semibold text-white">
                                    {industry.title}
                                </h3>

                                <p className="mt-4 text-sm leading-7 text-slate-400">
                                    {industry.description}
                                </p>

                                <button className="mt-8 flex items-center gap-2 text-blue-400 transition-all duration-300 group-hover:gap-3">
                                    Explore
                                    <ArrowRight size={18} />
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}