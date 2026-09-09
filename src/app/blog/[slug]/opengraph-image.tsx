import { ImageResponse } from "next/og";

import { getPostBySlug, blogPosts } from "@/components/blog/blogData";

/* -------------------------------------------------------------------------- */
/*                       BLOG POST OG IMAGE GENERATION                        */
/* -------------------------------------------------------------------------- */

export const alt = "Sentrox AI Blog";

export const size = {
    width: 1200,
    height: 630,
};

export const contentType = "image/png";

export function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

export default async function Image({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    const title = post?.title ?? "Blog Post";
    const category = post?.category ?? "Article";
    const author = post?.author?.name ?? "Sentrox AI";
    const readTime = post?.readTime ?? "";

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: 60,
                    background: "linear-gradient(135deg, #030712 0%, #0a0f1e 50%, #030712 100%)",
                    borderBottom: "4px solid #2563eb",
                }}
            >

                {/* Top: Category badge + Read time */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "8px 20px",
                            borderRadius: 9999,
                            background: "rgba(37, 99, 235, 0.15)",
                            border: "1px solid rgba(37, 99, 235, 0.30)",
                        }}
                    >
                        <span
                            style={{
                                fontSize: 18,
                                fontWeight: 600,
                                color: "#60a5fa",
                            }}
                        >
                            {category}
                        </span>
                    </div>
                    {readTime ? (
                        <span
                            style={{
                                fontSize: 18,
                                color: "#64748b",
                                fontWeight: 500,
                            }}
                        >
                            {readTime}
                        </span>
                    ) : null}
                </div>

                {/* Middle: Title */}
                <div style={{ display: "flex", flex: 1, alignItems: "center" }}>
                    <h1
                        style={{
                            fontSize: title.length > 60 ? 42 : 52,
                            fontWeight: 800,
                            color: "#ffffff",
                            lineHeight: 1.2,
                            margin: 0,
                            maxWidth: "90%",
                        }}
                    >
                        {title}
                    </h1>
                </div>

                {/* Bottom: Author + Sentrox branding */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {/* Author avatar */}
                        <div
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: 9999,
                                background: "linear-gradient(135deg, #2563eb, #06b6d4)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 20,
                                    fontWeight: 700,
                                    color: "white",
                                }}
                            >
                                {author.charAt(0)}
                            </span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            <span
                                style={{
                                    fontSize: 18,
                                    fontWeight: 600,
                                    color: "#e2e8f0",
                                }}
                            >
                                {author}
                            </span>
                            <span style={{ fontSize: 14, color: "#64748b" }}>
                                sentrox.ai
                            </span>
                        </div>
                    </div>

                    {/* Sentrox logo */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                        }}
                    >
                        <div
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 10,
                                background: "linear-gradient(135deg, #2563eb, #06b6d4)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <span
                                style={{
                                    fontSize: 18,
                                    fontWeight: 800,
                                    color: "white",
                                }}
                            >
                                S
                            </span>
                        </div>
                        <span
                            style={{
                                fontSize: 22,
                                fontWeight: 700,
                                color: "#94a3b8",
                            }}
                        >
                            Sentrox AI
                        </span>
                    </div>
                </div>


            </div>
        ),
        { ...size }
    );
}
