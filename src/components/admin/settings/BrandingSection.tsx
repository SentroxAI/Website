"use client";

/* -------------------------------------------------------------------------- */
/*                 BRANDING SETTINGS SECTION                                  */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { Palette, Image, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BrandingSettings } from "@/lib/settings";

interface BrandingSectionProps {
    branding: BrandingSettings;
    onChange: (branding: BrandingSettings) => void;
}

const presetColors = [
    "#8b5cf6", "#6366f1", "#3b82f6", "#06b6d4",
    "#10b981", "#22c55e", "#f59e0b", "#ef4444",
    "#ec4899", "#f97316", "#14b8a6", "#64748b",
];

export default function BrandingSection({ branding, onChange }: BrandingSectionProps) {
    const handleChange = (key: keyof BrandingSettings, value: string) => {
        onChange({ ...branding, [key]: value });
    };

    return (
        <div className="space-y-6">
            {/* Colors */}
            <div className="grid gap-6 sm:grid-cols-2">
                <ColorPicker
                    label="Primary Color"
                    value={branding.primaryColor}
                    onChange={(v) => handleChange("primaryColor", v)}
                />
                <ColorPicker
                    label="Accent Color"
                    value={branding.accentColor}
                    onChange={(v) => handleChange("accentColor", v)}
                />
            </div>

            {/* Preview */}
            <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                    <Sparkles className="inline h-3 w-3 mr-1 -mt-0.5" />
                    Color Preview
                </p>
                <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                    <div
                        className="h-10 flex-1 rounded-lg flex items-center justify-center text-xs font-medium text-white"
                        style={{ backgroundColor: branding.primaryColor }}
                    >
                        Primary
                    </div>
                    <div
                        className="h-10 flex-1 rounded-lg flex items-center justify-center text-xs font-medium text-white"
                        style={{ backgroundColor: branding.accentColor }}
                    >
                        Accent
                    </div>
                    <div
                        className="h-10 flex-1 rounded-lg flex items-center justify-center text-xs font-medium text-white"
                        style={{
                            background: `linear-gradient(135deg, ${branding.primaryColor}, ${branding.accentColor})`,
                        }}
                    >
                        Gradient
                    </div>
                </div>
            </div>

            {/* URLs */}
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                        Logo URL
                    </label>
                    <div className="relative">
                        <Image className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sx-text-subtle" />
                        <input
                            type="url"
                            value={branding.logoUrl}
                            onChange={(e) => handleChange("logoUrl", e.target.value)}
                            placeholder="https://example.com/logo.png"
                            className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] pl-10 pr-3 text-sm text-white placeholder:text-sx-text-subtle outline-none transition-colors focus:border-white/[0.12] focus:bg-white/[0.04]"
                        />
                    </div>
                </div>
                <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                        Favicon URL
                    </label>
                    <div className="relative">
                        <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sx-text-subtle" />
                        <input
                            type="url"
                            value={branding.faviconUrl}
                            onChange={(e) => handleChange("faviconUrl", e.target.value)}
                            placeholder="https://example.com/favicon.ico"
                            className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] pl-10 pr-3 text-sm text-white placeholder:text-sx-text-subtle outline-none transition-colors focus:border-white/[0.12] focus:bg-white/[0.04]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ── Color Picker ────────────────────────────────────────────────────────────── */

function ColorPicker({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) {
    const [custom, setCustom] = useState(false);

    return (
        <div>
            <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                <Palette className="inline h-3 w-3 mr-1 -mt-0.5" />
                {label}
            </label>
            <div className="space-y-2.5">
                {/* Preset swatches */}
                <div className="flex flex-wrap gap-2">
                    {presetColors.map((color) => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => { onChange(color); setCustom(false); }}
                            className={cn(
                                "h-7 w-7 rounded-lg transition-all hover:scale-110",
                                value === color && "ring-2 ring-white ring-offset-1 ring-offset-[#080e1e]",
                            )}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                </div>
                {/* Custom hex input */}
                <div className="flex items-center gap-2">
                    <div
                        className="h-8 w-8 shrink-0 rounded-lg border border-white/[0.06]"
                        style={{ backgroundColor: value }}
                    />
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => { onChange(e.target.value); setCustom(true); }}
                        placeholder="#8b5cf6"
                        className="h-8 flex-1 rounded-lg border border-white/[0.06] bg-white/[0.02] px-2 text-xs text-white font-mono outline-none transition-colors focus:border-white/[0.12] focus:bg-white/[0.04]"
                    />
                </div>
            </div>
        </div>
    );
}
