"use client";

/* -------------------------------------------------------------------------- */
/*                         PROJECTS LISTING PAGE                              */
/*                                                                            */
/*  Module 4: Projects — main listing with filters, search, and grid.         */
/* -------------------------------------------------------------------------- */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Link from "next/link";
import DashboardContainer from "@/components/dashboard/DashboardContainer";
import ProjectFilters from "@/components/dashboard/projects/ProjectFilters";
import ProjectGrid from "@/components/dashboard/projects/ProjectGrid";
import { projects, type ProjectStatus } from "@/components/dashboard/projects/data";

export default function ProjectsPage() {
    const [activeStatus, setActiveStatus] = useState<ProjectStatus | "all">("all");
    const [searchQuery, setSearchQuery] = useState("");

    /* ── Filter + search logic ─────────────────────────────────────── */

    const filteredProjects = useMemo(() => {
        let result = projects;

        // Status filter
        if (activeStatus !== "all") {
            result = result.filter((p) => p.status === activeStatus);
        }

        // Search
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(
                (p) =>
                    p.title.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q) ||
                    p.service.toLowerCase().includes(q) ||
                    p.client.toLowerCase().includes(q)
            );
        }

        return result;
    }, [activeStatus, searchQuery]);

    /* ── Status counts ─────────────────────────────────────────────── */

    const counts = useMemo(() => {
        const map: Record<string, number> = { all: projects.length };
        for (const p of projects) {
            map[p.status] = (map[p.status] || 0) + 1;
        }
        return map;
    }, []);

    return (
        <DashboardContainer>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6"
            >
                <div>
                    <h1 className="text-xl font-bold text-white md:text-2xl">
                        Projects
                    </h1>
                    <p className="mt-1 text-sm text-sx-text-muted">
                        {projects.length} projects · {counts.active || 0} active
                    </p>
                </div>

                <Link
                    href="/contact?subject=New+Project+Request"
                    className="flex items-center gap-2 rounded-xl bg-sx-primary-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sx-primary-500 shadow-lg shadow-sx-primary/20 w-fit"
                >
                    <Plus className="h-4 w-4" />
                    Request Project
                </Link>
            </motion.div>

            {/* Filters */}
            <div className="mb-6">
                <ProjectFilters
                    activeStatus={activeStatus}
                    onStatusChange={setActiveStatus}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    counts={counts}
                />
            </div>

            {/* Project grid */}
            <ProjectGrid projects={filteredProjects} />
        </DashboardContainer>
    );
}
