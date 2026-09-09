/* -------------------------------------------------------------------------- */
/*                          ROBOTS.TXT (Enhanced)                              */
/*                                                                            */
/*  Sprint 4 — Module 9: Production robots.txt with admin/dashboard           */
/*  disallow, crawl-delay, and sitemap reference.                             */
/* -------------------------------------------------------------------------- */

import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sentroxai.com";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: [
                    "/api/",
                    "/admin/",
                    "/dashboard/",
                    "/private/",
                    "/login",
                    "/signup",
                    "/forgot-password",
                    "/update-password",
                ],
            },
            {
                /* Block aggressive bots */
                userAgent: ["GPTBot", "ChatGPT-User", "CCBot", "anthropic-ai"],
                disallow: ["/"],
            },
        ],
        sitemap: `${BASE_URL}/sitemap.xml`,
        host: BASE_URL,
    };
}
