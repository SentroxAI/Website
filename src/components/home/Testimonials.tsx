"use client";

import { motion } from "framer-motion";
import {
    Star,
    Users,
    BadgeCheck,
    Headphones,
} from "lucide-react";

import FloatingReview from "./testimonials/FloatingReview";
import TestimonialCard from "./testimonials/TestimonialCard";
import { testimonials } from "./testimonials/testimonialData";

const stats = [
    {
        icon: Users,
        value: "250+",
        label: "Projects Delivered",
    },
    {
        icon: Star,
        value: "4.9/5",
        label: "Average Rating",
    },
    {
        icon: BadgeCheck,
        value: "98%",
        label: "Client Satisfaction",
    },
    {
        icon: Headphones,
        value: "24/7",
        label: "Support",
    },
];

export default function Testimonials() {
    return (
        <section
            id="testimonials"
            className="relative overflow-hidden py-28"
        >
            {/* Background */}

            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(37,99,235,.08),transparent_65%)]" />

            <div className="absolute left-1/2 top-20 -z-10 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[120px]" />

            <div className="mx-auto max-w-7xl px-6">
                {/* Heading */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 40,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
                    className="relative mx-auto max-w-3xl text-center"
                >
                    <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-5 py-2 text-sm font-medium text-blue-400">
                        Client Success Stories
                    </span>

                    <h2 className="mt-6 text-4xl font-bold text-white md:text-5xl">
                        Trusted By Businesses
                        <br />
                        Around The World
                    </h2>

                    <p className="mt-6 text-lg leading-8 text-slate-400">
                        From startups to growing enterprises,
                        we help businesses build premium digital
                        experiences that deliver measurable results.
                    </p>

                    {/* Rating */}

                    <div className="mt-8 flex items-center justify-center gap-3">
                        <div className="flex text-yellow-400">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className="h-5 w-5 fill-yellow-400"
                                />
                            ))}
                        </div>

                        <span className="font-medium text-white">
                            4.9 / 5 Rating
                        </span>

                        <span className="text-slate-400">
                            • 250+ Happy Clients
                        </span>
                    </div>
                </motion.div>

                {/* Floating Reviews */}

                <div className="relative mt-16 hidden h-40 lg:block">
                    <div className="absolute left-0 top-8">
                        <FloatingReview
                            title="+42% Bookings"
                            subtitle="Luxury Hotel"
                            delay={0}
                        />
                    </div>

                    <div className="absolute left-1/2 -translate-x-1/2">
                        <FloatingReview
                            title="SEO Score 100"
                            subtitle="Google Optimized"
                            delay={0.4}
                        />
                    </div>

                    <div className="absolute right-0 top-8">
                        <FloatingReview
                            title="AI Chatbot"
                            subtitle="24/7 Customer Support"
                            delay={0.8}
                        />
                    </div>
                </div>

                {/* Testimonials */}

                <div className="mt-24 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <TestimonialCard
                            key={testimonial.id}
                            testimonial={testimonial}
                            index={index}
                        />
                    ))}
                </div>

                {/* Statistics */}

                <div className="mt-24 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((item, index) => {
                        const Icon = item.icon;

                        return (
                            <motion.div
                                key={item.label}
                                initial={{
                                    opacity: 0,
                                    y: 30,
                                }}
                                whileInView={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                viewport={{
                                    once: true,
                                }}
                                transition={{
                                    delay: index * 0.1,
                                }}
                                whileHover={{
                                    y: -8,
                                }}
                                className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl"
                            >
                                <Icon className="mx-auto h-10 w-10 text-blue-400" />

                                <h3 className="mt-6 text-4xl font-bold text-white">
                                    {item.value}
                                </h3>

                                <p className="mt-3 text-slate-400">
                                    {item.label}
                                </p>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 30,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
                    className="mt-24 rounded-[36px] border border-white/10 bg-gradient-to-br from-blue-600/10 via-white/5 to-cyan-500/10 p-12 text-center backdrop-blur-2xl"
                >
                    <h2 className="text-4xl font-bold text-white">
                        Ready To Become Our Next Success Story?
                    </h2>

                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                        Let's build an AI-powered website that helps
                        your business attract more customers, automate
                        operations, and grow faster.
                    </p>

                    <motion.button
                        whileHover={{
                            scale: 1.05,
                        }}
                        whileTap={{
                            scale: 0.98,
                        }}
                        className="mt-10 rounded-2xl bg-blue-600 px-8 py-4 font-semibold text-white transition-colors hover:bg-blue-500"
                    >
                        Start Your Project
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}