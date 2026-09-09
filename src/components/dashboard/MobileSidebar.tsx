"use client";

/* -------------------------------------------------------------------------- */
/*                           MOBILE SIDEBAR                                   */
/*                                                                            */
/*  Sheet/drawer sidebar for mobile viewports (< 768px).                      */
/*  Uses the existing Sheet component with side="left".                       */
/*  Closes automatically on route change.                                     */
/* -------------------------------------------------------------------------- */

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
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
import Link from "next/link";

/* ── Navigation config ─────────────────────────────────────────────────────── */

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/dashboard/projects", label: "Projects", icon: <FolderKanban className="h-5 w-5" /> },
    { href: "/dashboard/messages", label: "Messages", icon: <MessageSquare className="h-5 w-5" />, badge: 3 },
    { href: "/dashboard/files", label: "Files", icon: <FileText className="h-5 w-5" /> },
    { href: "/dashboard/meetings", label: "Meetings", icon: <Video className="h-5 w-5" /> },
    { href: "/dashboard/billing", label: "Billing", icon: <CreditCard className="h-5 w-5" /> },
    { href: "/dashboard/profile", label: "Profile", icon: <User className="h-5 w-5" /> },
    { href: "/dashboard/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
];

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function MobileSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { isMobileOpen, setMobileOpen } = useSidebarContext();
    const { profile } = useAuthContext();
    const supabase = createClient();

    /* ── Close on route change ──────────────────────────────────────── */
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname, setMobileOpen]);

    const isActive = (href: string) => {
        if (href === "/dashboard") return pathname === "/dashboard";
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
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sx-primary-500 to-sx-accent-500 shadow-lg shadow-sx-primary/20">
                                <span className="text-sm font-bold text-white">S</span>
                            </div>
                            <span className="text-base font-bold tracking-tight text-white">
                                Sentrox
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
                                {/* Active bar */}
                                {isActive(item.href) && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-gradient-to-b from-sx-primary-400 to-sx-accent-400" />
                                )}

                                <span
                                    className={cn(
                                        "flex shrink-0 items-center justify-center",
                                        isActive(item.href)
                                            ? "text-sx-primary-400"
                                            : "text-sx-text-subtle"
                                    )}
                                >
                                    {item.icon}
                                </span>
                                <span className="flex-1">{item.label}</span>

                                {item.badge && (
                                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sx-primary/15 px-1.5 text-[10px] font-semibold text-sx-primary-400">
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>

                    <Separator className="my-4 bg-white/[0.06]" />

                    {/* Support section */}
                    <div className="flex flex-col gap-0.5">
                        <Link
                            href="#"
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sx-text-muted hover:bg-white/[0.04] hover:text-sx-text-secondary transition-colors"
                        >
                            <HelpCircle className="h-5 w-5 text-sx-text-subtle" />
                            Help & Support
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sx-text-muted hover:bg-red-500/10 hover:text-red-400 transition-colors text-left"
                        >
                            <LogOut className="h-5 w-5 text-sx-text-subtle" />
                            Logout
                        </button>
                    </div>
                </ScrollArea>

                {/* Bottom profile */}
                <div className="border-t border-white/[0.06] p-4">
                    <div className="flex items-center gap-3">
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
                </div>
            </SheetContent>
        </Sheet>
    );
}
