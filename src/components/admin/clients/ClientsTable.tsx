"use client";

/* -------------------------------------------------------------------------- */
/*                          CLIENTS TABLE                                     */
/*                                                                            */
/*  Main data table for the clients page with staggered row animations,      */
/*  responsive column hiding, and row-click to open detail drawer.           */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import {
    MoreHorizontal,
    Eye,
    ArrowRightLeft,
    Trash2,
    Users,
    Mail,
    Building2,
    Calendar,
    Globe,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { ClientWithUser, ClientStatus } from "@/app/actions/clients";
import ClientStatusBadge from "./ClientStatusBadge";

interface ClientsTableProps {
    clients: ClientWithUser[];
    onSelectClient: (client: ClientWithUser) => void;
    onStatusChange: (id: string, status: ClientStatus) => void;
    onDelete: (id: string) => void;
}

const statusFlow: ClientStatus[] = ["active", "pending", "inactive"];

export default function ClientsTable({
    clients,
    onSelectClient,
    onStatusChange,
    onDelete,
}: ClientsTableProps) {
    if (clients.length === 0) {
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
                                Company
                            </th>
                            <th className="hidden lg:table-cell px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                Industry
                            </th>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                Status
                            </th>
                            <th className="hidden xl:table-cell px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                Website
                            </th>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                Since
                            </th>
                            <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.map((client, index) => (
                            <ClientRow
                                key={client.id}
                                client={client}
                                index={index}
                                onSelect={() => onSelectClient(client)}
                                onStatusChange={onStatusChange}
                                onDelete={onDelete}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile card list */}
            <div className="md:hidden divide-y divide-white/[0.06]">
                {clients.map((client, index) => (
                    <ClientCard
                        key={client.id}
                        client={client}
                        index={index}
                        onSelect={() => onSelectClient(client)}
                    />
                ))}
            </div>
        </motion.div>
    );
}

/* ── Table Row (Desktop) ────────────────────────────────────────────────────── */

function ClientRow({
    client,
    index,
    onSelect,
    onStatusChange,
    onDelete,
}: {
    client: ClientWithUser;
    index: number;
    onSelect: () => void;
    onStatusChange: (id: string, status: ClientStatus) => void;
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

    const userName = client.users?.full_name || "Unknown";
    const userEmail = client.users?.email || "—";
    const initials = userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const date = new Date(client.created_at);
    const formattedDate = date.toLocaleDateString("en-IN", {
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
            {/* Contact */}
            <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-xs font-bold text-emerald-300">
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">
                            {userName}
                        </p>
                        <p className="truncate text-xs text-sx-text-subtle">
                            {userEmail}
                        </p>
                    </div>
                </div>
            </td>

            {/* Company */}
            <td className="px-4 py-3.5">
                <span className="text-sm text-sx-text-muted">{client.company}</span>
            </td>

            {/* Industry */}
            <td className="hidden lg:table-cell px-4 py-3.5">
                <span className="text-sm text-sx-text-muted">
                    {client.industry || "—"}
                </span>
            </td>

            {/* Status */}
            <td className="px-4 py-3.5">
                <ClientStatusBadge status={client.status as ClientStatus} />
            </td>

            {/* Website */}
            <td className="hidden xl:table-cell px-4 py-3.5">
                {client.website ? (
                    <a
                        href={client.website.startsWith("http") ? client.website : `https://${client.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        <Globe className="h-3 w-3" />
                        <span className="truncate max-w-[120px]">
                            {client.website.replace(/^https?:\/\//, "")}
                        </span>
                    </a>
                ) : (
                    <span className="text-xs text-sx-text-subtle">—</span>
                )}
            </td>

            {/* Since */}
            <td className="px-4 py-3.5">
                <p className="text-xs text-sx-text-muted">{formattedDate}</p>
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
                                    onDelete(client.id);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete client
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
                                        onStatusChange(client.id, s);
                                        setMenuOpen(false);
                                        setStatusMenuOpen(false);
                                    }}
                                    className={cn(
                                        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs transition-colors",
                                        client.status === s
                                            ? "bg-white/[0.06] text-white"
                                            : "text-sx-text-muted hover:bg-white/[0.04] hover:text-white",
                                    )}
                                >
                                    <ClientStatusBadge status={s} />
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

function ClientCard({
    client,
    index,
    onSelect,
}: {
    client: ClientWithUser;
    index: number;
    onSelect: () => void;
}) {
    const userName = client.users?.full_name || "Unknown";
    const userEmail = client.users?.email || "";
    const initials = userName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const date = new Date(client.created_at);
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
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-sm font-bold text-emerald-300">
                        {initials}
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-white">{userName}</p>
                        <div className="flex items-center gap-1.5 text-xs text-sx-text-subtle">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{userEmail}</span>
                        </div>
                    </div>
                </div>
                <ClientStatusBadge status={client.status as ClientStatus} />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-sx-text-muted">
                <span className="flex items-center gap-1">
                    <Building2 className="h-3 w-3 text-sx-text-subtle" />
                    {client.company}
                </span>
                <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-sx-text-subtle" />
                    {formattedDate}
                </span>
                {client.industry && (
                    <span className="text-sx-text-subtle">
                        {client.industry}
                    </span>
                )}
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
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 mb-4">
                <Users className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">No clients found</h3>
            <p className="mt-1.5 text-sm text-sx-text-muted text-center max-w-sm">
                No clients match your current filters. Try adjusting your search or status filters to see more results.
            </p>
        </motion.div>
    );
}
