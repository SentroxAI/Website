"use client";

/* -------------------------------------------------------------------------- */
/*                          USE-AUTH HOOK                                      */
/*                                                                            */
/*  Client-side hook providing:                                               */
/*  - Current authenticated user                                              */
/*  - User profile from the users table                                       */
/*  - Loading state                                                           */
/*  - Role-based convenience checks                                           */
/*                                                                            */
/*  Subscribes to onAuthStateChange for real-time auth state updates.         */
/* -------------------------------------------------------------------------- */

import { useEffect, useState, useCallback } from "react";
import type { User } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";
import type { Tables, UserRole } from "@/types/database.types";

interface UseAuthReturn {
    /** The Supabase auth user (null if not authenticated) */
    user: User | null;
    /** The user profile from the public.users table */
    profile: Tables<"users"> | null;
    /** Whether auth state is still being determined */
    isLoading: boolean;
    /** Whether the current user is an admin */
    isAdmin: boolean;
    /** Whether the current user is a client */
    isClient: boolean;
    /** Whether the current user is a team member */
    isTeam: boolean;
    /** The user's role */
    role: UserRole | null;
    /** Re-fetch the user profile */
    refreshProfile: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
    const [user, setUser] = useState<User | null>(null);
    const [profile, setProfile] = useState<Tables<"users"> | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const supabase = createClient();

    const fetchProfile = useCallback(
        async (userId: string) => {
            const { data } = await supabase
                .from("users")
                .select("*")
                .eq("id", userId)
                .single();

            setProfile(data);
        },
        [supabase],
    );

    const refreshProfile = useCallback(async () => {
        if (user?.id) {
            await fetchProfile(user.id);
        }
    }, [user?.id, fetchProfile]);

    useEffect(() => {
        // Get initial session
        const getInitialSession = async () => {
            const {
                data: { user: currentUser },
            } = await supabase.auth.getUser();

            setUser(currentUser);

            if (currentUser) {
                await fetchProfile(currentUser.id);
            }

            setIsLoading(false);
        };

        getInitialSession();

        // Subscribe to auth state changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            const currentUser = session?.user ?? null;
            setUser(currentUser);

            if (currentUser) {
                await fetchProfile(currentUser.id);
            } else {
                setProfile(null);
            }

            setIsLoading(false);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [supabase, fetchProfile]);

    const role = (profile?.role as UserRole) ?? null;

    return {
        user,
        profile,
        isLoading,
        isAdmin: role === "admin",
        isClient: role === "client",
        isTeam: role === "team",
        role,
        refreshProfile,
    };
}
