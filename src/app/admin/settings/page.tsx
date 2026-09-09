"use client";

/* -------------------------------------------------------------------------- */
/*                    ADMIN SETTINGS PAGE                                     */
/*                                                                            */
/*  Sprint 3 — Module 10: Agency configuration dashboard.                   */
/*  5 collapsible sections with localStorage persistence.                    */
/* -------------------------------------------------------------------------- */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Settings,
    Save,
    RotateCcw,
    Check,
    Building2,
    Palette,
    Share2,
    Bell,
    Search,
    ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import AdminContainer from "@/components/admin/AdminContainer";
import ProfileSection from "@/components/admin/settings/ProfileSection";
import BrandingSection from "@/components/admin/settings/BrandingSection";
import SocialSection from "@/components/admin/settings/SocialSection";
import NotificationSection from "@/components/admin/settings/NotificationSection";
import SEOSection from "@/components/admin/settings/SEOSection";
import {
    loadSettings,
    saveSettings,
    resetSettings,
    defaultSettings,
    type AgencySettings,
} from "@/lib/settings";

/* ── Section config ────────────────────────────────────────────────────────── */

const sections = [
    {
        id: "profile",
        label: "Agency Profile",
        description: "Business name, contact details, and address",
        icon: <Building2 className="h-4 w-4" />,
        color: "text-blue-400 bg-blue-500/10",
    },
    {
        id: "branding",
        label: "Branding & Colors",
        description: "Visual identity, colors, and logo",
        icon: <Palette className="h-4 w-4" />,
        color: "text-violet-400 bg-violet-500/10",
    },
    {
        id: "social",
        label: "Social Links",
        description: "Connect your social media profiles",
        icon: <Share2 className="h-4 w-4" />,
        color: "text-pink-400 bg-pink-500/10",
    },
    {
        id: "notifications",
        label: "Notifications",
        description: "Email and browser notification preferences",
        icon: <Bell className="h-4 w-4" />,
        color: "text-amber-400 bg-amber-500/10",
    },
    {
        id: "seo",
        label: "SEO & Meta",
        description: "Search engine optimization and analytics",
        icon: <Search className="h-4 w-4" />,
        color: "text-emerald-400 bg-emerald-500/10",
    },
];

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<AgencySettings>(defaultSettings);
    const [openSections, setOpenSections] = useState<Set<string>>(new Set(["profile"]));
    const [saved, setSaved] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        setSettings(loadSettings());
        setMounted(true);
    }, []);

    const toggleSection = (id: string) => {
        setOpenSections((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const handleSave = () => {
        const success = saveSettings(settings);
        if (success) {
            setSaved(true);
            setHasChanges(false);
            setTimeout(() => setSaved(false), 2000);
        }
    };

    const handleReset = () => {
        const defaults = resetSettings();
        setSettings(defaults);
        setHasChanges(false);
    };

    const updateSettings = (partial: Partial<AgencySettings>) => {
        setSettings((prev) => ({ ...prev, ...partial }));
        setHasChanges(true);
    };

    if (!mounted) {
        return (
            <AdminContainer>
                <LoadingSkeleton />
            </AdminContainer>
        );
    }

    return (
        <AdminContainer>
            {/* Page header */}
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-500/20 to-gray-500/20">
                        <Settings className="h-5 w-5 text-slate-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Agency Settings</h1>
                        <p className="text-sm text-sx-text-muted">Configure your agency preferences</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleReset}
                        className="flex h-9 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 text-xs font-medium text-sx-text-muted transition-all hover:border-white/[0.12] hover:text-white"
                    >
                        <RotateCcw className="h-3.5 w-3.5" />
                        Reset
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!hasChanges && !saved}
                        className={cn(
                            "flex h-9 items-center gap-2 rounded-xl px-4 text-xs font-medium transition-all shadow-lg",
                            saved
                                ? "bg-emerald-600 text-white shadow-emerald-500/20"
                                : hasChanges
                                ? "bg-gradient-to-r from-slate-600 to-slate-500 text-white shadow-slate-500/20 hover:from-slate-500 hover:to-slate-400"
                                : "bg-white/[0.06] text-sx-text-subtle cursor-not-allowed shadow-none",
                        )}
                    >
                        {saved ? (
                            <>
                                <Check className="h-3.5 w-3.5" />
                                Saved!
                            </>
                        ) : (
                            <>
                                <Save className="h-3.5 w-3.5" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </motion.div>

            {/* Unsaved changes indicator */}
            <AnimatePresence>
                {hasChanges && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 overflow-hidden"
                    >
                        <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-2.5">
                            <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                            <p className="text-xs text-amber-400">
                                You have unsaved changes. Click <strong>Save Changes</strong> to persist.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Settings sections */}
            <div className="space-y-3">
                {sections.map((section, index) => (
                    <motion.div
                        key={section.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-colors hover:border-white/[0.08]"
                    >
                        {/* Section header (toggle) */}
                        <button
                            onClick={() => toggleSection(section.id)}
                            className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-white/[0.02]"
                        >
                            <div className="flex items-center gap-3">
                                <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl", section.color)}>
                                    {section.icon}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-white">{section.label}</p>
                                    <p className="text-[10px] text-sx-text-subtle">{section.description}</p>
                                </div>
                            </div>
                            <ChevronDown
                                className={cn(
                                    "h-4 w-4 text-sx-text-subtle transition-transform",
                                    openSections.has(section.id) && "rotate-180",
                                )}
                            />
                        </button>

                        {/* Section content */}
                        <AnimatePresence>
                            {openSections.has(section.id) && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="overflow-hidden"
                                >
                                    <div className="border-t border-white/[0.06] px-5 py-5">
                                        {section.id === "profile" && (
                                            <ProfileSection
                                                profile={settings.profile}
                                                onChange={(profile) => updateSettings({ profile })}
                                            />
                                        )}
                                        {section.id === "branding" && (
                                            <BrandingSection
                                                branding={settings.branding}
                                                onChange={(branding) => updateSettings({ branding })}
                                            />
                                        )}
                                        {section.id === "social" && (
                                            <SocialSection
                                                social={settings.social}
                                                onChange={(social) => updateSettings({ social })}
                                            />
                                        )}
                                        {section.id === "notifications" && (
                                            <NotificationSection
                                                notifications={settings.notifications}
                                                onChange={(notifications) => updateSettings({ notifications })}
                                            />
                                        )}
                                        {section.id === "seo" && (
                                            <SEOSection
                                                seo={settings.seo}
                                                onChange={(seo) => updateSettings({ seo })}
                                            />
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            {/* Footer note */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-center text-[11px] text-sx-text-subtle"
            >
                Settings are stored locally in your browser. To sync across devices, connect a database.
            </motion.p>
        </AdminContainer>
    );
}

/* ── Loading Skeleton ────────────────────────────────────────────────────────── */

function LoadingSkeleton() {
    return (
        <div className="space-y-3 animate-pulse">
            <div className="h-16 rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
            {[...Array(5)].map((_, i) => (
                <div key={i} className="h-[72px] rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
            ))}
        </div>
    );
}
