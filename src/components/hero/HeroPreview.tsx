"use client";

import Scene from "./workspace/Scene";

export default function HeroPreview() {
    return (
        <div className="relative hidden lg:flex h-[760px] w-full items-center justify-center">
            <Scene />
        </div>
    );
}