"use client";

import { Sparkles } from "lucide-react";

import PageHeader from "@/components/ui/section/PageHeader";

export default function AboutHero() {
    return (
        <PageHeader
            badge="About Us"
            badgeIcon={<Sparkles className="h-4 w-4" />}
            title="Building the Future with AI"
            description="We're a team of designers, developers, and AI specialists passionate about creating digital experiences that transform businesses and delight users."
            breadcrumbs={[{ label: "About" }]}
        />
    );
}
