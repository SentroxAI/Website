"use client";

import { Sparkles } from "lucide-react";

import PageHeader from "@/components/ui/section/PageHeader";

export default function PricingHero() {
    return (
        <PageHeader
            badge="Pricing"
            badgeIcon={<Sparkles className="h-4 w-4" />}
            title="Transparent Pricing, Real Value"
            description="Choose the plan that matches your goals. All plans include premium design, AI integrations, and dedicated support. No hidden fees."
            breadcrumbs={[{ label: "Pricing" }]}
        />
    );
}
