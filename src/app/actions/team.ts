"use server";

/* -------------------------------------------------------------------------- */
/*                      TEAM SERVER ACTIONS                                   */
/*                                                                            */
/*  Sprint 3 — Module 6: CRUD operations for team members (users table).     */
/*  Team members are users with role 'admin' or 'team'.                      */
/*  All actions run server-side and rely on RLS (admin-only policies).       */
/* -------------------------------------------------------------------------- */

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";

/* ── Types ─────────────────────────────────────────────────────────────────── */

export type TeamMember = Tables<"users">;

export type TeamRole = "admin" | "team";

export interface TeamFilters {
    role?: TeamRole | "all";
    search?: string;
    sort?: "newest" | "oldest" | "name_asc" | "name_desc";
}

export interface TeamStatsData {
    total: number;
    admins: number;
    teamMembers: number;
}

export interface CreateTeamMemberData {
    full_name: string;
    email: string;
    phone?: string;
    role: TeamRole;
}

export interface UpdateTeamMemberData {
    full_name?: string;
    email?: string;
    phone?: string | null;
    role?: TeamRole;
}

/* ── Fetch all team members ────────────────────────────────────────────────── */

export async function fetchTeamMembers(filters?: TeamFilters): Promise<{
    data: TeamMember[];
    error: string | null;
}> {
    try {
        const supabase = await createClient();

        let query = supabase
            .from("users")
            .select("*")
            .in("role", ["admin", "team"]);

        // Role filter
        if (filters?.role && filters.role !== "all") {
            query = supabase
                .from("users")
                .select("*")
                .eq("role", filters.role);
        }

        // Sorting
        switch (filters?.sort) {
            case "oldest":
                query = query.order("created_at", { ascending: true });
                break;
            case "name_asc":
                query = query.order("full_name", { ascending: true });
                break;
            case "name_desc":
                query = query.order("full_name", { ascending: false });
                break;
            case "newest":
            default:
                query = query.order("created_at", { ascending: false });
                break;
        }

        const { data, error } = await query;

        if (error) {
            console.error("fetchTeamMembers error:", error.message);
            return { data: [], error: error.message };
        }

        let results = (data || []) as TeamMember[];

        // Client-side search filter
        if (filters?.search && filters.search.trim()) {
            const term = filters.search.trim().toLowerCase();
            results = results.filter(
                (m) =>
                    m.full_name.toLowerCase().includes(term) ||
                    m.email.toLowerCase().includes(term) ||
                    (m.phone && m.phone.includes(term)),
            );
        }

        return { data: results, error: null };
    } catch (err) {
        console.error("fetchTeamMembers unexpected error:", err);
        return { data: [], error: "Failed to fetch team members" };
    }
}

/* ── Fetch team statistics ─────────────────────────────────────────────────── */

export async function fetchTeamStats(): Promise<{
    data: TeamStatsData;
    error: string | null;
}> {
    const emptyStats: TeamStatsData = {
        total: 0,
        admins: 0,
        teamMembers: 0,
    };

    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("users")
            .select("role")
            .in("role", ["admin", "team"]);

        if (error) {
            console.error("fetchTeamStats error:", error.message);
            return { data: emptyStats, error: error.message };
        }

        const members = (data || []) as { role: string }[];
        const total = members.length;
        const admins = members.filter((m) => m.role === "admin").length;
        const teamMembers = members.filter((m) => m.role === "team").length;

        return {
            data: { total, admins, teamMembers },
            error: null,
        };
    } catch (err) {
        console.error("fetchTeamStats unexpected error:", err);
        return { data: emptyStats, error: "Failed to fetch team stats" };
    }
}

/* ── Update team member role ───────────────────────────────────────────────── */

export async function updateTeamMemberRole(
    id: string,
    role: TeamRole,
): Promise<{ success: boolean; error: string | null }> {
    try {
        const supabase = await createClient();

        const { error } = await supabase
            .from("users")
            // @ts-expect-error — Supabase SDK generic inference gap
            .update({ role } as any)
            .eq("id", id);

        if (error) {
            console.error("updateTeamMemberRole error:", error.message);
            return { success: false, error: error.message };
        }

        return { success: true, error: null };
    } catch (err) {
        console.error("updateTeamMemberRole unexpected error:", err);
        return { success: false, error: "Failed to update role" };
    }
}

/* ── Update team member details ────────────────────────────────────────────── */

export async function updateTeamMember(
    id: string,
    data: UpdateTeamMemberData,
): Promise<{ success: boolean; error: string | null }> {
    try {
        const supabase = await createClient();

        const updatePayload: Record<string, unknown> = {};
        if (data.full_name !== undefined) updatePayload.full_name = data.full_name;
        if (data.email !== undefined) updatePayload.email = data.email;
        if (data.phone !== undefined) updatePayload.phone = data.phone;
        if (data.role !== undefined) updatePayload.role = data.role as string;

        const { error } = await supabase
            .from("users")
            // @ts-expect-error — Supabase SDK generic inference gap
            .update(updatePayload as any)
            .eq("id", id);

        if (error) {
            console.error("updateTeamMember error:", error.message);
            return { success: false, error: error.message };
        }

        return { success: true, error: null };
    } catch (err) {
        console.error("updateTeamMember unexpected error:", err);
        return { success: false, error: "Failed to update team member" };
    }
}

/* ── Remove team member ────────────────────────────────────────────────────── */
/*  Downgrades role to "client" rather than hard-deleting the user record.    */

export async function removeTeamMember(
    id: string,
): Promise<{ success: boolean; error: string | null }> {
    try {
        const supabase = await createClient();

        const { error } = await supabase
            .from("users")
            // @ts-expect-error — Supabase SDK generic inference gap
            .update({ role: "client" } as any)
            .eq("id", id);

        if (error) {
            console.error("removeTeamMember error:", error.message);
            return { success: false, error: error.message };
        }

        return { success: true, error: null };
    } catch (err) {
        console.error("removeTeamMember unexpected error:", err);
        return { success: false, error: "Failed to remove team member" };
    }
}

/* ── Add team member ───────────────────────────────────────────────────────── */
/*  Uses admin client (service role) to insert a user with role 'team'.       */

export async function addTeamMember(
    data: CreateTeamMemberData,
): Promise<{ success: boolean; error: string | null }> {
    try {
        const admin = createAdminClient();

        const userId = crypto.randomUUID();

        const { error } = await admin.from("users").insert({
            id: userId,
            full_name: data.full_name,
            email: data.email,
            phone: data.phone || null,
            role: data.role,
        });

        if (error) {
            console.error("addTeamMember error:", error.message);
            return { success: false, error: error.message };
        }

        return { success: true, error: null };
    } catch (err) {
        console.error("addTeamMember unexpected error:", err);
        return { success: false, error: "Failed to add team member" };
    }
}
