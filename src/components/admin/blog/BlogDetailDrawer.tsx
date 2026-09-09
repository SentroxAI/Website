"use client";

/* -------------------------------------------------------------------------- */
/*                    BLOG POST DETAIL DRAWER                                 */
/*                                                                            */
/*  Slide-over panel showing post details, content preview, tag editing,     */
/*  publish toggle, and action buttons.                                      */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Calendar,
    User,
    Tags,
    Eye,
    EyeOff,
    Trash2,
    FileText,
    Link2,
    Clock,
    PenSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/app/actions/blog";
import BlogStatusBadge from "./BlogStatusBadge";

interface BlogDetailDrawerProps {
    post: BlogPost | null;
    open: boolean;
    onClose: () => void;
    onTogglePublished: (id: string, published: boolean) => void;
    onDelete: (id: string) => void;
}

function formatDate(d: string | null, long = false): string {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-IN", {
        day: "numeric",
        month: long ? "long" : "short",
        year: "numeric",
    });
}

function formatTime(d: string | null): string {
    if (!d) return "";
    return new Date(d).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function wordCount(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length;
}

function readingTime(text: string): string {
    const words = wordCount(text);
    const minutes = Math.max(1, Math.round(words / 200));
    return `${minutes} min read`;
}

export default function BlogDetailDrawer({
    post,
    open,
    onClose,
    onTogglePublished,
    onDelete,
}: BlogDetailDrawerProps) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    if (!post) return null;

    const authorName = post.users?.full_name || "Unknown";
    const words = wordCount(post.content);

    const handleDelete = () => {
        if (confirmDelete) {
            onDelete(post.id);
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
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20">
                                    <PenSquare className="h-4 w-4 text-orange-300" />
                                </div>
                                <div className="min-w-0">
                                    <h2 className="text-base font-semibold text-white truncate">
                                        {post.title}
                                    </h2>
                                    <p className="text-xs text-sx-text-subtle font-mono truncate">
                                        /{post.slug}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sx-text-subtle hover:bg-white/[0.06] hover:text-white transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                            {/* Status + Publish toggle */}
                            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-sx-text-subtle">
                                        Status
                                    </p>
                                    <BlogStatusBadge published={post.published} size="md" />
                                </div>

                                <button
                                    onClick={() => onTogglePublished(post.id, !post.published)}
                                    className={cn(
                                        "flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-all",
                                        post.published
                                            ? "border-amber-500/20 bg-amber-500/5 text-amber-400 hover:bg-amber-500/10"
                                            : "border-emerald-500/20 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10",
                                    )}
                                >
                                    {post.published ? (
                                        <>
                                            <EyeOff className="h-4 w-4" />
                                            Unpublish Post
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="h-4 w-4" />
                                            Publish Post
                                        </>
                                    )}
                                </button>

                                {post.published_at && (
                                    <p className="mt-2 text-[10px] text-sx-text-subtle text-center">
                                        Published on {formatDate(post.published_at, true)} at {formatTime(post.published_at)}
                                    </p>
                                )}
                            </div>

                            {/* Post Meta */}
                            <section>
                                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-sx-text-subtle">
                                    Post Details
                                </h3>
                                <div className="space-y-2.5">
                                    <InfoRow
                                        icon={<User className="h-4 w-4" />}
                                        label="Author"
                                        value={authorName}
                                    />
                                    <InfoRow
                                        icon={<Calendar className="h-4 w-4" />}
                                        label="Created"
                                        value={formatDate(post.created_at, true)}
                                    />
                                    <InfoRow
                                        icon={<Clock className="h-4 w-4" />}
                                        label="Last Updated"
                                        value={formatDate(post.updated_at, true)}
                                    />
                                    <InfoRow
                                        icon={<FileText className="h-4 w-4" />}
                                        label="Word Count"
                                        value={`${words.toLocaleString()} words · ${readingTime(post.content)}`}
                                    />
                                    <InfoRow
                                        icon={<Link2 className="h-4 w-4" />}
                                        label="Slug"
                                        value={`/${post.slug}`}
                                    />
                                </div>
                            </section>

                            {/* Tags */}
                            {post.tags.length > 0 && (
                                <section>
                                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-sx-text-subtle">
                                        <Tags className="inline h-3.5 w-3.5 mr-1.5 -mt-0.5" />
                                        Tags
                                    </h3>
                                    <div className="flex flex-wrap gap-1.5">
                                        {post.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-lg bg-orange-500/10 px-2.5 py-1 text-xs font-medium text-orange-400"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Excerpt */}
                            {post.excerpt && (
                                <section>
                                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-sx-text-subtle">
                                        Excerpt
                                    </h3>
                                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                                        <p className="text-sm leading-relaxed text-sx-text-muted">
                                            {post.excerpt}
                                        </p>
                                    </div>
                                </section>
                            )}

                            {/* Content preview */}
                            <section>
                                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-sx-text-subtle">
                                    Content Preview
                                </h3>
                                <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 max-h-[300px] overflow-y-auto">
                                    <div className="text-sm leading-relaxed text-sx-text-muted whitespace-pre-wrap">
                                        {post.content.length > 2000
                                            ? post.content.slice(0, 2000) + "..."
                                            : post.content}
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Footer actions */}
                        <div className="border-t border-white/[0.06] px-6 py-4">
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => onTogglePublished(post.id, !post.published)}
                                    className={cn(
                                        "flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium shadow-lg transition-all",
                                        post.published
                                            ? "bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-amber-500/20 hover:from-amber-500 hover:to-amber-400"
                                            : "bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-orange-500/20 hover:from-orange-500 hover:to-orange-400",
                                    )}
                                >
                                    {post.published ? (
                                        <>
                                            <EyeOff className="h-4 w-4" />
                                            Unpublish
                                        </>
                                    ) : (
                                        <>
                                            <Eye className="h-4 w-4" />
                                            Publish
                                        </>
                                    )}
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

/* ── Info Row ────────────────────────────────────────────────────────────────── */

function InfoRow({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-white/[0.02]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-sx-text-subtle">
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-[10px] font-medium uppercase tracking-wider text-sx-text-subtle">
                    {label}
                </p>
                <span className="text-sm text-white">{value}</span>
            </div>
        </div>
    );
}
