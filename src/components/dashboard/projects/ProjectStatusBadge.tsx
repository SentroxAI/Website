"use client";

/* -------------------------------------------------------------------------- */
/*                          PROJECT STATUS BADGE                              */
/*                                                                            */
/*  Status badge with icon and label mapped from ProjectStatus enum.          */
/* -------------------------------------------------------------------------- */

import { Circle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import type { ProjectStatus } from "./data";

const statusConfig: Record<
    ProjectStatus,
    { label: string; variant: BadgeProps["variant"]; icon: React.ReactNode }
> = {
    active: {
        label: "Active",
        variant: "info",
        icon: <Circle className="h-2.5 w-2.5 fill-current" />,
    },
    completed: {
        label: "Completed",
        variant: "success",
        icon: <CheckCircle2 className="h-3 w-3" />,
    },
    pending: {
        label: "Pending",
        variant: "warning",
        icon: <Clock className="h-3 w-3" />,
    },
    cancelled: {
        label: "Cancelled",
        variant: "destructive",
        icon: <XCircle className="h-3 w-3" />,
    },
};

interface ProjectStatusBadgeProps {
    status: ProjectStatus;
    size?: BadgeProps["size"];
}

export default function ProjectStatusBadge({ status, size }: ProjectStatusBadgeProps) {
    const config = statusConfig[status];

    return (
        <Badge variant={config.variant} size={size} className="gap-1">
            {config.icon}
            {config.label}
        </Badge>
    );
}
