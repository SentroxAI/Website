/* -------------------------------------------------------------------------- */
/*                        NEXT.JS CONFIGURATION                               */
/*                                                                            */
/*  Sprint 4 — Module 6: Production-ready configuration.                      */
/*  Security headers, image optimization, redirects, and bundle analysis.     */
/* -------------------------------------------------------------------------- */

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* ── Image optimization ────────────────────────────────────────────────── */
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "buhsrvtoohnvzmqkxgal.supabase.co",
                pathname: "/storage/v1/object/public/**",
            },
            {
                protocol: "https",
                hostname: "*.supabase.co",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
        ],
        formats: ["image/avif", "image/webp"],
        minimumCacheTTL: 60 * 60 * 24, // 24 hours
    },

    /* ── Redirects ─────────────────────────────────────────────────────────── */
    async redirects() {
        return [
            {
                source: "/home",
                destination: "/",
                permanent: true,
            },
            {
                source: "/admin/dashboard",
                destination: "/admin",
                permanent: true,
            },
        ];
    },

    /* ── Security Headers ──────────────────────────────────────────────────── */
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    /* ── Strict Transport Security ───────────────── */
                    {
                        key: "Strict-Transport-Security",
                        value: "max-age=63072000; includeSubDomains; preload",
                    },
                    /* ── Content Security Policy ─────────────────── */
                    {
                        key: "Content-Security-Policy",
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://checkout.razorpay.com https://www.googletagmanager.com https://www.google-analytics.com",
                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                            "img-src 'self' data: blob: https: http:",
                            "font-src 'self' https://fonts.gstatic.com",
                            "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.razorpay.com https://lumberjack.razorpay.com https://generativelanguage.googleapis.com https://www.google-analytics.com",
                            "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com",
                            "object-src 'none'",
                            "base-uri 'self'",
                            "form-action 'self'",
                            "frame-ancestors 'none'",
                            "upgrade-insecure-requests",
                        ].join("; "),
                    },
                    /* ── X-Frame-Options ──────────────────────────── */
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    /* ── X-Content-Type-Options ───────────────────── */
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    /* ── X-DNS-Prefetch-Control ───────────────────── */
                    {
                        key: "X-DNS-Prefetch-Control",
                        value: "on",
                    },
                    /* ── Referrer Policy ──────────────────────────── */
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                    /* ── Permissions Policy ───────────────────────── */
                    {
                        key: "Permissions-Policy",
                        value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
                    },
                ],
            },
        ];
    },

    /* ── Experimental ──────────────────────────────────────────────────────── */
    serverExternalPackages: ["@google/genai"],

    /* ── Logging ───────────────────────────────────────────────────────────── */
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
};

export default nextConfig;
