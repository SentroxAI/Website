"use client";

/* -------------------------------------------------------------------------- */
/*                          TEAM TABLE                                        */
/*                                                                            */
/*  Main data table for the team page with avatar initials, role badges,     */
/*  staggered row animations, and row-click to open drawer.                  */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import {
    MoreHorizontal,
    Eye,
    ArrowRightLeft,
    UserMinus,
    UsersRound,
    Mail,
    Phone,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { TeamMember, TeamRole } from "@/app/actions/team";
import TeamRoleBadge from "./TeamRoleBadge";

interface TeamTableProps {
    members: TeamMember[];
    onSelectMember: (member: TeamMember) => void;
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

export default function TeamTable({
    members,
    onSelectMember,
    onRoleChange,
    onRemove,
}: TeamTableProps) {
    if (members.length === 0) {
        return <EmptyState />;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]"
        >
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-white/[0.06]">
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                Member
                            </th>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                Email
                            </th>
                            <th className="hidden lg:table-cell px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                Phone
                            </th>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                Role
                            </th>
                            <th className="hidden xl:table-cell px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                Joined
                            </th>
                            <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {members.map((member, index) => (
                            <MemberRow
                                key={member.id}
                                member={member}
                                index={index}
                                onSelect={() => onSelectMember(member)}
                                onRoleChange={onRoleChange}
                                onRemove={onRemove}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile card list */}
            <div className="md:hidden divide-y divide-white/[0.06]">
                {members.map((member, index) => (
                    <MemberCard
                        key={member.id}
                        member={member}
                        index={index}
                        onSelect={() => onSelectMember(member)}
                    />
                ))}
            </div>
        </motion.div>
    );
}

/* ── Table Row (Desktop) ────────────────────────────────────────────────────── */

function MemberRow({
    member,
    index,
    onSelect,
    onRoleChange,
    onRemove,
}: {
    member: TeamMember;
    index: number;
    onSelect: () => void;
    onRoleChange: (id: string, role: TeamRole) => void;
    onRemove: (id: string) => void;
}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [roleMenuOpen, setRoleMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
                setRoleMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const joinedDate = new Date(member.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return (
        <motion.tr
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: index * 0.03 }}
            onClick={onSelect}
            className="group cursor-pointer border-b border-white/[0.03] transition-colors hover:bg-white/[0.03] last:border-b-0"
        >
            {/* Member */}
            <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                    {member.avatar_url ? (
                        <img
                            src={member.avatar_url}
                            alt={member.full_name}
                            className="h-9 w-9 rounded-xl object-cover"
                        />
                    ) : (
                        <div
                            className={cn(
                                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-bold",
                                getAvatarGradient(member.full_name),
                                getAvatarTextColor(member.full_name),
                            )}
                        >
                            {getInitials(member.full_name)}
                        </div>
                    )}
                    <p className="truncate text-sm font-medium text-white max-w-[180px]">
                        {member.full_name}
                    </p>
                </div>
            </td>

            {/* Email */}
            <td className="px-4 py-3.5">
                <span className="text-sm text-sx-text-muted">{member.email}</span>
            </td>

            {/* Phone */}
            <td className="hidden lg:table-cell px-4 py-3.5">
                <span className="text-sm text-sx-text-muted">
                    {member.phone || "—"}
                </span>
            </td>

            {/* Role */}
            <td className="px-4 py-3.5">
                <TeamRoleBadge role={member.role as TeamRole} />
            </td>

            {/* Joined */}
            <td className="hidden xl:table-cell px-4 py-3.5">
                <span className="text-xs text-sx-text-muted">{joinedDate}</span>
            </td>

            {/* Actions */}
            <td className="px-4 py-3.5 text-right">
                <div ref={menuRef} className="relative inline-block">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(!menuOpen);
                            setRoleMenuOpen(false);
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-sx-text-subtle opacity-0 transition-all group-hover:opacity-100 hover:bg-white/[0.06] hover:text-white"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {menuOpen && !roleMenuOpen && (
                        <div className="absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-xl border border-white/[0.08] bg-[#0c1222] p-1 shadow-xl shadow-black/30">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuOpen(false);
                                    onSelect();
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-sx-text-muted hover:bg-white/[0.04] hover:text-white transition-colors"
                            >
                                <Eye className="h-3.5 w-3.5" />
                                View details
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setRoleMenuOpen(true);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-sx-text-muted hover:bg-white/[0.04] hover:text-white transition-colors"
                            >
                                <ArrowRightLeft className="h-3.5 w-3.5" />
                                Change role
                            </button>
                            <div className="my-1 h-px bg-white/[0.06]" />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuOpen(false);
                                    onRemove(member.id);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                <UserMinus className="h-3.5 w-3.5" />
                                Remove from team
                            </button>
                        </div>
                    )}

                    {menuOpen && roleMenuOpen && (
                        <div className="absolute right-0 top-full z-50 mt-1 min-w-[150px] rounded-xl border border-white/[0.08] bg-[#0c1222] p-1 shadow-xl shadow-black/30">
                            {allRoles.map((r) => (
                                <button
                                    key={r}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRoleChange(member.id, r);
                                        setMenuOpen(false);
                                        setRoleMenuOpen(false);
                                    }}
                                    className={cn(
                                        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors",
                                        member.role === r
                                            ? "bg-white/[0.06] text-white"
                                            : "text-sx-text-muted hover:bg-white/[0.04] hover:text-white",
                                    )}
                                >
                                    <TeamRoleBadge role={r} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </td>
        </motion.tr>
    );
}

/* ── Mobile Card ────────────────────────────────────────────────────────────── */

function MemberCard({
    member,
    index,
    onSelect,
}: {
    member: TeamMember;
    index: number;
    onSelect: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
            onClick={onSelect}
            className="cursor-pointer p-4 transition-colors hover:bg-white/[0.03]"
        >
            <div className="flex items-center gap-3 mb-2.5">
                {member.avatar_url ? (
                    <img
                        src={member.avatar_url}
                        alt={member.full_name}
                        className="h-10 w-10 rounded-xl object-cover"
                    />
                ) : (
                    <div
                        className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-bold",
                            getAvatarGradient(member.full_name),
                            getAvatarTextColor(member.full_name),
                        )}
                    >
                        {getInitials(member.full_name)}
                    </div>
                )}
                <div className="min-w-0 flex-1">
                    <p className="font-medium text-white truncate">{member.full_name}</p>
                    <p className="text-xs text-sx-text-subtle truncate">{member.email}</p>
                </div>
                <TeamRoleBadge role={member.role as TeamRole} />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-sx-text-muted ml-[52px]">
                {member.phone && (
                    <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-sx-text-subtle" />
                        {member.phone}
                    </span>
                )}
                <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3 text-sx-text-subtle" />
                    {member.email}
                </span>
            </div>
        </motion.div>
    );
}

/* ── Empty State ────────────────────────────────────────────────────────────── */

function EmptyState() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] px-6 py-20"
        >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-500/10 mb-4">
                <UsersRound className="h-6 w-6 text-pink-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">No team members found</h3>
            <p className="mt-1.5 text-sm text-sx-text-muted text-center max-w-sm">
                No team members match your current filters. Try adjusting your search or role filters.
            </p>
        </motion.div>
    );
}
