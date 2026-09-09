"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Container from "@/components/ui/layout/Container";
import Section from "@/components/ui/layout/Section";
import SectionHeading from "@/components/ui/section/SectionHeading";
import { fadeUp, viewport } from "@/lib/animations";

import BlogCard from "./BlogCard";
import { blogPosts, blogCategories } from "./blogData";

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

export default function BlogGrid() {
    const [activeCategory, setActiveCategory] = useState("All");

    const filteredPosts =
        activeCategory === "All"
            ? blogPosts
            : blogPosts.filter((p) => p.category === activeCategory);

    return (
        <Section id="blog-grid" spacing="md">
            <Container>
                {/* Heading */}

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                >
                    <SectionHeading
                        title="Latest Insights"
                        description="Thoughts on AI, web development, and building digital products that matter."
                    />
                </motion.div>

                {/* Filter Tabs */}

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mt-12 flex flex-wrap justify-center gap-2"
                >
                    {blogCategories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={[
                                "relative rounded-2xl px-5 py-2.5 text-sm font-medium transition-all duration-300",
                                activeCategory === cat
                                    ? "bg-blue-600 text-white"
                                    : "border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white",
                            ].join(" ")}
                        >
                            {cat}

                            {activeCategory === cat && (
                                <motion.div
                                    layoutId="blog-filter"
                                    className="absolute inset-0 rounded-2xl bg-blue-600"
                                    style={{ zIndex: -1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 30,
                                    }}
                                />
                            )}
                        </button>
                    ))}
                </motion.div>

                {/* Grid */}

                <motion.div
                    layout
                    className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredPosts.map((post) => (
                            <BlogCard key={post.id} post={post} />
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Empty State */}

                {filteredPosts.length === 0 && (
                    <p className="mt-16 text-center text-slate-500">
                        No posts in this category yet. Check back soon!
                    </p>
                )}
            </Container>
        </Section>
    );
}
