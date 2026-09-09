/* -------------------------------------------------------------------------- */
/*                        DASHBOARD LAYOUT                                    */
/*                                                                            */
/*  Server Component — checks Supabase session.                               */
/*  Redirects to /login if unauthenticated.                                   */
/*  Wraps children in the DashboardShell.                                     */
/* -------------------------------------------------------------------------- */

import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import DashboardShell from "@/components/dashboard/DashboardShell";

export const metadata: Metadata = {
    title: "Dashboard",
    robots: {
        index: false,
        follow: false,
    },
};

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    /* ── Session check ─────────────────────────────────────────────────── */
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    /* ── Render dashboard shell ────────────────────────────────────────── */
    return <DashboardShell>{children}</DashboardShell>;
}
