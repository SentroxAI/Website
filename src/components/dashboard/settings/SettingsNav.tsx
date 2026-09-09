"use client";

/* -------------------------------------------------------------------------- */
/*                        SETTINGS NAV                                        */
/*                                                                            */
/*  Left sidebar tab navigation for settings sections.                        */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { User, Bell, Shield, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SettingsTab } from "./data";

const tabIcons: Record<SettingsTab, React.ReactNode> = {
    profile: <User className="h-4 w-4" />,
    notifications: <Bell className="h-4 w-4" />,
    security: <Shield className="h-4 w-4" />,
    appearance: <Palette className="h-4 w-4" />,
};

const tabs: { id: SettingsTab; label: string }[] = [
    { id: "profile", label: "Profile" },
    { id: "notifications", label: "Notifications" },
    { id: "security", label: "Security" },
    { id: "appearance", label: "Appearance" },
];

interface SettingsNavProps {
    activeTab: SettingsTab;
    onTabChange: (tab: SettingsTab) => void;
}

export default function SettingsNav({ activeTab, onTabChange }: SettingsNavProps) {
    return (
        <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;

                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={cn(
                            "relative flex items-center gap-2.5 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                            isActive
                                ? "text-white"
                                : "text-sx-text-muted hover:text-sx-text-secondary hover:bg-white/[0.03]"
                        )}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="settings-tab"
                                className="absolute inset-0 rounded-xl bg-white/[0.06] border border-white/[0.08]"
                                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                        )}
                        <span className="relative">{tabIcons[tab.id]}</span>
                        <span className="relative">{tab.label}</span>
                    </button>
                );
            })}
        </nav>
    );
}
