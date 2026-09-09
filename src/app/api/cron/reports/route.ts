/* -------------------------------------------------------------------------- */
/*                     CRON — WEEKLY / MONTHLY REPORTS                        */
/*                                                                            */
/*  Sprint 4 — Module 4: Automated report generation.                        */
/*  Vercel Cron Job compatible endpoint.                                      */
/*                                                                            */
/*  Add to vercel.json:                                                       */
/*  { "crons": [                                                              */
/*    { "path": "/api/cron/reports?type=weekly", "schedule": "0 9 * * 1" },  */
/*    { "path": "/api/cron/reports?type=monthly", "schedule": "0 9 1 * *" }  */
/*  ] }                                                                       */
/* -------------------------------------------------------------------------- */

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import {
    sendEmail,
    buildWeeklyReportEmail,
    buildMonthlyReportEmail,
    NOTIFICATION_EMAIL,
} from "@/services/email";

/* ── Auth guard (Vercel Cron sends CRON_SECRET) ────────────────────────────── */

function verifyCronAuth(request: NextRequest): boolean {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    // Allow in development
    if (process.env.NODE_ENV === "development") return true;

    // Verify secret
    if (cronSecret && authHeader === `Bearer ${cronSecret}`) return true;

    return false;
}

/* ── Stats gathering ───────────────────────────────────────────────────────── */

async function getWeeklyStats() {
    const admin = createAdminClient();
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    // New leads this week
    const { count: newLeads } = await admin
        .from("leads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", oneWeekAgo);

    // Completed projects this week
    const { count: projectsCompleted } = await admin
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed")
        .gte("updated_at", oneWeekAgo);

    // Revenue this week (from payments)
    const { data: payments } = await admin
        .from("payments")
        .select("amount")
        .eq("status", "completed")
        .gte("created_at", oneWeekAgo);

    const revenue = (payments || []).reduce((sum, p) => sum + Number(p.amount), 0);

    // Messages received this week
    const { count: messagesReceived } = await admin
        .from("messages")
        .select("*", { count: "exact", head: true })
        .gte("created_at", oneWeekAgo);

    // Meetings held this week
    const { count: meetingsHeld } = await admin
        .from("meetings")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed")
        .gte("date", oneWeekAgo);

    return {
        newLeads: newLeads || 0,
        projectsCompleted: projectsCompleted || 0,
        revenue: revenue.toLocaleString("en-IN"),
        messagesReceived: messagesReceived || 0,
        meetingsHeld: meetingsHeld || 0,
    };
}

async function getMonthlyStats() {
    const admin = createAdminClient();
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    // Revenue
    const { data: payments } = await admin
        .from("payments")
        .select("amount")
        .eq("status", "completed")
        .gte("created_at", firstOfMonth);

    const totalRevenue = (payments || []).reduce((sum, p) => sum + Number(p.amount), 0);

    // New clients
    const { count: newClients } = await admin
        .from("clients")
        .select("*", { count: "exact", head: true })
        .gte("created_at", firstOfMonth);

    // Active projects
    const { count: activeProjects } = await admin
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("status", "active");

    // Completed projects
    const { count: completedProjects } = await admin
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed")
        .gte("updated_at", firstOfMonth);

    // Leads
    const { count: totalLeads } = await admin
        .from("leads")
        .select("*", { count: "exact", head: true })
        .gte("created_at", firstOfMonth);

    const { count: wonLeads } = await admin
        .from("leads")
        .select("*", { count: "exact", head: true })
        .eq("status", "won")
        .gte("updated_at", firstOfMonth);

    const conversionRate =
        (totalLeads || 0) > 0
            ? `${Math.round(((wonLeads || 0) / (totalLeads || 1)) * 100)}%`
            : "0%";

    return {
        totalRevenue: totalRevenue.toLocaleString("en-IN"),
        newClients: newClients || 0,
        activeProjects: activeProjects || 0,
        completedProjects: completedProjects || 0,
        totalLeads: totalLeads || 0,
        conversionRate,
    };
}

/* ── Helpers ───────────────────────────────────────────────────────────────── */

function getWeekPeriod(): string {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - 7);
    const fmt = (d: Date) =>
        d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    return `${fmt(startOfWeek)} – ${fmt(now)}`;
}

function getMonthName(): string {
    return new Date().toLocaleDateString("en-IN", {
        month: "long",
        year: "numeric",
    });
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                              ROUTE HANDLER                                 */
/* ═══════════════════════════════════════════════════════════════════════════ */

export async function GET(request: NextRequest) {
    // Verify cron authentication
    if (!verifyCronAuth(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "weekly";

    try {
        if (type === "weekly") {
            const stats = await getWeeklyStats();
            const period = getWeekPeriod();

            const { subject, html } = buildWeeklyReportEmail({
                name: "Admin",
                period,
                stats,
            });

            const result = await sendEmail({
                to: NOTIFICATION_EMAIL,
                subject,
                html,
                tags: [{ name: "type", value: "weekly-report" }],
            });

            return NextResponse.json({
                success: result.success,
                type: "weekly",
                period,
                stats,
                emailId: result.id,
            });
        }

        if (type === "monthly") {
            const stats = await getMonthlyStats();
            const month = getMonthName();

            const { subject, html } = buildMonthlyReportEmail({
                name: "Admin",
                month,
                stats,
            });

            const result = await sendEmail({
                to: NOTIFICATION_EMAIL,
                subject,
                html,
                tags: [{ name: "type", value: "monthly-report" }],
            });

            return NextResponse.json({
                success: result.success,
                type: "monthly",
                month,
                stats,
                emailId: result.id,
            });
        }

        return NextResponse.json(
            { error: 'Invalid type. Use "weekly" or "monthly".' },
            { status: 400 },
        );
    } catch (error) {
        console.error("❌ Report generation failed:", error);
        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : "Report generation failed",
            },
            { status: 500 },
        );
    }
}
