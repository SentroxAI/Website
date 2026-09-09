"use client";

import { Sparkles } from "lucide-react";

import PageHeader from "@/components/ui/section/PageHeader";

export default function ContactHero() {
    return (
        <PageHeader
            badge="Get In Touch"
            badgeIcon={<Sparkles className="h-4 w-4" />}
            title="Let's Build Something Extraordinary"
            description="Configure your project step by step, get a transparent real-time quote, and send us your details — all in under 60 seconds. Our team will follow up within 24 hours."
            breadcrumbs={[{ label: "Contact" }]}
        />
    );
}
