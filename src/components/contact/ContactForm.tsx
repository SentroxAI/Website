"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import Container from "@/components/ui/layout/Container";
import Section from "@/components/ui/layout/Section";
import GlassCard from "@/components/ui/cards/GlassCard";
import Input from "@/components/ui/inputs/Input";
import Textarea from "@/components/ui/inputs/Textarea";
import Select from "@/components/ui/inputs/Select";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import { fadeUp, viewport } from "@/lib/animations";

import { contactFormSchema, type ContactFormData } from "@/lib/validations";

/* -------------------------------------------------------------------------- */
/*                                 OPTIONS                                    */
/* -------------------------------------------------------------------------- */

const serviceOptions = [
    { label: "AI Website Development", value: "ai-website" },
    { label: "AI Automation", value: "ai-automation" },
    { label: "AI Agents / Chatbots", value: "ai-agents" },
    { label: "Custom Software", value: "custom-software" },
    { label: "SEO & Growth", value: "seo" },
    { label: "Maintenance & Support", value: "maintenance" },
    { label: "Other", value: "other" },
];

const budgetOptions = [
    { label: "Under $2,000", value: "under-2k" },
    { label: "$2,000 – $5,000", value: "2k-5k" },
    { label: "$5,000 – $15,000", value: "5k-15k" },
    { label: "$15,000 – $50,000", value: "15k-50k" },
    { label: "$50,000+", value: "50k-plus" },
    { label: "Not Sure Yet", value: "not-sure" },
];

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

export default function ContactForm() {
    const [submitted, setSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactFormSchema),
    });

    const onSubmit = async (data: ContactFormData) => {
        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Something went wrong");
            }

            setSubmitted(true);
            toast.success("Message sent successfully!");
            reset();

            setTimeout(() => setSubmitted(false), 5000);
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again.";
            toast.error(message);
        }
    };

    return (
        <Section id="contact-form" spacing="md">
            <Container size="lg">
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                >
                    <GlassCard className="p-8 lg:p-12">
                        {submitted ? (
                            /* ── Success State ──────────────────────────── */

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center py-16 text-center"
                            >
                                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/15">
                                    <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                                </div>

                                <h3 className="mt-6 text-3xl font-bold text-white">
                                    Message Sent!
                                </h3>

                                <p className="mt-4 max-w-md text-slate-400">
                                    Thank you for reaching out. We'll get
                                    back to you within 24 hours.
                                </p>
                            </motion.div>
                        ) : (
                            /* ── Form ───────────────────────────────────── */

                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="space-y-8"
                            >
                                <div>
                                    <h2 className="text-3xl font-bold text-white">
                                        Send Us a Message
                                    </h2>

                                    <p className="mt-2 text-slate-400">
                                        Fill out the form and we'll get
                                        back to you within 24 hours.
                                    </p>
                                </div>

                                {/* Name + Email */}

                                <div className="grid gap-6 md:grid-cols-2">
                                    <Input
                                        label="Full Name"
                                        placeholder="John Doe"
                                        error={errors.name?.message}
                                        {...register("name")}
                                    />

                                    <Input
                                        label="Email Address"
                                        type="email"
                                        placeholder="john@example.com"
                                        error={errors.email?.message}
                                        {...register("email")}
                                    />
                                </div>

                                {/* Phone + Company */}

                                <div className="grid gap-6 md:grid-cols-2">
                                    <Input
                                        label="Phone Number"
                                        type="tel"
                                        placeholder="+91 XXXXX XXXXX"
                                        {...register("phone")}
                                    />

                                    <Input
                                        label="Company"
                                        placeholder="Your Company"
                                        {...register("company")}
                                    />
                                </div>

                                {/* Service + Budget */}

                                <div className="grid gap-6 md:grid-cols-2">
                                    <Select
                                        label="Service Needed"
                                        placeholder="Select a service"
                                        options={serviceOptions}
                                        error={errors.service?.message}
                                        {...register("service")}
                                    />

                                    <Select
                                        label="Budget Range"
                                        placeholder="Select budget"
                                        options={budgetOptions}
                                        {...register("budget")}
                                    />
                                </div>

                                {/* Message */}

                                <Textarea
                                    label="Your Message"
                                    placeholder="Tell us about your project, goals, and timeline..."
                                    showCount
                                    maxLength={5000}
                                    error={errors.message?.message}
                                    {...register("message")}
                                />

                                {/* Submit */}

                                <PrimaryButton
                                    type="submit"
                                    size="lg"
                                    loading={isSubmitting}
                                    rightIcon={<Send className="h-5 w-5" />}
                                    className="w-full sm:w-auto"
                                >
                                    Send Message
                                </PrimaryButton>
                            </form>
                        )}
                    </GlassCard>
                </motion.div>
            </Container>
        </Section>
    );
}
