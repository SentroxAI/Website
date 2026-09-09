"use server";

/* -------------------------------------------------------------------------- */
/*                      CLIENT SERVER ACTIONS                                 */
/*                                                                            */
/*  Sprint 3 — Module 4: CRUD operations for the clients table.              */
/*  All actions run server-side and rely on RLS (admin-only policies).        */
/*  createClient uses the service-role admin client to insert into both       */
/*  the users and clients tables.                                             */
/* -------------------------------------------------------------------------- */

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/database.types";

/* ── Types ─────────────────────────────────────────────────────────────────── */

export type Client = Tables<"clients">;
export type User = Tables<"users">;

export type ClientStatus = "active" | "inactive" | "pending";

/** Client row joined with user contact info */
export interface ClientWithUser {
    id: string;
    company: string;
    industry: string | null;
    website: string | null;
    status: string;
    user_id: string;
    created_at: string;
    updated_at: string;
    users: {
        id: string;
        full_name: string;
        email: string;
        phone: string | null;
        avatar_url: string | null;
        role: string;
    } | null;
    project_count?: number;
}

export interface ClientFilters {
    status?: ClientStatus | "all";
    search?: string;
    industry?: string;
    sort?: "newest" | "oldest" | "company_asc" | "company_desc";
}

export interface ClientStatsData {
    total: number;
    active: number;
    inactive: number;
    pending: number;
}

export interface CreateClientData {
    full_name: string;
    email: string;
    phone?: string;
    company: string;
    industry?: string;
    website?: string;
}

/* ── Fetch all clients with optional filters ───────────────────────────────── */

export async function fetchClients(filters?: ClientFilters): Promise<{
    data: ClientWithUser[];
    error: string | null;
}> {
    try {
        const supabase = await createClient();

        let query = supabase
            .from("clients")
            .select("*, users!clients_user_id_fkey(id, full_name, email, phone, avatar_url, role)");

        // Status filter
        if (filters?.status && filters.status !== "all") {
            query = query.eq("status", filters.status);
        }

        // Industry filter
        if (filters?.industry && filters.industry !== "all") {
            query = query.eq("industry", filters.industry);
        }

        // Sorting
        switch (filters?.sort) {
            case "oldest":
                query = query.order("created_at", { ascending: true });
                break;
            case "company_asc":
                query = query.order("company", { ascending: true });
                break;
            case "company_desc":
                query = query.order("company", { ascending: false });
                break;
            case "newest":
            default:
                query = query.order("created_at", { ascending: false });
                break;
        }

        const { data, error } = await query.returns<ClientWithUser[]>();

        if (error) {
            console.error("fetchClients error:", error.message);
            return { data: [], error: error.message };
        }

        let results = data || [];

        // Client-side search filter (across joined user fields)
        if (filters?.search && filters.search.trim()) {
            const term = filters.search.trim().toLowerCase();
            results = results.filter(
                (c) =>
                    c.company.toLowerCase().includes(term) ||
                    c.users?.full_name.toLowerCase().includes(term) ||
                    c.users?.email.toLowerCase().includes(term),
            );
        }

        return { data: results, error: null };
    } catch (err) {
        console.error("fetchClients unexpected error:", err);
        return { data: [], error: "Failed to fetch clients" };
    }
}

/* ── Fetch a single client by ID ───────────────────────────────────────────── */

export async function fetchClientById(id: string): Promise<{
    data: ClientWithUser | null;
    error: string | null;
}> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("clients")
            .select("*, users!clients_user_id_fkey(id, full_name, email, phone, avatar_url, role)")
            .eq("id", id)
            .returns<ClientWithUser[]>()
            .single();

        if (error) {
            console.error("fetchClientById error:", error.message);
            return { data: null, error: error.message };
        }

        return { data: data as ClientWithUser, error: null };
    } catch (err) {
        console.error("fetchClientById unexpected error:", err);
        return { data: null, error: "Failed to fetch client" };
    }
}

/* ── Fetch client statistics ───────────────────────────────────────────────── */

export async function fetchClientStats(): Promise<{
    data: ClientStatsData;
    error: string | null;
}> {
    const emptyStats: ClientStatsData = {
        total: 0,
        active: 0,
        inactive: 0,
        pending: 0,
    };

    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("clients")
            .select("status")
            .returns<{ status: string }[]>();

        if (error) {
            console.error("fetchClientStats error:", error.message);
            return { data: emptyStats, error: error.message };
        }

        const clients = data || [];
        const total = clients.length;

        const counts = clients.reduce(
            (acc, client) => {
                const status = client.status as ClientStatus;
                if (status in acc) {
                    acc[status]++;
                }
                return acc;
            },
            { active: 0, inactive: 0, pending: 0 } as Record<ClientStatus, number>,
        );

        return {
            data: { total, ...counts },
            error: null,
        };
    } catch (err) {
        console.error("fetchClientStats unexpected error:", err);
        return { data: emptyStats, error: "Failed to fetch client stats" };
    }
}

/* ── Update client status ──────────────────────────────────────────────────── */

export async function updateClientStatus(
    id: string,
    status: ClientStatus,
): Promise<{ success: boolean; error: string | null }> {
    try {
        const supabase = await createClient();

        const { error } = await supabase
            .from("clients")
            // @ts-expect-error — Supabase SDK generic inference gap
            .update({ status } as any)
            .eq("id", id);

        if (error) {
            console.error("updateClientStatus error:", error.message);
            return { success: false, error: error.message };
        }

        return { success: true, error: null };
    } catch (err) {
        console.error("updateClientStatus unexpected error:", err);
        return { success: false, error: "Failed to update client status" };
    }
}

/* ── Delete a client ───────────────────────────────────────────────────────── */

export async function deleteClient(
    id: string,
): Promise<{ success: boolean; error: string | null }> {
    try {
        const supabase = await createClient();

        const { error } = await supabase
            .from("clients")
            .delete()
            .eq("id", id);

        if (error) {
            console.error("deleteClient error:", error.message);
            return { success: false, error: error.message };
        }

        return { success: true, error: null };
    } catch (err) {
        console.error("deleteClient unexpected error:", err);
        return { success: false, error: "Failed to delete client" };
    }
}

/* ── Create a new client ───────────────────────────────────────────────────── */
/*  Uses the admin client (service role) to create both user + client records  */

export async function createNewClient(
    data: CreateClientData,
): Promise<{ success: boolean; error: string | null }> {
    try {
        const admin = createAdminClient();

        // 1. Create a user record with role "client"
        //    We use a random UUID for the auth user id since this is admin-created
        const userId = crypto.randomUUID();

        const { error: userError } = await admin.from("users").insert({
            id: userId,
            full_name: data.full_name,
            email: data.email,
            phone: data.phone || null,
            role: "client",
        });

        if (userError) {
            console.error("createNewClient user insert error:", userError.message);
            return { success: false, error: userError.message };
        }

        // 2. Create the client record linked to the user
        const { error: clientError } = await admin.from("clients").insert({
            user_id: userId,
            company: data.company,
            industry: data.industry || null,
            website: data.website || null,
            status: "active",
        });

        if (clientError) {
            console.error("createNewClient client insert error:", clientError.message);
            // Attempt rollback of user record
            await admin.from("users").delete().eq("id", userId);
            return { success: false, error: clientError.message };
        }

        return { success: true, error: null };
    } catch (err) {
        console.error("createNewClient unexpected error:", err);
        return { success: false, error: "Failed to create client" };
    }
}
