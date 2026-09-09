"use client";

/* -------------------------------------------------------------------------- */
/*                      ADMIN BLOG CMS PAGE                                   */
/*                                                                            */
/*  Sprint 3 — Module 7: Full blog content management.                       */
/*  Layout: Header → Stats → Filters → Table → Drawer / Modal               */
/* -------------------------------------------------------------------------- */

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { PenSquare, RefreshCw, FilePlus } from "lucide-react";
import AdminContainer from "@/components/admin/AdminContainer";
import AdminSection from "@/components/admin/overview/AdminSection";
import BlogStats from "@/components/admin/blog/BlogStats";
import BlogFilters from "@/components/admin/blog/BlogFilters";
import BlogTable from "@/components/admin/blog/BlogTable";
import BlogDetailDrawer from "@/components/admin/blog/BlogDetailDrawer";
import CreatePostModal from "@/components/admin/blog/CreatePostModal";
import {
    fetchBlogPosts,
    fetchBlogStats,
    togglePostPublished,
    deleteBlogPost,
    type BlogPost,
    type BlogFilters as BlogFiltersType,
    type BlogStatsData,
} from "@/app/actions/blog";

export default function BlogPage() {
    /* ── State ────────────────────────────────────────────────────────────── */
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [stats, setStats] = useState<BlogStatsData>({
        total: 0,
        published: 0,
        drafts: 0,
        tags: [],
    });
    const [filters, setFilters] = useState<BlogFiltersType>({
        status: "all",
        search: "",
        tag: "all",
        sort: "newest",
    });
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    /* ── Data fetching ────────────────────────────────────────────────────── */
    const loadData = useCallback(
        async (showLoader = false) => {
            if (showLoader) setLoading(true);
            setRefreshing(true);

            const [postsResult, statsResult] = await Promise.all([
                fetchBlogPosts(filters),
                fetchBlogStats(),
            ]);

            setPosts(postsResult.data);
            setStats(statsResult.data);
            setLoading(false);
            setRefreshing(false);
        },
        [filters],
    );

    useEffect(() => {
        loadData(true);
    }, [loadData]);

    /* ── Handlers ─────────────────────────────────────────────────────────── */
    const handleSelectPost = (post: BlogPost) => {
        setSelectedPost(post);
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setTimeout(() => setSelectedPost(null), 200);
    };

    const handleTogglePublished = async (id: string, published: boolean) => {
        const result = await togglePostPublished(id, published);
        if (result.success) {
            // Optimistic update
            setPosts((prev) =>
                prev.map((p) =>
                    p.id === id
                        ? {
                              ...p,
                              published,
                              published_at: published
                                  ? new Date().toISOString()
                                  : p.published_at,
                          }
                        : p,
                ),
            );
            if (selectedPost?.id === id) {
                setSelectedPost((prev) =>
                    prev
                        ? {
                              ...prev,
                              published,
                              published_at: published
                                  ? new Date().toISOString()
                                  : prev.published_at,
                          }
                        : null,
                );
            }
            // Refresh stats
            const statsResult = await fetchBlogStats();
            setStats(statsResult.data);
        }
    };

    const handleDelete = async (id: string) => {
        const result = await deleteBlogPost(id);
        if (result.success) {
            setPosts((prev) => prev.filter((p) => p.id !== id));
            if (selectedPost?.id === id) {
                handleCloseDrawer();
            }
            // Refresh stats
            const statsResult = await fetchBlogStats();
            setStats(statsResult.data);
        }
    };

    const handleFiltersChange = (newFilters: BlogFiltersType) => {
        setFilters(newFilters);
    };

    const handleCreateSuccess = () => {
        loadData(false);
    };

    /* ── Render ───────────────────────────────────────────────────────────── */
    return (
        <AdminContainer>
            {/* Page header */}
            <motion.div
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20">
                        <PenSquare className="h-5 w-5 text-orange-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Blog CMS</h1>
                        <p className="text-sm text-sx-text-muted">
                            Create and manage blog content
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCreateModalOpen(true)}
                        className="flex h-9 items-center gap-2 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 px-3 text-xs font-medium text-white shadow-lg shadow-orange-500/20 transition-all hover:from-orange-500 hover:to-orange-400 hover:shadow-orange-500/30"
                    >
                        <FilePlus className="h-3.5 w-3.5" />
                        New Post
                    </button>
                    <button
                        onClick={() => loadData(false)}
                        disabled={refreshing}
                        className="flex h-9 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 text-xs font-medium text-sx-text-muted transition-all hover:border-white/[0.12] hover:text-white disabled:opacity-50"
                    >
                        <RefreshCw
                            className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`}
                        />
                        Refresh
                    </button>
                </div>
            </motion.div>

            {/* Loading skeleton */}
            {loading ? (
                <LoadingSkeleton />
            ) : (
                <>
                    {/* Key Metrics */}
                    <AdminSection title="Content Overview" delay={0.05} className="mb-6">
                        <BlogStats stats={stats} />
                    </AdminSection>

                    {/* Filters + Table */}
                    <AdminSection title="All Posts" delay={0.1} className="mb-6">
                        <div className="space-y-4">
                            <BlogFilters
                                filters={filters}
                                onFiltersChange={handleFiltersChange}
                                totalResults={posts.length}
                                availableTags={stats.tags}
                            />
                            <BlogTable
                                posts={posts}
                                onSelectPost={handleSelectPost}
                                onTogglePublished={handleTogglePublished}
                                onDelete={handleDelete}
                            />
                        </div>
                    </AdminSection>
                </>
            )}

            {/* Detail drawer */}
            <BlogDetailDrawer
                post={selectedPost}
                open={drawerOpen}
                onClose={handleCloseDrawer}
                onTogglePublished={handleTogglePublished}
                onDelete={handleDelete}
            />

            {/* Create post modal */}
            <CreatePostModal
                open={createModalOpen}
                onClose={() => setCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />
        </AdminContainer>
    );
}

/* ── Loading Skeleton ────────────────────────────────────────────────────────── */

function LoadingSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div
                        key={i}
                        className="h-28 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
                    />
                ))}
            </div>
            <div className="h-24 rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
            <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                    <div
                        key={i}
                        className="h-16 rounded-xl border border-white/[0.06] bg-white/[0.02]"
                    />
                ))}
            </div>
        </div>
    );
}
