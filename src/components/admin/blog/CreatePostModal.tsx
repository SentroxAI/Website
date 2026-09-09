"use client";

/* -------------------------------------------------------------------------- */
/*                     CREATE BLOG POST MODAL                                 */
/*                                                                            */
/*  Glassmorphism modal for creating a new blog post with title, slug        */
/*  (auto-generated), excerpt, tags, content, and publish toggle.            */
/* -------------------------------------------------------------------------- */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, PenSquare, Loader2, Tags, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { createBlogPost, type CreatePostData } from "@/app/actions/blog";
import { useAuthContext } from "@/providers/AuthProvider";

interface CreatePostModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

export default function CreatePostModal({
    open,
    onClose,
    onSuccess,
}: CreatePostModalProps) {
    const { profile } = useAuthContext();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [tagInput, setTagInput] = useState("");
    const [form, setForm] = useState<CreatePostData>({
        title: "",
        slug: "",
        content: "",
        excerpt: "",
        tags: [],
        published: false,
    });

    // Auto-generate slug from title
    useEffect(() => {
        if (form.title) {
            setForm((prev) => ({ ...prev, slug: slugify(prev.title) }));
        }
    }, [form.title]);

    const handleChange = (field: keyof CreatePostData, value: string | boolean | string[]) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (error) setError(null);
    };

    const handleAddTag = () => {
        const tag = tagInput.trim();
        if (tag && !(form.tags || []).includes(tag)) {
            handleChange("tags", [...(form.tags || []), tag]);
        }
        setTagInput("");
    };

    const handleRemoveTag = (tag: string) => {
        handleChange("tags", (form.tags || []).filter((t) => t !== tag));
    };

    const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.title.trim()) {
            setError("Title is required.");
            return;
        }
        if (!form.slug.trim()) {
            setError("Slug is required.");
            return;
        }

        if (!profile?.id) {
            setError("Unable to determine author. Please refresh and try again.");
            return;
        }

        setLoading(true);
        setError(null);

        const result = await createBlogPost(form, profile.id);

        if (result.success) {
            setForm({
                title: "",
                slug: "",
                content: "",
                excerpt: "",
                tags: [],
                published: false,
            });
            setTagInput("");
            onSuccess();
            onClose();
        } else {
            setError(result.error || "Failed to create post.");
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
                            className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/[0.08] bg-[#0a1225] shadow-2xl shadow-black/50"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.06] bg-[#0a1225] px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10">
                                        <PenSquare className="h-4 w-4 text-orange-400" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-semibold text-white">
                                            Create Post
                                        </h2>
                                        <p className="text-xs text-sx-text-subtle">
                                            Write a new blog post
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
                                <div>
                                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={(e) => handleChange("title", e.target.value)}
                                        placeholder="My Awesome Blog Post"
                                        className="h-10 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 text-sm text-white placeholder:text-sx-text-subtle outline-none transition-colors focus:border-white/[0.12] focus:bg-white/[0.04]"
                                    />
                                </div>

                                {/* Slug */}
                                <div>
                                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                        Slug *
                                    </label>
                                    <div className="flex items-center h-10 rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                                        <span className="px-3 text-xs text-sx-text-subtle border-r border-white/[0.06]">
                                            /blog/
                                        </span>
                                        <input
                                            type="text"
                                            value={form.slug}
                                            onChange={(e) => handleChange("slug", slugify(e.target.value))}
                                            placeholder="my-awesome-blog-post"
                                            className="h-full flex-1 bg-transparent px-3 text-sm text-white placeholder:text-sx-text-subtle outline-none font-mono"
                                        />
                                    </div>
                                </div>

                                {/* Excerpt */}
                                <div>
                                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                        Excerpt
                                    </label>
                                    <textarea
                                        value={form.excerpt || ""}
                                        onChange={(e) => handleChange("excerpt", e.target.value)}
                                        placeholder="A brief summary of your post..."
                                        rows={2}
                                        className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm text-white placeholder:text-sx-text-subtle outline-none transition-colors focus:border-white/[0.12] focus:bg-white/[0.04] resize-none"
                                    />
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                        <Tags className="inline h-3 w-3 mr-1 -mt-0.5" />
                                        Tags
                                    </label>
                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                        {(form.tags || []).map((tag) => (
                                            <span
                                                key={tag}
                                                className="inline-flex items-center gap-1 rounded-lg bg-orange-500/10 px-2 py-0.5 text-xs font-medium text-orange-400"
                                            >
                                                {tag}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTag(tag)}
                                                    className="hover:text-red-400 transition-colors"
                                                >
                                                    <X className="h-3 w-3" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={handleTagKeyDown}
                                            placeholder="Add a tag and press Enter"
                                            className="h-9 flex-1 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 text-sm text-white placeholder:text-sx-text-subtle outline-none transition-colors focus:border-white/[0.12] focus:bg-white/[0.04]"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddTag}
                                            className="flex h-9 items-center rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 text-xs font-medium text-sx-text-muted hover:text-white transition-colors"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div>
                                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                                        Content
                                    </label>
                                    <textarea
                                        value={form.content}
                                        onChange={(e) => handleChange("content", e.target.value)}
                                        placeholder="Write your blog post content here..."
                                        rows={8}
                                        className="w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-sm text-white placeholder:text-sx-text-subtle outline-none transition-colors focus:border-white/[0.12] focus:bg-white/[0.04] resize-y font-mono leading-relaxed"
                                    />
                                    {form.content && (
                                        <p className="mt-1 text-[10px] text-sx-text-subtle tabular-nums">
                                            {form.content.trim().split(/\s+/).filter(Boolean).length} words
                                        </p>
                                    )}
                                </div>

                                {/* Publish toggle */}
                                <div className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        {form.published ? (
                                            <Eye className="h-4 w-4 text-emerald-400" />
                                        ) : (
                                            <EyeOff className="h-4 w-4 text-sx-text-subtle" />
                                        )}
                                        <div>
                                            <p className="text-sm font-medium text-white">
                                                {form.published ? "Publish immediately" : "Save as draft"}
                                            </p>
                                            <p className="text-[10px] text-sx-text-subtle">
                                                {form.published
                                                    ? "Post will be visible to the public"
                                                    : "Post will be saved but not visible"}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleChange("published", !form.published)}
                                        className={cn(
                                            "relative h-6 w-11 rounded-full transition-colors",
                                            form.published ? "bg-emerald-500" : "bg-white/[0.1]",
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                                                form.published ? "left-[22px]" : "left-0.5",
                                            )}
                                        />
                                    </button>
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
                                        className="flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-5 text-sm font-medium text-white shadow-lg shadow-orange-500/20 transition-all hover:from-orange-500 hover:to-orange-400 hover:shadow-orange-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            <>
                                                <PenSquare className="h-4 w-4" />
                                                {form.published ? "Publish Post" : "Save Draft"}
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
