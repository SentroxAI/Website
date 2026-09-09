/* -------------------------------------------------------------------------- */
/*                     SUPABASE CLIENT — SERVER SIDE                          */
/*                                                                            */
/*  For Server Components, Server Actions, and Route Handlers.                */
/*  Uses cookies() from next/headers to persist auth across requests.         */
/* -------------------------------------------------------------------------- */

import { createServerClient } from "@supabase/ssr";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

import type { Database } from "@/types/database.types";

export async function createClient() {
    const cookieStore = await cookies();

    return createServerClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options);
                        });
                    } catch {
                        // The `setAll` method is called from a Server Component
                        // where cookies cannot be set. This can be safely ignored
                        // when the session is being refreshed via proxy.
                    }
                },
            },
        },
    );
}

/**
 * Create a Supabase admin client using the service role key.
 * This bypasses RLS — only use for server-side operations where
 * the user is not authenticated (e.g., public form submissions).
 *
 * Uses createClient from @supabase/supabase-js directly (no cookies needed).
 */
export function createAdminClient() {
    return createSupabaseClient<Database>(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
}

