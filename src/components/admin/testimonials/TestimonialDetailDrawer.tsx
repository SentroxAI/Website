"use client";

/* -------------------------------------------------------------------------- */
/*                  TESTIMONIAL DETAIL DRAWER                                 */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Calendar,
    Building2,
    Briefcase,
    Award,
    Trash2,
    Quote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/app/actions/testimonials";
import StarRating from "./StarRating";

interface TestimonialDetailDrawerProps {
    testimonial: Testimonial | null;
    open: boolean;
    onClose: () => void;
    onToggleFeatured: (id: string, featured: boolean) => void;
    onDelete: (id: string) => void;
}

function getInitials(name: string): string {
    return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function getAvatarGradient(name: string): string {
    const gradients = [
        "from-amber-500/20 to-orange-500/20",
        "from-violet-500/20 to-purple-500/20",
        "from-blue-500/20 to-cyan-500/20",
        "from-emerald-500/20 to-teal-500/20",
        "from-pink-500/20 to-rose-500/20",
        "from-sky-500/20 to-indigo-500/20",
    ];
    const idx = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % gradients.length;
    return gradients[idx];
}

function getAvatarTextColor(name: string): string {
    const colors = ["text-amber-300", "text-violet-300", "text-blue-300", "text-emerald-300", "text-pink-300", "text-sky-300"];
    const idx = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % colors.length;
    return colors[idx];
}

export default function TestimonialDetailDrawer({
    testimonial,
    open,
    onClose,
    onToggleFeatured,
    onDelete,
}: TestimonialDetailDrawerProps) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    if (!testimonial) return null;

    const createdDate = new Date(testimonial.created_at).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const handleDelete = () => {
        if (confirmDelete) {
            onDelete(testimonial.id);
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
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                    />

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
                                {testimonial.avatar_url ? (
                                    <img src={testimonial.avatar_url} alt={testimonial.client_name} className="h-10 w-10 rounded-xl object-cover" />
                                ) : (
                                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-bold", getAvatarGradient(testimonial.client_name), getAvatarTextColor(testimonial.client_name))}>
                                        {getInitials(testimonial.client_name)}
                                    </div>
                                )}
                                <div>
                                    <h2 className="text-base font-semibold text-white">{testimonial.client_name}</h2>
                                    <p className="text-xs text-sx-text-subtle">Testimonial Details</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-sx-text-subtle hover:bg-white/[0.06] hover:text-white transition-colors">
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                            {/* Rating + Featured */}
                            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-sx-text-subtle">Rating</p>
                                    {testimonial.is_featured && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                                            <Award className="h-3 w-3" />
                                            Featured
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3">
                                    <StarRating rating={testimonial.rating} size="lg" />
                                    <span className="text-lg font-bold text-white">{testimonial.rating}/5</span>
                                </div>

                                <button
                                    onClick={() => onToggleFeatured(testimonial.id, !testimonial.is_featured)}
                                    className={cn(
                                        "mt-3 flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all",
                                        testimonial.is_featured
                                            ? "border-white/[0.08] bg-white/[0.02] text-sx-text-muted hover:text-white"
                                            : "border-amber-500/20 bg-amber-500/5 text-amber-400 hover:bg-amber-500/10",
                                    )}
                                >
                                    <Award className="h-4 w-4" />
                                    {testimonial.is_featured ? "Remove from Featured" : "Add to Featured"}
                                </button>
                            </div>

                            {/* Quote */}
                            <section>
                                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-sx-text-subtle">
                                    <Quote className="inline h-3.5 w-3.5 mr-1 -mt-0.5" />
                                    Testimonial
                                </h3>
                                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                                    <p className="text-sm leading-relaxed text-white/90 italic">
                                        &ldquo;{testimonial.content}&rdquo;
                                    </p>
                                </div>
                            </section>

                            {/* Client Info */}
                            <section>
                                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-sx-text-subtle">
                                    Client Information
                                </h3>
                                <div className="space-y-2.5">
                                    <InfoRow icon={<Briefcase className="h-4 w-4" />} label="Role" value={testimonial.client_role} />
                                    <InfoRow icon={<Building2 className="h-4 w-4" />} label="Company" value={testimonial.company} />
                                    <InfoRow icon={<Calendar className="h-4 w-4" />} label="Added" value={createdDate} />
                                </div>
                            </section>
                        </div>

                        {/* Footer */}
                        <div className="border-t border-white/[0.06] px-6 py-4">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => onToggleFeatured(testimonial.id, !testimonial.is_featured)}
                                    className={cn(
                                        "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium shadow-lg transition-all",
                                        testimonial.is_featured
                                            ? "bg-gradient-to-r from-white/[0.08] to-white/[0.04] text-white shadow-none border border-white/[0.06]"
                                            : "bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-amber-500/20 hover:from-amber-500 hover:to-amber-400",
                                    )}
                                >
                                    <Award className="h-4 w-4" />
                                    {testimonial.is_featured ? "Unfeature" : "Feature"}
                                </button>
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

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-white/[0.02]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-sx-text-subtle">{icon}</div>
            <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium uppercase tracking-wider text-sx-text-subtle">{label}</p>
                <span className="text-sm text-white">{value}</span>
            </div>
        </div>
    );
}
