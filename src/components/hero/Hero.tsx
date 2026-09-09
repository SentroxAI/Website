"use client";

import Section from "@/components/ui/layout/Section";
import Container from "@/components/ui/layout/Container";

import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import HeroPreview from "./HeroPreview";

export default function Hero() {
    return (
        <Section
            id="hero"
            className="pt-28 pb-16 sm:pt-36 sm:pb-24"
        >
            <HeroBackground />

            <Container>
                <div className="relative grid items-center gap-16 lg:grid-cols-2">
                    <HeroContent />

                    <HeroPreview />
                </div>
            </Container>
        </Section>
    );
}