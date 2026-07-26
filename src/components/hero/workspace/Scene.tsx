"use client";

import AmbientGlow from "./AmbientGlow";
import BrowserFrame from "./BrowserFrame";
import MouseParallax from "./MouseParallax";

export default function Scene() {
    return (
        <div className="relative h-[760px] w-full">
            <AmbientGlow />

            <MouseParallax>
                <BrowserFrame />
            </MouseParallax>
        </div>
    );
}