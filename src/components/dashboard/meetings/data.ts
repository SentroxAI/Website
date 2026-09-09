/* -------------------------------------------------------------------------- */
/*                      MEETINGS MODULE – MOCK DATA                           */
/*                                                                            */
/*  Meeting data with typed interfaces mirroring Supabase schema.             */
/* -------------------------------------------------------------------------- */

/* ── Types ─────────────────────────────────────────────────────────────────── */

export type MeetingStatus = "scheduled" | "confirmed" | "completed" | "cancelled";
export type MeetingType = "video" | "phone" | "in-person";

export interface MeetingParticipant {
    id: string;
    name: string;
    avatar?: string;
    role: string;
}

export interface Meeting {
    id: string;
    title: string;
    description: string;
    date: string;           // ISO date
    startTime: string;      // "HH:mm"
    endTime: string;        // "HH:mm"
    durationMinutes: number;
    status: MeetingStatus;
    type: MeetingType;
    meetingUrl?: string;
    location?: string;
    projectName?: string;
    organizer: MeetingParticipant;
    participants: MeetingParticipant[];
    notes?: string;
    agenda?: string[];
}

/* ── Mock data ─────────────────────────────────────────────────────────────── */

export const meetings: Meeting[] = [
    {
        id: "mt1",
        title: "Website Redesign — Sprint Review",
        description: "Review completed sprint deliverables and demo the latest homepage design to the client.",
        date: "2026-08-05",
        startTime: "10:00",
        endTime: "11:00",
        durationMinutes: 60,
        status: "confirmed",
        type: "video",
        meetingUrl: "https://meet.google.com/abc-defg-hij",
        projectName: "Website Redesign",
        organizer: { id: "u1", name: "Alice Johnson", role: "Lead Designer" },
        participants: [
            { id: "u1", name: "Alice Johnson", role: "Lead Designer" },
            { id: "u2", name: "Bob Smith", role: "Frontend Developer" },
            { id: "u3", name: "Charlie Davis", role: "Backend Developer" },
        ],
        agenda: [
            "Homepage hero section walkthrough",
            "Responsive layout demo",
            "CMS integration status update",
            "Client feedback & next steps",
        ],
    },
    {
        id: "mt2",
        title: "Mobile App — Architecture Review",
        description: "Deep dive into the proposed architecture for the v2.0 mobile app, covering auth flows and data layer.",
        date: "2026-08-05",
        startTime: "14:00",
        endTime: "15:30",
        durationMinutes: 90,
        status: "scheduled",
        type: "video",
        meetingUrl: "https://meet.google.com/klm-nopq-rst",
        projectName: "Mobile App v2.0",
        organizer: { id: "u4", name: "Diana Wilson", role: "Product Manager" },
        participants: [
            { id: "u4", name: "Diana Wilson", role: "Product Manager" },
            { id: "u5", name: "Eve Martinez", role: "Mobile Developer" },
        ],
        agenda: [
            "Auth module architecture",
            "Real-time chat system design",
            "Push notification strategy",
            "Timeline & resource allocation",
        ],
    },
    {
        id: "mt3",
        title: "Quarterly Business Review",
        description: "Quarterly review of project progress, budget utilization, and upcoming milestones with the client.",
        date: "2026-08-07",
        startTime: "11:00",
        endTime: "12:00",
        durationMinutes: 60,
        status: "scheduled",
        type: "video",
        meetingUrl: "https://meet.google.com/uvw-xyza-bcd",
        organizer: { id: "u4", name: "Diana Wilson", role: "Product Manager" },
        participants: [
            { id: "u4", name: "Diana Wilson", role: "Product Manager" },
            { id: "u1", name: "Alice Johnson", role: "Lead Designer" },
        ],
        agenda: [
            "Q2 project summary",
            "Budget review",
            "Q3 roadmap preview",
            "Open discussion",
        ],
    },
    {
        id: "mt4",
        title: "Design System Workshop",
        description: "Collaborative workshop to finalize the design token system, component library, and documentation approach.",
        date: "2026-08-08",
        startTime: "09:00",
        endTime: "10:30",
        durationMinutes: 90,
        status: "scheduled",
        type: "in-person",
        location: "Conference Room B, Floor 3",
        projectName: "Website Redesign",
        organizer: { id: "u1", name: "Alice Johnson", role: "Lead Designer" },
        participants: [
            { id: "u1", name: "Alice Johnson", role: "Lead Designer" },
            { id: "u2", name: "Bob Smith", role: "Frontend Developer" },
        ],
    },
    {
        id: "mt5",
        title: "SEO Results Presentation",
        description: "Final presentation of SEO optimization results, traffic improvements, and ranking changes.",
        date: "2026-08-02",
        startTime: "15:00",
        endTime: "15:45",
        durationMinutes: 45,
        status: "completed",
        type: "phone",
        projectName: "SEO Optimization",
        organizer: { id: "u6", name: "Frank Lee", role: "SEO Specialist" },
        participants: [
            { id: "u6", name: "Frank Lee", role: "SEO Specialist" },
        ],
        notes: "Organic traffic up 47%. Top 3 rankings achieved for 12 out of 15 target keywords. Client very satisfied with results.",
    },
    {
        id: "mt6",
        title: "Client Onboarding Call",
        description: "Initial onboarding call with the new client to discuss project scope, timelines, and communication preferences.",
        date: "2026-08-01",
        startTime: "10:00",
        endTime: "10:30",
        durationMinutes: 30,
        status: "completed",
        type: "video",
        meetingUrl: "https://meet.google.com/efg-hijk-lmn",
        projectName: "Brand Identity System",
        organizer: { id: "u7", name: "Grace Kim", role: "Brand Designer" },
        participants: [
            { id: "u7", name: "Grace Kim", role: "Brand Designer" },
            { id: "u8", name: "Henry Park", role: "Art Director" },
        ],
        notes: "Client prefers modern, minimalist aesthetic. Timeline confirmed for September start. Follow-up with moodboards by Aug 15.",
    },
    {
        id: "mt7",
        title: "E-commerce Project Cancellation Discussion",
        description: "Meeting to discuss the client's decision to cancel the e-commerce integration project.",
        date: "2026-07-28",
        startTime: "14:00",
        endTime: "14:30",
        durationMinutes: 30,
        status: "cancelled",
        type: "video",
        projectName: "E-commerce Integration",
        organizer: { id: "u9", name: "Ivan Chen", role: "Full-Stack Developer" },
        participants: [
            { id: "u9", name: "Ivan Chen", role: "Full-Stack Developer" },
        ],
    },
];

/* ── Helpers ───────────────────────────────────────────────────────────────── */

export function getUpcomingMeetings(): Meeting[] {
    const today = new Date().toISOString().split("T")[0];
    return meetings
        .filter((m) => m.date >= today && m.status !== "cancelled" && m.status !== "completed")
        .sort((a, b) => `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`));
}

export function getPastMeetings(): Meeting[] {
    const today = new Date().toISOString().split("T")[0];
    return meetings
        .filter((m) => m.date < today || m.status === "completed" || m.status === "cancelled")
        .sort((a, b) => `${b.date}${b.startTime}`.localeCompare(`${a.date}${a.startTime}`));
}

export function getMeetingById(id: string): Meeting | undefined {
    return meetings.find((m) => m.id === id);
}

export function formatMeetingDate(date: string): string {
    const d = new Date(date + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const diff = d.getTime() - today.getTime();
    const days = Math.round(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Today";
    if (days === 1) return "Tomorrow";
    if (days === -1) return "Yesterday";
    if (days > 1 && days <= 6) {
        return d.toLocaleDateString("en-US", { weekday: "long" });
    }

    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function formatTimeRange(start: string, end: string): string {
    const format = (t: string) => {
        const [h, m] = t.split(":").map(Number);
        const period = h >= 12 ? "PM" : "AM";
        const hour = h % 12 || 12;
        return `${hour}:${m.toString().padStart(2, "0")} ${period}`;
    };
    return `${format(start)} – ${format(end)}`;
}
