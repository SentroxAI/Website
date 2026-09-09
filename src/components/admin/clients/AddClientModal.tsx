"use client";

/* -------------------------------------------------------------------------- */
/*                       ADD CLIENT MODAL                                     */
/*                                                                            */
/*  Glassmorphism modal for creating a new client record.                    */
/*  Creates both a user (role=client) and a client row.                      */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Loader2 } from "lucide-react";
import { createNewClient, type CreateClientData } from "@/app/actions/clients";

interface AddClientModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const industryOptions = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "E-commerce",
    "Real Estate",
    "Media",
    "Manufacturing",
    "Other",
];

export default function AddClientModal({
    open,
    onClose,
    onSuccess,
}: AddClientModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState<CreateClientData>({
        full_name: "",
        email: "",
        phone: "",
        company: "",
        industry: "",
        website: "",
    });

    const handleChange = (field: keyof CreateClientData, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!form.full_name.trim() || !form.email.trim() || !form.company.trim()) {
            setError("Name, email, and company are required.");
            return;
        }

        setLoading(true);
        setError(null);

        const result = await createNewClient(form);

        if (result.success) {
            // Reset form
            setForm({
                full_name: "",
                email: "",
                phone: "",
                company: "",
                industry: "",
                website: "",
            });
            onSuccess();
            onClose();
        } else {
            setError(result.error || "Failed to create client.");
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
                            className="w-full max-w-lg rounded-2xl border border-white/[0.08] bg-[#0a1225] shadow-2xl shadow-black/50"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
                                        <UserPlus className="h-4 w-4 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-semibold text-white">
                                            Add New Client
                                        </h2>
                                        <p className="text-xs text-sx-text-subtle">
                                            Create a new client record
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
                                {/* Name + Email row */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <FormField
                                        label="Full Name *"
                                        value={form.full_name}
                                        onChange={(v) => handleChange("full_name", v)}
                                        placeholder="John Doe"
                                    />
                                    <FormField
                                        label="Email *"
                                        type="email"
                                        value={form.email}
                                        onChange={(v) => handleChange("email", v)}
                                        placeholder="john@company.com"
                                    />
                                </div>

                                {/* Phone + Company row */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <FormField
                                        label="Phone"
                                        type="tel"
                                        value={form.phone || ""}
                                        onChange={(v) => handleChange("phone", v)}
                                        placeholder="+91 98765 43210"
                                    />
                                    <FormField
                                        label="Company *"
                                        value={form.company}
                                        onChange={(v) => handleChange("company", v)}
                                        placeholder="Acme Corp"
                                    />
                                </div>

                                {/* Industry + Website row */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                            Industry
                                        </label>
                                        <select
                                            value={form.industry || ""}
                                            onChange={(e) => handleChange("industry", e.target.value)}
                                            className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 text-sm text-white outline-none transition-colors focus:border-white/[0.12] focus:bg-white/[0.04] appearance-none cursor-pointer"
                                        >
                                            <option value="" className="bg-[#0c1222]">Select industry</option>
                                            {industryOptions.map((opt) => (
                                                <option key={opt} value={opt} className="bg-[#0c1222]">
                                                    {opt}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <FormField
                                        label="Website"
                                        value={form.website || ""}
                                        onChange={(v) => handleChange("website", v)}
                                        placeholder="https://company.com"
                                    />
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
                                        className="flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 text-sm font-medium text-white shadow-lg shadow-emerald-500/20 transition-all hover:from-emerald-500 hover:to-emerald-400 hover:shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="h-4 w-4" />
                                                Create Client
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
