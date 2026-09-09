"use server";

/* -------------------------------------------------------------------------- */
/*                    ANALYTICS SERVER ACTIONS                                */
/*                                                                            */
/*  Sprint 3 — Module 8: Aggregation queries across all tables.              */
/*  Pulls data from leads, clients, projects, blog_posts, users.             */
/* -------------------------------------------------------------------------- */

import { createClient } from "@/lib/supabase/server";

/* ── Types ─────────────────────────────────────────────────────────────────── */

export interface AnalyticsKPI {
    totalLeads: number;
    totalClients: number;
    totalProjects: number;
    totalPosts: number;
    totalTeam: number;
    totalRevenue: number;
    conversionRate: number;
    avgProjectProgress: number;
}

export interface LeadsBySource {
    source: string;
    count: number;
    color: string;
}

export interface LeadsByStatus {
    status: string;
    count: number;
}

export interface ProjectsByStatus {
    status: string;
    count: number;
    color: string;
}

export interface MonthlyData {
    month: string;
    leads: number;
    clients: number;
    projects: number;
}

export interface ContentMetrics {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    totalTags: number;
    avgWordsPerPost: number;
    topTags: { tag: string; count: number }[];
}

export interface AnalyticsData {
    kpi: AnalyticsKPI;
    leadsBySource: LeadsBySource[];
    leadsByStatus: LeadsByStatus[];
    projectsByStatus: ProjectsByStatus[];
    monthlyTrends: MonthlyData[];
    contentMetrics: ContentMetrics;
}

/* ── Source color map ──────────────────────────────────────────────────────── */

const sourceColors: Record<string, string> = {
    website: "#6366f1",
    referral: "#8b5cf6",
    social_media: "#ec4899",
    linkedin: "#0ea5e9",
    cold_outreach: "#f59e0b",
    google: "#10b981",
    other: "#64748b",
};

const projectStatusColors: Record<string, string> = {
    active: "#8b5cf6",
    completed: "#10b981",
    pending: "#f59e0b",
    cancelled: "#ef4444",
};

/* ── Fetch all analytics ───────────────────────────────────────────────────── */

export async function fetchAnalytics(): Promise<{
    data: AnalyticsData;
    error: string | null;
}> {
    const empty: AnalyticsData = {
        kpi: {
            totalLeads: 0,
            totalClients: 0,
            totalProjects: 0,
            totalPosts: 0,
            totalTeam: 0,
            totalRevenue: 0,
            conversionRate: 0,
            avgProjectProgress: 0,
        },
        leadsBySource: [],
        leadsByStatus: [],
        projectsByStatus: [],
        monthlyTrends: [],
        contentMetrics: {
            totalPosts: 0,
            publishedPosts: 0,
            draftPosts: 0,
            totalTags: 0,
            avgWordsPerPost: 0,
            topTags: [],
        },
    };

    try {
        const supabase = await createClient();

        // Parallel queries
        const [leadsRes, clientsRes, projectsRes, postsRes, teamRes] = await Promise.all([
            supabase.from("leads").select("id, status, source, created_at"),
            supabase.from("clients").select("id, status, created_at"),
            supabase.from("projects").select("id, status, progress, budget, created_at"),
            supabase.from("blog_posts").select("id, published, tags, content, created_at"),
            supabase.from("users").select("id, role").in("role", ["admin", "team"]),
        ]);

        const leads = (leadsRes.data || []) as { id: string; status: string; source: string; created_at: string }[];
        const clients = (clientsRes.data || []) as { id: string; status: string; created_at: string }[];
        const projects = (projectsRes.data || []) as { id: string; status: string; progress: number; budget: number | null; created_at: string }[];
        const posts = (postsRes.data || []) as { id: string; published: boolean; tags: string[]; content: string; created_at: string }[];
        const team = (teamRes.data || []) as { id: string; role: string }[];

        /* ── KPIs ─────────────────────────────────────────────────────────── */
        const totalLeads = leads.length;
        const totalClients = clients.length;
        const totalProjects = projects.length;
        const totalPosts = posts.length;
        const totalTeam = team.length;
        const totalRevenue = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
        const conversionRate = totalLeads > 0 ? Math.round((totalClients / totalLeads) * 100) : 0;
        const avgProjectProgress = totalProjects > 0
            ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / totalProjects)
            : 0;

        const kpi: AnalyticsKPI = {
            totalLeads,
            totalClients,
            totalProjects,
            totalPosts,
            totalTeam,
            totalRevenue,
            conversionRate,
            avgProjectProgress,
        };

        /* ── Leads by source ──────────────────────────────────────────────── */
        const sourceMap = new Map<string, number>();
        leads.forEach((l) => {
            const src = l.source || "other";
            sourceMap.set(src, (sourceMap.get(src) || 0) + 1);
        });
        const leadsBySource: LeadsBySource[] = Array.from(sourceMap.entries())
            .map(([source, count]) => ({
                source,
                count,
                color: sourceColors[source] || sourceColors.other,
            }))
            .sort((a, b) => b.count - a.count);

        /* ── Leads by status ──────────────────────────────────────────────── */
        const statusMap = new Map<string, number>();
        leads.forEach((l) => {
            statusMap.set(l.status, (statusMap.get(l.status) || 0) + 1);
        });
        const leadsByStatus: LeadsByStatus[] = Array.from(statusMap.entries())
            .map(([status, count]) => ({ status, count }))
            .sort((a, b) => b.count - a.count);

        /* ── Projects by status ───────────────────────────────────────────── */
        const projStatusMap = new Map<string, number>();
        projects.forEach((p) => {
            projStatusMap.set(p.status, (projStatusMap.get(p.status) || 0) + 1);
        });
        const projectsByStatus: ProjectsByStatus[] = Array.from(projStatusMap.entries())
            .map(([status, count]) => ({
                status,
                count,
                color: projectStatusColors[status] || "#64748b",
            }))
            .sort((a, b) => b.count - a.count);

        /* ── Monthly trends (last 6 months) ───────────────────────────────── */
        const now = new Date();
        const monthlyTrends: MonthlyData[] = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            const monthLabel = date.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });

            const monthLeads = leads.filter((l) => l.created_at.startsWith(monthKey)).length;
            const monthClients = clients.filter((c) => c.created_at.startsWith(monthKey)).length;
            const monthProjects = projects.filter((p) => p.created_at.startsWith(monthKey)).length;

            monthlyTrends.push({
                month: monthLabel,
                leads: monthLeads,
                clients: monthClients,
                projects: monthProjects,
            });
        }

        /* ── Content metrics ──────────────────────────────────────────────── */
        const publishedPosts = posts.filter((p) => p.published).length;
        const draftPosts = totalPosts - publishedPosts;
        const tagCountMap = new Map<string, number>();
        posts.forEach((p) => p.tags?.forEach((t) => tagCountMap.set(t, (tagCountMap.get(t) || 0) + 1)));
        const totalTags = tagCountMap.size;
        const topTags = Array.from(tagCountMap.entries())
            .map(([tag, count]) => ({ tag, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);
        const totalWords = posts.reduce((sum, p) => sum + (p.content?.trim().split(/\s+/).filter(Boolean).length || 0), 0);
        const avgWordsPerPost = totalPosts > 0 ? Math.round(totalWords / totalPosts) : 0;

        const contentMetrics: ContentMetrics = {
            totalPosts,
            publishedPosts,
            draftPosts,
            totalTags,
            avgWordsPerPost,
            topTags,
        };

        return {
            data: { kpi, leadsBySource, leadsByStatus, projectsByStatus, monthlyTrends, contentMetrics },
            error: null,
        };
    } catch (err) {
        console.error("fetchAnalytics unexpected error:", err);
        return { data: empty, error: "Failed to fetch analytics" };
    }
}
