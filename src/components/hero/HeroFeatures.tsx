const features = [
    "AI Powered",
    "SEO Optimized",
    "Lightning Fast",
    "Mobile First",
];

export default function HeroFeatures() {
    return (
        <div className="flex flex-wrap gap-3">
            {features.map((feature) => (
                <div
                    key={feature}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 backdrop-blur-xl"
                >
                    {feature}
                </div>
            ))}
        </div>
    );
}