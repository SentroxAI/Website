import type { Metadata } from "next";

import { Navbar } from "@/components/navbar";
import Footer from "@/components/home/Footer";

import PortfolioHero from "@/components/portfolio/PortfolioHero";
import PortfolioGrid from "@/components/portfolio/PortfolioGrid";

export const metadata: Metadata = {
    title: "Portfolio",
    description:
        "Explore our portfolio of AI-powered websites, automation systems, and custom software built by Sentrox AI.",
    alternates: {
        canonical: "https://sentrox.ai/portfolio",
    },
    openGraph: {
        title: "Portfolio — Sentrox AI",
        description: "See our latest AI-powered projects and case studies.",
    },
};

export default function PortfolioPage() {
    return (
        <>
            <Navbar />

            <main>
                <PortfolioHero />
                <PortfolioGrid />
            </main>

            <Footer />
        </>
    );
}
