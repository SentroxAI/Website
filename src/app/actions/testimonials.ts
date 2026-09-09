"use server";

/* -------------------------------------------------------------------------- */
/*                   TESTIMONIALS SERVER ACTIONS                              */
/*                                                                            */
/*  Sprint 3 — Module 9: CRUD for the testimonials table.                   */
/*  Standalone table — no FK joins required.                                 */
/* -------------------------------------------------------------------------- */

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";

/* ── Types ─────────────────────────────────────────────────────────────────── */

export type Testimonial = Tables<"testimonials">;

export interface TestimonialFilters {
    featured?: "all" | "featured" | "regular";
    search?: string;
    rating?: number | "all";
    sort?: "newest" | "oldest" | "rating_high" | "rating_low" | "name_asc";
}

export interface TestimonialStatsData {
    total: number;
    featured: number;
    avgRating: number;
    fiveStarCount: number;
}

export interface CreateTestimonialData {
    client_name: string;
    client_role: string;
    company: string;
    content: string;
    avatar_url?: string;
    rating: number;
    is_featured?: boolean;
}

/* ── Fetch all testimonials ────────────────────────────────────────────────── */

export async function fetchTestimonials(filters?: TestimonialFilters): Promise<{
    data: Testimonial[];
    error: string | null;
}> {
    try {
        const supabase = await createClient();

        let query = supabase.from("testimonials").select("*");

        // Featured filter
        if (filters?.featured === "featured") {
            query = query.eq("is_featured", true);
        } else if (filters?.featured === "regular") {
            query = query.eq("is_featured", false);
        }

        // Rating filter
        if (filters?.rating && filters.rating !== "all") {
            query = query.eq("rating", filters.rating);
        }

        // Sorting
        switch (filters?.sort) {
            case "oldest":
                query = query.order("created_at", { ascending: true });
                break;
            case "rating_high":
                query = query.order("rating", { ascending: false });
                break;
            case "rating_low":
                query = query.order("rating", { ascending: true });
                break;
            case "name_asc":
                query = query.order("client_name", { ascending: true });
                break;
            case "newest":
            default:
                query = query.order("created_at", { ascending: false });
                break;
        }

        const { data, error } = await query;

        if (error) {
            console.error("fetchTestimonials error:", error.message);
            return { data: [], error: error.message };
        }

        let results = (data || []) as Testimonial[];

        // Client-side search
        if (filters?.search && filters.search.trim()) {
            const term = filters.search.trim().toLowerCase();
            results = results.filter(
                (t) =>
                    t.client_name.toLowerCase().includes(term) ||
                    t.company.toLowerCase().includes(term) ||
                    t.content.toLowerCase().includes(term) ||
                    t.client_role.toLowerCase().includes(term),
            );
        }

        return { data: results, error: null };
    } catch (err) {
        console.error("fetchTestimonials unexpected error:", err);
        return { data: [], error: "Failed to fetch testimonials" };
    }
}

/* ── Fetch testimonial statistics ──────────────────────────────────────────── */

export async function fetchTestimonialStats(): Promise<{
    data: TestimonialStatsData;
    error: string | null;
}> {
    const emptyStats: TestimonialStatsData = {
        total: 0,
        featured: 0,
        avgRating: 0,
        fiveStarCount: 0,
    };

    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("testimonials")
            .select("rating, is_featured");

        if (error) {
            console.error("fetchTestimonialStats error:", error.message);
            return { data: emptyStats, error: error.message };
        }

        const items = (data || []) as { rating: number; is_featured: boolean }[];
        const total = items.length;
        const featured = items.filter((t) => t.is_featured).length;
        const totalRating = items.reduce((sum, t) => sum + t.rating, 0);
        const avgRating = total > 0 ? Math.round((totalRating / total) * 10) / 10 : 0;
        const fiveStarCount = items.filter((t) => t.rating === 5).length;

        return {
            data: { total, featured, avgRating, fiveStarCount },
            error: null,
        };
    } catch (err) {
        console.error("fetchTestimonialStats unexpected error:", err);
        return { data: emptyStats, error: "Failed to fetch testimonial stats" };
    }
}

/* ── Toggle featured status ────────────────────────────────────────────────── */

export async function toggleTestimonialFeatured(
    id: string,
    is_featured: boolean,
): Promise<{ success: boolean; error: string | null }> {
    try {
        const supabase = await createClient();

        const { error } = await supabase
            .from("testimonials")
            // @ts-expect-error — Supabase SDK generic inference gap
            .update({ is_featured } as any)
            .eq("id", id);

        if (error) {
            console.error("toggleTestimonialFeatured error:", error.message);
            return { success: false, error: error.message };
        }

        return { success: true, error: null };
    } catch (err) {
        console.error("toggleTestimonialFeatured unexpected error:", err);
        return { success: false, error: "Failed to toggle featured status" };
    }
}

/* ── Delete a testimonial ──────────────────────────────────────────────────── */

export async function deleteTestimonial(
    id: string,
): Promise<{ success: boolean; error: string | null }> {
    try {
        const supabase = await createClient();

        const { error } = await supabase
            .from("testimonials")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("deleteTestimonial error:", error.message);
            return { success: false, error: error.message };
        }

        return { success: true, error: null };
    } catch (err) {
        console.error("deleteTestimonial unexpected error:", err);
        return { success: false, error: "Failed to delete testimonial" };
    }
}

/* ── Create a testimonial ──────────────────────────────────────────────────── */

export async function createTestimonial(
    data: CreateTestimonialData,
): Promise<{ success: boolean; error: string | null }> {
    try {
        const supabase = await createClient();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase.from("testimonials") as any).insert({
            client_name: data.client_name,
            client_role: data.client_role,
            company: data.company,
            content: data.content,
            avatar_url: data.avatar_url || null,
            rating: data.rating,
            is_featured: data.is_featured || false,
        });

        if (error) {
            console.error("createTestimonial error:", error.message);
            return { success: false, error: error.message };
        }

        return { success: true, error: null };
    } catch (err) {
        console.error("createTestimonial unexpected error:", err);
        return { success: false, error: "Failed to create testimonial" };
    }
}
