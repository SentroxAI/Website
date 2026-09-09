"use client";

/* -------------------------------------------------------------------------- */
/*                       MEETING STATUS BADGE                                 */
/* -------------------------------------------------------------------------- */

import { Circle, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import type { MeetingStatus } from "./data";

const statusConfig: Record<
    MeetingStatus,
    { label: string; variant: BadgeProps["variant"]; icon: React.ReactNode }
> = {
    scheduled: {
        label: "Scheduled",
        variant: "secondary",
        icon: <Clock className="h-2.5 w-2.5" />,
    },
    confirmed: {
        label: "Confirmed",
        variant: "info",
        icon: <Circle className="h-2.5 w-2.5 fill-current" />,
    },
    completed: {
        label: "Completed",
        variant: "success",
        icon: <CheckCircle2 className="h-3 w-3" />,
    },
    cancelled: {
        label: "Cancelled",
        variant: "destructive",
        icon: <XCircle className="h-3 w-3" />,
    },
};

interface MeetingStatusBadgeProps {
    status: MeetingStatus;
    size?: BadgeProps["size"];
}

export default function MeetingStatusBadge({ status, size }: MeetingStatusBadgeProps) {
    const config = statusConfig[status];
    return (
        <Badge variant={config.variant} size={size} className="gap-1">
            {config.icon}
            {config.label}
        </Badge>
    );
}
