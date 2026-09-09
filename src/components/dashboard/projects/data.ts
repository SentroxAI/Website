/* -------------------------------------------------------------------------- */
/*                       PROJECT MODULE – MOCK DATA                           */
/*                                                                            */
/*  Rich mock data for the projects listing and detail pages.                 */
/*  Interfaces mirror Supabase schema shapes for easy migration.              */
/* -------------------------------------------------------------------------- */

/* ── Enums ─────────────────────────────────────────────────────────────────── */

export type ProjectStatus = "active" | "completed" | "pending" | "cancelled";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

/* ── Types ─────────────────────────────────────────────────────────────────── */

export interface ProjectMember {
    id: string;
    name: string;
    role: string;
    avatar?: string;
}

export interface ProjectTask {
    id: string;
    title: string;
    completed: boolean;
    priority: TaskPriority;
    assignee?: string;
    dueDate?: string;
}

export interface ProjectMilestone {
    id: string;
    title: string;
    dueDate: string;
    completed: boolean;
    tasks: ProjectTask[];
}

export interface ProjectFile {
    id: string;
    name: string;
    type: string;
    size: string;
    uploadedAt: string;
    uploadedBy: string;
}

export interface ProjectActivity {
    id: string;
    type: "task" | "milestone" | "file" | "comment" | "status";
    title: string;
    description: string;
    time: string;
    user: string;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    status: ProjectStatus;
    service: string;
    progress: number;
    startDate: string;
    dueDate: string;
    budget: number;
    budgetUsed: number;
    client: string;
    team: ProjectMember[];
    milestones: ProjectMilestone[];
    files: ProjectFile[];
    activity: ProjectActivity[];
}

/* ── Mock data ─────────────────────────────────────────────────────────────── */

export const projects: Project[] = [
    {
        id: "p1",
        title: "Website Redesign",
        description:
            "Complete overhaul of the corporate website with modern design, improved UX, and optimized performance. Includes responsive layouts, new branding integration, and CMS migration.",
        status: "active",
        service: "Web Development",
        progress: 75,
        startDate: "2026-06-01",
        dueDate: "2026-09-15",
        budget: 12000,
        budgetUsed: 8400,
        client: "Acme Corp",
        team: [
            { id: "u1", name: "Alice Johnson", role: "Lead Designer" },
            { id: "u2", name: "Bob Smith", role: "Frontend Developer" },
            { id: "u3", name: "Charlie Davis", role: "Backend Developer" },
        ],
        milestones: [
            {
                id: "ms1",
                title: "Discovery & Research",
                dueDate: "2026-06-15",
                completed: true,
                tasks: [
                    { id: "t1", title: "Stakeholder interviews", completed: true, priority: "high" },
                    { id: "t2", title: "Competitive analysis", completed: true, priority: "medium" },
                    { id: "t3", title: "User journey mapping", completed: true, priority: "high" },
                ],
            },
            {
                id: "ms2",
                title: "Design Phase",
                dueDate: "2026-07-15",
                completed: true,
                tasks: [
                    { id: "t4", title: "Wireframes", completed: true, priority: "high" },
                    { id: "t5", title: "UI mockups", completed: true, priority: "high" },
                    { id: "t6", title: "Design system", completed: true, priority: "medium" },
                    { id: "t7", title: "Client approval", completed: true, priority: "urgent" },
                ],
            },
            {
                id: "ms3",
                title: "Development",
                dueDate: "2026-08-30",
                completed: false,
                tasks: [
                    { id: "t8", title: "Frontend implementation", completed: true, priority: "high", assignee: "Bob Smith" },
                    { id: "t9", title: "Backend API", completed: true, priority: "high", assignee: "Charlie Davis" },
                    { id: "t10", title: "CMS integration", completed: false, priority: "medium", assignee: "Charlie Davis" },
                    { id: "t11", title: "Responsive testing", completed: false, priority: "high", assignee: "Bob Smith" },
                ],
            },
            {
                id: "ms4",
                title: "Launch",
                dueDate: "2026-09-15",
                completed: false,
                tasks: [
                    { id: "t12", title: "QA testing", completed: false, priority: "urgent" },
                    { id: "t13", title: "Performance optimization", completed: false, priority: "high" },
                    { id: "t14", title: "Go-live deployment", completed: false, priority: "urgent" },
                ],
            },
        ],
        files: [
            { id: "f1", name: "brand-guidelines-v2.pdf", type: "pdf", size: "2.4 MB", uploadedAt: "2026-08-02", uploadedBy: "Alice Johnson" },
            { id: "f2", name: "wireframes-desktop.fig", type: "figma", size: "12.8 MB", uploadedAt: "2026-07-10", uploadedBy: "Alice Johnson" },
            { id: "f3", name: "homepage-hero.png", type: "image", size: "856 KB", uploadedAt: "2026-07-28", uploadedBy: "Bob Smith" },
        ],
        activity: [
            { id: "a1", type: "task", title: "Frontend implementation completed", description: "All responsive layouts finalized", time: "2 hours ago", user: "Bob Smith" },
            { id: "a2", type: "file", title: "brand-guidelines-v2.pdf uploaded", description: "Updated brand guide with new colors", time: "Yesterday", user: "Alice Johnson" },
            { id: "a3", type: "milestone", title: "Design Phase completed", description: "All design deliverables approved", time: "3 days ago", user: "Alice Johnson" },
            { id: "a4", type: "comment", title: "CMS integration discussion", description: "Proposed WordPress → Sanity migration", time: "4 days ago", user: "Charlie Davis" },
        ],
    },
    {
        id: "p2",
        title: "Mobile App v2.0",
        description:
            "Major update to the mobile application with new features including real-time chat, push notifications, and biometric authentication.",
        status: "active",
        service: "Mobile Development",
        progress: 42,
        startDate: "2026-07-01",
        dueDate: "2026-10-30",
        budget: 25000,
        budgetUsed: 9800,
        client: "TechStart Inc.",
        team: [
            { id: "u4", name: "Diana Wilson", role: "Product Manager" },
            { id: "u5", name: "Eve Martinez", role: "Mobile Developer" },
        ],
        milestones: [
            {
                id: "ms5",
                title: "Planning & Architecture",
                dueDate: "2026-07-20",
                completed: true,
                tasks: [
                    { id: "t15", title: "Requirements gathering", completed: true, priority: "high" },
                    { id: "t16", title: "Architecture design", completed: true, priority: "high" },
                ],
            },
            {
                id: "ms6",
                title: "Core Features",
                dueDate: "2026-09-01",
                completed: false,
                tasks: [
                    { id: "t17", title: "Auth module", completed: true, priority: "urgent", assignee: "Eve Martinez" },
                    { id: "t18", title: "Chat system", completed: false, priority: "high", assignee: "Eve Martinez" },
                    { id: "t19", title: "Push notifications", completed: false, priority: "medium" },
                ],
            },
            {
                id: "ms7",
                title: "Testing & Release",
                dueDate: "2026-10-30",
                completed: false,
                tasks: [
                    { id: "t20", title: "Beta testing", completed: false, priority: "high" },
                    { id: "t21", title: "App Store submission", completed: false, priority: "urgent" },
                ],
            },
        ],
        files: [
            { id: "f4", name: "app-architecture.pdf", type: "pdf", size: "1.2 MB", uploadedAt: "2026-07-15", uploadedBy: "Diana Wilson" },
        ],
        activity: [
            { id: "a5", type: "task", title: "Auth module completed", description: "Biometric auth implemented", time: "1 day ago", user: "Eve Martinez" },
            { id: "a6", type: "status", title: "Sprint 2 started", description: "Chat system development begins", time: "3 days ago", user: "Diana Wilson" },
        ],
    },
    {
        id: "p3",
        title: "SEO Optimization",
        description:
            "Comprehensive SEO audit and optimization including technical SEO, content strategy, link building, and monthly reporting.",
        status: "completed",
        service: "Digital Marketing",
        progress: 100,
        startDate: "2026-04-01",
        dueDate: "2026-07-20",
        budget: 4500,
        budgetUsed: 4200,
        client: "GreenLeaf Co.",
        team: [
            { id: "u6", name: "Frank Lee", role: "SEO Specialist" },
        ],
        milestones: [
            {
                id: "ms8",
                title: "Audit & Strategy",
                dueDate: "2026-04-30",
                completed: true,
                tasks: [
                    { id: "t22", title: "Technical audit", completed: true, priority: "high" },
                    { id: "t23", title: "Content strategy", completed: true, priority: "high" },
                ],
            },
            {
                id: "ms9",
                title: "Implementation",
                dueDate: "2026-06-30",
                completed: true,
                tasks: [
                    { id: "t24", title: "On-page optimization", completed: true, priority: "high" },
                    { id: "t25", title: "Link building", completed: true, priority: "medium" },
                ],
            },
            {
                id: "ms10",
                title: "Reporting & Handoff",
                dueDate: "2026-07-20",
                completed: true,
                tasks: [
                    { id: "t26", title: "Performance report", completed: true, priority: "high" },
                    { id: "t27", title: "Knowledge transfer", completed: true, priority: "medium" },
                ],
            },
        ],
        files: [],
        activity: [
            { id: "a7", type: "milestone", title: "Project completed", description: "All deliverables handed off", time: "2 weeks ago", user: "Frank Lee" },
        ],
    },
    {
        id: "p4",
        title: "Brand Identity System",
        description:
            "Create a complete brand identity including logo, color palette, typography, iconography, and brand guidelines document.",
        status: "pending",
        service: "Branding",
        progress: 0,
        startDate: "2026-09-01",
        dueDate: "2026-11-01",
        budget: 8000,
        budgetUsed: 0,
        client: "Nova Ventures",
        team: [
            { id: "u7", name: "Grace Kim", role: "Brand Designer" },
            { id: "u8", name: "Henry Park", role: "Art Director" },
        ],
        milestones: [
            {
                id: "ms11",
                title: "Research & Moodboards",
                dueDate: "2026-09-15",
                completed: false,
                tasks: [
                    { id: "t28", title: "Market research", completed: false, priority: "high" },
                    { id: "t29", title: "Moodboard creation", completed: false, priority: "medium" },
                ],
            },
        ],
        files: [],
        activity: [],
    },
    {
        id: "p5",
        title: "E-commerce Integration",
        description:
            "Integrate Stripe payments, inventory management, and order tracking into the existing platform.",
        status: "cancelled",
        service: "Web Development",
        progress: 30,
        startDate: "2026-05-01",
        dueDate: "2026-12-15",
        budget: 18000,
        budgetUsed: 5100,
        client: "RetailMax",
        team: [
            { id: "u9", name: "Ivan Chen", role: "Full-Stack Developer" },
            { id: "u10", name: "Julia Brown", role: "QA Engineer" },
        ],
        milestones: [
            {
                id: "ms12",
                title: "Payment Integration",
                dueDate: "2026-07-01",
                completed: true,
                tasks: [
                    { id: "t30", title: "Stripe setup", completed: true, priority: "urgent" },
                    { id: "t31", title: "Checkout flow", completed: true, priority: "high" },
                ],
            },
            {
                id: "ms13",
                title: "Inventory System",
                dueDate: "2026-09-01",
                completed: false,
                tasks: [
                    { id: "t32", title: "Database schema", completed: false, priority: "high" },
                    { id: "t33", title: "Admin dashboard", completed: false, priority: "medium" },
                ],
            },
        ],
        files: [
            { id: "f5", name: "api-documentation.pdf", type: "pdf", size: "3.1 MB", uploadedAt: "2026-06-20", uploadedBy: "Ivan Chen" },
        ],
        activity: [
            { id: "a8", type: "status", title: "Project cancelled", description: "Client requested discontinuation", time: "1 week ago", user: "Ivan Chen" },
        ],
    },
];

/* ── Helper functions ──────────────────────────────────────────────────────── */

export function getProjectById(id: string): Project | undefined {
    return projects.find((p) => p.id === id);
}

export function getProjectsByStatus(status: ProjectStatus): Project[] {
    return projects.filter((p) => p.status === status);
}

export function getAllTasks(project: Project): ProjectTask[] {
    return project.milestones.flatMap((m) => m.tasks);
}

export function getTaskStats(project: Project) {
    const tasks = getAllTasks(project);
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    return { total, completed, remaining: total - completed };
}
