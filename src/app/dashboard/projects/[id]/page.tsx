"use client";

/* -------------------------------------------------------------------------- */
/*                       PROJECT DETAIL PAGE                                  */
/*                                                                            */
/*  Module 4: Individual project view with milestones, tasks, files,          */
/*  activity feed, and team.                                                  */
/* -------------------------------------------------------------------------- */

import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import DashboardContainer from "@/components/dashboard/DashboardContainer";
import DashboardSection from "@/components/dashboard/overview/DashboardSection";
import ProjectDetailHeader from "@/components/dashboard/projects/ProjectDetailHeader";
import MilestoneList from "@/components/dashboard/projects/MilestoneList";
import ProjectFilesList from "@/components/dashboard/projects/ProjectFilesList";
import ProjectActivityFeed from "@/components/dashboard/projects/ProjectActivityFeed";
import ProjectTeamList from "@/components/dashboard/projects/ProjectTeamList";
import { getProjectById } from "@/components/dashboard/projects/data";

export default function ProjectDetailPage() {
    const params = useParams<{ id: string }>();
    const project = getProjectById(params.id);

    if (!project) {
        notFound();
    }

    return (
        <DashboardContainer>
            {/* Header with progress & metadata */}
            <ProjectDetailHeader project={project} />

            <div className="mt-8 space-y-8">
                {/* Milestones & Tasks */}
                <DashboardSection title="Milestones & Tasks" delay={0.1}>
                    <MilestoneList milestones={project.milestones} />
                </DashboardSection>

                {/* Two-column: Activity + Team */}
                <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
                    <DashboardSection title="Activity" delay={0.15}>
                        <ProjectActivityFeed activity={project.activity} />
                    </DashboardSection>

                    <DashboardSection title="Team" delay={0.2}>
                        <ProjectTeamList team={project.team} />
                    </DashboardSection>
                </div>

                {/* Files */}
                <DashboardSection
                    title="Files"
                    viewAllHref="/dashboard/files"
                    delay={0.25}
                >
                    <ProjectFilesList files={project.files} />
                </DashboardSection>
            </div>
        </DashboardContainer>
    );
}
