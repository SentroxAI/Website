"use client";

import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import HeroPreview from "./HeroPreview";

export default function Hero() {
    return (
        <section className="relative overflow-hidden pt-36 pb-24">
            <HeroBackground />

            <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
                <HeroContent />

                <HeroPreview />
            </div>
        </section>
    );
}