import type { Metadata } from "next";

import { Navbar } from "@/components/navbar";
import Footer from "@/components/home/Footer";

import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
import AboutValues from "@/components/about/AboutValues";
import AboutTeam from "@/components/about/AboutTeam";
import AboutStats from "@/components/about/AboutStats";

export const metadata: Metadata = {
    title: "About",
    description:
        "Learn about Sentrox AI — our mission, values, team, and why we build AI-powered digital experiences.",
    alternates: {
        canonical: "https://sentrox.ai/about",
    },
    openGraph: {
        title: "About — Sentrox AI",
        description:
            "Meet the team behind Sentrox AI and learn about our mission.",
    },
};

export default function AboutPage() {
    return (
        <>
            <Navbar />

            <main>
                <AboutHero />
                <AboutStats />
                <AboutStory />
                <AboutValues />
                <AboutTeam />
            </main>

            <Footer />
        </>
    );
}
