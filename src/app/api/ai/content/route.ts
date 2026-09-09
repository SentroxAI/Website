/* -------------------------------------------------------------------------- */
/*                     AI CONTENT GENERATION API                              */
/*                                                                            */
/*  Sprint 4 — Module 5: Generate landing pages, blog posts, meta tags,       */
/*  FAQs, social media posts, and email copy using Gemini AI. Admin-only.    */
/* -------------------------------------------------------------------------- */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateContent, checkRateLimit, isAIConfigured } from "@/lib/ai";

const VALID_CONTENT_TYPES = [
    "landing_page",
    "blog_post",
    "meta_tags",
    "faq",
    "social_media",
    "email_copy",
] as const;

type ContentType = (typeof VALID_CONTENT_TYPES)[number];

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
        if (!checkRateLimit(user.id, "content")) {
            return NextResponse.json(
                { error: "Rate limit exceeded. Try again later." },
                { status: 429 },
            );
        }

        /* ── Parse request ────────────────────────────────────────────── */
        const body = await req.json();
        const { type, topic, keywords, tone, targetAudience } = body;

        if (!type || !topic) {
            return NextResponse.json(
                { error: "Content type and topic are required." },
                { status: 400 },
            );
        }

        if (!VALID_CONTENT_TYPES.includes(type as ContentType)) {
            return NextResponse.json(
                { error: `Invalid content type. Must be one of: ${VALID_CONTENT_TYPES.join(", ")}` },
                { status: 400 },
            );
        }

        /* ── Generate content ─────────────────────────────────────────── */
        const content = await generateContent({
            type: type as ContentType,
            topic,
            keywords,
            tone,
            targetAudience,
        });

        return NextResponse.json({
            success: true,
            content,
            type,
            topic,
            generatedAt: new Date().toISOString(),
        });
    } catch (error) {
        console.error("❌ AI Content generation error:", error);
        return NextResponse.json(
            {
                error: error instanceof Error
                    ? error.message
                    : "Failed to generate content",
            },
            { status: 500 },
        );
    }
}
