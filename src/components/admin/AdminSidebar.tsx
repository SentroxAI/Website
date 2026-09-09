"use client";

/* -------------------------------------------------------------------------- */
/*                          ADMIN SIDEBAR                                     */
/*                                                                            */
/*  Desktop sidebar: fixed left, 260px expanded / 72px collapsed.             */
/*  Admin-specific navigation with management sections.                       */
/* -------------------------------------------------------------------------- */

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    Users,
    UserPlus,
    FolderKanban,
    Receipt,
    CreditCard,
    PenSquare,
    BarChart3,
    Star,
    UsersRound,
    Settings,
    LogOut,
    PanelLeftClose,
    PanelLeft,
    Shield,
    Brain,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useSidebarContext } from "@/providers/SidebarProvider";
import { useAuthContext } from "@/providers/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import Avatar from "@/components/ui/Avatar";
import ScrollArea from "@/components/ui/ScrollArea";
import Tooltip from "@/components/ui/overlays/Tooltip";
import SidebarItem from "@/components/dashboard/SidebarItem";
import SidebarGroup from "@/components/dashboard/SidebarGroup";

/* ── Navigation config ─────────────────────────────────────────────────────── */

const overviewNav = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
];

const managementNav = [
    { href: "/admin/leads", label: "Leads", icon: <UserPlus className="h-5 w-5" />, badge: 5 },
    { href: "/admin/clients", label: "Clients", icon: <Users className="h-5 w-5" /> },
    { href: "/admin/projects", label: "Projects", icon: <FolderKanban className="h-5 w-5" /> },
    { href: "/admin/billing", label: "Billing", icon: <CreditCard className="h-5 w-5" /> },
    { href: "/admin/invoices", label: "Invoices", icon: <Receipt className="h-5 w-5" /> },
    { href: "/admin/team", label: "Team", icon: <UsersRound className="h-5 w-5" /> },
];

const contentNav = [
    { href: "/admin/blog", label: "Blog", icon: <PenSquare className="h-5 w-5" /> },
    { href: "/admin/testimonials", label: "Testimonials", icon: <Star className="h-5 w-5" /> },
    { href: "/admin/ai", label: "AI Tools", icon: <Brain className="h-5 w-5" /> },
];

const insightsNav = [
    { href: "/admin/analytics", label: "Analytics", icon: <BarChart3 className="h-5 w-5" /> },
    { href: "/admin/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
];

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { isCollapsed, toggle } = useSidebarContext();
    const { profile } = useAuthContext();
    const supabase = createClient();

    const isActive = (href: string) => {
        if (href === "/admin") return pathname === "/admin";
        return pathname.startsWith(href);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <motion.aside
            data-slot="admin-sidebar"
            animate={{ width: isCollapsed ? 72 : 260 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className={cn(
                "fixed inset-y-0 left-0 z-40 hidden md:flex flex-col",
                "border-r border-white/[0.06] bg-[#060a14]"
            )}
        >
            {/* ── Logo + Collapse toggle ───────────────────────────────── */}
            <div className="flex h-16 items-center justify-between px-4 border-b border-white/[0.06]">
                {!isCollapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-2.5"
                    >
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/20">
                            <Shield className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <span className="text-base font-bold tracking-tight text-white">
                                Sentrox
                            </span>
                            <span className="ml-1.5 text-[10px] font-semibold uppercase tracking-wider text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">
                                Admin
                            </span>
                        </div>
                    </motion.div>
                )}

                {isCollapsed && (
                    <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/20">
                        <Shield className="h-4 w-4 text-white" />
                    </div>
                )}

                {!isCollapsed && (
                    <Tooltip content="Collapse sidebar" side="right" delay={0}>
                        <button
                            onClick={toggle}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-sx-text-subtle hover:bg-white/5 hover:text-sx-text-muted transition-colors"
                        >
                            <PanelLeftClose className="h-4 w-4" />
                        </button>
                    </Tooltip>
                )}
            </div>

            {/* ── Navigation ───────────────────────────────────────────── */}
            <ScrollArea className="flex-1 py-4">
                <SidebarGroup label="Overview">
                    {overviewNav.map((item) => (
                        <SidebarItem
                            key={item.href}
                            href={item.href}
                            icon={item.icon}
                            label={item.label}
                            isActive={isActive(item.href)}
                        />
                    ))}
                </SidebarGroup>

                <SidebarGroup label="Management" className="mt-2">
                    {managementNav.map((item) => (
                        <SidebarItem
                            key={item.href}
                            href={item.href}
                            icon={item.icon}
                            label={item.label}
                            isActive={isActive(item.href)}
                            badge={item.badge}
                        />
                    ))}
                </SidebarGroup>

                <SidebarGroup label="Content" className="mt-2">
                    {contentNav.map((item) => (
                        <SidebarItem
                            key={item.href}
                            href={item.href}
                            icon={item.icon}
                            label={item.label}
                            isActive={isActive(item.href)}
                        />
                    ))}
                </SidebarGroup>

                <SidebarGroup label="System" className="mt-2">
                    {insightsNav.map((item) => (
                        <SidebarItem
                            key={item.href}
                            href={item.href}
                            icon={item.icon}
                            label={item.label}
                            isActive={isActive(item.href)}
                        />
                    ))}
                    <SidebarItem
                        href="#"
                        icon={<LogOut className="h-5 w-5" />}
                        label="Logout"
                        onClick={handleLogout}
                    />
                </SidebarGroup>
            </ScrollArea>

            {/* ── Collapse toggle (collapsed state) ────────────────────── */}
            {isCollapsed && (
                <div className="flex justify-center py-2 border-t border-white/[0.06]">
                    <Tooltip content="Expand sidebar" side="right" delay={0}>
                        <button
                            onClick={toggle}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-sx-text-subtle hover:bg-white/5 hover:text-sx-text-muted transition-colors"
                        >
                            <PanelLeft className="h-4 w-4" />
                        </button>
                    </Tooltip>
                </div>
            )}

            {/* ── Bottom profile section ───────────────────────────────── */}
            <div className={cn(
                "border-t border-white/[0.06] p-3",
                isCollapsed && "flex justify-center"
            )}>
                {isCollapsed ? (
                    <Tooltip content={profile?.full_name || "Admin"} side="right" delay={0}>
                        <button className="rounded-lg p-1 hover:bg-white/5 transition-colors">
                            <Avatar
                                src={profile?.avatar_url}
                                fallback={profile?.full_name || "A"}
                                size="sm"
                            />
                        </button>
                    </Tooltip>
                ) : (
                    <div className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-white/[0.04] transition-colors cursor-pointer">
                        <Avatar
                            src={profile?.avatar_url}
                            fallback={profile?.full_name || "A"}
                            size="sm"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-medium text-white">
                                {profile?.full_name || "Admin"}
                            </p>
                            <p className="truncate text-xs text-sx-text-subtle">
                                {profile?.email || ""}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </motion.aside>
    );
}
