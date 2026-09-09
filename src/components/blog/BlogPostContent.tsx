"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    Calendar,
    Clock,
    Tag,
    Share2,
    ArrowRight,
    Bot,
    Globe,
    Zap,
    Search,
    Cpu,
    Shield,
    type LucideIcon,
} from "lucide-react";
import { toast } from "sonner";

import Container from "@/components/ui/layout/Container";
import Section from "@/components/ui/layout/Section";
import GlassCard from "@/components/ui/cards/GlassCard";
import GradientCard from "@/components/ui/cards/GradientCard";
import PrimaryButton from "@/components/ui/buttons/PrimaryButton";
import SecondaryButton from "@/components/ui/buttons/SecondaryButton";
import Breadcrumbs from "@/components/ui/navigation/Breadcrumbs";
import { fadeUp, viewport } from "@/lib/animations";
import { copyToClipboard } from "@/lib/utils";

import { blogPosts, type BlogPost } from "./blogData";

/* -------------------------------------------------------------------------- */
/*                               ICON MAP                                     */
/* -------------------------------------------------------------------------- */

const iconMap: Record<string, LucideIcon> = {
    Bot,
    Globe,
    Zap,
    Search,
    Cpu,
    Shield,
};

/* -------------------------------------------------------------------------- */
/*                              COLOR MAPPING                                 */
/* -------------------------------------------------------------------------- */

const colorMap: Record<string, { icon: string; tag: string }> = {
    blue: {
        icon: "bg-blue-500/15 text-blue-400",
        tag: "border-blue-500/20 bg-blue-500/10 text-blue-300",
    },
    cyan: {
        icon: "bg-cyan-500/15 text-cyan-400",
        tag: "border-cyan-500/20 bg-cyan-500/10 text-cyan-300",
    },
    amber: {
        icon: "bg-amber-500/15 text-amber-400",
        tag: "border-amber-500/20 bg-amber-500/10 text-amber-300",
    },
    emerald: {
        icon: "bg-emerald-500/15 text-emerald-400",
        tag: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
    },
    violet: {
        icon: "bg-violet-500/15 text-violet-400",
        tag: "border-violet-500/20 bg-violet-500/10 text-violet-300",
    },
    rose: {
        icon: "bg-rose-500/15 text-rose-400",
        tag: "border-rose-500/20 bg-rose-500/10 text-rose-300",
    },
};

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

interface BlogPostContentProps {
    post: BlogPost;
}

export default function BlogPostContent({ post }: BlogPostContentProps) {
    const Icon = iconMap[post.icon] || Bot;
    const colors = colorMap[post.color] || colorMap.blue;

    const formattedDate = new Date(post.publishedAt).toLocaleDateString(
        "en-US",
        { month: "long", day: "numeric", year: "numeric" }
    );

    /* ── Related Posts ─────────────────────────────────────────────────── */

    const relatedPosts = blogPosts
        .filter((p) => p.id !== post.id && p.category === post.category)
        .slice(0, 2);

    if (relatedPosts.length < 2) {
        const extras = blogPosts
            .filter(
                (p) =>
                    p.id !== post.id &&
                    !relatedPosts.some((r) => r.id === p.id)
            )
            .slice(0, 2 - relatedPosts.length);
        relatedPosts.push(...extras);
    }

    /* ── Share Handler ────────────────────────────────────────────────── */

    const handleShare = async () => {
        const url =
            typeof window !== "undefined" ? window.location.href : "";

        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url,
                });
            } catch {
                /* user cancelled */
            }
        } else {
            const copied = await copyToClipboard(url);
            if (copied) toast.success("Link copied to clipboard");
        }
    };

    return (
        <Section id="blog-post" className="pt-36 pb-24">
            {/* Background */}

            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(37,99,235,.06),transparent_65%)]" />

            <Container size="md">
                {/* Breadcrumbs */}

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                >
                    <Breadcrumbs
                        items={[
                            { label: "Home", href: "/" },
                            { label: "Blog", href: "/blog" },
                            { label: post.title },
                        ]}
                    />
                </motion.div>

                {/* Header */}

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    animate="visible"
                    className="mt-10"
                >
                    {/* Category + Meta */}

                    <div className="flex flex-wrap items-center gap-3">
                        <span
                            className={`rounded-full border px-3 py-1 text-xs font-medium ${colors.tag}`}
                        >
                            {post.category}
                        </span>

                        <span className="flex items-center gap-1.5 text-sm text-slate-500">
                            <Calendar className="h-4 w-4" />
                            {formattedDate}
                        </span>

                        <span className="flex items-center gap-1.5 text-sm text-slate-500">
                            <Clock className="h-4 w-4" />
                            {post.readTime}
                        </span>
                    </div>

                    {/* Title */}

                    <h1 className="mt-6 text-4xl font-bold leading-tight text-white md:text-5xl">
                        {post.title}
                    </h1>

                    {/* Author + Share */}

                    <div className="mt-8 flex items-center justify-between border-b border-white/10 pb-8">
                        <div className="flex items-center gap-3">
                            <div
                                className={`flex h-10 w-10 items-center justify-center rounded-full ${colors.icon}`}
                            >
                                <Icon className="h-5 w-5" />
                            </div>

                            <div>
                                <p className="text-sm font-medium text-white">
                                    {post.author.name}
                                </p>
                                <p className="text-xs text-slate-500">
                                    {post.author.role}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleShare}
                            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                        >
                            <Share2 className="h-4 w-4" />
                            Share
                        </button>
                    </div>
                </motion.div>

                {/* Content */}

                <motion.article
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mt-12 space-y-6"
                >
                    {post.content.map((paragraph, index) => (
                        <p
                            key={index}
                            className="text-lg leading-9 text-slate-300"
                        >
                            {paragraph}
                        </p>
                    ))}
                </motion.article>

                {/* Tags */}

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mt-12 flex flex-wrap items-center gap-2 border-t border-white/10 pt-8"
                >
                    <Tag className="h-4 w-4 text-slate-500" />

                    {post.tags.map((tag) => (
                        <span
                            key={tag}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400"
                        >
                            {tag}
                        </span>
                    ))}
                </motion.div>

                {/* Navigation */}

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mt-12"
                >
                    <SecondaryButton
                        href="/blog"
                        leftIcon={<ArrowLeft size={18} />}
                    >
                        Back to Blog
                    </SecondaryButton>
                </motion.div>

                {/* Related Posts */}

                {relatedPosts.length > 0 && (
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewport}
                        className="mt-20"
                    >
                        <h2 className="text-2xl font-bold text-white">
                            Related Articles
                        </h2>

                        <div className="mt-8 grid gap-6 sm:grid-cols-2">
                            {relatedPosts.map((related) => {
                                const RIcon = iconMap[related.icon] || Bot;
                                const rColors =
                                    colorMap[related.color] || colorMap.blue;

                                return (
                                    <Link
                                        key={related.id}
                                        href={`/blog/${related.slug}`}
                                    >
                                        <GlassCard className="group h-full p-6 transition-shadow duration-300 hover:shadow-[0_0_30px_rgba(37,99,235,0.08)]">
                                            <div
                                                className={`flex h-10 w-10 items-center justify-center rounded-xl ${rColors.icon}`}
                                            >
                                                <RIcon className="h-5 w-5" />
                                            </div>

                                            <h3 className="mt-4 text-lg font-semibold text-white transition-colors group-hover:text-blue-400">
                                                {related.title}
                                            </h3>

                                            <p className="mt-2 text-sm text-slate-400 line-clamp-2">
                                                {related.excerpt}
                                            </p>
                                        </GlassCard>
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* CTA */}

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mt-20"
                >
                    <GradientCard
                        gradient="mixed"
                        padding="lg"
                        radius="3xl"
                        hover={false}
                        className="p-10 text-center"
                    >
                        <h2 className="text-3xl font-bold text-white">
                            Ready to Build Something Extraordinary?
                        </h2>

                        <p className="mx-auto mt-4 max-w-lg text-slate-400">
                            Let&apos;s discuss how AI can transform your
                            business. Book a free consultation today.
                        </p>

                        <PrimaryButton
                            href="/contact"
                            size="lg"
                            className="mt-8"
                            rightIcon={<ArrowRight size={20} />}
                        >
                            Start Your Project
                        </PrimaryButton>
                    </GradientCard>
                </motion.div>
            </Container>
        </Section>
    );
}
