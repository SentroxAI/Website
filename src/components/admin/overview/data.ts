/* -------------------------------------------------------------------------- */
/*                   ADMIN OVERVIEW – MOCK DATA                               */
/*                                                                            */
/*  Revenue, clients, leads, projects, and chart data.                        */
/* -------------------------------------------------------------------------- */

/* ── Stat cards ────────────────────────────────────────────────────────────── */

export interface StatCard {
    id: string;
    label: string;
    value: string;
    change: number; // percentage
    trend: "up" | "down" | "neutral";
    period: string;
}

export const statCards: StatCard[] = [
    { id: "revenue", label: "Revenue", value: "₹18,42,500", change: 12.5, trend: "up", period: "vs last month" },
    { id: "clients", label: "Active Clients", value: "24", change: 8.3, trend: "up", period: "vs last month" },
    { id: "leads", label: "New Leads", value: "47", change: -3.2, trend: "down", period: "vs last month" },
    { id: "projects", label: "Active Projects", value: "18", change: 5.6, trend: "up", period: "vs last month" },
    { id: "utilization", label: "Team Utilization", value: "87%", change: 2.1, trend: "up", period: "vs last month" },
    { id: "conversion", label: "Conversion Rate", value: "34%", change: 4.8, trend: "up", period: "vs last month" },
    { id: "meetings", label: "Meetings This Week", value: "12", change: 0, trend: "neutral", period: "this week" },
    { id: "growth", label: "Monthly Growth", value: "+15%", change: 15.0, trend: "up", period: "MoM" },
];

/* ── Revenue chart ─────────────────────────────────────────────────────────── */

export interface ChartDataPoint {
    label: string;
    value: number;
}

export const revenueChartData: ChartDataPoint[] = [
    { label: "Jan", value: 980000 },
    { label: "Feb", value: 1120000 },
    { label: "Mar", value: 1350000 },
    { label: "Apr", value: 1100000 },
    { label: "May", value: 1480000 },
    { label: "Jun", value: 1620000 },
    { label: "Jul", value: 1780000 },
    { label: "Aug", value: 1842500 },
];

export const leadsChartData: ChartDataPoint[] = [
    { label: "Jan", value: 32 },
    { label: "Feb", value: 41 },
    { label: "Mar", value: 55 },
    { label: "Apr", value: 38 },
    { label: "May", value: 62 },
    { label: "Jun", value: 48 },
    { label: "Jul", value: 53 },
    { label: "Aug", value: 47 },
];

export const projectsChartData: ChartDataPoint[] = [
    { label: "Jan", value: 8 },
    { label: "Feb", value: 10 },
    { label: "Mar", value: 12 },
    { label: "Apr", value: 11 },
    { label: "May", value: 14 },
    { label: "Jun", value: 16 },
    { label: "Jul", value: 17 },
    { label: "Aug", value: 18 },
];

/* ── Pipeline ──────────────────────────────────────────────────────────────── */

export interface PipelineStage {
    stage: string;
    count: number;
    value: string;
    color: string;
}

export const pipelineData: PipelineStage[] = [
    { stage: "New", count: 12, value: "₹8,50,000", color: "bg-blue-500" },
    { stage: "Contacted", count: 8, value: "₹6,20,000", color: "bg-cyan-500" },
    { stage: "Qualified", count: 15, value: "₹12,40,000", color: "bg-emerald-500" },
    { stage: "Proposal", count: 7, value: "₹9,80,000", color: "bg-amber-500" },
    { stage: "Won", count: 5, value: "₹7,50,000", color: "bg-green-500" },
];

/* ── Recent activity ───────────────────────────────────────────────────────── */

export type ActivityType = "client" | "lead" | "project" | "invoice" | "team" | "meeting";

export interface RecentActivity {
    id: string;
    type: ActivityType;
    title: string;
    description: string;
    time: string;
    user: string;
}

export const recentActivities: RecentActivity[] = [
    { id: "a1", type: "lead", title: "New lead received", description: "TechVision Inc. submitted a project inquiry via the website.", time: "15 min ago", user: "System" },
    { id: "a2", type: "client", title: "Client onboarded", description: "Acme Corp has completed their onboarding process.", time: "1 hour ago", user: "Alice Johnson" },
    { id: "a3", type: "project", title: "Project milestone completed", description: "Website Redesign — Phase 2 Design approved by client.", time: "2 hours ago", user: "Bob Smith" },
    { id: "a4", type: "invoice", title: "Invoice paid", description: "Invoice #INV-0098 for ₹2,50,000 marked as paid.", time: "3 hours ago", user: "System" },
    { id: "a5", type: "team", title: "Team member added", description: "Eve Martinez joined the Mobile Development team.", time: "5 hours ago", user: "Diana Wilson" },
    { id: "a6", type: "meeting", title: "Meeting scheduled", description: "Quarterly Business Review set for Aug 7 at 11 AM.", time: "Yesterday", user: "Diana Wilson" },
    { id: "a7", type: "lead", title: "Lead converted", description: "FinEdge Solutions converted from lead to active client.", time: "Yesterday", user: "Frank Lee" },
    { id: "a8", type: "project", title: "Project created", description: "Brand Identity System project has been initialized.", time: "2 days ago", user: "Grace Kim" },
];

/* ── Top clients ───────────────────────────────────────────────────────────── */

export interface TopClient {
    id: string;
    name: string;
    revenue: string;
    projects: number;
    status: "active" | "inactive";
}

export const topClients: TopClient[] = [
    { id: "tc1", name: "Acme Corp", revenue: "₹4,80,000", projects: 3, status: "active" },
    { id: "tc2", name: "TechVision Inc.", revenue: "₹3,50,000", projects: 2, status: "active" },
    { id: "tc3", name: "GreenLeaf Studios", revenue: "₹2,90,000", projects: 2, status: "active" },
    { id: "tc4", name: "FinEdge Solutions", revenue: "₹2,20,000", projects: 1, status: "active" },
    { id: "tc5", name: "NovaStack Labs", revenue: "₹1,85,000", projects: 1, status: "inactive" },
];

/* ── Upcoming deadlines ────────────────────────────────────────────────────── */

export interface Deadline {
    id: string;
    project: string;
    milestone: string;
    dueDate: string;
    daysLeft: number;
    priority: "high" | "medium" | "low";
}

export const upcomingDeadlines: Deadline[] = [
    { id: "d1", project: "Website Redesign", milestone: "Phase 3 — Development", dueDate: "Aug 10", daysLeft: 6, priority: "high" },
    { id: "d2", project: "Mobile App v2.0", milestone: "Alpha Release", dueDate: "Aug 15", daysLeft: 11, priority: "high" },
    { id: "d3", project: "E-commerce Integration", milestone: "Payment Gateway", dueDate: "Aug 18", daysLeft: 14, priority: "medium" },
    { id: "d4", project: "Brand Identity System", milestone: "Initial Concepts", dueDate: "Aug 22", daysLeft: 18, priority: "low" },
];
