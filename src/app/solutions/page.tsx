import type { Metadata } from "next";

import { Navbar } from "@/components/navbar";
import Footer from "@/components/home/Footer";

import {
    SolutionsHero,
    PortalFeatures,
    Benefits,
    SolutionsCTA,
} from "@/components/solutions/SolutionsContent";

export const metadata: Metadata = {
    title: "Solutions",
    description:
        "Access your Sentrox AI client portal — manage projects, communicate with your team, share files, and handle billing in one dashboard.",
    alternates: {
        canonical: "https://sentrox.ai/solutions",
    },
    openGraph: {
        title: "Solutions — Sentrox AI",
        description:
            "Your dedicated client portal for project management, team collaboration, and billing.",
    },
};

export default function SolutionsPage() {
    return (
        <>
            <Navbar />

            <main>
                <SolutionsHero />
                <PortalFeatures />
                <Benefits />
                <SolutionsCTA />
            </main>

            <Footer />
        </>
    );
}
