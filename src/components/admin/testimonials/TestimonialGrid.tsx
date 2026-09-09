"use client";

/* -------------------------------------------------------------------------- */
/*                      TESTIMONIAL CARDS GRID                                */
/*                                                                            */
/*  Card-based layout for testimonials (not a table — better for reviews).   */
/*  Shows quote, rating stars, client info, featured badge, and actions.     */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import {
    MoreHorizontal,
    Award,
    Trash2,
    Eye,
    Star as StarIcon,
    MessageSquareQuote,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/app/actions/testimonials";
import StarRating from "./StarRating";

interface TestimonialGridProps {
    testimonials: Testimonial[];
    onSelectTestimonial: (testimonial: Testimonial) => void;
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

export default function TestimonialGrid({
    testimonials,
    onSelectTestimonial,
    onToggleFeatured,
    onDelete,
}: TestimonialGridProps) {
    if (testimonials.length === 0) {
        return <EmptyState />;
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
        >
            {testimonials.map((item, index) => (
                <TestimonialCard
                    key={item.id}
                    testimonial={item}
                    index={index}
                    onSelect={() => onSelectTestimonial(item)}
                    onToggleFeatured={onToggleFeatured}
                    onDelete={onDelete}
                />
            ))}
        </motion.div>
    );
}

/* ── Card ────────────────────────────────────────────────────────────────────── */

function TestimonialCard({
    testimonial,
    index,
    onSelect,
    onToggleFeatured,
    onDelete,
}: {
    testimonial: Testimonial;
    index: number;
    onSelect: () => void;
    onToggleFeatured: (id: string, featured: boolean) => void;
    onDelete: (id: string) => void;
}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
            onClick={onSelect}
            className={cn(
                "group relative cursor-pointer rounded-2xl border bg-white/[0.02] p-5 transition-all hover:bg-white/[0.04]",
                testimonial.is_featured
                    ? "border-amber-500/20 shadow-lg shadow-amber-500/5"
                    : "border-white/[0.06] hover:border-white/[0.1]",
            )}
        >
            {/* Featured badge */}
            {testimonial.is_featured && (
                <div className="absolute -top-2 right-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                        <Award className="h-3 w-3" />
                        Featured
                    </span>
                </div>
            )}

            {/* Top row: rating + actions */}
            <div className="flex items-center justify-between mb-3">
                <StarRating rating={testimonial.rating} />
                <div ref={menuRef} className="relative">
                    <button
                        onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-sx-text-subtle opacity-0 transition-all group-hover:opacity-100 hover:bg-white/[0.06] hover:text-white"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </button>
                    {menuOpen && (
                        <div className="absolute right-0 top-full z-50 mt-1 min-w-[170px] rounded-xl border border-white/[0.08] bg-[#0c1222] p-1 shadow-xl shadow-black/30">
                            <button
                                onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onSelect(); }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-sx-text-muted hover:bg-white/[0.04] hover:text-white transition-colors"
                            >
                                <Eye className="h-3.5 w-3.5" />
                                View details
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuOpen(false);
                                    onToggleFeatured(testimonial.id, !testimonial.is_featured);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-sx-text-muted hover:bg-white/[0.04] hover:text-white transition-colors"
                            >
                                <Award className="h-3.5 w-3.5" />
                                {testimonial.is_featured ? "Remove from featured" : "Add to featured"}
                            </button>
                            <div className="my-1 h-px bg-white/[0.06]" />
                            <button
                                onClick={(e) => { e.stopPropagation(); setMenuOpen(false); onDelete(testimonial.id); }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Quote */}
            <p className="text-sm leading-relaxed text-sx-text-muted mb-4 line-clamp-4">
                &ldquo;{testimonial.content}&rdquo;
            </p>

            {/* Client info */}
            <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
                {testimonial.avatar_url ? (
                    <img src={testimonial.avatar_url} alt={testimonial.client_name} className="h-9 w-9 rounded-xl object-cover" />
                ) : (
                    <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xs font-bold", getAvatarGradient(testimonial.client_name), getAvatarTextColor(testimonial.client_name))}>
                        {getInitials(testimonial.client_name)}
                    </div>
                )}
                <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white truncate">{testimonial.client_name}</p>
                    <p className="text-xs text-sx-text-subtle truncate">
                        {testimonial.client_role} · {testimonial.company}
                    </p>
                </div>
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
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 mb-4">
                <MessageSquareQuote className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">No testimonials found</h3>
            <p className="mt-1.5 text-sm text-sx-text-muted text-center max-w-sm">
                No reviews match your current filters. Try adjusting your search or filters.
            </p>
        </motion.div>
    );
}
