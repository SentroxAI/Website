"use client";

/* -------------------------------------------------------------------------- */
/*                    TEAM MEMBER DETAIL DRAWER                               */
/*                                                                            */
/*  Full-screen slide-over panel showing team member details, role control,  */
/*  and action buttons. Uses framer-motion AnimatePresence.                  */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Mail,
    Phone,
    Calendar,
    ChevronDown,
    UserMinus,
    Shield,
    User,
    Building2,
    Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TeamMember, TeamRole } from "@/app/actions/team";
import TeamRoleBadge, { teamRoleConfig } from "./TeamRoleBadge";

interface TeamDetailDrawerProps {
    member: TeamMember | null;
    open: boolean;
    onClose: () => void;
    onRoleChange: (id: string, role: TeamRole) => void;
    onRemove: (id: string) => void;
}

const allRoles: TeamRole[] = ["admin", "team"];

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

function getAvatarGradient(name: string): string {
    const gradients = [
        "from-pink-500/20 to-rose-500/20",
        "from-violet-500/20 to-purple-500/20",
        "from-blue-500/20 to-cyan-500/20",
        "from-emerald-500/20 to-teal-500/20",
        "from-amber-500/20 to-orange-500/20",
        "from-sky-500/20 to-indigo-500/20",
    ];
    const idx = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % gradients.length;
    return gradients[idx];
}

function getAvatarTextColor(name: string): string {
    const colors = [
        "text-pink-300",
        "text-violet-300",
        "text-blue-300",
        "text-emerald-300",
        "text-amber-300",
        "text-sky-300",
    ];
    const idx = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
    return colors[idx];
}

export default function TeamDetailDrawer({
    member,
    open,
    onClose,
    onRoleChange,
    onRemove,
}: TeamDetailDrawerProps) {
    const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
    const [confirmRemove, setConfirmRemove] = useState(false);

    if (!member) return null;

    const joinDate = new Date(member.created_at);
    const formattedJoined = joinDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const updatedDate = new Date(member.updated_at);
    const formattedUpdated = updatedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    // How long ago they joined
    const daysSinceJoined = Math.floor(
        (Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24),
    );
    const tenureLabel =
        daysSinceJoined < 30
            ? `${daysSinceJoined} days`
            : daysSinceJoined < 365
              ? `${Math.floor(daysSinceJoined / 30)} months`
              : `${(daysSinceJoined / 365).toFixed(1)} years`;

    const handleRemove = () => {
        if (confirmRemove) {
            onRemove(member.id);
            onClose();
        } else {
            setConfirmRemove(true);
            setTimeout(() => setConfirmRemove(false), 3000);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.aside
                        key="drawer"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-white/[0.06] bg-[#080e1e] shadow-2xl shadow-black/50"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
                            <div className="flex items-center gap-3">
                                {member.avatar_url ? (
                                    <img
                                        src={member.avatar_url}
                                        alt={member.full_name}
                                        className="h-10 w-10 rounded-xl object-cover"
                                    />
                                ) : (
                                    <div
                                        className={cn(
                                            "flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-bold",
                                            getAvatarGradient(member.full_name),
                                            getAvatarTextColor(member.full_name),
                                        )}
                                    >
                                        {getInitials(member.full_name)}
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-base font-semibold text-white">
                                        {member.full_name}
                                    </h2>
                                    <p className="text-xs text-sx-text-subtle">
                                        Team Member Details
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-sx-text-subtle hover:bg-white/[0.06] hover:text-white transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                            {/* Role section */}
                            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-sx-text-subtle">
                                        Role
                                    </p>
                                    <span className="text-[10px] text-sx-text-subtle">
                                        Updated {formattedUpdated}
                                    </span>
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                                        className="flex w-full items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 transition-colors hover:border-white/[0.12]"
                                    >
                                        <TeamRoleBadge
                                            role={member.role as TeamRole}
                                            size="md"
                                        />
                                        <ChevronDown
                                            className={cn(
                                                "h-4 w-4 text-sx-text-subtle transition-transform",
                                                roleDropdownOpen && "rotate-180",
                                            )}
                                        />
                                    </button>

                                    {roleDropdownOpen && (
                                        <div className="absolute left-0 right-0 top-full z-10 mt-1.5 rounded-xl border border-white/[0.08] bg-[#0c1222] p-1 shadow-xl shadow-black/30">
                                            {allRoles.map((r) => (
                                                <button
                                                    key={r}
                                                    onClick={() => {
                                                        onRoleChange(member.id, r);
                                                        setRoleDropdownOpen(false);
                                                    }}
                                                    className={cn(
                                                        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors",
                                                        member.role === r
                                                            ? "bg-white/[0.06]"
                                                            : "hover:bg-white/[0.04]",
                                                    )}
                                                >
                                                    <TeamRoleBadge role={r} />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Role description */}
                                <div className="mt-3 rounded-lg bg-white/[0.02] px-3 py-2">
                                    <p className="text-[11px] text-sx-text-subtle leading-relaxed">
                                        {member.role === "admin"
                                            ? "Full access to the admin dashboard, all CRUD operations, settings, and team management."
                                            : "Access to assigned projects, client communication, and task updates. No admin settings access."}
                                    </p>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <section>
                                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-sx-text-subtle">
                                    Contact Information
                                </h3>
                                <div className="space-y-2.5">
                                    <InfoRow
                                        icon={<Mail className="h-4 w-4" />}
                                        label="Email"
                                        value={member.email}
                                        href={`mailto:${member.email}`}
                                    />
                                    {member.phone && (
                                        <InfoRow
                                            icon={<Phone className="h-4 w-4" />}
                                            label="Phone"
                                            value={member.phone}
                                            href={`tel:${member.phone}`}
                                        />
                                    )}
                                    {member.company && (
                                        <InfoRow
                                            icon={<Building2 className="h-4 w-4" />}
                                            label="Company"
                                            value={member.company}
                                        />
                                    )}
                                </div>
                            </section>

                            {/* Activity */}
                            <section>
                                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-sx-text-subtle">
                                    Activity
                                </h3>
                                <div className="space-y-2.5">
                                    <InfoRow
                                        icon={<Calendar className="h-4 w-4" />}
                                        label="Joined"
                                        value={formattedJoined}
                                    />
                                    <InfoRow
                                        icon={<Clock className="h-4 w-4" />}
                                        label="Tenure"
                                        value={tenureLabel}
                                    />
                                </div>
                            </section>
                        </div>

                        {/* Footer actions */}
                        <div className="border-t border-white/[0.06] px-6 py-4">
                            <div className="flex items-center gap-3">
                                <a
                                    href={`mailto:${member.email}`}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-pink-500/20 transition-all hover:from-pink-500 hover:to-pink-400 hover:shadow-pink-500/30"
                                >
                                    <Mail className="h-4 w-4" />
                                    Email Member
                                </a>
                                <button
                                    onClick={handleRemove}
                                    className={cn(
                                        "flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all",
                                        confirmRemove
                                            ? "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                            : "border-white/[0.06] bg-white/[0.02] text-sx-text-muted hover:border-red-500/20 hover:text-red-400",
                                    )}
                                >
                                    <UserMinus className="h-4 w-4" />
                                    {confirmRemove ? "Confirm" : "Remove"}
                                </button>
                            </div>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}

/* ── Info Row ────────────────────────────────────────────────────────────────── */

function InfoRow({
    icon,
    label,
    value,
    href,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    href?: string;
}) {
    const content = href ? (
        <a
            href={href}
            className="text-sm text-white hover:text-pink-400 transition-colors"
            target={href.startsWith("mailto:") ? undefined : "_blank"}
            rel="noopener noreferrer"
        >
            {value}
        </a>
    ) : (
        <span className="text-sm text-white">{value}</span>
    );

    return (
        <div className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-white/[0.02]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-sx-text-subtle">
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium uppercase tracking-wider text-sx-text-subtle">
                    {label}
                </p>
                {content}
            </div>
        </div>
    );
}
