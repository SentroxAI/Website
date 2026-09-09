"use client";

/* -------------------------------------------------------------------------- */
/*                          AUTH PROVIDER                                     */
/*                                                                            */
/*  React context provider that wraps the app to provide auth state.          */
/*  Uses the useAuth hook internally and exposes the same interface           */
/*  via context so any component can access auth state without prop drilling. */
/* -------------------------------------------------------------------------- */

import { createContext, useContext, type ReactNode } from "react";
import type { User } from "@supabase/supabase-js";

import { useAuth } from "@/hooks/use-auth";
import type { Tables, UserRole } from "@/types/database.types";

interface AuthContextType {
    user: User | null;
    profile: Tables<"users"> | null;
    isLoading: boolean;
    isAdmin: boolean;
    isClient: boolean;
    isTeam: boolean;
    role: UserRole | null;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    profile: null,
    isLoading: true,
    isAdmin: false,
    isClient: false,
    isTeam: false,
    role: null,
    refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const auth = useAuth();

    return (
        <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
    );
}

/**
 * Hook to access auth context from any component.
 * Must be used within an AuthProvider.
 */
export function useAuthContext(): AuthContextType {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }

    return context;
}
