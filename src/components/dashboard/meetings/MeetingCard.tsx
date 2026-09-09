"use client";

/* -------------------------------------------------------------------------- */
/*                          MEETING CARD                                      */
/*                                                                            */
/*  Card showing meeting info: time, participants, type, status, actions.     */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Video,
    Phone,
    MapPin,
    Clock,
    ChevronDown,
    ExternalLink,
    Users,
    ListChecks,
    StickyNote,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import MeetingStatusBadge from "./MeetingStatusBadge";
import { formatMeetingDate, formatTimeRange, type Meeting } from "./data";

const typeConfig: Record<Meeting["type"], { icon: React.ReactNode; label: string; color: string }> = {
    video: { icon: <Video className="h-3.5 w-3.5" />, label: "Video Call", color: "text-blue-400" },
    phone: { icon: <Phone className="h-3.5 w-3.5" />, label: "Phone Call", color: "text-emerald-400" },
    "in-person": { icon: <MapPin className="h-3.5 w-3.5" />, label: "In Person", color: "text-amber-400" },
};

interface MeetingCardProps {
    meeting: Meeting;
    index: number;
}

export default function MeetingCard({ meeting, index }: MeetingCardProps) {
    const [expanded, setExpanded] = useState(false);
    const typeInfo = typeConfig[meeting.type];
    const isPast = meeting.status === "completed" || meeting.status === "cancelled";

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className={cn(
                "overflow-hidden rounded-2xl border transition-all",
                isPast
                    ? "border-white/[0.04] bg-white/[0.01] opacity-70"
                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]"
            )}
        >
            <div className="p-4 sm:p-5">
                {/* Top row: date badge + status */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-sx-primary-400 bg-sx-primary/10 rounded-lg px-2 py-0.5">
                            {formatMeetingDate(meeting.date)}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-sx-text-muted">
                            <Clock className="h-3 w-3" />
                            {formatTimeRange(meeting.startTime, meeting.endTime)}
                        </span>
                        <span className="text-[11px] text-sx-text-subtle">
                            ({meeting.durationMinutes}m)
                        </span>
                    </div>
                    <MeetingStatusBadge status={meeting.status} size="sm" />
                </div>

                {/* Title + description */}
                <h3 className="text-sm font-semibold text-white mb-1">
                    {meeting.title}
                </h3>
                <p className="text-xs text-sx-text-muted line-clamp-2 leading-relaxed mb-3">
                    {meeting.description}
                </p>

                {/* Metadata row */}
                <div className="flex flex-wrap items-center gap-3 mb-3">
                    {/* Type */}
                    <span className={cn("flex items-center gap-1 text-[11px] font-medium", typeInfo.color)}>
                        {typeInfo.icon}
                        {typeInfo.label}
                    </span>

                    {/* Project */}
                    {meeting.projectName && (
                        <span className="text-[11px] text-sx-text-subtle">
                            📁 {meeting.projectName}
                        </span>
                    )}

                    {/* Location */}
                    {meeting.location && (
                        <span className="flex items-center gap-1 text-[11px] text-sx-text-subtle">
                            <MapPin className="h-3 w-3" />
                            {meeting.location}
                        </span>
                    )}
                </div>

                {/* Bottom row: participants + actions */}
                <div className="flex items-center justify-between">
                    {/* Participants */}
                    <div className="flex items-center gap-2">
                        <div className="flex -space-x-1.5">
                            {meeting.participants.slice(0, 4).map((p) => (
                                <Avatar
                                    key={p.id}
                                    fallback={p.name}
                                    src={p.avatar}
                                    size="xs"
                                    className="ring-2 ring-[#0a0f1e]"
                                />
                            ))}
                        </div>
                        <span className="text-[11px] text-sx-text-muted">
                            {meeting.participants.length} participant{meeting.participants.length !== 1 ? "s" : ""}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                        {meeting.meetingUrl && !isPast && (
                            <a
                                href={meeting.meetingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 rounded-lg bg-blue-500/10 px-2.5 py-1.5 text-[11px] font-medium text-blue-400 hover:bg-blue-500/20 transition-colors"
                            >
                                <ExternalLink className="h-3 w-3" />
                                Join
                            </a>
                        )}
                        {(meeting.agenda || meeting.notes) && (
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className={cn(
                                    "flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium transition-colors",
                                    expanded
                                        ? "bg-white/[0.06] text-white"
                                        : "text-sx-text-muted hover:bg-white/[0.04] hover:text-white"
                                )}
                            >
                                Details
                                <motion.div
                                    animate={{ rotate: expanded ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ChevronDown className="h-3 w-3" />
                                </motion.div>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Expandable details */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-white/[0.04] px-4 sm:px-5 py-4 space-y-4">
                            {/* Agenda */}
                            {meeting.agenda && meeting.agenda.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-sx-text-secondary mb-2">
                                        <ListChecks className="h-3.5 w-3.5 text-sx-text-subtle" />
                                        Agenda
                                    </div>
                                    <ul className="space-y-1.5 pl-5">
                                        {meeting.agenda.map((item, i) => (
                                            <li key={i} className="text-xs text-sx-text-muted list-disc marker:text-sx-text-subtle">
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Notes */}
                            {meeting.notes && (
                                <div>
                                    <div className="flex items-center gap-1.5 text-xs font-semibold text-sx-text-secondary mb-2">
                                        <StickyNote className="h-3.5 w-3.5 text-sx-text-subtle" />
                                        Notes
                                    </div>
                                    <p className="text-xs text-sx-text-muted leading-relaxed bg-white/[0.02] rounded-lg p-3 border border-white/[0.04]">
                                        {meeting.notes}
                                    </p>
                                </div>
                            )}

                            {/* Full participant list */}
                            <div>
                                <div className="flex items-center gap-1.5 text-xs font-semibold text-sx-text-secondary mb-2">
                                    <Users className="h-3.5 w-3.5 text-sx-text-subtle" />
                                    Participants
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {meeting.participants.map((p) => (
                                        <div key={p.id} className="flex items-center gap-2 rounded-lg bg-white/[0.03] border border-white/[0.04] px-2.5 py-1.5">
                                            <Avatar fallback={p.name} size="xs" />
                                            <div>
                                                <p className="text-[11px] font-medium text-sx-text-secondary">{p.name}</p>
                                                <p className="text-[10px] text-sx-text-subtle">{p.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
