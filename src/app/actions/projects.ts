"use server";

/* -------------------------------------------------------------------------- */
/*                      PROJECT SERVER ACTIONS                                */
/*                                                                            */
/*  Sprint 3 — Module 5: CRUD operations for the projects table.             */
/*  All actions run server-side and rely on RLS (admin-only policies).        */
/*  Projects join clients → users to surface the client contact info.        */
/* -------------------------------------------------------------------------- */

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";

/* ── Types ─────────────────────────────────────────────────────────────────── */

export type ProjectStatus = "active" | "completed" | "cancelled" | "pending";

/** Project row joined with client + user contact info */
export interface ProjectWithClient {
    id: string;
    title: string;
    description: string | null;
    service: string;
    status: string;
    progress: number;
    budget: number | null;
    start_date: string | null;
    due_date: string | null;
    client_id: string;
    created_at: string;
    updated_at: string;
    clients: {
        id: string;
        company: string;
        industry: string | null;
        users: {
            id: string;
            full_name: string;
            email: string;
            avatar_url: string | null;
        } | null;
    } | null;
}

export interface ProjectFilters {
    status?: ProjectStatus | "all";
    search?: string;
    service?: string;
    sort?: "newest" | "oldest" | "title_asc" | "title_desc" | "due_soonest" | "budget_high" | "budget_low";
}

export interface ProjectStatsData {
    total: number;
    active: number;
    completed: number;
    pending: number;
    cancelled: number;
    avgProgress: number;
    totalBudget: number;
}

export interface CreateProjectData {
    title: string;
    description?: string;
    service: string;
    client_id: string;
    budget?: number;
    start_date?: string;
    due_date?: string;
}

/* ── Fetch all projects with optional filters ──────────────────────────────── */

export async function fetchProjects(filters?: ProjectFilters): Promise<{
    data: ProjectWithClient[];
    error: string | null;
}> {
    try {
        const supabase = await createClient();

        let query = supabase
            .from("projects")
            .select("*, clients!projects_client_id_fkey(id, company, industry, users!clients_user_id_fkey(id, full_name, email, avatar_url))");

        // Status filter
        if (filters?.status && filters.status !== "all") {
            query = query.eq("status", filters.status);
        }

        // Service filter
        if (filters?.service && filters.service !== "all") {
            query = query.eq("service", filters.service);
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
            case "due_soonest":
                query = query.order("due_date", { ascending: true, nullsFirst: false });
                break;
            case "budget_high":
                query = query.order("budget", { ascending: false, nullsFirst: false });
                break;
            case "budget_low":
                query = query.order("budget", { ascending: true, nullsFirst: false });
                break;
            case "newest":
            default:
                query = query.order("created_at", { ascending: false });
                break;
        }

        const { data, error } = await query.returns<ProjectWithClient[]>();

        if (error) {
            console.error("fetchProjects error:", error.message);
            return { data: [], error: error.message };
        }

        let results = data || [];

        // Client-side search filter (across joined fields)
        if (filters?.search && filters.search.trim()) {
            const term = filters.search.trim().toLowerCase();
            results = results.filter(
                (p) =>
                    p.title.toLowerCase().includes(term) ||
                    p.clients?.company.toLowerCase().includes(term) ||
                    p.clients?.users?.full_name.toLowerCase().includes(term) ||
                    p.service.toLowerCase().includes(term),
            );
        }

        return { data: results, error: null };
    } catch (err) {
        console.error("fetchProjects unexpected error:", err);
        return { data: [], error: "Failed to fetch projects" };
    }
}

/* ── Fetch a single project by ID ──────────────────────────────────────────── */

export async function fetchProjectById(id: string): Promise<{
    data: ProjectWithClient | null;
    error: string | null;
}> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("projects")
            .select("*, clients!projects_client_id_fkey(id, company, industry, users!clients_user_id_fkey(id, full_name, email, avatar_url))")
            .eq("id", id)
            .returns<ProjectWithClient[]>()
            .single();

        if (error) {
            console.error("fetchProjectById error:", error.message);
            return { data: null, error: error.message };
        }

        return { data: data as ProjectWithClient, error: null };
    } catch (err) {
        console.error("fetchProjectById unexpected error:", err);
        return { data: null, error: "Failed to fetch project" };
    }
}

/* ── Fetch project statistics ──────────────────────────────────────────────── */

export async function fetchProjectStats(): Promise<{
    data: ProjectStatsData;
    error: string | null;
}> {
    const emptyStats: ProjectStatsData = {
        total: 0,
        active: 0,
        completed: 0,
        pending: 0,
        cancelled: 0,
        avgProgress: 0,
        totalBudget: 0,
    };

    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("projects")
            .select("status, progress, budget")
            .returns<{ status: string; progress: number; budget: number | null }[]>();

        if (error) {
            console.error("fetchProjectStats error:", error.message);
            return { data: emptyStats, error: error.message };
        }

        const projects = data || [];
        const total = projects.length;

        const counts = projects.reduce(
            (acc, p) => {
                const status = p.status as ProjectStatus;
                if (status in acc) {
                    acc[status]++;
                }
                return acc;
            },
            { active: 0, completed: 0, pending: 0, cancelled: 0 } as Record<ProjectStatus, number>,
        );

        const totalProgress = projects.reduce((sum, p) => sum + (p.progress || 0), 0);
        const avgProgress = total > 0 ? Math.round(totalProgress / total) : 0;

        const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);

        return {
            data: { total, ...counts, avgProgress, totalBudget },
            error: null,
        };
    } catch (err) {
        console.error("fetchProjectStats unexpected error:", err);
        return { data: emptyStats, error: "Failed to fetch project stats" };
    }
}

/* ── Update project status ─────────────────────────────────────────────────── */

export async function updateProjectStatus(
    id: string,
    status: ProjectStatus,
): Promise<{ success: boolean; error: string | null }> {
    try {
        const supabase = await createClient();

        // If completed, set progress to 100
        const updateData: Record<string, unknown> = { status };
        if (status === "completed") {
            updateData.progress = 100;
        }

        const { error } = await supabase
            .from("projects")
            // @ts-expect-error — Supabase SDK generic inference gap
            .update(updateData as any)
            .eq("id", id);

        if (error) {
            console.error("updateProjectStatus error:", error.message);
            return { success: false, error: error.message };
        }

        return { success: true, error: null };
    } catch (err) {
        console.error("updateProjectStatus unexpected error:", err);
        return { success: false, error: "Failed to update project status" };
    }
}

/* ── Update project progress ───────────────────────────────────────────────── */

export async function updateProjectProgress(
    id: string,
    progress: number,
): Promise<{ success: boolean; error: string | null }> {
    try {
        const supabase = await createClient();

        const clamped = Math.min(100, Math.max(0, progress));

        const { error } = await supabase
            .from("projects")
            // @ts-expect-error — Supabase SDK generic inference gap
            .update({ progress: clamped } as any)
            .eq("id", id);

        if (error) {
            console.error("updateProjectProgress error:", error.message);
            return { success: false, error: error.message };
        }

        return { success: true, error: null };
    } catch (err) {
        console.error("updateProjectProgress unexpected error:", err);
        return { success: false, error: "Failed to update project progress" };
    }
}

/* ── Delete a project ──────────────────────────────────────────────────────── */

export async function deleteProject(
    id: string,
): Promise<{ success: boolean; error: string | null }> {
    try {
        const supabase = await createClient();

        const { error } = await supabase
            .from("projects")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("deleteProject error:", error.message);
            return { success: false, error: error.message };
        }

        return { success: true, error: null };
    } catch (err) {
        console.error("deleteProject unexpected error:", err);
        return { success: false, error: "Failed to delete project" };
    }
}

/* ── Create a new project ──────────────────────────────────────────────────── */

export async function createNewProject(
    data: CreateProjectData,
): Promise<{ success: boolean; error: string | null }> {
    try {
        const supabase = await createClient();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase.from("projects") as any).insert({
            title: data.title,
            description: data.description || null,
            service: data.service,
            client_id: data.client_id,
            budget: data.budget || null,
            start_date: data.start_date || null,
            due_date: data.due_date || null,
            status: "pending",
            progress: 0,
        });

        if (error) {
            console.error("createNewProject error:", error.message);
            return { success: false, error: error.message };
        }

        return { success: true, error: null };
    } catch (err) {
        console.error("createNewProject unexpected error:", err);
        return { success: false, error: "Failed to create project" };
    }
}

/* ── Fetch clients for dropdown ────────────────────────────────────────────── */
/*  Used in the AddProjectModal to pick which client the project is for       */

export async function fetchClientsForDropdown(): Promise<{
    data: { id: string; company: string; userName: string }[];
    error: string | null;
}> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("clients")
            .select("id, company, users!clients_user_id_fkey(full_name)")
            .eq("status", "active")
            .order("company", { ascending: true })
            .returns<{ id: string; company: string; users: { full_name: string } | null }[]>();

        if (error) {
            console.error("fetchClientsForDropdown error:", error.message);
            return { data: [], error: error.message };
        }

        const mapped = (data || []).map((c) => ({
            id: c.id,
            company: c.company,
            userName: c.users?.full_name || "Unknown",
        }));

        return { data: mapped, error: null };
    } catch (err) {
        console.error("fetchClientsForDropdown unexpected error:", err);
        return { data: [], error: "Failed to fetch clients" };
    }
}
