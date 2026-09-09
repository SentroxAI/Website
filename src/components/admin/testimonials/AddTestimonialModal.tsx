"use client";

/* -------------------------------------------------------------------------- */
/*                   ADD TESTIMONIAL MODAL                                    */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquareQuote, Loader2 } from "lucide-react";
import { createTestimonial, type CreateTestimonialData } from "@/app/actions/testimonials";
import StarRating from "./StarRating";

interface AddTestimonialModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AddTestimonialModal({
    open,
    onClose,
    onSuccess,
}: AddTestimonialModalProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState<CreateTestimonialData>({
        client_name: "",
        client_role: "",
        company: "",
        content: "",
        rating: 5,
        is_featured: false,
    });

    const handleChange = (field: keyof CreateTestimonialData, value: string | number | boolean) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (error) setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.client_name.trim()) return setError("Client name is required.");
        if (!form.client_role.trim()) return setError("Client role is required.");
        if (!form.company.trim()) return setError("Company is required.");
        if (!form.content.trim()) return setError("Testimonial content is required.");

        setLoading(true);
        setError(null);

        const result = await createTestimonial(form);

        if (result.success) {
            setForm({ client_name: "", client_role: "", company: "", content: "", rating: 5, is_featured: false });
            onSuccess();
            onClose();
        } else {
            setError(result.error || "Failed to create testimonial.");
        }

        setLoading(false);
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                    />

                    <motion.div
                        key="modal"
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#0a1225] shadow-2xl shadow-black/50" onClick={(e) => e.stopPropagation()}>
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10">
                                        <MessageSquareQuote className="h-4 w-4 text-amber-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-semibold text-white">Add Testimonial</h2>
                                        <p className="text-xs text-sx-text-subtle">Add a new client review</p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-sx-text-subtle hover:bg-white/[0.06] hover:text-white transition-colors">
                                    <X className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                                {/* Client Name */}
                                <div>
                                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">Client Name *</label>
                                    <input type="text" value={form.client_name} onChange={(e) => handleChange("client_name", e.target.value)} placeholder="John Doe" className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 text-sm text-white placeholder:text-sx-text-subtle outline-none transition-colors focus:border-white/[0.12] focus:bg-white/[0.04]" />
                                </div>

                                {/* Client Role */}
                                <div>
                                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">Role / Title *</label>
                                    <input type="text" value={form.client_role} onChange={(e) => handleChange("client_role", e.target.value)} placeholder="CEO, CTO, Founder..." className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 text-sm text-white placeholder:text-sx-text-subtle outline-none transition-colors focus:border-white/[0.12] focus:bg-white/[0.04]" />
                                </div>

                                {/* Company */}
                                <div>
                                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">Company *</label>
                                    <input type="text" value={form.company} onChange={(e) => handleChange("company", e.target.value)} placeholder="Acme Inc." className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 text-sm text-white placeholder:text-sx-text-subtle outline-none transition-colors focus:border-white/[0.12] focus:bg-white/[0.04]" />
                                </div>

                                {/* Rating */}
                                <div>
                                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">Rating</label>
                                    <div className="flex items-center gap-3">
                                        <StarRating rating={form.rating} size="lg" interactive onChange={(r) => handleChange("rating", r)} />
                                        <span className="text-sm font-medium text-white">{form.rating}/5</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div>
                                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">Testimonial *</label>
                                    <textarea value={form.content} onChange={(e) => handleChange("content", e.target.value)} placeholder="What the client said about your work..." rows={4} className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm text-white placeholder:text-sx-text-subtle outline-none transition-colors focus:border-white/[0.12] focus:bg-white/[0.04] resize-none" />
                                </div>

                                {/* Featured toggle */}
                                <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                                    <div>
                                        <p className="text-sm font-medium text-white">Feature this testimonial</p>
                                        <p className="text-[10px] text-sx-text-subtle">Highlighted on the website</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleChange("is_featured", !form.is_featured)}
                                        className={`relative h-6 w-11 rounded-full transition-colors ${form.is_featured ? "bg-amber-500" : "bg-white/[0.1]"}`}
                                    >
                                        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.is_featured ? "left-[22px]" : "left-0.5"}`} />
                                    </button>
                                </div>

                                {/* Error */}
                                {error && (
                                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-red-400 bg-red-500/10 rounded-lg px-3 py-2">
                                        {error}
                                    </motion.p>
                                )}

                                {/* Actions */}
                                <div className="flex items-center justify-end gap-3 pt-2">
                                    <button type="button" onClick={onClose} className="flex h-10 items-center rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 text-sm font-medium text-sx-text-muted transition-all hover:border-white/[0.12] hover:text-white">
                                        Cancel
                                    </button>
                                    <button type="submit" disabled={loading} className="flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-5 text-sm font-medium text-white shadow-lg shadow-amber-500/20 transition-all hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 disabled:cursor-not-allowed">
                                        {loading ? (
                                            <><Loader2 className="h-4 w-4 animate-spin" />Adding...</>
                                        ) : (
                                            <><MessageSquareQuote className="h-4 w-4" />Add Testimonial</>
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
