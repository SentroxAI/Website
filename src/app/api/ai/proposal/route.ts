/* -------------------------------------------------------------------------- */
/*                    AI PROPOSAL GENERATION API                              */
/*                                                                            */
/*  Sprint 4 — Module 5: Generates a project proposal from lead data          */
/*  using Gemini AI. Admin-only endpoint.                                     */
/* -------------------------------------------------------------------------- */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateProposal, checkRateLimit, isAIConfigured } from "@/lib/ai";

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

        // Admin-only
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
        if (!checkRateLimit(user.id, "proposal")) {
            return NextResponse.json(
                { error: "Rate limit exceeded. Try again later." },
                { status: 429 },
            );
        }

        /* ── Parse request ────────────────────────────────────────────── */
        const body = await req.json();
        const { leadId, name, company, service, budget, message } = body;

        if (!name || !service) {
            return NextResponse.json(
                { error: "Name and service are required." },
                { status: 400 },
            );
        }

        /* ── Generate proposal ────────────────────────────────────────── */
        const proposal = await generateProposal({
            name,
            company,
            service,
            budget,
            message,
        });

        return NextResponse.json({
            success: true,
            proposal,
            leadId,
            generatedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error("❌ AI Proposal generation error:", error);
        return NextResponse.json(
            {
                error: error instanceof Error
                    ? error.message
                    : "Failed to generate proposal",
            },
            { status: 500 },
        );
    }
}
