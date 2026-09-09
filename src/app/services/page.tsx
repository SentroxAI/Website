import type { Metadata } from "next";

import { Navbar } from "@/components/navbar";
import Footer from "@/components/home/Footer";

import ServicesHero from "@/components/services/ServicesHero";
import ServicesList from "@/components/services/ServicesList";
import ServiceCTA from "@/components/services/ServiceCTA";

export const metadata: Metadata = {
    title: "Services",
    description:
        "AI-powered website development, automation, chatbots, SEO, and custom software solutions by Sentrox AI.",
    alternates: {
        canonical: "https://sentrox.ai/services",
    },
    openGraph: {
        title: "Services — Sentrox AI",
        description:
            "Explore our full range of AI-powered digital solutions.",
    },
};

export default function ServicesPage() {
    return (
        <>
            <Navbar />

            <main>
                <ServicesHero />
                <ServicesList />
                <ServiceCTA />
            </main>

            <Footer />
        </>
    );
}
