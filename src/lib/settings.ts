"use client";

/* -------------------------------------------------------------------------- */
/*                  SETTINGS TYPES & STORAGE                                  */
/*                                                                            */
/*  Sprint 3 — Module 10: Agency settings stored in localStorage.            */
/*  No DB table exists, so we persist client-side with a typed interface.    */
/* -------------------------------------------------------------------------- */

/* ── Types ─────────────────────────────────────────────────────────────────── */

export interface AgencyProfile {
    agencyName: string;
    tagline: string;
    email: string;
    phone: string;
    website: string;
    address: string;
}

export interface BrandingSettings {
    primaryColor: string;
    accentColor: string;
    logoUrl: string;
    faviconUrl: string;
}

export interface SocialLinks {
    twitter: string;
    linkedin: string;
    instagram: string;
    github: string;
    youtube: string;
    dribbble: string;
}

export interface NotificationSettings {
    emailNewLead: boolean;
    emailNewClient: boolean;
    emailProjectUpdate: boolean;
    emailWeeklyDigest: boolean;
    browserNotifications: boolean;
}

export interface SEOSettings {
    metaTitle: string;
    metaDescription: string;
    ogImage: string;
    googleAnalyticsId: string;
}

export interface AgencySettings {
    profile: AgencyProfile;
    branding: BrandingSettings;
    social: SocialLinks;
    notifications: NotificationSettings;
    seo: SEOSettings;
}

/* ── Defaults ──────────────────────────────────────────────────────────────── */

export const defaultSettings: AgencySettings = {
    profile: {
        agencyName: "SentroxAI",
        tagline: "Empowering businesses with AI-driven solutions",
        email: "hello@sentroxai.com",
        phone: "+91 98765 43210",
        website: "https://sentroxai.com",
        address: "New Delhi, India",
    },
    branding: {
        primaryColor: "#8b5cf6",
        accentColor: "#06b6d4",
        logoUrl: "",
        faviconUrl: "",
    },
    social: {
        twitter: "",
        linkedin: "",
        instagram: "",
        github: "",
        youtube: "",
        dribbble: "",
    },
    notifications: {
        emailNewLead: true,
        emailNewClient: true,
        emailProjectUpdate: false,
        emailWeeklyDigest: true,
        browserNotifications: false,
    },
    seo: {
        metaTitle: "SentroxAI — AI-Powered Digital Agency",
        metaDescription: "We build intelligent digital solutions that transform businesses.",
        ogImage: "",
        googleAnalyticsId: "",
    },
};

/* ── Storage helpers ───────────────────────────────────────────────────────── */

const STORAGE_KEY = "sentroxai_agency_settings";

export function loadSettings(): AgencySettings {
    if (typeof window === "undefined") return defaultSettings;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored) as Partial<AgencySettings>;
            // Deep merge with defaults to handle new fields
            return {
                profile: { ...defaultSettings.profile, ...parsed.profile },
                branding: { ...defaultSettings.branding, ...parsed.branding },
                social: { ...defaultSettings.social, ...parsed.social },
                notifications: { ...defaultSettings.notifications, ...parsed.notifications },
                seo: { ...defaultSettings.seo, ...parsed.seo },
            };
        }
    } catch (err) {
        console.error("Failed to load settings:", err);
    }

    return defaultSettings;
}

export function saveSettings(settings: AgencySettings): boolean {
    if (typeof window === "undefined") return false;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        return true;
    } catch (err) {
        console.error("Failed to save settings:", err);
        return false;
    }
}

export function resetSettings(): AgencySettings {
    if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
    }
    return defaultSettings;
}
