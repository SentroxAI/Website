/* -------------------------------------------------------------------------- */
/*                          ADMIN LAYOUT                                      */
/*                                                                            */
/*  Server Component — checks Supabase session AND admin role.                */
/*  Redirects to /login if unauthenticated, /dashboard if not admin.          */
/*  Wraps children in the AdminShell.                                         */
/* -------------------------------------------------------------------------- */

import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
    title: "Admin",
    robots: {
        index: false,
        follow: false,
    },
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    /* ── Session + role check ──────────────────────────────────────────── */
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Check admin role from users table
    const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single<{ role: string }>();

    if (profile?.role !== "admin") {
        redirect("/dashboard");
    }

    /* ── Render admin shell ────────────────────────────────────────────── */
    return <AdminShell>{children}</AdminShell>;
}
