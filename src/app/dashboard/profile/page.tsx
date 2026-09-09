"use client";

/* -------------------------------------------------------------------------- */
/*                           PROFILE PAGE                                      */
/*                                                                            */
/*  Full client profile page showing user info from Supabase.                 */
/*  Displays avatar, personal info, account details, and quick links.         */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import {
    User,
    Mail,
    Phone,
    Building2,
    Calendar,
    Shield,
    Settings,
    ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import DashboardContainer from "@/components/dashboard/DashboardContainer";
import Avatar from "@/components/ui/Avatar";

/* ── Animation variants ───────────────────────────────────────────────────── */

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, delay: i * 0.06, ease: "easeOut" as const },
    }),
};

/* ── Info Row ─────────────────────────────────────────────────────────────── */

function InfoRow({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string | null | undefined;
}) {
    return (
        <div className="flex items-start gap-3 rounded-xl bg-white/[0.02] border border-white/[0.06] px-4 py-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.05]">
                <Icon className="h-4 w-4 text-sx-text-muted" />
            </div>
            <div className="min-w-0">
                <p className="text-[11px] font-medium uppercase tracking-wider text-sx-text-subtle">
                    {label}
                </p>
                <p className="mt-0.5 text-sm text-white truncate">
                    {value || "Not set"}
                </p>
            </div>
        </div>
    );
}

/* ── Quick Link ───────────────────────────────────────────────────────────── */

function QuickLink({
    icon: Icon,
    label,
    description,
    href,
}: {
    icon: React.ElementType;
    label: string;
    description: string;
    href: string;
}) {
    return (
        <Link
            href={href}
            className="group flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5 transition-all hover:border-white/[0.12] hover:bg-white/[0.04]"
        >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sx-primary/10">
                <Icon className="h-4 w-4 text-sx-primary-400" />
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-sx-text-muted">{description}</p>
            </div>
            <ExternalLink className="h-3.5 w-3.5 text-sx-text-subtle opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>
    );
}

/* ── Main Component ───────────────────────────────────────────────────────── */

export default function ProfilePage() {
    const { user, profile, isLoading } = useAuth();

    /* ── Loading skeleton ─────────────────────────────────────────── */
    if (isLoading) {
        return (
            <DashboardContainer>
                <div className="space-y-6">
                    <div className="h-48 animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
                    <div className="grid gap-4 sm:grid-cols-2">
                        {[...Array(4)].map((_, i) => (
                            <div
                                key={i}
                                className="h-16 animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.02]"
                            />
                        ))}
                    </div>
                </div>
            </DashboardContainer>
        );
    }

    const displayName = profile?.full_name || user?.user_metadata?.full_name || "User";
    const email = profile?.email || user?.email || "";
    const phone = profile?.phone;
    const company = profile?.company;
    const role = profile?.role || "client";
    const memberSince = user?.created_at
        ? new Date(user.created_at).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "Unknown";

    return (
        <DashboardContainer>
            {/* ── Header ───────────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-xl font-bold text-white md:text-2xl">
                    Profile
                </h1>
                <p className="mt-1 text-sm text-sx-text-muted">
                    Your personal information and account details.
                </p>
            </motion.div>

            {/* ── Profile Card ─────────────────────────────────────────── */}
            <motion.div
                custom={0}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-gradient-to-br from-white/[0.03] to-white/[0.01] p-6 sm:p-8 mb-8"
            >
                {/* Background glow */}
                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-sx-primary/10 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-sx-accent/10 blur-3xl" />

                <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:items-start sm:gap-6">
                    {/* Avatar */}
                    <div className="relative">
                        <Avatar
                            src={profile?.avatar_url}
                            fallback={displayName}
                            size="lg"
                            className="!h-20 !w-20 !text-xl sm:!h-24 sm:!w-24 sm:!text-2xl"
                        />
                        <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 ring-4 ring-[#030712]">
                            <div className="h-2 w-2 rounded-full bg-white" />
                        </div>
                    </div>

                    {/* Name + meta */}
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-xl font-bold text-white sm:text-2xl">
                            {displayName}
                        </h2>
                        <p className="mt-1 text-sm text-sx-text-muted">{email}</p>

                        <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-sx-primary/10 px-3 py-1 text-xs font-medium capitalize text-sx-primary-400">
                                <Shield className="h-3 w-3" />
                                {role}
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.05] px-3 py-1 text-xs font-medium text-sx-text-muted">
                                <Calendar className="h-3 w-3" />
                                Member since {memberSince}
                            </span>
                        </div>

                        <Link
                            href="/dashboard/settings"
                            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/[0.06] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-white/[0.1]"
                        >
                            <Settings className="h-3.5 w-3.5" />
                            Edit Profile
                        </Link>
                    </div>
                </div>
            </motion.div>

            {/* ── Info Grid ────────────────────────────────────────────── */}
            <motion.div
                custom={1}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="mb-8"
            >
                <h3 className="mb-4 text-sm font-semibold text-sx-text-secondary">
                    Personal Information
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                    <InfoRow icon={User} label="Full Name" value={displayName} />
                    <InfoRow icon={Mail} label="Email" value={email} />
                    <InfoRow icon={Phone} label="Phone" value={phone} />
                    <InfoRow icon={Building2} label="Company" value={company} />
                </div>
            </motion.div>

            {/* ── Quick Links ──────────────────────────────────────────── */}
            <motion.div
                custom={2}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
            >
                <h3 className="mb-4 text-sm font-semibold text-sx-text-secondary">
                    Quick Links
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <QuickLink
                        icon={Settings}
                        label="Account Settings"
                        description="Update profile, password, and preferences"
                        href="/dashboard/settings"
                    />
                    <QuickLink
                        icon={Shield}
                        label="Security"
                        description="Manage passwords and active sessions"
                        href="/dashboard/settings"
                    />
                    <QuickLink
                        icon={Mail}
                        label="Messages"
                        description="View your conversations"
                        href="/dashboard/messages"
                    />
                </div>
            </motion.div>
        </DashboardContainer>
    );
}
