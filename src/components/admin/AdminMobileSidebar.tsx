"use client";

/* -------------------------------------------------------------------------- */
/*                       ADMIN MOBILE SIDEBAR                                 */
/*                                                                            */
/*  Sheet/drawer sidebar for mobile viewports (< 768px).                      */
/*  Admin-specific nav, closes on route change.                               */
/* -------------------------------------------------------------------------- */

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
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
    Shield,
    Brain,
} from "lucide-react";

import { useSidebarContext } from "@/providers/SidebarProvider";
import { useAuthContext } from "@/providers/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import ScrollArea from "@/components/ui/ScrollArea";
import { Separator } from "@/components/ui/separator";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

/* ── Navigation ────────────────────────────────────────────────────────────── */

const navItems = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/admin/leads", label: "Leads", icon: <UserPlus className="h-5 w-5" />, badge: 5 },
    { href: "/admin/clients", label: "Clients", icon: <Users className="h-5 w-5" /> },
    { href: "/admin/projects", label: "Projects", icon: <FolderKanban className="h-5 w-5" /> },
    { href: "/admin/billing", label: "Billing", icon: <CreditCard className="h-5 w-5" /> },
    { href: "/admin/invoices", label: "Invoices", icon: <Receipt className="h-5 w-5" /> },
    { href: "/admin/team", label: "Team", icon: <UsersRound className="h-5 w-5" /> },
    { href: "/admin/blog", label: "Blog", icon: <PenSquare className="h-5 w-5" /> },
    { href: "/admin/testimonials", label: "Testimonials", icon: <Star className="h-5 w-5" /> },
    { href: "/admin/ai", label: "AI Tools", icon: <Brain className="h-5 w-5" /> },
    { href: "/admin/analytics", label: "Analytics", icon: <BarChart3 className="h-5 w-5" /> },
    { href: "/admin/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
];

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function AdminMobileSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { isMobileOpen, setMobileOpen } = useSidebarContext();
    const { profile } = useAuthContext();
    const supabase = createClient();

    /* ── Close on route change ────────────────────────────────────────── */
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname, setMobileOpen]);

    const isActive = (href: string) => {
        if (href === "/admin") return pathname === "/admin";
        return pathname.startsWith(href);
    };

    const handleLogout = async () => {
        setMobileOpen(false);
        await supabase.auth.signOut();
        router.push("/login");
    };

    return (
        <Sheet open={isMobileOpen} onOpenChange={(open) => setMobileOpen(open)}>
            <SheetContent
                side="left"
                className="w-[280px] border-r border-white/[0.06] bg-[#060a14] p-0"
                showCloseButton
            >
                {/* Header */}
                <SheetHeader className="border-b border-white/[0.06] px-5 py-4">
                    <SheetTitle>
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-orange-500 shadow-lg shadow-red-500/20">
                                <Shield className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-base font-bold tracking-tight text-white">
                                Sentrox
                            </span>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded">
                                Admin
                            </span>
                        </div>
                    </SheetTitle>
                </SheetHeader>

                {/* Navigation */}
                <ScrollArea className="flex-1 py-4 px-3">
                    <div className="flex flex-col gap-0.5">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                    isActive(item.href)
                                        ? "bg-white/[0.07] text-white"
                                        : "text-sx-text-muted hover:bg-white/[0.04] hover:text-sx-text-secondary"
                                )}
                            >
                                {isActive(item.href) && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-gradient-to-b from-red-400 to-orange-400" />
                                )}

                                <span
                                    className={cn(
                                        "flex shrink-0 items-center justify-center",
                                        isActive(item.href)
                                            ? "text-red-400"
                                            : "text-sx-text-subtle"
                                    )}
                                >
                                    {item.icon}
                                </span>
                                <span className="flex-1">{item.label}</span>

                                {item.badge && (
                                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500/15 px-1.5 text-[10px] font-semibold text-red-400">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>

                    <Separator className="my-4 bg-white/[0.06]" />

                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sx-text-muted hover:bg-red-500/10 hover:text-red-400 transition-colors text-left"
                    >
                        <LogOut className="h-5 w-5 text-sx-text-subtle" />
                        Logout
                    </button>
                </ScrollArea>

                {/* Bottom profile */}
                <div className="border-t border-white/[0.06] p-4">
                    <div className="flex items-center gap-3">
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
                </div>
            </SheetContent>
        </Sheet>
    );
}
