"use client";

/* -------------------------------------------------------------------------- */
/*                          SETTINGS PAGE                                     */
/*                                                                            */
/*  Module 8: Profile & Settings — tabbed layout with sidebar navigation.     */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { motion } from "framer-motion";
import DashboardContainer from "@/components/dashboard/DashboardContainer";
import SettingsNav from "@/components/dashboard/settings/SettingsNav";
import ProfileSection from "@/components/dashboard/settings/ProfileSection";
import NotificationsSection from "@/components/dashboard/settings/NotificationsSection";
import SecuritySection from "@/components/dashboard/settings/SecuritySection";
import AppearanceSection from "@/components/dashboard/settings/AppearanceSection";
import type { SettingsTab } from "@/components/dashboard/settings/data";

const sectionTitles: Record<SettingsTab, { title: string; subtitle: string }> = {
    profile: { title: "Profile", subtitle: "Manage your personal information and preferences" },
    notifications: { title: "Notifications", subtitle: "Control how and when you receive alerts" },
    security: { title: "Security", subtitle: "Password, two-factor auth, and active sessions" },
    appearance: { title: "Appearance", subtitle: "Customize your visual experience" },
};

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
    const section = sectionTitles[activeTab];

    return (
        <DashboardContainer>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-6"
            >
                <h1 className="text-xl font-bold text-white md:text-2xl">
                    Settings
                </h1>
                <p className="mt-1 text-sm text-sx-text-muted">
                    Manage your account preferences and configuration.
                </p>
            </motion.div>

            {/* Layout: sidebar nav + content */}
            <div className="flex flex-col gap-6 lg:flex-row">
                {/* Navigation */}
                <motion.div
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 }}
                    className="shrink-0 lg:w-[200px]"
                >
                    <SettingsNav activeTab={activeTab} onTabChange={setActiveTab} />
                </motion.div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Section header */}
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                        className="mb-5"
                    >
                        <h2 className="text-base font-semibold text-white">{section.title}</h2>
                        <p className="text-xs text-sx-text-muted mt-0.5">{section.subtitle}</p>
                    </motion.div>

                    {/* Active section */}
                    {activeTab === "profile" && <ProfileSection />}
                    {activeTab === "notifications" && <NotificationsSection />}
                    {activeTab === "security" && <SecuritySection />}
                    {activeTab === "appearance" && <AppearanceSection />}
                </div>
            </div>
        </DashboardContainer>
    );
}
