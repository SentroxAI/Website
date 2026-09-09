"use client";

import { Sparkles } from "lucide-react";

import PageHeader from "@/components/ui/section/PageHeader";

export default function BlogHero() {
    return (
        <PageHeader
            badge="Blog"
            badgeIcon={<Sparkles className="h-4 w-4" />}
            title="Insights & Resources"
            description="Expert insights on AI-powered web development, automation, and digital growth strategies for modern businesses."
            breadcrumbs={[{ label: "Blog" }]}
        />
    );
}
