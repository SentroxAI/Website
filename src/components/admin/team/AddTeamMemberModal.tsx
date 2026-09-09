"use client";

/* -------------------------------------------------------------------------- */
/*                      ADD TEAM MEMBER MODAL                                 */
/*                                                                            */
/*  Glassmorphism modal for adding a new team member.                        */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Loader2 } from "lucide-react";
import { addTeamMember, type CreateTeamMemberData, type TeamRole } from "@/app/actions/team";

interface AddTeamMemberModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddTeamMemberModal({
    open,
    onClose,
    onSuccess,
}: AddTeamMemberModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState<CreateTeamMemberData>({
        full_name: "",
        email: "",
        phone: "",
        role: "team",
    });

    const handleChange = (field: keyof CreateTeamMemberData, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.full_name.trim() || !form.email.trim()) {
            setError("Name and email are required.");
            return;
        }

        setLoading(true);
        setError(null);

        const result = await addTeamMember(form);

        if (result.success) {
            setForm({ full_name: "", email: "", phone: "", role: "team" });
            onSuccess();
            onClose();
        } else {
            setError(result.error || "Failed to add team member.");
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
                            className="w-full max-w-md rounded-2xl border border-white/[0.08] bg-[#0a1225] shadow-2xl shadow-black/50"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-500/10">
                                        <UserPlus className="h-4 w-4 text-pink-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-semibold text-white">
                                            Add Team Member
                                        </h2>
                                        <p className="text-xs text-sx-text-subtle">
                                            Add a new member to your team
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
                                {/* Name */}
                                <div>
                                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={form.full_name}
                                        onChange={(e) => handleChange("full_name", e.target.value)}
                                        placeholder="John Doe"
                                        className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 text-sm text-white placeholder:text-sx-text-subtle outline-none transition-colors focus:border-white/[0.12] focus:bg-white/[0.04]"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => handleChange("email", e.target.value)}
                                        placeholder="john@example.com"
                                        className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 text-sm text-white placeholder:text-sx-text-subtle outline-none transition-colors focus:border-white/[0.12] focus:bg-white/[0.04]"
                                    />
                                </div>

                                {/* Phone + Role row */}
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                            Phone
                                        </label>
                                        <input
                                            type="tel"
                                            value={form.phone || ""}
                                            onChange={(e) => handleChange("phone", e.target.value)}
                                            placeholder="+91 98765 43210"
                                            className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 text-sm text-white placeholder:text-sx-text-subtle outline-none transition-colors focus:border-white/[0.12] focus:bg-white/[0.04]"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                            Role
                                        </label>
                                        <select
                                            value={form.role}
                                            onChange={(e) => handleChange("role", e.target.value as TeamRole)}
                                            className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 text-sm text-white outline-none transition-colors focus:border-white/[0.12] focus:bg-white/[0.04] appearance-none cursor-pointer"
                                        >
                                            <option value="team" className="bg-[#0c1222]">Team Member</option>
                                            <option value="admin" className="bg-[#0c1222]">Admin</option>
                                        </select>
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
                                        className="flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 px-5 text-sm font-medium text-white shadow-lg shadow-pink-500/20 transition-all hover:from-pink-500 hover:to-pink-400 hover:shadow-pink-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Adding...
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="h-4 w-4" />
                                                Add Member
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
