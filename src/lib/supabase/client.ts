/* -------------------------------------------------------------------------- */
/*                     SUPABASE CLIENT — BROWSER (CLIENT)                     */
/*                                                                            */
/*  Singleton client for use in 'use client' components.                      */
/*  Uses createBrowserClient from @supabase/ssr which automatically           */
/*  manages auth cookies in the browser.                                      */
/* -------------------------------------------------------------------------- */

import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/database.types";

export function createClient() {
    return createBrowserClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
}
