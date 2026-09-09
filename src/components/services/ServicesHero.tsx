"use client";

import { Code2, Sparkles } from "lucide-react";

import PageHeader from "@/components/ui/section/PageHeader";

export default function ServicesHero() {
    return (
        <PageHeader
            badge="Our Services"
            badgeIcon={<Sparkles className="h-4 w-4" />}
            title="AI Solutions Built for Growth"
            description="From AI-powered websites to workflow automation, we build modern digital solutions that help businesses scale faster, convert better, and operate smarter."
            breadcrumbs={[{ label: "Services" }]}
        />
    );
}
