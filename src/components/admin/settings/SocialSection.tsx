"use client";

/* -------------------------------------------------------------------------- */
/*                  SOCIAL LINKS SECTION                                      */
/* -------------------------------------------------------------------------- */

import type { SocialLinks } from "@/lib/settings";

interface SocialSectionProps {
    social: SocialLinks;
    onChange: (social: SocialLinks) => void;
}

const socialFields: {
    key: keyof SocialLinks;
    label: string;
    placeholder: string;
    color: string;
    icon: string;
}[] = [
    { key: "twitter", label: "Twitter / X", placeholder: "https://x.com/agency", color: "text-sky-400", icon: "𝕏" },
    { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/company/agency", color: "text-blue-400", icon: "in" },
    { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/agency", color: "text-pink-400", icon: "IG" },
    { key: "github", label: "GitHub", placeholder: "https://github.com/agency", color: "text-white", icon: "GH" },
    { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@agency", color: "text-red-400", icon: "YT" },
    { key: "dribbble", label: "Dribbble", placeholder: "https://dribbble.com/agency", color: "text-pink-300", icon: "Dr" },
];

export default function SocialSection({ social, onChange }: SocialSectionProps) {
    const handleChange = (key: keyof SocialLinks, value: string) => {
        onChange({ ...social, [key]: value });
    };

    const filledCount = Object.values(social).filter((v) => v.trim()).length;

    return (
        <div className="space-y-4">
            <p className="text-xs text-sx-text-muted">
                {filledCount} of {socialFields.length} connected
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
                {socialFields.map((field) => {
                    const hasValue = social[field.key].trim().length > 0;
                    return (
                        <div
                            key={field.key}
                            className={`rounded-xl border p-3 transition-all ${
                                hasValue
                                    ? "border-white/[0.1] bg-white/[0.03]"
                                    : "border-white/[0.06] bg-white/[0.01]"
                            }`}
                        >
                            <div className="flex items-center gap-2.5 mb-2">
                                <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.06] text-xs font-bold ${field.color}`}>
                                    {field.icon}
                                </div>
                                <span className="text-sm font-medium text-white">{field.label}</span>
                                {hasValue && (
                                    <span className="ml-auto h-2 w-2 rounded-full bg-emerald-400" />
                                )}
                            </div>
                            <input
                                type="url"
                                value={social[field.key]}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                                placeholder={field.placeholder}
                                className="h-9 w-full rounded-lg border border-white/[0.04] bg-white/[0.02] px-3 text-xs text-white placeholder:text-sx-text-subtle outline-none transition-colors focus:border-white/[0.1] focus:bg-white/[0.04]"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
