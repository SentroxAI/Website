/* -------------------------------------------------------------------------- */
/*                          PROXY — Route Protection                          */
/*                                                                            */
/*  Next.js 16 file convention: proxy.ts replaces middleware.ts               */
/*  Exported function must be named `proxy` (not `middleware`).               */
/*                                                                            */
/*  Responsibilities:                                                         */
/*  1. Refresh Supabase auth session on every matched request                 */
/*  2. Protect /dashboard/* and /admin/* routes                               */
/*  3. Role-based access control                                              */
/* -------------------------------------------------------------------------- */

import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "@/lib/supabase/proxy";

/**
 * Public routes that don't require authentication.
 * Everything else matched by the config will check auth.
 */
const PUBLIC_ROUTES = new Set([
    "/",
    "/about",
    "/contact",
    "/services",
    "/pricing",
    "/portfolio",
    "/blog",
    "/login",
    "/signup",
    "/forgot-password",
    "/update-password",
    "/privacy-policy",
    "/terms",
    "/cookies",
]);

/**
 * Check if a path matches any public route.
 * Handles both exact matches and prefix matches for nested routes
 * like /blog/[slug] and /services/[slug].
 */
function isPublicRoute(pathname: string): boolean {
    if (PUBLIC_ROUTES.has(pathname)) return true;

    // Allow nested public routes (e.g., /blog/my-post, /services/web-dev)
    const publicPrefixes = ["/blog/", "/services/", "/portfolio/"];
    return publicPrefixes.some((prefix) => pathname.startsWith(prefix));
}

export async function proxy(request: NextRequest) {
    const { supabase, supabaseResponse } = createClient(request);

    /* ── Refresh the session ──────────────────────────────────────────── */
    // IMPORTANT: Do not remove this. It refreshes the auth token and
    // keeps the session alive. getUser() validates the token server-side.
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { pathname } = request.nextUrl;

    /* ── Allow public routes ──────────────────────────────────────────── */
    if (isPublicRoute(pathname)) {
        return supabaseResponse;
    }

    /* ── Auth callback route must always pass through ─────────────────── */
    if (pathname.startsWith("/api/auth/")) {
        return supabaseResponse;
    }

    /* ── Public API routes (no auth required) ────────────────────────── */
    if (
        pathname === "/api/contact" ||
        pathname === "/api/quote" ||
        pathname === "/api/newsletter" ||
        pathname.startsWith("/api/payments/webhook")
    ) {
        return supabaseResponse;
    }

    /* ── Redirect unauthenticated users to login ──────────────────────── */
    if (!user) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
    }

    /* ── Role-based access control ────────────────────────────────────── */
    if (pathname.startsWith("/admin")) {
        // Fetch user role from the users table
        const { data: profile } = await supabase
            .from("users")
            .select("role")
            .eq("id", user.id)
            .single<{ role: string }>();

        if (profile?.role !== "admin") {
            // Non-admins trying to access admin routes get redirected
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }
    }

    return supabaseResponse;
}

/* ── Matcher configuration ────────────────────────────────────────────────── */
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         * - Public assets in /public folder
         */
        "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|opengraph-image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
    ],
};
