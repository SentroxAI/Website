"use client";

/* -------------------------------------------------------------------------- */
/*                          BLOG TABLE                                        */
/*                                                                            */
/*  Main data table for the blog CMS with title, author, tags, status,       */
/*  publish date, and action menus.                                          */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import {
    MoreHorizontal,
    Eye,
    EyeOff,
    Trash2,
    PenSquare,
    Calendar,
    User,
    Tags,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { BlogPost } from "@/app/actions/blog";
import BlogStatusBadge from "./BlogStatusBadge";

interface BlogTableProps {
    posts: BlogPost[];
    onSelectPost: (post: BlogPost) => void;
    onTogglePublished: (id: string, published: boolean) => void;
    onDelete: (id: string) => void;
}

export default function BlogTable({
    posts,
    onSelectPost,
    onTogglePublished,
    onDelete,
}: BlogTableProps) {
    if (posts.length === 0) {
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
                                Title
                            </th>
                            <th className="hidden lg:table-cell px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                Author
                            </th>
                            <th className="hidden xl:table-cell px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                Tags
                            </th>
                            <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                Status
                            </th>
                            <th className="hidden lg:table-cell px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                Date
                            </th>
                            <th className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post, index) => (
                            <PostRow
                                key={post.id}
                                post={post}
                                index={index}
                                onSelect={() => onSelectPost(post)}
                                onTogglePublished={onTogglePublished}
                                onDelete={onDelete}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile card list */}
            <div className="md:hidden divide-y divide-white/[0.06]">
                {posts.map((post, index) => (
                    <PostCard
                        key={post.id}
                        post={post}
                        index={index}
                        onSelect={() => onSelectPost(post)}
                    />
                ))}
            </div>
        </motion.div>
    );
}

/* ── Table Row ──────────────────────────────────────────────────────────────── */

function PostRow({
    post,
    index,
    onSelect,
    onTogglePublished,
    onDelete,
}: {
    post: BlogPost;
    index: number;
    onSelect: () => void;
    onTogglePublished: (id: string, published: boolean) => void;
    onDelete: (id: string) => void;
}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const authorName = post.users?.full_name || "Unknown";
    const displayDate = post.published && post.published_at
        ? new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
        : new Date(post.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

    return (
        <motion.tr
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: index * 0.03 }}
            onClick={onSelect}
            className="group cursor-pointer border-b border-white/[0.03] transition-colors hover:bg-white/[0.03] last:border-b-0"
        >
            {/* Title */}
            <td className="px-4 py-3.5">
                <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white max-w-[280px]">
                        {post.title}
                    </p>
                    <p className="truncate text-xs text-sx-text-subtle max-w-[280px] font-mono">
                        /{post.slug}
                    </p>
                </div>
            </td>

            {/* Author */}
            <td className="hidden lg:table-cell px-4 py-3.5">
                <div className="flex items-center gap-2">
                    {post.users?.avatar_url ? (
                        <img
                            src={post.users.avatar_url}
                            alt={authorName}
                            className="h-6 w-6 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500/10 text-[10px] font-bold text-orange-300">
                            {authorName.charAt(0)}
                        </div>
                    )}
                    <span className="text-sm text-sx-text-muted">{authorName}</span>
                </div>
            </td>

            {/* Tags */}
            <td className="hidden xl:table-cell px-4 py-3.5">
                <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {post.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="rounded-md bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-sx-text-muted"
                        >
                            {tag}
                        </span>
                    ))}
                    {post.tags.length > 3 && (
                        <span className="text-[10px] text-sx-text-subtle">
                            +{post.tags.length - 3}
                        </span>
                    )}
                </div>
            </td>

            {/* Status */}
            <td className="px-4 py-3.5">
                <BlogStatusBadge published={post.published} />
            </td>

            {/* Date */}
            <td className="hidden lg:table-cell px-4 py-3.5">
                <span className="text-xs text-sx-text-muted">{displayDate}</span>
            </td>

            {/* Actions */}
            <td className="px-4 py-3.5 text-right">
                <div ref={menuRef} className="relative inline-block">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setMenuOpen(!menuOpen);
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-sx-text-subtle opacity-0 transition-all group-hover:opacity-100 hover:bg-white/[0.06] hover:text-white"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {menuOpen && (
                        <div className="absolute right-0 top-full z-50 mt-1 min-w-[170px] rounded-xl border border-white/[0.08] bg-[#0c1222] p-1 shadow-xl shadow-black/30">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuOpen(false);
                                    onSelect();
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-sx-text-muted hover:bg-white/[0.04] hover:text-white transition-colors"
                            >
                                <PenSquare className="h-3.5 w-3.5" />
                                View / Edit
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuOpen(false);
                                    onTogglePublished(post.id, !post.published);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-sx-text-muted hover:bg-white/[0.04] hover:text-white transition-colors"
                            >
                                {post.published ? (
                                    <>
                                        <EyeOff className="h-3.5 w-3.5" />
                                        Unpublish
                                    </>
                                ) : (
                                    <>
                                        <Eye className="h-3.5 w-3.5" />
                                        Publish
                                    </>
                                )}
                            </button>
                            <div className="my-1 h-px bg-white/[0.06]" />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuOpen(false);
                                    onDelete(post.id);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete post
                            </button>
                        </div>
                    )}
                </div>
            </td>
        </motion.tr>
    );
}

/* ── Mobile Card ────────────────────────────────────────────────────────────── */

function PostCard({
    post,
    index,
    onSelect,
}: {
    post: BlogPost;
    index: number;
    onSelect: () => void;
}) {
    const authorName = post.users?.full_name || "Unknown";
    const displayDate = post.published && post.published_at
        ? new Date(post.published_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
        : new Date(post.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.04 }}
            onClick={onSelect}
            className="cursor-pointer p-4 transition-colors hover:bg-white/[0.03]"
        >
            <div className="flex items-start justify-between mb-2">
                <div className="min-w-0 flex-1">
                    <p className="font-medium text-white truncate">{post.title}</p>
                    <p className="text-xs text-sx-text-subtle font-mono truncate">/{post.slug}</p>
                </div>
                <BlogStatusBadge published={post.published} />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-sx-text-muted">
                <span className="flex items-center gap-1">
                    <User className="h-3 w-3 text-sx-text-subtle" />
                    {authorName}
                </span>
                <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-sx-text-subtle" />
                    {displayDate}
                </span>
                {post.tags.length > 0 && (
                    <span className="flex items-center gap-1">
                        <Tags className="h-3 w-3 text-sx-text-subtle" />
                        {post.tags.slice(0, 2).join(", ")}
                        {post.tags.length > 2 && ` +${post.tags.length - 2}`}
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
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-500/10 mb-4">
                <PenSquare className="h-6 w-6 text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">No posts found</h3>
            <p className="mt-1.5 text-sm text-sx-text-muted text-center max-w-sm">
                No blog posts match your current filters. Try adjusting your search or status filters.
            </p>
        </motion.div>
    );
}
