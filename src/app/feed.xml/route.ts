/* -------------------------------------------------------------------------- */
/*                          RSS FEED                                           */
/*                                                                            */
/*  Sprint 4 — Module 9: RSS 2.0 feed for blog posts.                        */
/*  Endpoint: /feed.xml                                                       */
/* -------------------------------------------------------------------------- */

import { createAdminClient } from "@/lib/supabase/server";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sentroxai.com";

export async function GET() {
    let items = "";

    try {
        const supabase = createAdminClient();

        const { data: posts } = await supabase
            .from("blog_posts")
            .select("title, slug, excerpt, published_at, tags, users!blog_posts_author_id_fkey(full_name)")
            .eq("published", true)
            .order("published_at", { ascending: false })
            .limit(50);

        if (posts) {
            items = (posts as unknown as Array<{
                title: string;
                slug: string;
                excerpt: string | null;
                published_at: string | null;
                tags: string[];
                users: { full_name: string } | null;
            }>)
                .map(
                    (post) => `
    <item>
      <title><![CDATA[${escapeXml(post.title)}]]></title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${post.slug}</guid>
      <description><![CDATA[${escapeXml(post.excerpt || "")}]]></description>
      <pubDate>${new Date(post.published_at || "").toUTCString()}</pubDate>
      ${post.users?.full_name ? `<author>${escapeXml(post.users.full_name)}</author>` : ""}
      ${post.tags?.length ? post.tags.map((t) => `<category>${escapeXml(t)}</category>`).join("\n      ") : ""}
    </item>`,
                )
                .join("\n");
        }
    } catch (error) {
        console.error("⚠️ RSS Feed: Failed to fetch blog posts:", error);

        // Fallback to static blog data
        try {
            const { blogPosts } = await import("@/components/blog/blogData");
            items = blogPosts
                .map(
                    (post) => `
    <item>
      <title><![CDATA[${escapeXml(post.title)}]]></title>
      <link>${BASE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${post.slug}</guid>
      <description><![CDATA[${escapeXml(post.excerpt)}]]></description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <author>${escapeXml(post.author.name)}</author>
      <category>${escapeXml(post.category)}</category>
    </item>`,
                )
                .join("\n");
        } catch {
            // Return empty feed if both fail
        }
    }

    const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Sentrox AI Blog</title>
    <link>${BASE_URL}/blog</link>
    <description>Insights on AI, web development, automation, and digital transformation from the Sentrox AI team.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${BASE_URL}/favicon.ico</url>
      <title>Sentrox AI Blog</title>
      <link>${BASE_URL}/blog</link>
    </image>
    ${items}
  </channel>
</rss>`;

    return new Response(feed, {
        headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800",
        },
    });
}

/* ── Helpers ───────────────────────────────────────────────────────────────── */

function escapeXml(str: string): string {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}
