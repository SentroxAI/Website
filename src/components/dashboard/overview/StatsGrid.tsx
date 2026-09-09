"use client";

/* -------------------------------------------------------------------------- */
/*                            STATS GRID                                      */
/*                                                                            */
/*  Responsive grid of StatsCard components.                                  */
/*  Fetches real counts from Supabase, falls back to mock data.               */
/* -------------------------------------------------------------------------- */

import { useEffect, useState } from "react";
import StatsCard from "./StatsCard";
import { statsData, type StatItem } from "./data";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";

export default function StatsGrid() {
    const { user } = useAuth();
    const [stats, setStats] = useState<StatItem[]>(statsData);

    useEffect(() => {
        async function fetchRealStats() {
            if (!user) return;

            try {
                const supabase = createClient();

                // Get client_id
                const clientResult = await supabase
                    .from("clients")
                    .select("id")
                    .eq("user_id", user.id)
                    .single();
                const clientId = (clientResult.data as { id: string } | null)?.id;

                if (!clientId) return; // No client record — keep mock data

                // Fetch real counts in parallel
                const [
                    { count: activeProjects },
                    { count: completedProjects },
                    { count: unreadMessages },
                    { count: upcomingMeetings },
                ] = await Promise.all([
                    supabase
                        .from("projects")
                        .select("*", { count: "exact", head: true })
                        .eq("client_id", clientId)
                        .eq("status", "active"),
                    supabase
                        .from("projects")
                        .select("*", { count: "exact", head: true })
                        .eq("client_id", clientId)
                        .eq("status", "completed"),
                    supabase
                        .from("messages")
                        .select("*", { count: "exact", head: true })
                        .eq("receiver_id", user.id)
                        .eq("read", false),
                    supabase
                        .from("meetings")
                        .select("*", { count: "exact", head: true })
                        .eq("client_id", clientId)
                        .gte("scheduled_at", new Date().toISOString())
                        .eq("status", "scheduled"),
                ]);

                // Only update if we got real data (at least one non-zero count)
                const hasData = (activeProjects ?? 0) + (completedProjects ?? 0) + (unreadMessages ?? 0) + (upcomingMeetings ?? 0) > 0;

                if (hasData) {
                    setStats((prev) =>
                        prev.map((stat) => {
                            switch (stat.id) {
                                case "active-projects":
                                    return { ...stat, value: activeProjects ?? 0 };
                                case "completed-projects":
                                    return { ...stat, value: completedProjects ?? 0 };
                                case "unread-messages":
                                    return { ...stat, value: unreadMessages ?? 0 };
                                case "upcoming-meetings":
                                    return { ...stat, value: upcomingMeetings ?? 0 };
                                default:
                                    return stat;
                            }
                        })
                    );
                }
            } catch {
                // Silently fall back to mock data on error
            }
        }

        fetchRealStats();
    }, [user]);

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <StatsCard key={stat.id} stat={stat} index={index} />
            ))}
        </div>
    );
}
