/* -------------------------------------------------------------------------- */
/*                            LOGIN PAGE                                       */
/* -------------------------------------------------------------------------- */

import type { Metadata } from "next";

import AuthCard from "@/components/auth/AuthCard";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
    title: "Sign In",
    description: "Sign in to your Sentrox AI dashboard to manage your projects.",
};

export default function LoginPage() {
    return (
        <AuthCard>
            <LoginForm />
        </AuthCard>
    );
}
