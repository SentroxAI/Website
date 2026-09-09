/* -------------------------------------------------------------------------- */
/*                       FORGOT PASSWORD PAGE                                  */
/* -------------------------------------------------------------------------- */

import type { Metadata } from "next";

import AuthCard from "@/components/auth/AuthCard";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = {
    title: "Forgot Password",
    description: "Reset your Sentrox AI account password.",
};

export default function ForgotPasswordPage() {
    return (
        <AuthCard>
            <ForgotPasswordForm />
        </AuthCard>
    );
}
