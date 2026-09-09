"use client";

/* -------------------------------------------------------------------------- */
/*                          LEADS TABLE                                       */
/*                                                                            */
/*  Main data table for the leads page with staggered row animations,         */
/*  responsive column hiding, and row-click to open detail drawer.            */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import {
    MoreHorizontal,
    Eye,
    ArrowRightLeft,
    Trash2,
    UserPlus,
    Mail,
    Building2,
    Calendar,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Lead, LeadStatus } from "@/app/actions/leads";
import LeadStatusBadge from "./LeadStatusBadge";

interface LeadsTableProps {
    leads: Lead[];
    onSelectLead: (lead: Lead) => void;
    onStatusChange: (id: string, status: LeadStatus) => void;
    onDelete: (id: string) => void;
}

const statusFlow: LeadStatus[] = ["new", "contacted", "qualified", "converted", "lost"];

export default function LeadsTable({
    leads,
    onSelectLead,
    onStatusChange,
    onDelete,
}: LeadsTableProps) {
    if (leads.length === 0) {
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
                                Contact
                            </th>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                Service
                            </th>
                            <th className="hidden lg:table-cell px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                Budget
                            </th>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                Status
                            </th>
                            <th className="hidden xl:table-cell px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                Source
                            </th>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                Date
                            </th>
                            <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map((lead, index) => (
                            <LeadRow
                                key={lead.id}
                                lead={lead}
                                index={index}
                                onSelect={() => onSelectLead(lead)}
                                onStatusChange={onStatusChange}
                                onDelete={onDelete}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile card list */}
            <div className="md:hidden divide-y divide-white/[0.06]">
                {leads.map((lead, index) => (
                    <LeadCard
                        key={lead.id}
                        lead={lead}
                        index={index}
                        onSelect={() => onSelectLead(lead)}
                    />
                ))}
            </div>
        </motion.div>
    );
}

/* ── Table Row (Desktop) ────────────────────────────────────────────────────── */

function LeadRow({
    lead,
    index,
    onSelect,
    onStatusChange,
    onDelete,
}: {
    lead: Lead;
    index: number;
    onSelect: () => void;
    onStatusChange: (id: string, status: LeadStatus) => void;
    onDelete: (id: string) => void;
}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [statusMenuOpen, setStatusMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
                setStatusMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const date = new Date(lead.created_at);
    const formattedDate = date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
    });
    const formattedTime = date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        <motion.tr
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: index * 0.03 }}
            onClick={onSelect}
            className="group cursor-pointer border-b border-white/[0.03] transition-colors hover:bg-white/[0.03] last:border-b-0"
        >
            {/* Contact */}
            <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 text-xs font-bold text-blue-300">
                        {lead.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">
                            {lead.name}
                        </p>
                        <p className="truncate text-xs text-sx-text-subtle">
                            {lead.email}
                        </p>
                    </div>
                </div>
            </td>

            {/* Service */}
            <td className="px-4 py-3.5">
                <span className="text-sm text-sx-text-muted">{lead.service}</span>
            </td>

            {/* Budget */}
            <td className="hidden lg:table-cell px-4 py-3.5">
                <span className="text-sm text-sx-text-muted tabular-nums">
                    {lead.budget || "—"}
                </span>
            </td>

            {/* Status */}
            <td className="px-4 py-3.5">
                <LeadStatusBadge status={lead.status as LeadStatus} />
            </td>

            {/* Source */}
            <td className="hidden xl:table-cell px-4 py-3.5">
                <span className="rounded-md bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-sx-text-subtle">
                    {lead.source.replace("_", " ")}
                </span>
            </td>

            {/* Date */}
            <td className="px-4 py-3.5">
                <div>
                    <p className="text-xs text-sx-text-muted">{formattedDate}</p>
                    <p className="text-[10px] text-sx-text-subtle">{formattedTime}</p>
                </div>
            </td>

            {/* Actions */}
            <td className="px-4 py-3.5 text-right">
                <div ref={menuRef} className="relative inline-block">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(!menuOpen);
                            setStatusMenuOpen(false);
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-sx-text-subtle opacity-0 transition-all group-hover:opacity-100 hover:bg-white/[0.06] hover:text-white"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {menuOpen && !statusMenuOpen && (
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
                                    setStatusMenuOpen(true);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-sx-text-muted hover:bg-white/[0.04] hover:text-white transition-colors"
                            >
                                <ArrowRightLeft className="h-3.5 w-3.5" />
                                Change status
                            </button>
                            <div className="my-1 h-px bg-white/[0.06]" />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuOpen(false);
                                    onDelete(lead.id);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete lead
                            </button>
                        </div>
                    )}

                    {menuOpen && statusMenuOpen && (
                        <div className="absolute right-0 top-full z-50 mt-1 min-w-[150px] rounded-xl border border-white/[0.08] bg-[#0c1222] p-1 shadow-xl shadow-black/30">
                            {statusFlow.map((s) => (
                                <button
                                    key={s}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onStatusChange(lead.id, s);
                                        setMenuOpen(false);
                                        setStatusMenuOpen(false);
                                    }}
                                    className={cn(
                                        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors",
                                        lead.status === s
                                            ? "bg-white/[0.06] text-white"
                                            : "text-sx-text-muted hover:bg-white/[0.04] hover:text-white",
                                    )}
                                >
                                    <LeadStatusBadge status={s} />
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

function LeadCard({
    lead,
    index,
    onSelect,
}: {
    lead: Lead;
    index: number;
    onSelect: () => void;
}) {
    const date = new Date(lead.created_at);
    const formattedDate = date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
            onClick={onSelect}
            className="cursor-pointer p-4 transition-colors hover:bg-white/[0.03]"
        >
            <div className="flex items-start justify-between mb-2.5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 text-sm font-bold text-blue-300">
                        {lead.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-white">{lead.name}</p>
                        <div className="flex items-center gap-1.5 text-xs text-sx-text-subtle">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{lead.email}</span>
                        </div>
                    </div>
                </div>
                <LeadStatusBadge status={lead.status as LeadStatus} />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-sx-text-muted">
                {lead.company && (
                    <span className="flex items-center gap-1">
                        <Building2 className="h-3 w-3 text-sx-text-subtle" />
                        {lead.company}
                    </span>
                )}
                <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-sx-text-subtle" />
                    {formattedDate}
                </span>
                <span className="text-sx-text-subtle">
                    {lead.service}
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
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 mb-4">
                <UserPlus className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">No leads found</h3>
            <p className="mt-1.5 text-sm text-sx-text-muted text-center max-w-sm">
                No leads match your current filters. Try adjusting your search or status filters to see more results.
            </p>
        </motion.div>
    );
}
