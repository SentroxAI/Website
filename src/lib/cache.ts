/* -------------------------------------------------------------------------- */
/*                      SERVER-SIDE CACHING UTILITIES                         */
/*                                                                            */
/*  Sprint 4 — Module 8: Performance optimization cache layer.                */
/*  Uses Next.js unstable_cache for server-side data caching with             */
/*  automatic revalidation, tag-based invalidation, and stale-while-         */
/*  revalidate patterns for Supabase queries.                                 */
/* -------------------------------------------------------------------------- */

import { unstable_cache } from "next/cache";
import { createAdminClient } from "@/lib/supabase/server";

/* ── Cache Configuration ───────────────────────────────────────────────────── */

/** Default revalidation times (in seconds). */
export const CACHE_TTL = {
    /** Short-lived: 30 seconds — live dashboard data. */
    SHORT: 30,
    /** Medium: 5 minutes — analytics, stats. */
    MEDIUM: 5 * 60,
    /** Long: 1 hour — blog posts, team, testimonials (rarely change). */
    LONG: 60 * 60,
    /** Very long: 24 hours — settings, plans, static data. */
    STATIC: 24 * 60 * 60,
};

/** Cache tag constants for targeted invalidation. */
export const CACHE_TAGS = {
    ANALYTICS: "analytics",
    BLOG: "blog",
    BLOG_POST: (slug: string) => `blog:${slug}`,
    CLIENTS: "clients",
    LEADS: "leads",
    PROJECTS: "projects",
    TEAM: "team",
    TESTIMONIALS: "testimonials",
    BILLING: "billing",
    PLANS: "plans",
    SETTINGS: "settings",
    DASHBOARD_STATS: "dashboard-stats",
} as const;

/* ── Cached Data Fetchers ──────────────────────────────────────────────────── */

/**
 * Cached dashboard stats (admin overview KPI cards).
 * Revalidates every 30 seconds.
 */
export const getCachedDashboardStats = unstable_cache(
    async () => {
        const supabase = createAdminClient();

        const [
            { count: totalClients },
            { count: totalProjects },
            { count: totalLeads },
            { count: activeProjects },
        ] = await Promise.all([
            supabase.from("clients").select("*", { count: "exact", head: true }),
            supabase.from("projects").select("*", { count: "exact", head: true }),
            supabase.from("leads").select("*", { count: "exact", head: true }),
            supabase
                .from("projects")
                .select("*", { count: "exact", head: true })
                .eq("status", "in_progress"),
        ]);

        return {
            totalClients: totalClients || 0,
            totalProjects: totalProjects || 0,
            totalLeads: totalLeads || 0,
            activeProjects: activeProjects || 0,
        };
    },
    ["dashboard-stats"],
    {
        revalidate: CACHE_TTL.SHORT,
        tags: [CACHE_TAGS.DASHBOARD_STATS],
    },
);

/**
 * Cached blog posts listing (public marketing site).
 * Revalidates every hour.
 */
export const getCachedBlogPosts = unstable_cache(
    async (limit?: number) => {
        const supabase = createAdminClient();

        let query = supabase
            .from("blog_posts")
            .select("*")
            .eq("published", true)
            .order("published_at", { ascending: false });

        if (limit) {
            query = query.limit(limit);
        }

        const { data, error } = await query;

        if (error) {
            console.error("❌ Cached blog fetch error:", error);
            return [];
        }

        return data || [];
    },
    ["blog-posts"],
    {
        revalidate: CACHE_TTL.LONG,
        tags: [CACHE_TAGS.BLOG],
    },
);

/**
 * Cached single blog post by slug.
 * Revalidates every hour.
 */
export const getCachedBlogPost = (slug: string) =>
    unstable_cache(
        async () => {
            const supabase = createAdminClient();

            const { data, error } = await supabase
                .from("blog_posts")
                .select("*")
                .eq("slug", slug)
                .eq("published", true)
                .single();

            if (error) return null;
            return data;
        },
        [`blog-post-${slug}`],
        {
            revalidate: CACHE_TTL.LONG,
            tags: [CACHE_TAGS.BLOG, CACHE_TAGS.BLOG_POST(slug)],
        },
    )();

/**
 * Cached team members (public about page).
 * Revalidates every hour.
 */
export const getCachedTeamMembers = unstable_cache(
    async () => {
        const supabase = createAdminClient();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error } = await (supabase.from("team_members" as any) as any)
            .select("*")
            .eq("active", true)
            .order("display_order", { ascending: true });

        if (error) {
            console.error("❌ Cached team fetch error:", error);
            return [];
        }

        return data || [];
    },
    ["team-members"],
    {
        revalidate: CACHE_TTL.LONG,
        tags: [CACHE_TAGS.TEAM],
    },
);

/**
 * Cached testimonials (public marketing site).
 * Revalidates every hour.
 */
export const getCachedTestimonials = unstable_cache(
    async () => {
        const supabase = createAdminClient();

        const { data, error } = await supabase
            .from("testimonials")
            .select("*")
            .eq("is_featured", true)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("❌ Cached testimonials fetch error:", error);
            return [];
        }

        return data || [];
    },
    ["testimonials"],
    {
        revalidate: CACHE_TTL.LONG,
        tags: [CACHE_TAGS.TESTIMONIALS],
    },
);

/**
 * Cached subscription plans (pricing page + billing).
 * Revalidates every 24 hours.
 */
export const getCachedPlans = unstable_cache(
    async () => {
        const supabase = createAdminClient();

        const { data, error } = await supabase
            .from("subscription_plans")
            .select("*")
            .eq("is_active", true)
            .order("sort_order", { ascending: true });

        if (error) {
            console.error("❌ Cached plans fetch error:", error);
            return [];
        }

        return data || [];
    },
    ["subscription-plans"],
    {
        revalidate: CACHE_TTL.STATIC,
        tags: [CACHE_TAGS.PLANS],
    },
);

/* ── Cache Invalidation Helpers ────────────────────────────────────────────── */

/**
 * Invalidate all caches matching a tag.
 * Call this after mutations (create/update/delete).
 *
 * Usage:
 * ```ts
 * import { revalidateTag } from "next/cache";
 * import { CACHE_TAGS } from "@/lib/cache";
 *
 * // After creating a blog post:
 * revalidateTag(CACHE_TAGS.BLOG);
 *
 * // After updating a specific blog post:
 * revalidateTag(CACHE_TAGS.BLOG_POST("my-slug"));
 * ```
 */

/* ── Generic Cache Wrapper ─────────────────────────────────────────────────── */

/**
 * Generic cache wrapper for any async function.
 * Wraps any Supabase query or async operation with caching.
 *
 * @example
 * ```ts
 * const data = await cachedQuery(
 *   "my-query",
 *   async () => {
 *     const supabase = createAdminClient();
 *     const { data } = await supabase.from("table").select("*");
 *     return data;
 *   },
 *   { revalidate: CACHE_TTL.MEDIUM, tags: ["my-tag"] }
 * );
 * ```
 */
export function cachedQuery<T>(
    key: string,
    fn: () => Promise<T>,
    options?: { revalidate?: number; tags?: string[] },
) {
    return unstable_cache(fn, [key], {
        revalidate: options?.revalidate ?? CACHE_TTL.MEDIUM,
        tags: options?.tags,
    })();
}
