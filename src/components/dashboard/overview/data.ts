/* -------------------------------------------------------------------------- */
/*                          DASHBOARD MOCK DATA                               */
/*                                                                            */
/*  Centralized mock data for all dashboard overview widgets.                 */
/*  Structured so components can later swap to Supabase queries               */
/*  without changing their prop interfaces.                                   */
/* -------------------------------------------------------------------------- */

/* ── Stats ─────────────────────────────────────────────────────────────────── */

export interface StatItem {
    id: string;
    label: string;
    value: number;
    previousValue?: number;
    format?: "number" | "currency" | "percentage" | "storage";
    icon: string; // lucide icon name
    color: string; // tailwind color key
    sparkline?: number[];
}

export const statsData: StatItem[] = [
    {
        id: "active-projects",
        label: "Active Projects",
        value: 12,
        previousValue: 9,
        icon: "FolderKanban",
        color: "blue",
        sparkline: [4, 6, 5, 8, 7, 9, 12],
    },
    {
        id: "completed-projects",
        label: "Completed",
        value: 34,
        previousValue: 28,
        icon: "CheckCircle2",
        color: "emerald",
        sparkline: [20, 22, 24, 26, 29, 31, 34],
    },
    {
        id: "unread-messages",
        label: "Unread Messages",
        value: 8,
        previousValue: 12,
        icon: "MessageSquare",
        color: "cyan",
        sparkline: [15, 12, 18, 10, 14, 11, 8],
    },
    {
        id: "upcoming-meetings",
        label: "Upcoming Meetings",
        value: 5,
        previousValue: 3,
        icon: "Calendar",
        color: "violet",
        sparkline: [2, 1, 3, 2, 4, 3, 5],
    },
];

/* ── Storage ───────────────────────────────────────────────────────────────── */

export interface StorageData {
    used: number; // GB
    total: number; // GB
    breakdown: { label: string; size: number; color: string }[];
}

export const storageData: StorageData = {
    used: 14.2,
    total: 25,
    breakdown: [
        { label: "Documents", size: 5.8, color: "bg-blue-500" },
        { label: "Images", size: 4.1, color: "bg-cyan-500" },
        { label: "Videos", size: 3.2, color: "bg-violet-500" },
        { label: "Other", size: 1.1, color: "bg-slate-500" },
    ],
};

/* ── Projects ──────────────────────────────────────────────────────────────── */

export interface ProjectItem {
    id: string;
    name: string;
    status: "pending" | "in-progress" | "completed" | "on-hold";
    progress: number;
    dueDate: string;
    team: string[];
    budget: number;
    budgetUsed: number;
}

export const projectsData: ProjectItem[] = [
    {
        id: "p1",
        name: "Website Redesign",
        status: "in-progress",
        progress: 75,
        dueDate: "2026-09-15",
        team: ["Alice", "Bob", "Charlie"],
        budget: 12000,
        budgetUsed: 8400,
    },
    {
        id: "p2",
        name: "Mobile App v2.0",
        status: "in-progress",
        progress: 42,
        dueDate: "2026-10-30",
        team: ["Diana", "Eve"],
        budget: 25000,
        budgetUsed: 9800,
    },
    {
        id: "p3",
        name: "SEO Optimization",
        status: "completed",
        progress: 100,
        dueDate: "2026-07-20",
        team: ["Frank"],
        budget: 4500,
        budgetUsed: 4200,
    },
    {
        id: "p4",
        name: "Brand Identity System",
        status: "pending",
        progress: 0,
        dueDate: "2026-11-01",
        team: ["Grace", "Henry"],
        budget: 8000,
        budgetUsed: 0,
    },
    {
        id: "p5",
        name: "E-commerce Integration",
        status: "on-hold",
        progress: 30,
        dueDate: "2026-12-15",
        team: ["Ivan", "Julia"],
        budget: 18000,
        budgetUsed: 5100,
    },
];

/* ── Project progress summary ──────────────────────────────────────────────── */

export interface ProgressSummary {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
    onHold: number;
    overallCompletion: number;
}

export const progressSummary: ProgressSummary = {
    total: 46,
    completed: 34,
    inProgress: 8,
    pending: 3,
    onHold: 1,
    overallCompletion: 74,
};

/* ── Activity Timeline ─────────────────────────────────────────────────────── */

export interface ActivityItem {
    id: string;
    type: "project" | "invoice" | "meeting" | "file" | "message";
    title: string;
    description: string;
    time: string;
    relativeTime: string;
}

export const activityData: ActivityItem[] = [
    {
        id: "a1",
        type: "project",
        title: 'Project "Website Redesign" updated',
        description: "Milestone 3 completed — responsive layouts finalized",
        time: "2026-08-03T14:30:00",
        relativeTime: "2 hours ago",
    },
    {
        id: "a2",
        type: "invoice",
        title: "Invoice #103 paid",
        description: "$4,200.00 received for SEO Optimization",
        time: "2026-08-03T11:15:00",
        relativeTime: "5 hours ago",
    },
    {
        id: "a3",
        type: "meeting",
        title: "Meeting scheduled",
        description: "Design review with Alice — Aug 5, 10:00 AM",
        time: "2026-08-03T09:00:00",
        relativeTime: "7 hours ago",
    },
    {
        id: "a4",
        type: "file",
        title: "New file uploaded",
        description: "brand-guidelines-v2.pdf added to Brand Identity System",
        time: "2026-08-02T16:45:00",
        relativeTime: "Yesterday",
    },
    {
        id: "a5",
        type: "message",
        title: "Message received",
        description: "Bob sent feedback on the homepage wireframes",
        time: "2026-08-02T14:20:00",
        relativeTime: "Yesterday",
    },
    {
        id: "a6",
        type: "project",
        title: 'Project "Mobile App v2.0" milestone added',
        description: "Authentication module scope finalized",
        time: "2026-08-01T10:00:00",
        relativeTime: "2 days ago",
    },
];

/* ── Meetings ──────────────────────────────────────────────────────────────── */

export interface MeetingItem {
    id: string;
    title: string;
    date: string;
    time: string;
    duration: string;
    client: string;
    platform: "google-meet" | "zoom" | "teams";
    link: string;
}

export const meetingsData: MeetingItem[] = [
    {
        id: "m1",
        title: "Design Review",
        date: "2026-08-05",
        time: "10:00 AM",
        duration: "45 min",
        client: "Alice Johnson",
        platform: "google-meet",
        link: "#",
    },
    {
        id: "m2",
        title: "Sprint Planning",
        date: "2026-08-06",
        time: "2:00 PM",
        duration: "1 hour",
        client: "Bob Smith",
        platform: "zoom",
        link: "#",
    },
    {
        id: "m3",
        title: "Client Onboarding",
        date: "2026-08-07",
        time: "11:00 AM",
        duration: "30 min",
        client: "Charlie Davis",
        platform: "google-meet",
        link: "#",
    },
    {
        id: "m4",
        title: "Quarterly Review",
        date: "2026-08-10",
        time: "3:30 PM",
        duration: "1.5 hours",
        client: "Diana Wilson",
        platform: "teams",
        link: "#",
    },
];

/* ── Files ─────────────────────────────────────────────────────────────────── */

export interface FileItem {
    id: string;
    name: string;
    type: "pdf" | "image" | "video" | "document" | "figma" | "spreadsheet";
    size: string;
    uploadedAt: string;
    relativeTime: string;
}

export const filesData: FileItem[] = [
    {
        id: "f1",
        name: "brand-guidelines-v2.pdf",
        type: "pdf",
        size: "2.4 MB",
        uploadedAt: "2026-08-02",
        relativeTime: "Yesterday",
    },
    {
        id: "f2",
        name: "wireframes-mobile.fig",
        type: "figma",
        size: "12.8 MB",
        uploadedAt: "2026-08-01",
        relativeTime: "2 days ago",
    },
    {
        id: "f3",
        name: "homepage-hero.png",
        type: "image",
        size: "856 KB",
        uploadedAt: "2026-07-31",
        relativeTime: "3 days ago",
    },
    {
        id: "f4",
        name: "project-proposal.docx",
        type: "document",
        size: "340 KB",
        uploadedAt: "2026-07-30",
        relativeTime: "4 days ago",
    },
    {
        id: "f5",
        name: "budget-tracker.xlsx",
        type: "spreadsheet",
        size: "128 KB",
        uploadedAt: "2026-07-28",
        relativeTime: "6 days ago",
    },
];

/* ── Messages ──────────────────────────────────────────────────────────────── */

export interface MessageItem {
    id: string;
    senderName: string;
    senderAvatar?: string;
    preview: string;
    time: string;
    relativeTime: string;
    unread: boolean;
}

export const messagesData: MessageItem[] = [
    {
        id: "msg1",
        senderName: "Alice Johnson",
        preview: "The new homepage design looks great! I have a few suggestions for the hero section...",
        time: "2026-08-03T16:30:00",
        relativeTime: "30 min ago",
        unread: true,
    },
    {
        id: "msg2",
        senderName: "Bob Smith",
        preview: "Can we move the sprint planning to Thursday? I have a conflict on Wednesday.",
        time: "2026-08-03T14:15:00",
        relativeTime: "2 hours ago",
        unread: true,
    },
    {
        id: "msg3",
        senderName: "Charlie Davis",
        preview: "Invoice #103 has been processed. Payment should arrive within 2 business days.",
        time: "2026-08-03T11:00:00",
        relativeTime: "5 hours ago",
        unread: false,
    },
    {
        id: "msg4",
        senderName: "Diana Wilson",
        preview: "Looking forward to our quarterly review next week. I'll prepare the deck.",
        time: "2026-08-02T09:45:00",
        relativeTime: "Yesterday",
        unread: false,
    },
];

/* ── Quick Actions ─────────────────────────────────────────────────────────── */

export interface QuickAction {
    id: string;
    label: string;
    icon: string; // lucide icon name
    href: string;
    color: string;
    description: string;
}

export const quickActionsData: QuickAction[] = [
    {
        id: "qa1",
        label: "Upload Files",
        icon: "Upload",
        href: "/dashboard/files",
        color: "blue",
        description: "Upload project files",
    },
    {
        id: "qa2",
        label: "Send Message",
        icon: "Send",
        href: "/dashboard/messages",
        color: "cyan",
        description: "Start a conversation",
    },
    {
        id: "qa3",
        label: "Book Meeting",
        icon: "CalendarPlus",
        href: "/dashboard/meetings",
        color: "violet",
        description: "Schedule a call",
    },
    {
        id: "qa4",
        label: "View Projects",
        icon: "FolderKanban",
        href: "/dashboard/projects",
        color: "emerald",
        description: "Check project status",
    },
    {
        id: "qa5",
        label: "Contact Support",
        icon: "Headphones",
        href: "#",
        color: "amber",
        description: "Get help anytime",
    },
    {
        id: "qa6",
        label: "Pay Invoice",
        icon: "CreditCard",
        href: "/dashboard/invoices",
        color: "rose",
        description: "View pending invoices",
    },
];
