import AdminContainer from "@/components/admin/AdminContainer";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function AdminNotFound() {
    return (
        <AdminContainer>
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] px-6 py-24 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 mb-4">
                    <AlertTriangle className="h-6 w-6 text-amber-400" />
                </div>
                <h1 className="text-xl font-semibold text-white">Page Not Found</h1>
                <p className="mt-2 text-sm text-sx-text-muted">
                    The admin page you&apos;re looking for doesn&apos;t exist.
                </p>
                <Link
                    href="/admin"
                    className="mt-4 rounded-xl bg-white/[0.06] px-4 py-2 text-sm font-medium text-white hover:bg-white/[0.1] transition-colors"
                >
                    Back to Dashboard
                </Link>
            </div>
        </AdminContainer>
    );
}
