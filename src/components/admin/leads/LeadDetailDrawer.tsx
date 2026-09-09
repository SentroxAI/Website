"use client";

/* -------------------------------------------------------------------------- */
/*                      LEAD DETAIL DRAWER                                    */
/*                                                                            */
/*  Full-screen slide-over panel showing lead details, status control,        */
/*  and action buttons. Uses framer-motion AnimatePresence for smooth         */
/*  enter/exit transitions.                                                   */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Mail,
    Phone,
    Building2,
    Calendar,
    MessageSquare,
    Briefcase,
    DollarSign,
    Tag,
    ChevronDown,
    Trash2,
    ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Lead, LeadStatus } from "@/app/actions/leads";
import LeadStatusBadge from "./LeadStatusBadge";
import { statusConfig } from "./LeadStatusBadge";

interface LeadDetailDrawerProps {
    lead: Lead | null;
    open: boolean;
    onClose: () => void;
    onStatusChange: (id: string, status: LeadStatus) => void;
    onDelete: (id: string) => void;
}

const allStatuses: LeadStatus[] = ["new", "contacted", "qualified", "converted", "lost"];

export default function LeadDetailDrawer({
    lead,
    open,
    onClose,
    onStatusChange,
    onDelete,
}: LeadDetailDrawerProps) {
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    if (!lead) return null;

    const date = new Date(lead.created_at);
    const formattedDate = date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const updatedDate = new Date(lead.updated_at);
    const formattedUpdated = updatedDate.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

    const handleDelete = () => {
        if (confirmDelete) {
            onDelete(lead.id);
            onClose();
        } else {
            setConfirmDelete(true);
            setTimeout(() => setConfirmDelete(false), 3000);
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
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 text-sm font-bold text-blue-300">
                                    {lead.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .slice(0, 2)
                                        .toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-white">
                                        {lead.name}
                                    </h2>
                                    <p className="text-xs text-sx-text-subtle">
                                        Lead Details
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
                            {/* Status section */}
                            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-sx-text-subtle">
                                        Status
                                    </p>
                                    <span className="text-[10px] text-sx-text-subtle">
                                        Updated {formattedUpdated}
                                    </span>
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                                        className="flex w-full items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 transition-colors hover:border-white/[0.12]"
                                    >
                                        <LeadStatusBadge
                                            status={lead.status as LeadStatus}
                                            size="md"
                                        />
                                        <ChevronDown
                                            className={cn(
                                                "h-4 w-4 text-sx-text-subtle transition-transform",
                                                statusDropdownOpen && "rotate-180",
                                            )}
                                        />
                                    </button>

                                    {statusDropdownOpen && (
                                        <div className="absolute left-0 right-0 top-full z-10 mt-1.5 rounded-xl border border-white/[0.08] bg-[#0c1222] p-1 shadow-xl shadow-black/30">
                                            {allStatuses.map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => {
                                                        onStatusChange(lead.id, s);
                                                        setStatusDropdownOpen(false);
                                                    }}
                                                    className={cn(
                                                        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors",
                                                        lead.status === s
                                                            ? "bg-white/[0.06]"
                                                            : "hover:bg-white/[0.04]",
                                                    )}
                                                >
                                                    <LeadStatusBadge status={s} />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Status timeline */}
                                <div className="mt-4 flex items-center gap-1">
                                    {allStatuses.map((s, i) => {
                                        const idx = allStatuses.indexOf(lead.status as LeadStatus);
                                        const isPast = i <= idx;
                                        const cfg = statusConfig[s];
                                        return (
                                            <div key={s} className="flex items-center gap-1 flex-1">
                                                <div
                                                    className={cn(
                                                        "h-1.5 w-full rounded-full transition-colors",
                                                        isPast ? cfg.dot : "bg-white/[0.06]",
                                                    )}
                                                />
                                            </div>
                                        );
                                    })}
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
                                        value={lead.email}
                                        href={`mailto:${lead.email}`}
                                    />
                                    {lead.phone && (
                                        <InfoRow
                                            icon={<Phone className="h-4 w-4" />}
                                            label="Phone"
                                            value={lead.phone}
                                            href={`tel:${lead.phone}`}
                                        />
                                    )}
                                    {lead.company && (
                                        <InfoRow
                                            icon={<Building2 className="h-4 w-4" />}
                                            label="Company"
                                            value={lead.company}
                                        />
                                    )}
                                </div>
                            </section>

                            {/* Inquiry Details */}
                            <section>
                                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-sx-text-subtle">
                                    Inquiry Details
                                </h3>
                                <div className="space-y-2.5">
                                    <InfoRow
                                        icon={<Briefcase className="h-4 w-4" />}
                                        label="Service"
                                        value={lead.service}
                                    />
                                    {lead.budget && (
                                        <InfoRow
                                            icon={<DollarSign className="h-4 w-4" />}
                                            label="Budget"
                                            value={lead.budget}
                                        />
                                    )}
                                    <InfoRow
                                        icon={<Tag className="h-4 w-4" />}
                                        label="Source"
                                        value={lead.source.replace("_", " ")}
                                    />
                                    <InfoRow
                                        icon={<Calendar className="h-4 w-4" />}
                                        label="Submitted"
                                        value={`${formattedDate} at ${formattedTime}`}
                                    />
                                </div>
                            </section>

                            {/* Message */}
                            <section>
                                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-sx-text-subtle">
                                    <MessageSquare className="inline h-3.5 w-3.5 mr-1.5 -mt-0.5" />
                                    Message
                                </h3>
                                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                                    <p className="text-sm leading-relaxed text-sx-text-muted whitespace-pre-wrap">
                                        {lead.message}
                                    </p>
                                </div>
                            </section>
                        </div>

                        {/* Footer actions */}
                        <div className="border-t border-white/[0.06] px-6 py-4">
                            <div className="flex items-center gap-3">
                                <a
                                    href={`mailto:${lead.email}`}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/20 transition-all hover:from-blue-500 hover:to-blue-400 hover:shadow-blue-500/30"
                                >
                                    <Mail className="h-4 w-4" />
                                    Email Lead
                                    <ExternalLink className="h-3 w-3 opacity-50" />
                                </a>
                                <button
                                    onClick={handleDelete}
                                    className={cn(
                                        "flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all",
                                        confirmDelete
                                            ? "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                            : "border-white/[0.06] bg-white/[0.02] text-sx-text-muted hover:border-red-500/20 hover:text-red-400",
                                    )}
                                >
                                    <Trash2 className="h-4 w-4" />
                                    {confirmDelete ? "Confirm" : "Delete"}
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
            className="text-sm text-white hover:text-blue-400 transition-colors"
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
