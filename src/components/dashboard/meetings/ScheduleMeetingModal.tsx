"use client";

/* -------------------------------------------------------------------------- */
/*                     SCHEDULE MEETING MODAL                                  */
/*                                                                            */
/*  Modal form to schedule a new meeting.                                     */
/*  Inserts into Supabase `meetings` table.                                   */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, Loader2, Video } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";

interface ScheduleMeetingModalProps {
    open: boolean;
    onClose: () => void;
}

export default function ScheduleMeetingModal({ open, onClose }: ScheduleMeetingModalProps) {
    const { user } = useAuth();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [duration, setDuration] = useState("30");
    const [meetingUrl, setMeetingUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim() || !date || !time) {
            toast.error("Please fill in all required fields.");
            return;
        }

        if (!user) {
            toast.error("You must be logged in.");
            return;
        }

        setSubmitting(true);
        try {
            const supabase = createClient();

            // Get client_id
            const clientResult = await supabase
                .from("clients")
                .select("id")
                .eq("user_id", user.id)
                .single();
            const clientId = (clientResult.data as { id: string } | null)?.id || user.id;

            const scheduledAt = new Date(`${date}T${time}`).toISOString();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error } = await (supabase.from("meetings") as any).insert({
                title: title.trim(),
                description: description.trim() || null,
                scheduled_at: scheduledAt,
                duration_minutes: parseInt(duration, 10),
                meeting_url: meetingUrl.trim() || null,
                client_id: clientId,
                organizer_id: user.id,
                status: "scheduled",
            });

            if (error) {
                toast.error("Failed to schedule: " + error.message);
            } else {
                toast.success("Meeting scheduled successfully!");
                // Reset form
                setTitle("");
                setDescription("");
                setDate("");
                setTime("");
                setDuration("30");
                setMeetingUrl("");
                onClose();
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="fixed inset-x-4 top-[10%] z-50 mx-auto max-w-md rounded-2xl border border-white/[0.08] bg-[#0c1222] p-6 shadow-2xl sm:inset-x-0"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sx-primary/10">
                                    <Calendar className="h-5 w-5 text-sx-primary-400" />
                                </div>
                                <div>
                                    <h2 className="text-base font-semibold text-white">Schedule Meeting</h2>
                                    <p className="text-xs text-sx-text-muted">Fill in the meeting details</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-sx-text-subtle hover:bg-white/5 hover:text-white transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Form */}
                        <div className="space-y-4">
                            {/* Title */}
                            <div>
                                <label className="block text-xs font-medium text-sx-text-muted mb-1.5">
                                    Meeting Title <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Project Kickoff Call"
                                    className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-sx-text-subtle outline-none transition-colors focus:border-sx-primary/30"
                                />
                            </div>

                            {/* Date & Time */}
                            <div className="grid gap-3 grid-cols-2">
                                <div>
                                    <label className="block text-xs font-medium text-sx-text-muted mb-1.5">
                                        Date <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        min={new Date().toISOString().split("T")[0]}
                                        className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:border-sx-primary/30 [color-scheme:dark]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-sx-text-muted mb-1.5">
                                        Time <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white outline-none transition-colors focus:border-sx-primary/30 [color-scheme:dark]"
                                    />
                                </div>
                            </div>

                            {/* Duration */}
                            <div>
                                <label className="block text-xs font-medium text-sx-text-muted mb-1.5">
                                    Duration
                                </label>
                                <div className="flex gap-2">
                                    {["15", "30", "45", "60"].map((d) => (
                                        <button
                                            key={d}
                                            type="button"
                                            onClick={() => setDuration(d)}
                                            className={cn(
                                                "flex-1 rounded-lg px-3 py-2 text-xs font-medium transition-all",
                                                duration === d
                                                    ? "bg-sx-primary/20 text-sx-primary-400 border border-sx-primary/30"
                                                    : "bg-white/[0.03] text-sx-text-muted border border-white/[0.06] hover:bg-white/[0.06]"
                                            )}
                                        >
                                            {d} min
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-medium text-sx-text-muted mb-1.5">
                                    Description
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Add meeting agenda or notes..."
                                    rows={2}
                                    className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-sx-text-subtle outline-none transition-colors focus:border-sx-primary/30 resize-none"
                                />
                            </div>

                            {/* Meeting URL */}
                            <div>
                                <label className="block text-xs font-medium text-sx-text-muted mb-1.5">
                                    Meeting Link (optional)
                                </label>
                                <div className="relative">
                                    <Video className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sx-text-subtle" />
                                    <input
                                        type="url"
                                        value={meetingUrl}
                                        onChange={(e) => setMeetingUrl(e.target.value)}
                                        placeholder="https://meet.google.com/..."
                                        className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] pl-10 pr-3.5 py-2.5 text-sm text-white placeholder:text-sx-text-subtle outline-none transition-colors focus:border-sx-primary/30"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex gap-3 justify-end">
                            <button
                                onClick={onClose}
                                className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2.5 text-sm font-medium text-sx-text-secondary hover:bg-white/[0.06] transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting || !title.trim() || !date || !time}
                                className="flex items-center gap-2 rounded-xl bg-sx-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sx-primary-500 shadow-lg shadow-sx-primary/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Calendar className="h-4 w-4" />
                                )}
                                {submitting ? "Scheduling..." : "Schedule"}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
