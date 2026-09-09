/* -------------------------------------------------------------------------- */
/*                      AUTH CALLBACK ROUTE HANDLER                           */
/*                                                                            */
/*  Handles the redirect from Supabase after:                                 */
/*  - Email verification                                                     */
/*  - OAuth sign-in                                                          */
/*  - Magic link sign-in                                                     */
/*  - Password reset                                                         */
/*                                                                            */
/*  Exchanges the auth code for a session, then redirects to the             */
/*  appropriate dashboard based on user role.                                 */
/* -------------------------------------------------------------------------- */

import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/dashboard";

    if (code) {
        const supabase = await createClient();

        const { error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error) {
            /* ── Determine redirect based on role ─────────────────────── */
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                const { data: profile } = await supabase
                    .from("users")
                    .select("role")
                    .eq("id", user.id)
                    .single();

                const userProfile = profile as {
                    role: "admin" | "client" | "team";
                } | null;

                // If the user is an admin and no specific `next` was given,
                // redirect to the admin dashboard
                if (userProfile?.role === "admin" && next === "/dashboard") {
                    return NextResponse.redirect(`${origin}/admin`);
                }
            }

            // Redirect to the requested page or default dashboard
            const forwardedHost = request.headers.get("x-forwarded-host");
            const isLocalEnv = process.env.NODE_ENV === "development";

            if (isLocalEnv) {
                // In development, use origin directly
                return NextResponse.redirect(`${origin}${next}`);
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`);
            } else {
                return NextResponse.redirect(`${origin}${next}`);
            }
        }
    }

    // If code exchange fails, redirect to an error page
    return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
