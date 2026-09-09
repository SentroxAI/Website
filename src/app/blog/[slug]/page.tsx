import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Navbar } from "@/components/navbar";
import Footer from "@/components/home/Footer";

import BlogPostContent from "@/components/blog/BlogPostContent";
import { blogPosts, getPostBySlug } from "@/components/blog/blogData";

/* -------------------------------------------------------------------------- */
/*                            STATIC GENERATION                               */
/* -------------------------------------------------------------------------- */

export function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }));
}

/* -------------------------------------------------------------------------- */
/*                               METADATA                                     */
/* -------------------------------------------------------------------------- */

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) return { title: "Post Not Found" };

    return {
        title: post.title,
        description: post.excerpt,
        alternates: {
            canonical: `https://sentrox.ai/blog/${post.slug}`,
        },
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: "article",
            publishedTime: post.publishedAt,
            authors: [post.author.name],
            tags: post.tags,
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt,
        },
    };
}

/* -------------------------------------------------------------------------- */
/*                                   PAGE                                     */
/* -------------------------------------------------------------------------- */

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = getPostBySlug(slug);

    if (!post) notFound();

    return (
        <>
            <Navbar />

            <main>
                <BlogPostContent post={post} />
            </main>

            <Footer />
        </>
    );
}
