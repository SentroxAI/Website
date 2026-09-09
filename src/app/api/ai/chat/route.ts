/* -------------------------------------------------------------------------- */
/*                       AI CHAT ASSISTANT API                                */
/*                                                                            */
/*  Sprint 4 — Module 5: Streaming AI chat assistant for admin dashboard.     */
/*  Uses Gemini with streaming responses and multi-turn conversation.         */
/* -------------------------------------------------------------------------- */

import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { streamChat, checkRateLimit, isAIConfigured } from "@/lib/ai";

export async function POST(req: NextRequest) {
    try {
        /* ── Auth check ───────────────────────────────────────────────── */
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            });
        }

        const { data: profile } = await supabase
            .from("users")
            .select("role")
            .eq("id", user.id)
            .single<{ role: string }>();

        if (profile?.role !== "admin") {
            return new Response(JSON.stringify({ error: "Forbidden" }), {
                status: 403,
                headers: { "Content-Type": "application/json" },
            });
        }

        /* ── AI configured check ──────────────────────────────────────── */
        if (!isAIConfigured()) {
            return new Response(
                JSON.stringify({ error: "AI features are not configured. Add GEMINI_API_KEY to .env.local" }),
                { status: 503, headers: { "Content-Type": "application/json" } },
            );
        }

        /* ── Rate limit ───────────────────────────────────────────────── */
        if (!checkRateLimit(user.id, "chat")) {
            return new Response(
                JSON.stringify({ error: "Rate limit exceeded. Try again later." }),
                { status: 429, headers: { "Content-Type": "application/json" } },
            );
        }

        /* ── Parse request ────────────────────────────────────────────── */
        const body = await req.json();
        const { messages } = body;

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return new Response(
                JSON.stringify({ error: "Messages array is required." }),
                { status: 400, headers: { "Content-Type": "application/json" } },
            );
        }

        /* ── Stream response ──────────────────────────────────────────── */
        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    for await (const chunk of streamChat(messages)) {
                        controller.enqueue(
                            encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`),
                        );
                    }
                    controller.enqueue(encoder.encode("data: [DONE]\n\n"));
                    controller.close();
                } catch (error) {
                    console.error("❌ AI Chat streaming error:", error);
                    controller.enqueue(
                        encoder.encode(
                            `data: ${JSON.stringify({ error: "Streaming error occurred" })}\n\n`,
                        ),
                    );
                    controller.close();
                }
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error) {
        console.error("❌ AI Chat error:", error);
        return new Response(
            JSON.stringify({
                error: error instanceof Error
                    ? error.message
                    : "Failed to process chat request",
            }),
            { status: 500, headers: { "Content-Type": "application/json" } },
        );
    }
}
