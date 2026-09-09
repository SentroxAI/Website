import type { Metadata } from "next";

import { Navbar } from "@/components/navbar";
import Footer from "@/components/home/Footer";

import BlogHero from "@/components/blog/BlogHero";
import BlogGrid from "@/components/blog/BlogGrid";

/* -------------------------------------------------------------------------- */
/*                                 METADATA                                   */
/* -------------------------------------------------------------------------- */

export const metadata: Metadata = {
    title: "Blog",
    description:
        "Read insights on AI-powered web development, automation, SEO, and digital growth strategies from the Sentrox AI team.",
    alternates: {
        canonical: "https://sentrox.ai/blog",
    },
    openGraph: {
        title: "Blog — Sentrox AI",
        description:
            "Expert insights on AI, web development, and building digital products.",
    },
};

/* -------------------------------------------------------------------------- */
/*                                   PAGE                                     */
/* -------------------------------------------------------------------------- */

export default function BlogPage() {
    return (
        <>
            <Navbar />

            <main>
                <BlogHero />
                <BlogGrid />
            </main>

            <Footer />
        </>
    );
}
