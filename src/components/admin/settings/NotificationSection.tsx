"use client";

/* -------------------------------------------------------------------------- */
/*                NOTIFICATION SETTINGS SECTION                               */
/* -------------------------------------------------------------------------- */

import { cn } from "@/lib/utils";
import { Mail, Bell, BarChart3, FolderKanban, UserPlus, Users } from "lucide-react";
import type { NotificationSettings } from "@/lib/settings";

interface NotificationSectionProps {
    notifications: NotificationSettings;
    onChange: (notifications: NotificationSettings) => void;
}

const toggles: {
    key: keyof NotificationSettings;
    label: string;
    description: string;
    icon: React.ReactNode;
}[] = [
    {
        key: "emailNewLead",
        label: "New Lead Notifications",
        description: "Get emailed when a new lead submits via the website",
        icon: <UserPlus className="h-4 w-4" />,
    },
    {
        key: "emailNewClient",
        label: "New Client Notifications",
        description: "Get emailed when a lead is converted to a client",
        icon: <Users className="h-4 w-4" />,
    },
    {
        key: "emailProjectUpdate",
        label: "Project Status Updates",
        description: "Get emailed when a project status or progress changes",
        icon: <FolderKanban className="h-4 w-4" />,
    },
    {
        key: "emailWeeklyDigest",
        label: "Weekly Digest",
        description: "Receive a weekly summary of agency activity",
        icon: <BarChart3 className="h-4 w-4" />,
    },
    {
        key: "browserNotifications",
        label: "Browser Notifications",
        description: "Show desktop push notifications for important events",
        icon: <Bell className="h-4 w-4" />,
    },
];

export default function NotificationSection({ notifications, onChange }: NotificationSectionProps) {
    const handleToggle = (key: keyof NotificationSettings) => {
        onChange({ ...notifications, [key]: !notifications[key] });
    };

    const enabledCount = Object.values(notifications).filter(Boolean).length;

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs text-sx-text-muted">
                <Mail className="h-3.5 w-3.5" />
                {enabledCount} of {toggles.length} notifications enabled
            </div>

            <div className="space-y-2">
                {toggles.map((toggle) => (
                    <div
                        key={toggle.key}
                        className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 transition-colors hover:bg-white/[0.03]"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-sx-text-subtle">
                                {toggle.icon}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">{toggle.label}</p>
                                <p className="text-[10px] text-sx-text-subtle">{toggle.description}</p>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => handleToggle(toggle.key)}
                            className={cn(
                                "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                                notifications[toggle.key] ? "bg-emerald-500" : "bg-white/[0.1]",
                            )}
                        >
                            <span
                                className={cn(
                                    "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                                    notifications[toggle.key] ? "left-[22px]" : "left-0.5",
                                )}
                            />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
