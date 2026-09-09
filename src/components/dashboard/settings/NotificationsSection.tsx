"use client";

/* -------------------------------------------------------------------------- */
/*                    NOTIFICATIONS SECTION                                   */
/*                                                                            */
/*  Toggle switches for notification preferences.                             */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { notificationPrefs, type NotificationPrefs } from "./data";

/* ── Toggle switch ─────────────────────────────────────────────────────────── */

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) {
    return (
        <button
            onClick={() => onChange(!enabled)}
            className={cn(
                "relative h-6 w-11 rounded-full transition-colors duration-200",
                enabled ? "bg-sx-primary-600" : "bg-white/[0.1]"
            )}
        >
            <motion.span
                animate={{ x: enabled ? 20 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-1 left-0 h-4 w-4 rounded-full bg-white shadow-sm"
            />
        </button>
    );
}

/* ── Toggle row ────────────────────────────────────────────────────────────── */

function ToggleRow({
    label,
    description,
    enabled,
    onChange,
}: {
    label: string;
    description: string;
    enabled: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between py-3.5">
            <div>
                <p className="text-sm font-medium text-sx-text-secondary">{label}</p>
                <p className="text-xs text-sx-text-muted mt-0.5">{description}</p>
            </div>
            <Toggle enabled={enabled} onChange={onChange} />
        </div>
    );
}

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function NotificationsSection() {
    const [prefs, setPrefs] = useState<NotificationPrefs>(notificationPrefs);

    const toggle = (key: keyof NotificationPrefs) => (value: boolean) => {
        setPrefs((prev) => ({ ...prev, [key]: value }));
    };

    const groups = [
        {
            title: "General",
            items: [
                { key: "emailNotifications" as const, label: "Email Notifications", desc: "Receive notifications via email" },
                { key: "pushNotifications" as const, label: "Push Notifications", desc: "Browser and mobile push alerts" },
            ],
        },
        {
            title: "Activity",
            items: [
                { key: "projectUpdates" as const, label: "Project Updates", desc: "Notified when projects are updated" },
                { key: "meetingReminders" as const, label: "Meeting Reminders", desc: "Get reminders before scheduled meetings" },
                { key: "messageAlerts" as const, label: "New Messages", desc: "Alert when you receive new messages" },
            ],
        },
        {
            title: "Digest",
            items: [
                { key: "weeklyDigest" as const, label: "Weekly Digest", desc: "Summary of activity every Monday" },
                { key: "marketingEmails" as const, label: "Marketing Emails", desc: "Product updates and promotions" },
            ],
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            {groups.map((group) => (
                <div
                    key={group.title}
                    className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"
                >
                    <h4 className="text-sm font-semibold text-white mb-1">{group.title}</h4>
                    <div className="divide-y divide-white/[0.04]">
                        {group.items.map((item) => (
                            <ToggleRow
                                key={item.key}
                                label={item.label}
                                description={item.desc}
                                enabled={prefs[item.key]}
                                onChange={toggle(item.key)}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </motion.div>
    );
}
