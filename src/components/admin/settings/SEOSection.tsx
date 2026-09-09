"use client";

/* -------------------------------------------------------------------------- */
/*                     SEO SETTINGS SECTION                                   */
/* -------------------------------------------------------------------------- */

import { Search, FileText, Image, BarChart3 } from "lucide-react";
import type { SEOSettings } from "@/lib/settings";

interface SEOSectionProps {
    seo: SEOSettings;
    onChange: (seo: SEOSettings) => void;
}

export default function SEOSection({ seo, onChange }: SEOSectionProps) {
    const handleChange = (key: keyof SEOSettings, value: string) => {
        onChange({ ...seo, [key]: value });
    };

    return (
        <div className="space-y-4">
            {/* Meta title */}
            <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                    Meta Title
                </label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sx-text-subtle" />
                    <input
                        type="text"
                        value={seo.metaTitle}
                        onChange={(e) => handleChange("metaTitle", e.target.value)}
                        placeholder="Your Agency — Tagline"
                        className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] pl-10 pr-3 text-sm text-white placeholder:text-sx-text-subtle outline-none transition-colors focus:border-white/[0.12] focus:bg-white/[0.04]"
                    />
                </div>
                <p className="mt-1 text-[10px] text-sx-text-subtle tabular-nums">
                    {seo.metaTitle.length}/60 characters
                </p>
            </div>

            {/* Meta description */}
            <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                    Meta Description
                </label>
                <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-sx-text-subtle" />
                    <textarea
                        value={seo.metaDescription}
                        onChange={(e) => handleChange("metaDescription", e.target.value)}
                        placeholder="A concise description of your agency..."
                        rows={3}
                        className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] pl-10 pr-3 py-2.5 text-sm text-white placeholder:text-sx-text-subtle outline-none transition-colors focus:border-white/[0.12] focus:bg-white/[0.04] resize-none"
                    />
                </div>
                <p className="mt-1 text-[10px] text-sx-text-subtle tabular-nums">
                    {seo.metaDescription.length}/160 characters
                </p>
            </div>

            {/* Search preview */}
            <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                    Google Preview
                </p>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 space-y-1">
                    <p className="text-sm font-medium text-blue-400 truncate">
                        {seo.metaTitle || "Your Page Title"}
                    </p>
                    <p className="text-xs text-emerald-400 truncate">
                        https://sentroxai.com
                    </p>
                    <p className="text-xs text-sx-text-muted line-clamp-2">
                        {seo.metaDescription || "Your page description will appear here..."}
                    </p>
                </div>
            </div>

            {/* OG Image & GA */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                        OG Image URL
                    </label>
                    <div className="relative">
                        <Image className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sx-text-subtle" />
                        <input
                            type="url"
                            value={seo.ogImage}
                            onChange={(e) => handleChange("ogImage", e.target.value)}
                            placeholder="https://example.com/og.png"
                            className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] pl-10 pr-3 text-sm text-white placeholder:text-sx-text-subtle outline-none transition-colors focus:border-white/[0.12] focus:bg-white/[0.04]"
                        />
                    </div>
                </div>
                <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                        Google Analytics ID
                    </label>
                    <div className="relative">
                        <BarChart3 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sx-text-subtle" />
                        <input
                            type="text"
                            value={seo.googleAnalyticsId}
                            onChange={(e) => handleChange("googleAnalyticsId", e.target.value)}
                            placeholder="G-XXXXXXXXXX"
                            className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] pl-10 pr-3 text-sm text-white font-mono placeholder:text-sx-text-subtle outline-none transition-colors focus:border-white/[0.12] focus:bg-white/[0.04]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
