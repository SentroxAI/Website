/* -------------------------------------------------------------------------- */
/*                      DASHBOARD NOT FOUND                                   */
/*                                                                            */
/*  Dashboard-styled 404 page.                                                */
/*  Shown when a sub-route under /dashboard doesn't exist.                    */
/* -------------------------------------------------------------------------- */

import Link from "next/link";
import { LayoutDashboard, ArrowLeft } from "lucide-react";

export default function DashboardNotFound() {
    return (
        <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 py-16 text-center">
            {/* Icon */}
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sx-primary-500/15 to-sx-accent-500/15">
                <LayoutDashboard className="h-7 w-7 text-sx-primary-400" />
            </div>

            {/* Text */}
            <h1 className="text-2xl font-bold text-white">Page not found</h1>
            <p className="mt-3 text-sm text-sx-text-muted">
                The dashboard page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>

            {/* Action */}
            <Link
                href="/dashboard"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-sx-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sx-primary-500 shadow-lg shadow-sx-primary/20"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
            </Link>
        </div>
    );
}
