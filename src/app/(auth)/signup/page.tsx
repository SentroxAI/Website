/* -------------------------------------------------------------------------- */
/*                           SIGNUP PAGE                                       */
/* -------------------------------------------------------------------------- */

import type { Metadata } from "next";

import AuthCard from "@/components/auth/AuthCard";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
    title: "Create Account",
    description:
        "Create your Sentrox AI account and start building with AI-powered solutions.",
};

export default function SignupPage() {
    return (
        <AuthCard>
            <SignupForm />
        </AuthCard>
    );
}
