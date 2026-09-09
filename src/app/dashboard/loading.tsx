/* -------------------------------------------------------------------------- */
/*                       DASHBOARD LOADING STATE                              */
/*                                                                            */
/*  Skeleton loading state matching the Module 3 dashboard layout.            */
/*  Shown by Next.js during Suspense/data fetching transitions.               */
/* -------------------------------------------------------------------------- */

export default function DashboardLoading() {
    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:px-8 animate-pulse">
            {/* Greeting skeleton */}
            <div className="mb-8">
                <div className="h-8 w-72 rounded-lg bg-white/[0.06]" />
                <div className="mt-3 h-4 w-96 rounded-lg bg-white/[0.04]" />
            </div>

            {/* Quick Actions skeleton */}
            <div className="mb-8">
                <div className="h-5 w-28 rounded-lg bg-white/[0.06] mb-4" />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4"
                        >
                            <div className="h-10 w-10 rounded-xl bg-white/[0.05]" />
                            <div className="h-3 w-16 rounded bg-white/[0.04]" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats grid skeleton */}
            <div className="mb-8">
                <div className="h-5 w-20 rounded-lg bg-white/[0.06] mb-4" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"
                        >
                            <div className="h-10 w-10 rounded-xl bg-white/[0.05] mb-3" />
                            <div className="h-3 w-24 rounded bg-white/[0.04] mb-2" />
                            <div className="h-7 w-12 rounded bg-white/[0.06] mb-2" />
                            <div className="h-3 w-32 rounded bg-white/[0.03]" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Progress chart skeleton */}
            <div className="mb-8">
                <div className="h-5 w-32 rounded-lg bg-white/[0.06] mb-4" />
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                    <div className="flex flex-col items-center gap-6 sm:flex-row">
                        <div className="h-40 w-40 rounded-full bg-white/[0.04]" />
                        <div className="flex-1 space-y-3 w-full">
                            <div className="h-4 w-28 rounded bg-white/[0.06] mb-4" />
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="h-3 w-full rounded bg-white/[0.04]" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity + Meetings skeleton */}
            <div className="mb-8 grid gap-6 lg:grid-cols-2">
                <div>
                    <div className="h-5 w-28 rounded-lg bg-white/[0.06] mb-4" />
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex gap-3">
                                <div className="h-8 w-8 rounded-lg bg-white/[0.05]" />
                                <div className="flex-1">
                                    <div className="h-4 w-48 rounded bg-white/[0.06] mb-1" />
                                    <div className="h-3 w-32 rounded bg-white/[0.04]" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <div className="h-5 w-36 rounded-lg bg-white/[0.06] mb-4" />
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] divide-y divide-white/[0.04]">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 px-5 py-4">
                                <div className="h-12 w-12 rounded-xl bg-white/[0.05]" />
                                <div className="flex-1">
                                    <div className="h-4 w-28 rounded bg-white/[0.06] mb-1" />
                                    <div className="h-3 w-40 rounded bg-white/[0.04]" />
                                </div>
                                <div className="h-8 w-16 rounded-lg bg-white/[0.05]" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
