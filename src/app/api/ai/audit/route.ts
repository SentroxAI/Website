/* -------------------------------------------------------------------------- */
/*                      AI WEBSITE AUDIT API                                  */
/*                                                                            */
/*  Sprint 4 — Module 5: Generates a comprehensive SEO + Performance +        */
/*  Accessibility audit for a given URL using Gemini AI. Admin-only.          */
/* -------------------------------------------------------------------------- */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateAudit, checkRateLimit, isAIConfigured } from "@/lib/ai";

export async function POST(req: NextRequest) {
    try {
        /* ── Auth check ───────────────────────────────────────────────── */
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from("users")
            .select("role")
            .eq("id", user.id)
            .single<{ role: string }>();

        if (profile?.role !== "admin") {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        /* ── AI configured check ──────────────────────────────────────── */
        if (!isAIConfigured()) {
            return NextResponse.json(
                { error: "AI features are not configured. Add GEMINI_API_KEY to .env.local" },
                { status: 503 },
            );
        }

        /* ── Rate limit ───────────────────────────────────────────────── */
        if (!checkRateLimit(user.id, "audit")) {
            return NextResponse.json(
                { error: "Rate limit exceeded. Try again later." },
                { status: 429 },
            );
        }

        /* ── Parse request ────────────────────────────────────────────── */
        const body = await req.json();
        const { url } = body;

        if (!url) {
            return NextResponse.json(
                { error: "URL is required." },
                { status: 400 },
            );
        }

        // Basic URL validation
        try {
            new URL(url);
        } catch {
            return NextResponse.json(
                { error: "Invalid URL format." },
                { status: 400 },
            );
        }

        /* ── Generate audit ───────────────────────────────────────────── */
        const report = await generateAudit(url);

        return NextResponse.json({
            success: true,
            report,
            url,
            generatedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error("❌ AI Audit error:", error);
        return NextResponse.json(
            {
                error: error instanceof Error
                    ? error.message
                    : "Failed to generate audit",
            },
            { status: 500 },
        );
    }
}
