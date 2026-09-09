/* -------------------------------------------------------------------------- */
/*                          SITEMAP (Enhanced)                                 */
/*                                                                            */
/*  Sprint 4 — Module 9: Dynamic sitemap pulling blog posts from Supabase,    */
/*  plus all static marketing pages and service/portfolio pages.              */
/* -------------------------------------------------------------------------- */

import type { MetadataRoute } from "next";

import { createAdminClient } from "@/lib/supabase/server";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sentroxai.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    /* ── Static Pages ────────────────────────────────────────────────── */

    const staticRoutes: {
        route: string;
        changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
        priority: number;
    }[] = [
        { route: "", changeFrequency: "weekly", priority: 1 },
        { route: "/services", changeFrequency: "monthly", priority: 0.9 },
        { route: "/portfolio", changeFrequency: "monthly", priority: 0.9 },
        { route: "/pricing", changeFrequency: "monthly", priority: 0.8 },
        { route: "/about", changeFrequency: "monthly", priority: 0.8 },
        { route: "/contact", changeFrequency: "monthly", priority: 0.9 },
        { route: "/blog", changeFrequency: "weekly", priority: 0.9 },
        { route: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
        { route: "/terms", changeFrequency: "yearly", priority: 0.3 },
        { route: "/cookies", changeFrequency: "yearly", priority: 0.3 },
    ];

    const staticEntries: MetadataRoute.Sitemap = staticRoutes.map(
        ({ route, changeFrequency, priority }) => ({
            url: `${BASE_URL}${route}`,
            lastModified: new Date(),
            changeFrequency,
            priority,
        }),
    );

    /* ── Dynamic Blog Posts (from Supabase) ───────────────────────────── */

    let blogEntries: MetadataRoute.Sitemap = [];

    try {
        const supabase = createAdminClient();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: posts } = await (supabase
            .from("blog_posts")
            .select("slug, published_at, updated_at") as any)
            .eq("published", true)
            .order("published_at", { ascending: false });

        if (posts) {
            blogEntries = (posts as unknown as Array<{ slug: string; published_at: string | null; updated_at: string | null }>).map((post) => ({
                url: `${BASE_URL}/blog/${post.slug}`,
                lastModified: new Date(post.updated_at || post.published_at || ""),
                changeFrequency: "monthly" as const,
                priority: 0.7,
            }));
        }
    } catch (error) {
        // Fallback: If Supabase fails, import static blog data
        console.error("⚠️ Sitemap: Failed to fetch dynamic blog posts:", error);

        try {
            const { blogPosts } = await import("@/components/blog/blogData");
            blogEntries = blogPosts.map((post) => ({
                url: `${BASE_URL}/blog/${post.slug}`,
                lastModified: new Date(post.publishedAt),
                changeFrequency: "monthly" as const,
                priority: 0.7,
            }));
        } catch {
            // Skip blog entries if both methods fail
        }
    }

    return [...staticEntries, ...blogEntries];
}
