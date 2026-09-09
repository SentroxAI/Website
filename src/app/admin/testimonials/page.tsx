"use client";

/* -------------------------------------------------------------------------- */
/*                    ADMIN TESTIMONIALS PAGE                                 */
/*                                                                            */
/*  Sprint 3 — Module 9: Full testimonial management.                       */
/*  Layout: Header → Stats → Filters → Card Grid → Drawer / Modal           */
/* -------------------------------------------------------------------------- */

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Star, RefreshCw, Plus } from "lucide-react";
import AdminContainer from "@/components/admin/AdminContainer";
import AdminSection from "@/components/admin/overview/AdminSection";
import TestimonialStats from "@/components/admin/testimonials/TestimonialStats";
import TestimonialFilters from "@/components/admin/testimonials/TestimonialFilters";
import TestimonialGrid from "@/components/admin/testimonials/TestimonialGrid";
import TestimonialDetailDrawer from "@/components/admin/testimonials/TestimonialDetailDrawer";
import AddTestimonialModal from "@/components/admin/testimonials/AddTestimonialModal";
import {
    fetchTestimonials,
    fetchTestimonialStats,
    toggleTestimonialFeatured,
    deleteTestimonial,
    type Testimonial,
    type TestimonialFilters as TFilters,
    type TestimonialStatsData,
} from "@/app/actions/testimonials";

export default function TestimonialsPage() {
    /* ── State ────────────────────────────────────────────────────────────── */
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [stats, setStats] = useState<TestimonialStatsData>({
        total: 0,
        featured: 0,
        avgRating: 0,
        fiveStarCount: 0,
    });
    const [filters, setFilters] = useState<TFilters>({
        featured: "all",
        search: "",
        rating: "all",
        sort: "newest",
    });
    const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    /* ── Data fetching ────────────────────────────────────────────────────── */
    const loadData = useCallback(
        async (showLoader = false) => {
            if (showLoader) setLoading(true);
            setRefreshing(true);

            const [testimonialsResult, statsResult] = await Promise.all([
                fetchTestimonials(filters),
                fetchTestimonialStats(),
            ]);

            setTestimonials(testimonialsResult.data);
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
    const handleSelectTestimonial = (testimonial: Testimonial) => {
        setSelectedTestimonial(testimonial);
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
        setTimeout(() => setSelectedTestimonial(null), 200);
    };

    const handleToggleFeatured = async (id: string, is_featured: boolean) => {
        const result = await toggleTestimonialFeatured(id, is_featured);
        if (result.success) {
            setTestimonials((prev) =>
                prev.map((t) => (t.id === id ? { ...t, is_featured } : t)),
            );
            if (selectedTestimonial?.id === id) {
                setSelectedTestimonial((prev) => (prev ? { ...prev, is_featured } : null));
            }
            const statsResult = await fetchTestimonialStats();
            setStats(statsResult.data);
        }
    };

    const handleDelete = async (id: string) => {
        const result = await deleteTestimonial(id);
        if (result.success) {
            setTestimonials((prev) => prev.filter((t) => t.id !== id));
            if (selectedTestimonial?.id === id) handleCloseDrawer();
            const statsResult = await fetchTestimonialStats();
            setStats(statsResult.data);
        }
    };

    const handleFiltersChange = (newFilters: TFilters) => {
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
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                        <Star className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">Testimonials</h1>
                        <p className="text-sm text-sx-text-muted">Manage client reviews & feedback</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setAddModalOpen(true)}
                        className="flex h-9 items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-3 text-xs font-medium text-white shadow-lg shadow-amber-500/20 transition-all hover:from-amber-500 hover:to-amber-400 hover:shadow-amber-500/30"
                    >
                        <Plus className="h-3.5 w-3.5" />
                        Add Review
                    </button>
                    <button
                        onClick={() => loadData(false)}
                        disabled={refreshing}
                        className="flex h-9 items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 text-xs font-medium text-sx-text-muted transition-all hover:border-white/[0.12] hover:text-white disabled:opacity-50"
                    >
                        <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
                        Refresh
                    </button>
                </div>
            </motion.div>

            {loading ? (
                <LoadingSkeleton />
            ) : (
                <>
                    <AdminSection title="Review Overview" delay={0.05} className="mb-6">
                        <TestimonialStats stats={stats} />
                    </AdminSection>

                    <AdminSection title="All Testimonials" delay={0.1} className="mb-6">
                        <div className="space-y-4">
                            <TestimonialFilters
                                filters={filters}
                                onFiltersChange={handleFiltersChange}
                                totalResults={testimonials.length}
                            />
                            <TestimonialGrid
                                testimonials={testimonials}
                                onSelectTestimonial={handleSelectTestimonial}
                                onToggleFeatured={handleToggleFeatured}
                                onDelete={handleDelete}
                            />
                        </div>
                    </AdminSection>
                </>
            )}

            <TestimonialDetailDrawer
                testimonial={selectedTestimonial}
                open={drawerOpen}
                onClose={handleCloseDrawer}
                onToggleFeatured={handleToggleFeatured}
                onDelete={handleDelete}
            />

            <AddTestimonialModal
                open={addModalOpen}
                onClose={() => setAddModalOpen(false)}
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
                    <div key={i} className="h-28 rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
                ))}
            </div>
            <div className="h-24 rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-52 rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
                ))}
            </div>
        </div>
    );
}
