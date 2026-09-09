/* -------------------------------------------------------------------------- */
/*                     SUPABASE CLIENT — PROXY (formerly Middleware)           */
/*                                                                            */
/*  Special client for src/proxy.ts. Unlike Server Components, the proxy      */
/*  can both read AND write cookies on the request/response, so we need       */
/*  custom cookie handling that bridges NextRequest → NextResponse.           */
/* -------------------------------------------------------------------------- */

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import type { Database } from "@/types/database.types";

export function createClient(request: NextRequest) {
    // Start with an unmodified response
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
                    // Set cookies on the request so subsequent server-side
                    // code sees the updated values
                    cookiesToSet.forEach(({ name, value }) => {
                        request.cookies.set(name, value);
                    });

                    // Re-create response so the cookies propagate to the browser
                    supabaseResponse = NextResponse.next({
                        request,
                    });

                    cookiesToSet.forEach(({ name, value, options }) => {
                        supabaseResponse.cookies.set(name, value, options);
                    });
                },
            },
        },
    );

    return { supabase, supabaseResponse };
}
