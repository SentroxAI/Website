"use server";

/* -------------------------------------------------------------------------- */
/*                        LEAD SERVER ACTIONS                                 */
/*                                                                            */
/*  Sprint 3 — Module 3: CRUD operations for the leads table.                 */
/*  All actions run server-side and rely on RLS (admin-only policies).         */
/* -------------------------------------------------------------------------- */

import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";

/* ── Types ─────────────────────────────────────────────────────────────────── */

export type Lead = Tables<"leads">;

export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";

export interface LeadFilters {
    status?: LeadStatus | "all";
    search?: string;
    service?: string;
    sort?: "newest" | "oldest" | "name_asc" | "name_desc";
}

export interface LeadStatsData {
    total: number;
    new: number;
    contacted: number;
    qualified: number;
    converted: number;
    lost: number;
    conversionRate: number;
}

/* ── Fetch all leads with optional filters ─────────────────────────────────── */

export async function fetchLeads(filters?: LeadFilters): Promise<{
    data: Lead[];
    error: string | null;
}> {
    try {
        const supabase = await createClient();

        let query = supabase.from("leads").select("*");

        // Status filter
        if (filters?.status && filters.status !== "all") {
            query = query.eq("status", filters.status);
        }

        // Search filter (name, email, or company)
        if (filters?.search && filters.search.trim()) {
            const term = `%${filters.search.trim()}%`;
            query = query.or(`name.ilike.${term},email.ilike.${term},company.ilike.${term}`);
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
            case "name_asc":
                query = query.order("name", { ascending: true });
                break;
            case "name_desc":
                query = query.order("name", { ascending: false });
                break;
            case "newest":
            default:
                query = query.order("created_at", { ascending: false });
                break;
        }

        const { data, error } = await query;

        if (error) {
            console.error("fetchLeads error:", error.message);
            return { data: [], error: error.message };
        }

        return { data: data || [], error: null };
    } catch (err) {
        console.error("fetchLeads unexpected error:", err);
        return { data: [], error: "Failed to fetch leads" };
    }
}

/* ── Fetch a single lead by ID ─────────────────────────────────────────────── */

export async function fetchLeadById(id: string): Promise<{
    data: Lead | null;
    error: string | null;
}> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("leads")
            .select("*")
            .eq("id", id)
            .single<Lead>();

        if (error) {
            console.error("fetchLeadById error:", error.message);
            return { data: null, error: error.message };
        }

        return { data, error: null };
    } catch (err) {
        console.error("fetchLeadById unexpected error:", err);
        return { data: null, error: "Failed to fetch lead" };
    }
}

/* ── Fetch lead statistics ─────────────────────────────────────────────────── */

export async function fetchLeadStats(): Promise<{
    data: LeadStatsData;
    error: string | null;
}> {
    const emptyStats: LeadStatsData = {
        total: 0,
        new: 0,
        contacted: 0,
        qualified: 0,
        converted: 0,
        lost: 0,
        conversionRate: 0,
    };

    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("leads")
            .select("status")
            .returns<{ status: string }[]>();

        if (error) {
            console.error("fetchLeadStats error:", error.message);
            return { data: emptyStats, error: error.message };
        }

        const leads = data || [];
        const total = leads.length;

        const counts = leads.reduce(
            (acc, lead) => {
                const status = lead.status as LeadStatus;
                if (status in acc) {
                    acc[status]++;
                }
                return acc;
            },
            { new: 0, contacted: 0, qualified: 0, converted: 0, lost: 0 } as Record<LeadStatus, number>,
        );

        const conversionRate = total > 0 ? Math.round((counts.converted / total) * 100) : 0;

        return {
            data: { total, ...counts, conversionRate },
            error: null,
        };
    } catch (err) {
        console.error("fetchLeadStats unexpected error:", err);
        return { data: emptyStats, error: "Failed to fetch lead stats" };
    }
}

/* ── Update lead status ────────────────────────────────────────────────────── */

export async function updateLeadStatus(
    id: string,
    status: LeadStatus,
): Promise<{ success: boolean; error: string | null }> {
    try {
        const supabase = await createClient();

        const { error } = await supabase
            .from("leads")
            // @ts-expect-error — Supabase SDK generic inference gap
            .update({ status } as any)
            .eq("id", id);

        if (error) {
            console.error("updateLeadStatus error:", error.message);
            return { success: false, error: error.message };
        }

        return { success: true, error: null };
    } catch (err) {
        console.error("updateLeadStatus unexpected error:", err);
        return { success: false, error: "Failed to update lead status" };
    }
}

/* ── Delete a lead ─────────────────────────────────────────────────────────── */

export async function deleteLead(
    id: string,
): Promise<{ success: boolean; error: string | null }> {
    try {
        const supabase = await createClient();

        const { error } = await supabase
            .from("leads")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("deleteLead error:", error.message);
            return { success: false, error: error.message };
        }

        return { success: true, error: null };
    } catch (err) {
        console.error("deleteLead unexpected error:", err);
        return { success: false, error: "Failed to delete lead" };
    }
}
