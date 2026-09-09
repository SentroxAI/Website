/* -------------------------------------------------------------------------- */
/*                       UPDATE PASSWORD PAGE                                  */
/* -------------------------------------------------------------------------- */

import type { Metadata } from "next";

import AuthCard from "@/components/auth/AuthCard";
import UpdatePasswordForm from "@/components/auth/UpdatePasswordForm";

export const metadata: Metadata = {
    title: "Update Password",
    description: "Set a new password for your Sentrox AI account.",
};

export default function UpdatePasswordPage() {
    return (
        <AuthCard>
            <UpdatePasswordForm />
        </AuthCard>
    );
}
