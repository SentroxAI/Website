"use client";

/* -------------------------------------------------------------------------- */
/*                         PROJECT TEAM LIST                                  */
/*                                                                            */
/*  Team member cards for the project detail page.                            */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { Mail, Users } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import EmptyState from "@/components/dashboard/overview/EmptyState";
import type { ProjectMember } from "./data";

interface ProjectTeamListProps {
    team: ProjectMember[];
}

export default function ProjectTeamList({ team }: ProjectTeamListProps) {
    if (team.length === 0) {
        return (
            <EmptyState
                icon={<Users className="h-6 w-6" />}
                title="No team members"
                description="Team members will appear here once assigned."
                className="rounded-xl border border-white/[0.06] bg-white/[0.02]"
            />
        );
    }

    return (
        <div className="grid gap-3 sm:grid-cols-2">
            {team.map((member, index) => (
                <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: index * 0.05 }}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]"
                >
                    <Avatar fallback={member.name} src={member.avatar} size="sm" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                            {member.name}
                        </p>
                        <p className="text-[11px] text-sx-text-muted">{member.role}</p>
                    </div>
                    <button className="flex h-7 w-7 items-center justify-center rounded-lg text-sx-text-subtle hover:bg-white/5 hover:text-white transition-colors">
                        <Mail className="h-3.5 w-3.5" />
                    </button>
                </motion.div>
            ))}
        </div>
    );
}
