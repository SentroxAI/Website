"use client";

/* -------------------------------------------------------------------------- */
/*                            USER DROPDOWN                                   */
/*                                                                            */
/*  Avatar trigger → dropdown menu with profile, settings, billing, etc.      */
/*  Logout calls supabase.auth.signOut() and redirects to /login.             */
/* -------------------------------------------------------------------------- */

import { useRouter } from "next/navigation";
import { User, Settings, CreditCard, HelpCircle, LogOut } from "lucide-react";

import { useAuthContext } from "@/providers/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import Avatar from "@/components/ui/Avatar";
import DropdownMenu from "@/components/ui/overlays/DropdownMenu";

export default function UserDropdown() {
    const router = useRouter();
    const { profile } = useAuthContext();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/login");
    };

    const items = [
        {
            label: "My Profile",
            icon: <User className="h-4 w-4" />,
            onClick: () => router.push("/dashboard/profile"),
        },
        {
            label: "Settings",
            icon: <Settings className="h-4 w-4" />,
            onClick: () => router.push("/dashboard/settings"),
        },
        {
            label: "Billing",
            icon: <CreditCard className="h-4 w-4" />,
            onClick: () => router.push("/dashboard/invoices"),
        },
        {
            label: "Support",
            icon: <HelpCircle className="h-4 w-4" />,
            onClick: () => {},
        },
        { separator: true, label: "" },
        {
            label: "Logout",
            icon: <LogOut className="h-4 w-4" />,
            danger: true,
            onClick: handleLogout,
        },
    ];

    return (
        <DropdownMenu
            trigger={
                <div className="flex items-center gap-2 rounded-xl px-1.5 py-1 hover:bg-white/5 transition-colors cursor-pointer">
                    <Avatar
                        src={profile?.avatar_url}
                        fallback={profile?.full_name || "U"}
                        size="sm"
                    />
                    <span className="hidden lg:block max-w-[100px] truncate text-sm font-medium text-sx-text-secondary">
                        {profile?.full_name || "User"}
                    </span>
                </div>
            }
            items={items}
            align="right"
        />
    );
}
