"use client";

/* -------------------------------------------------------------------------- */
/*                         PROJECT GRID                                       */
/*                                                                            */
/*  Responsive grid of ProjectCard components with empty state.               */
/* -------------------------------------------------------------------------- */

import { FolderKanban } from "lucide-react";
import ProjectCard from "./ProjectCard";
import EmptyState from "@/components/dashboard/overview/EmptyState";
import type { Project } from "./data";

interface ProjectGridProps {
    projects: Project[];
}

export default function ProjectGrid({ projects }: ProjectGridProps) {
    if (projects.length === 0) {
        return (
            <EmptyState
                icon={<FolderKanban className="h-6 w-6" />}
                title="No projects found"
                description="Try adjusting your filters or search query to find projects."
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02]"
            />
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
            ))}
        </div>
    );
}
