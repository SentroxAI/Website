import type { Metadata } from "next";

import { Navbar } from "@/components/navbar";
import Footer from "@/components/home/Footer";

import ContactHero from "@/components/contact/ContactHero";
import QuoteCalculator from "@/components/contact/QuoteCalculator";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactMap from "@/components/contact/ContactMap";
import BookingSection from "@/components/contact/BookingSection";
import ContactFAQ from "@/components/contact/ContactFAQ";

/* -------------------------------------------------------------------------- */
/*                                 METADATA                                   */
/* -------------------------------------------------------------------------- */

export const metadata: Metadata = {
    title: "Contact Us & Get a Quote",
    description:
        "Get a transparent, real-time project quote in under 60 seconds. Configure your build, see pricing update live, and send us your details — all in one place.",
    alternates: {
        canonical: "https://sentrox.ai/contact",
    },
    openGraph: {
        title: "Contact Sentrox AI — Instant Quote Calculator",
        description:
            "Build your project quote step by step with transparent pricing. Free consultations available.",
    },
};

/* -------------------------------------------------------------------------- */
/*                                   PAGE                                     */
/* -------------------------------------------------------------------------- */

export default function ContactPage() {
    return (
        <>
            <Navbar />

            <main>
                <ContactHero />
                <QuoteCalculator />
                <ContactInfo />
                <ContactMap />
                <BookingSection />
                <ContactFAQ />
            </main>

            <Footer />
        </>
    );
}
