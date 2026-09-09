/* -------------------------------------------------------------------------- */
/*                   SETTINGS MODULE – MOCK DATA                              */
/*                                                                            */
/*  User profile, notification prefs, security, and appearance settings.      */
/* -------------------------------------------------------------------------- */

/* ── Types ─────────────────────────────────────────────────────────────────── */

export interface UserProfile {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    company: string;
    role: string;
    avatar?: string;
    timezone: string;
    language: string;
    bio: string;
}

export interface NotificationPrefs {
    emailNotifications: boolean;
    pushNotifications: boolean;
    projectUpdates: boolean;
    meetingReminders: boolean;
    messageAlerts: boolean;
    weeklyDigest: boolean;
    marketingEmails: boolean;
}

export interface SecuritySettings {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    activeSessions: SessionInfo[];
}

export interface SessionInfo {
    id: string;
    device: string;
    browser: string;
    location: string;
    lastActive: string;
    current: boolean;
}

export interface AppearanceSettings {
    theme: "dark" | "light" | "system";
    accentColor: string;
    compactMode: boolean;
    animationsEnabled: boolean;
}

/* ── Mock data ─────────────────────────────────────────────────────────────── */

export const userProfile: UserProfile = {
    id: "me",
    fullName: "Sarthak Sharma",
    email: "sarthak@example.com",
    phone: "+1 (555) 123-4567",
    company: "Acme Corp",
    role: "Client",
    timezone: "Asia/Kolkata (UTC+5:30)",
    language: "English",
    bio: "Product enthusiast focused on building great digital experiences. Working with Sentrox on multiple projects.",
};

export const notificationPrefs: NotificationPrefs = {
    emailNotifications: true,
    pushNotifications: true,
    projectUpdates: true,
    meetingReminders: true,
    messageAlerts: true,
    weeklyDigest: false,
    marketingEmails: false,
};

export const securitySettings: SecuritySettings = {
    twoFactorEnabled: false,
    lastPasswordChange: "2026-06-15",
    activeSessions: [
        {
            id: "s1",
            device: "Windows PC",
            browser: "Chrome 126",
            location: "New Delhi, India",
            lastActive: "Active now",
            current: true,
        },
        {
            id: "s2",
            device: "iPhone 15 Pro",
            browser: "Safari Mobile",
            location: "New Delhi, India",
            lastActive: "2 hours ago",
            current: false,
        },
        {
            id: "s3",
            device: "MacBook Pro",
            browser: "Firefox 128",
            location: "Mumbai, India",
            lastActive: "3 days ago",
            current: false,
        },
    ],
};

export const appearanceSettings: AppearanceSettings = {
    theme: "dark",
    accentColor: "#6366f1",
    compactMode: false,
    animationsEnabled: true,
};

/* ── Settings nav ──────────────────────────────────────────────────────────── */

export type SettingsTab = "profile" | "notifications" | "security" | "appearance";

export interface SettingsNavItem {
    id: SettingsTab;
    label: string;
    description: string;
}

export const settingsNav: SettingsNavItem[] = [
    { id: "profile", label: "Profile", description: "Personal information and preferences" },
    { id: "notifications", label: "Notifications", description: "Email, push, and alert settings" },
    { id: "security", label: "Security", description: "Password, 2FA, and sessions" },
    { id: "appearance", label: "Appearance", description: "Theme, colors, and display" },
];
