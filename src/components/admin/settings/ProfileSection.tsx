"use client";

/* -------------------------------------------------------------------------- */
/*                  PROFILE SETTINGS SECTION                                  */
/* -------------------------------------------------------------------------- */

import { Building2, Mail, Phone, Globe, MapPin, Type } from "lucide-react";
import type { AgencyProfile } from "@/lib/settings";

interface ProfileSectionProps {
    profile: AgencyProfile;
    onChange: (profile: AgencyProfile) => void;
}

const fields: {
    key: keyof AgencyProfile;
    label: string;
    placeholder: string;
    icon: React.ReactNode;
    type?: string;
}[] = [
    { key: "agencyName", label: "Agency Name", placeholder: "Your Agency", icon: <Building2 className="h-4 w-4" /> },
    { key: "tagline", label: "Tagline", placeholder: "What you do in one line...", icon: <Type className="h-4 w-4" /> },
    { key: "email", label: "Contact Email", placeholder: "hello@agency.com", icon: <Mail className="h-4 w-4" />, type: "email" },
    { key: "phone", label: "Phone", placeholder: "+91 98765 43210", icon: <Phone className="h-4 w-4" /> },
    { key: "website", label: "Website URL", placeholder: "https://agency.com", icon: <Globe className="h-4 w-4" />, type: "url" },
    { key: "address", label: "Address", placeholder: "City, Country", icon: <MapPin className="h-4 w-4" /> },
];

export default function ProfileSection({ profile, onChange }: ProfileSectionProps) {
    const handleChange = (key: keyof AgencyProfile, value: string) => {
        onChange({ ...profile, [key]: value });
    };

    return (
        <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
                {fields.map((field) => (
                    <div key={field.key} className={field.key === "tagline" ? "sm:col-span-2" : ""}>
                        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                            {field.label}
                        </label>
                        <div className="relative">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sx-text-subtle">
                                {field.icon}
                            </div>
                            <input
                                type={field.type || "text"}
                                value={profile[field.key]}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                                placeholder={field.placeholder}
                                className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] pl-10 pr-3 text-sm text-white placeholder:text-sx-text-subtle outline-none transition-colors focus:border-white/[0.12] focus:bg-white/[0.04]"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
