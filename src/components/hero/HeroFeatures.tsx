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
                <span
                    key={feature}
                    className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 backdrop-blur-xl transition-all duration-300 hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-white"
                >
                    {feature}
                </span>
            ))}
        </div>
    );
}