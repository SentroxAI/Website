"use server";

/* -------------------------------------------------------------------------- */
/*                      BLOG SERVER ACTIONS                                   */
/*                                                                            */
/*  Sprint 3 — Module 7: CRUD operations for the blog_posts table.          */
/*  Posts join users (author_id) to surface the author name.                 */
/*  All actions run server-side and rely on RLS (admin-only policies).       */
/* -------------------------------------------------------------------------- */

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

/* ── Types ─────────────────────────────────────────────────────────────────── */

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string | null;
    cover_image: string | null;
    tags: string[];
    published: boolean;
    published_at: string | null;
    author_id: string;
    created_at: string;
    updated_at: string;
    users: {
        id: string;
        full_name: string;
        avatar_url: string | null;
    } | null;
}

export interface BlogFilters {
    status?: "all" | "published" | "draft";
    search?: string;
    tag?: string;
    sort?: "newest" | "oldest" | "title_asc" | "title_desc" | "recently_published";
}

export interface BlogStatsData {
    total: number;
    published: number;
    drafts: number;
    tags: string[];
}

export interface CreatePostData {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    cover_image?: string;
    tags?: string[];
    published?: boolean;
}

export interface UpdatePostData {
    title?: string;
    slug?: string;
    content?: string;
    excerpt?: string | null;
    cover_image?: string | null;
    tags?: string[];
    published?: boolean;
}

/* ── Fetch all blog posts ──────────────────────────────────────────────────── */

export async function fetchBlogPosts(filters?: BlogFilters): Promise<{
    data: BlogPost[];
    error: string | null;
}> {
    try {
        const supabase = await createClient();

        let query = supabase
            .from("blog_posts")
            .select("*, users!blog_posts_author_id_fkey(id, full_name, avatar_url)");

        // Status filter
        if (filters?.status === "published") {
            query = query.eq("published", true);
        } else if (filters?.status === "draft") {
            query = query.eq("published", false);
        }

        // Sorting
        switch (filters?.sort) {
            case "oldest":
                query = query.order("created_at", { ascending: true });
                break;
            case "title_asc":
                query = query.order("title", { ascending: true });
                break;
            case "title_desc":
                query = query.order("title", { ascending: false });
                break;
            case "recently_published":
                query = query.order("published_at", { ascending: false, nullsFirst: false });
                break;
            case "newest":
            default:
                query = query.order("created_at", { ascending: false });
                break;
        }

        const { data, error } = await query.returns<BlogPost[]>();

        if (error) {
            console.error("fetchBlogPosts error:", error.message);
            return { data: [], error: error.message };
        }

        let results = data || [];

        // Client-side search
        if (filters?.search && filters.search.trim()) {
            const term = filters.search.trim().toLowerCase();
            results = results.filter(
                (p) =>
                    p.title.toLowerCase().includes(term) ||
                    p.slug.toLowerCase().includes(term) ||
                    (p.excerpt && p.excerpt.toLowerCase().includes(term)) ||
                    p.users?.full_name.toLowerCase().includes(term),
            );
        }

        // Tag filter
        if (filters?.tag && filters.tag !== "all") {
            results = results.filter((p) =>
                p.tags.some((t) => t.toLowerCase() === filters.tag!.toLowerCase()),
            );
        }

        return { data: results, error: null };
    } catch (err) {
        console.error("fetchBlogPosts unexpected error:", err);
        return { data: [], error: "Failed to fetch blog posts" };
    }
}

/* ── Fetch a single post by ID ─────────────────────────────────────────────── */

export async function fetchBlogPostById(id: string): Promise<{
    data: BlogPost | null;
    error: string | null;
}> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("blog_posts")
            .select("*, users!blog_posts_author_id_fkey(id, full_name, avatar_url)")
            .eq("id", id)
            .returns<BlogPost[]>()
            .single();

        if (error) {
            console.error("fetchBlogPostById error:", error.message);
            return { data: null, error: error.message };
        }

        return { data: data as BlogPost, error: null };
    } catch (err) {
        console.error("fetchBlogPostById unexpected error:", err);
        return { data: null, error: "Failed to fetch blog post" };
    }
}

/* ── Fetch blog statistics ─────────────────────────────────────────────────── */

export async function fetchBlogStats(): Promise<{
    data: BlogStatsData;
    error: string | null;
}> {
    const emptyStats: BlogStatsData = {
        total: 0,
        published: 0,
        drafts: 0,
        tags: [],
    };

    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("blog_posts")
            .select("published, tags");

        if (error) {
            console.error("fetchBlogStats error:", error.message);
            return { data: emptyStats, error: error.message };
        }

        const posts = (data || []) as { published: boolean; tags: string[] }[];
        const total = posts.length;
        const published = posts.filter((p) => p.published).length;
        const drafts = total - published;

        // Collect unique tags
        const tagSet = new Set<string>();
        posts.forEach((p) => p.tags?.forEach((t) => tagSet.add(t)));
        const tags = Array.from(tagSet).sort();

        return {
            data: { total, published, drafts, tags },
            error: null,
        };
    } catch (err) {
        console.error("fetchBlogStats unexpected error:", err);
        return { data: emptyStats, error: "Failed to fetch blog stats" };
    }
}

/* ── Toggle publish status ─────────────────────────────────────────────────── */

export async function togglePostPublished(
    id: string,
    published: boolean,
): Promise<{ success: boolean; error: string | null }> {
    try {
        const supabase = await createClient();

        const { error } = await supabase
            .from("blog_posts")
            // @ts-expect-error — Supabase SDK generic inference gap: .update() resolves to 'never'
            .update({
                published,
                published_at: published ? new Date().toISOString() : null,
            })
            .eq("id", id);

        if (error) {
            console.error("togglePostPublished error:", error.message);
            return { success: false, error: error.message };
        }

        return { success: true, error: null };
    } catch (err) {
        console.error("togglePostPublished unexpected error:", err);
        return { success: false, error: "Failed to toggle publish status" };
    }
}

/* ── Update a post ─────────────────────────────────────────────────────────── */

export async function updateBlogPost(
    id: string,
    data: UpdatePostData,
): Promise<{ success: boolean; error: string | null }> {
    try {
        const supabase = await createClient();

        const updatePayload: Record<string, unknown> = {};
        if (data.title !== undefined) updatePayload.title = data.title;
        if (data.slug !== undefined) updatePayload.slug = data.slug;
        if (data.content !== undefined) updatePayload.content = data.content;
        if (data.excerpt !== undefined) updatePayload.excerpt = data.excerpt;
        if (data.cover_image !== undefined) updatePayload.cover_image = data.cover_image;
        if (data.tags !== undefined) updatePayload.tags = data.tags;
        if (data.published !== undefined) {
            updatePayload.published = data.published;
            if (data.published) {
                updatePayload.published_at = new Date().toISOString();
            }
        }

        const { error } = await supabase
            .from("blog_posts")
            // @ts-expect-error — Supabase SDK generic inference gap: .update() resolves to 'never'
            .update(updatePayload as any)
            .eq("id", id);

        if (error) {
            console.error("updateBlogPost error:", error.message);
            return { success: false, error: error.message };
        }

        return { success: true, error: null };
    } catch (err) {
        console.error("updateBlogPost unexpected error:", err);
        return { success: false, error: "Failed to update blog post" };
    }
}

/* ── Delete a post ─────────────────────────────────────────────────────────── */

export async function deleteBlogPost(
    id: string,
): Promise<{ success: boolean; error: string | null }> {
    try {
        const supabase = await createClient();

        const { error } = await supabase
            .from("blog_posts")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("deleteBlogPost error:", error.message);
            return { success: false, error: error.message };
        }

        return { success: true, error: null };
    } catch (err) {
        console.error("deleteBlogPost unexpected error:", err);
        return { success: false, error: "Failed to delete blog post" };
    }
}

/* ── Create a new post ─────────────────────────────────────────────────────── */

export async function createBlogPost(
    data: CreatePostData,
    authorId: string,
): Promise<{ success: boolean; error: string | null }> {
    try {
        const supabase = await createClient();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase.from("blog_posts") as any).insert({
            title: data.title,
            slug: data.slug,
            content: data.content || "",
            excerpt: data.excerpt || null,
            cover_image: data.cover_image || null,
            tags: data.tags || [],
            published: data.published || false,
            published_at: data.published ? new Date().toISOString() : null,
            author_id: authorId,
        });

        if (error) {
            console.error("createBlogPost error:", error.message);
            return { success: false, error: error.message };
        }

        return { success: true, error: null };
    } catch (err) {
        console.error("createBlogPost unexpected error:", err);
        return { success: false, error: "Failed to create blog post" };
    }
}
