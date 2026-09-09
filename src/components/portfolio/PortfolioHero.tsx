"use client";

import { Sparkles } from "lucide-react";

import PageHeader from "@/components/ui/section/PageHeader";

export default function PortfolioHero() {
    return (
        <PageHeader
            badge="Our Work"
            badgeIcon={<Sparkles className="h-4 w-4" />}
            title="Projects That Speak for Themselves"
            description="A showcase of AI-powered websites, automation systems, and digital experiences we've built for businesses worldwide."
            breadcrumbs={[{ label: "Portfolio" }]}
        />
    );
}
