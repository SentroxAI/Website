import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                        DASHBOARD CONTAINER                                 */
/*                                                                            */
/*  Page content wrapper with consistent max-width, padding, and spacing.     */
/*  Used inside each dashboard page for uniform content areas.                */
/* -------------------------------------------------------------------------- */

interface DashboardContainerProps {
    children: React.ReactNode;
    className?: string;
}

export default function DashboardContainer({
    children,
    className,
}: DashboardContainerProps) {
    return (
        <div
            data-slot="dashboard-container"
            className={cn(
                "mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:px-8",
                className
            )}
        >
            {children}
        </div>
    );
}
