"use client";

/* -------------------------------------------------------------------------- */
/*                          DASHBOARD SIDEBAR                                 */
/*                                                                            */
/*  Desktop sidebar: fixed left, 256px expanded / 72px collapsed.             */
/*  Logo at top, nav groups in middle, profile section at bottom.             */
/*  Smooth width animation via Framer Motion.                                 */
/* -------------------------------------------------------------------------- */

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    FolderKanban,
    MessageSquare,
    FileText,
    Video,
    CreditCard,
    User,
    Settings,
    HelpCircle,
    LogOut,
    PanelLeftClose,
    PanelLeft,
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

const mainNav = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/dashboard/projects", label: "Projects", icon: <FolderKanban className="h-5 w-5" /> },
    { href: "/dashboard/messages", label: "Messages", icon: <MessageSquare className="h-5 w-5" />, badge: 3 },
    { href: "/dashboard/files", label: "Files", icon: <FileText className="h-5 w-5" /> },
    { href: "/dashboard/meetings", label: "Meetings", icon: <Video className="h-5 w-5" /> },
    { href: "/dashboard/billing", label: "Billing", icon: <CreditCard className="h-5 w-5" /> },
];

const accountNav = [
    { href: "/dashboard/profile", label: "Profile", icon: <User className="h-5 w-5" /> },
    { href: "/dashboard/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
];

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function DashboardSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { isCollapsed, toggle } = useSidebarContext();
    const { profile } = useAuthContext();
    const supabase = createClient();

    const isActive = (href: string) => {
        if (href === "/dashboard") return pathname === "/dashboard";
        return pathname.startsWith(href);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <motion.aside
            data-slot="dashboard-sidebar"
            animate={{ width: isCollapsed ? 72 : 256 }}
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
                        {/* Logo mark */}
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sx-primary-500 to-sx-accent-500 shadow-lg shadow-sx-primary/20">
                            <span className="text-sm font-bold text-white">S</span>
                        </div>
                        <span className="text-base font-bold tracking-tight text-white">
                            Sentrox
                        </span>
                    </motion.div>
                )}

                {isCollapsed && (
                    <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sx-primary-500 to-sx-accent-500 shadow-lg shadow-sx-primary/20">
                        <span className="text-sm font-bold text-white">S</span>
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
                <SidebarGroup label="Main">
                    {mainNav.map((item) => (
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

                <SidebarGroup label="Account" className="mt-2">
                    {accountNav.map((item) => (
                        <SidebarItem
                            key={item.href}
                            href={item.href}
                            icon={item.icon}
                            label={item.label}
                            isActive={isActive(item.href)}
                        />
                    ))}
                </SidebarGroup>

                <SidebarGroup label="Support" className="mt-2">
                    <SidebarItem
                        href="#"
                        icon={<HelpCircle className="h-5 w-5" />}
                        label="Help & Support"
                    />
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
                    <Tooltip content={profile?.full_name || "Profile"} side="right" delay={0}>
                        <button className="rounded-lg p-1 hover:bg-white/5 transition-colors">
                            <Avatar
                                src={profile?.avatar_url}
                                fallback={profile?.full_name || "U"}
                                size="sm"
                            />
                        </button>
                    </Tooltip>
                ) : (
                    <div className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-white/[0.04] transition-colors cursor-pointer">
                        <Avatar
                            src={profile?.avatar_url}
                            fallback={profile?.full_name || "U"}
                            size="sm"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="truncate text-sm font-medium text-white">
                                {profile?.full_name || "User"}
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
