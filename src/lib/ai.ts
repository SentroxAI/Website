/* -------------------------------------------------------------------------- */
/*                           AI INTEGRATION LAYER                             */
/*                                                                            */
/*  Sprint 4 — Module 5: AI provider abstraction using Google Gemini.         */
/*  Prompt templates for proposal generation, website audits, content         */
/*  generation, and AI chat assistant. Rate limiting per user.                */
/* -------------------------------------------------------------------------- */

import { GoogleGenAI, type GenerateContentResponse } from "@google/genai";

/* ── Configuration ─────────────────────────────────────────────────────────── */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

/** Lazy-initialise the Gemini client (fails fast with a clear message). */
function getAI(): GoogleGenAI {
    if (!GEMINI_API_KEY) {
        throw new Error(
            "GEMINI_API_KEY is not set. Add it to your .env.local file.",
        );
    }
    return new GoogleGenAI({ apiKey: GEMINI_API_KEY });
}

const MODEL_NAME = "gemini-2.5-flash";

/* ── Rate Limiting ─────────────────────────────────────────────────────────── */

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

/** In-memory rate limiter (per-user, per-feature). */
const rateLimitMap = new Map<string, RateLimitEntry>();

const RATE_LIMITS: Record<string, { maxRequests: number; windowMs: number }> = {
    proposal: { maxRequests: 10, windowMs: 60 * 60 * 1000 },     // 10/hour
    audit: { maxRequests: 5, windowMs: 60 * 60 * 1000 },         // 5/hour
    content: { maxRequests: 20, windowMs: 60 * 60 * 1000 },      // 20/hour
    chat: { maxRequests: 50, windowMs: 60 * 60 * 1000 },         // 50/hour
};

export function checkRateLimit(userId: string, feature: string): boolean {
    const key = `${userId}:${feature}`;
    const now = Date.now();
    const limit = RATE_LIMITS[feature] || { maxRequests: 20, windowMs: 3600000 };

    const entry = rateLimitMap.get(key);

    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(key, { count: 1, resetAt: now + limit.windowMs });
        return true;
    }

    if (entry.count >= limit.maxRequests) {
        return false;
    }

    entry.count++;
    return true;
}

/* ── Prompt Templates ──────────────────────────────────────────────────────── */

export const PROMPTS = {
    /** Turn a lead into a professional proposal. */
    proposal: (lead: {
        name: string;
        company?: string;
        service: string;
        budget?: string;
        message?: string;
    }) => `You are a senior business development manager at Sentrox AI, a premium digital agency specializing in web development, AI solutions, branding, and digital marketing.

Generate a professional, detailed project proposal based on this lead:

**Client Name:** ${lead.name}
**Company:** ${lead.company || "Not specified"}
**Service Requested:** ${lead.service}
**Budget:** ${lead.budget || "Not specified"}
**Client Message:** ${lead.message || "No additional details provided"}

The proposal must include:
1. **Executive Summary** — Brief overview of the project
2. **Understanding of Requirements** — What the client needs
3. **Proposed Solution** — Detailed approach and technologies
4. **Scope of Work** — Phases and deliverables with timeline
5. **Timeline** — Project milestones
6. **Investment** — Pricing breakdown (use the budget as a guide, or suggest based on the service)
7. **Why Sentrox AI** — Unique value propositions
8. **Next Steps** — How to proceed

Format the output as clean markdown. Be professional, persuasive, and detailed. Include realistic timelines and pricing for an Indian digital agency.`,

    /** Website audit prompt. */
    audit: (url: string) => `You are a senior web performance and SEO expert. Perform a comprehensive audit of the following website URL and provide detailed findings.

**Website URL:** ${url}

Analyze and provide scores/recommendations for:

## 1. SEO Analysis
- Title tag, meta description, heading structure
- URL structure and canonicalization
- Schema/structured data
- Internal linking
- Mobile-friendliness signals

## 2. Performance Analysis
- Page load time estimation
- Resource optimization (images, CSS, JS)
- Caching strategies
- Core Web Vitals insights

## 3. Accessibility Analysis
- Color contrast
- ARIA labels and roles
- Keyboard navigation
- Screen reader compatibility
- Alt text coverage

## 4. Security Analysis
- HTTPS usage
- Mixed content issues
- Security headers
- Cookie policies

## 5. Content Quality
- Content relevance and freshness
- Readability score
- Call-to-action effectiveness
- User experience flow

For each category:
- Give a score out of 100
- List specific issues found
- Provide actionable recommendations
- Mark issues as Critical / Warning / Info

Format as clean markdown with scores, findings, and recommendations clearly organized.`,

    /** Content generation prompt. */
    content: (params: {
        type: "landing_page" | "blog_post" | "meta_tags" | "faq" | "social_media" | "email_copy";
        topic: string;
        keywords?: string;
        tone?: string;
        targetAudience?: string;
    }) => {
        const typeInstructions: Record<string, string> = {
            landing_page: `Create a high-converting landing page content structure including:
- Hero headline and subheadline
- Value propositions (3-5 key points)
- Features section with descriptions
- Social proof section suggestions
- FAQ section (5-7 questions)
- CTA sections (primary and secondary)
- SEO meta title and description`,
            blog_post: `Write a comprehensive, SEO-optimized blog post including:
- Engaging title (60 chars max)
- Meta description (155 chars max)
- Introduction hook
- Main content with H2/H3 subheadings
- Practical examples and tips
- Conclusion with CTA
- Suggested tags`,
            meta_tags: `Generate SEO meta tags including:
- Title tag (50-60 chars)
- Meta description (150-160 chars)
- OpenGraph tags (title, description, type)
- Twitter Card tags
- Canonical URL suggestion
- 5-10 relevant keywords`,
            faq: `Generate a comprehensive FAQ section with:
- 10-15 relevant questions
- Clear, concise answers
- Schema-ready format (question-answer pairs)
- Include common objections and their answers`,
            social_media: `Create social media content pack including:
- 5 LinkedIn posts (professional tone)
- 5 Twitter/X posts (concise, engaging)
- 5 Instagram captions (visual-focused)
- Relevant hashtag suggestions for each platform
- Best posting time suggestions`,
            email_copy: `Write email marketing copy including:
- Subject line (40-60 chars)
- Preview text (40-100 chars)
- Email body with personalization tokens
- Primary CTA button text
- P.S. line
- 3 A/B test subject line variations`,
        };

        return `You are a senior content strategist and copywriter for Sentrox AI, a premium digital agency.

**Content Type:** ${params.type.replace(/_/g, " ")}
**Topic:** ${params.topic}
**Target Keywords:** ${params.keywords || "Not specified"}
**Tone:** ${params.tone || "Professional yet approachable"}
**Target Audience:** ${params.targetAudience || "Business owners and decision-makers"}

${typeInstructions[params.type] || "Generate high-quality content for the specified type."}

Requirements:
- Write in a professional, engaging style
- Optimize for SEO where applicable
- Include specific, actionable content (no generic filler)
- Format as clean markdown
- Focus on conversion and value delivery`;
    },

    /** AI chat assistant prompt. */
    chatSystem: () => `You are an intelligent AI assistant for Sentrox AI's admin dashboard. You help the admin team with:

1. **Business Insights** — Answering questions about projects, clients, revenue, and performance
2. **Task Assistance** — Helping draft emails, proposals, meeting agendas
3. **Strategy** — Providing marketing, SEO, and business development advice
4. **Technical** — Answering web development, design, and technology questions

Guidelines:
- Be concise but thorough
- Use data-driven insights when possible
- Format responses with markdown for readability
- Suggest actionable next steps
- Be proactive — offer related tips or recommendations
- Maintain a professional, friendly tone
- If you don't know something specific about the business data, say so clearly

You represent Sentrox AI — a premium Indian digital agency specializing in web development, AI integration, branding, and digital marketing.`,
};

/* ── AI Generation Functions ───────────────────────────────────────────────── */

/**
 * Generate text using Gemini (non-streaming).
 */
export async function generateText(prompt: string): Promise<string> {
    const ai = getAI();
    const response: GenerateContentResponse = await ai.models.generateContent({
        model: MODEL_NAME,
        contents: prompt,
    });
    return response.text ?? "";
}

/**
 * Generate a proposal from lead data.
 */
export async function generateProposal(lead: {
    name: string;
    company?: string;
    service: string;
    budget?: string;
    message?: string;
}): Promise<string> {
    const prompt = PROMPTS.proposal(lead);
    return generateText(prompt);
}

/**
 * Generate a website audit report.
 */
export async function generateAudit(url: string): Promise<string> {
    const prompt = PROMPTS.audit(url);
    return generateText(prompt);
}

/**
 * Generate content (blog, landing page, meta tags, etc.).
 */
export async function generateContent(params: {
    type: "landing_page" | "blog_post" | "meta_tags" | "faq" | "social_media" | "email_copy";
    topic: string;
    keywords?: string;
    tone?: string;
    targetAudience?: string;
}): Promise<string> {
    const prompt = PROMPTS.content(params);
    return generateText(prompt);
}

/**
 * Stream a chat response. Returns an async iterator of text chunks.
 */
export async function* streamChat(
    messages: { role: "user" | "model"; content: string }[],
): AsyncGenerator<string> {
    const ai = getAI();

    // Build the contents array for Gemini
    const contents = messages.map((m) => ({
        role: m.role,
        parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContentStream({
        model: MODEL_NAME,
        contents,
        config: {
            systemInstruction: PROMPTS.chatSystem(),
        },
    });

    for await (const chunk of response) {
        const text = chunk.text;
        if (text) {
            yield text;
        }
    }
}

/* ── Utility ───────────────────────────────────────────────────────────────── */

/**
 * Check if AI features are configured (API key present).
 */
export function isAIConfigured(): boolean {
    return !!GEMINI_API_KEY;
}
