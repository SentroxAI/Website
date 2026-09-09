import type { Metadata } from "next";

import { Navbar } from "@/components/navbar";
import Footer from "@/components/home/Footer";

import PricingHero from "@/components/pricing/PricingHero";
import PricingSection from "@/components/home/Pricing";
import PricingComparison from "@/components/pricing/PricingComparison";
import PricingFAQ from "@/components/pricing/PricingFAQ";

export const metadata: Metadata = {
    title: "Pricing",
    description:
        "Transparent pricing for AI website development, automation, and custom software. Choose the plan that fits your business.",
    alternates: {
        canonical: "https://sentrox.ai/pricing",
    },
    openGraph: {
        title: "Pricing — Sentrox AI",
        description:
            "Transparent, flexible pricing for AI-powered digital solutions.",
    },
};

export default function PricingPage() {
    return (
        <>
            <Navbar />

            <main>
                <PricingHero />
                <PricingSection />
                <PricingComparison />
                <PricingFAQ />
            </main>

            <Footer />
        </>
    );
}
