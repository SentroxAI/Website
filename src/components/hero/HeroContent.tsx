import HeroActions from "./HeroActions";
import HeroFeatures from "./HeroFeatures";

export default function HeroContent() {
    return (
        <div className="space-y-8">
            <span className="inline-flex rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400">
                AI Website Agency
            </span>

            <h1 className="max-w-2xl text-5xl font-bold leading-tight md:text-7xl">
                Build
                <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                    AI-Powered
                </span>
                Digital Experiences
            </h1>

            <p className="max-w-xl text-lg leading-8 text-slate-400">
                We design and develop premium AI-powered websites,
                automations, chatbots, and digital experiences that help
                businesses grow faster.
            </p>

            <HeroActions />

            <HeroFeatures />
        </div>
    );
}