"use client";

/* -------------------------------------------------------------------------- */
/*                      ADD PROJECT MODAL                                     */
/*                                                                            */
/*  Glassmorphism modal for creating a new project record.                   */
/*  Fetches active clients for the client dropdown on open.                  */
/* -------------------------------------------------------------------------- */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FolderPlus, Loader2 } from "lucide-react";
import {
    createNewProject,
    fetchClientsForDropdown,
    type CreateProjectData,
} from "@/app/actions/projects";

interface AddProjectModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const serviceOptions = [
    "Web Development",
    "Mobile App",
    "UI/UX Design",
    "SEO",
    "Branding",
    "Digital Marketing",
    "E-commerce",
    "Consulting",
    "Other",
];

export default function AddProjectModal({
    open,
    onClose,
    onSuccess,
}: AddProjectModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [clients, setClients] = useState<{ id: string; company: string; userName: string }[]>([]);
    const [loadingClients, setLoadingClients] = useState(false);
    const [form, setForm] = useState<CreateProjectData>({
        title: "",
        description: "",
        service: "",
        client_id: "",
        budget: undefined,
        start_date: "",
        due_date: "",
    });

    // Fetch clients when modal opens
    useEffect(() => {
        if (open) {
            setLoadingClients(true);
            fetchClientsForDropdown().then((result) => {
                setClients(result.data);
                setLoadingClients(false);
            });
        }
    }, [open]);

    const handleChange = (field: keyof CreateProjectData, value: string | number | undefined) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!form.title.trim() || !form.service || !form.client_id) {
            setError("Title, service, and client are required.");
            return;
        }

        setLoading(true);
        setError(null);

        const result = await createNewProject(form);

        if (result.success) {
            // Reset form
            setForm({
                title: "",
                description: "",
                service: "",
                client_id: "",
                budget: undefined,
                start_date: "",
                due_date: "",
            });
            onSuccess();
            onClose();
        } else {
            setError(result.error || "Failed to create project.");
        }

        setLoading(false);
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="modal-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div
                            className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#0a1225] shadow-2xl shadow-black/50"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10">
                                        <FolderPlus className="h-4 w-4 text-violet-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-semibold text-white">
                                            New Project
                                        </h2>
                                        <p className="text-xs text-sx-text-subtle">
                                            Create a new project record
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

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                                {/* Title */}
                                <FormField
                                    label="Project Title *"
                                    value={form.title}
                                    onChange={(v) => handleChange("title", v)}
                                    placeholder="Website Redesign"
                                />

                                {/* Description */}
                                <div>
                                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                        Description
                                    </label>
                                    <textarea
                                        value={form.description || ""}
                                        onChange={(e) => handleChange("description", e.target.value)}
                                        placeholder="Brief project description..."
                                        rows={3}
                                        className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm text-white placeholder:text-sx-text-subtle outline-none transition-colors focus:border-white/[0.12] focus:bg-white/[0.04] resize-none"
                                    />
                                </div>

                                {/* Service + Client row */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                            Service *
                                        </label>
                                        <select
                                            value={form.service}
                                            onChange={(e) => handleChange("service", e.target.value)}
                                            className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 text-sm text-white outline-none transition-colors focus:border-white/[0.12] focus:bg-white/[0.04] appearance-none cursor-pointer"
                                        >
                                            <option value="" className="bg-[#0c1222]">Select service</option>
                                            {serviceOptions.map((opt) => (
                                                <option key={opt} value={opt} className="bg-[#0c1222]">
                                                    {opt}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                            Client *
                                        </label>
                                        <select
                                            value={form.client_id}
                                            onChange={(e) => handleChange("client_id", e.target.value)}
                                            disabled={loadingClients}
                                            className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 text-sm text-white outline-none transition-colors focus:border-white/[0.12] focus:bg-white/[0.04] appearance-none cursor-pointer disabled:opacity-50"
                                        >
                                            <option value="" className="bg-[#0c1222]">
                                                {loadingClients ? "Loading clients..." : "Select client"}
                                            </option>
                                            {clients.map((c) => (
                                                <option key={c.id} value={c.id} className="bg-[#0c1222]">
                                                    {c.company} — {c.userName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Budget + Dates row */}
                                <div className="grid gap-4 sm:grid-cols-3">
                                    <div>
                                        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                            Budget (₹)
                                        </label>
                                        <input
                                            type="number"
                                            value={form.budget || ""}
                                            onChange={(e) =>
                                                handleChange("budget", e.target.value ? Number(e.target.value) : undefined)
                                            }
                                            placeholder="50000"
                                            className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 text-sm text-white placeholder:text-sx-text-subtle outline-none transition-colors focus:border-white/[0.12] focus:bg-white/[0.04]"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                            Start Date
                                        </label>
                                        <input
                                            type="date"
                                            value={form.start_date || ""}
                                            onChange={(e) => handleChange("start_date", e.target.value)}
                                            className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 text-sm text-white outline-none transition-colors focus:border-white/[0.12] focus:bg-white/[0.04] [color-scheme:dark]"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                            Due Date
                                        </label>
                                        <input
                                            type="date"
                                            value={form.due_date || ""}
                                            onChange={(e) => handleChange("due_date", e.target.value)}
                                            className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 text-sm text-white outline-none transition-colors focus:border-white/[0.12] focus:bg-white/[0.04] [color-scheme:dark]"
                                        />
                                    </div>
                                </div>

                                {/* Error */}
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2"
                                    >
                                        {error}
                                    </motion.p>
                                )}

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="flex h-10 items-center rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 text-sm font-medium text-sx-text-muted transition-all hover:border-white/[0.12] hover:text-white"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 px-5 text-sm font-medium text-white shadow-lg shadow-violet-500/20 transition-all hover:from-violet-500 hover:to-violet-400 hover:shadow-violet-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <FolderPlus className="h-4 w-4" />
                                                Create Project
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

/* ── Form Field ──────────────────────────────────────────────────────────────── */

function FormField({
    label,
    type = "text",
    value,
    onChange,
    placeholder,
}: {
    label: string;
    type?: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}) {
    return (
        <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 text-sm text-white placeholder:text-sx-text-subtle outline-none transition-colors focus:border-white/[0.12] focus:bg-white/[0.04]"
            />
        </div>
    );
}
