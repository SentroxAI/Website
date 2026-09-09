/* -------------------------------------------------------------------------- */
/*                    PROJECT DETAIL LOADING STATE                            */
/* -------------------------------------------------------------------------- */

export default function ProjectDetailLoading() {
    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 lg:px-8 animate-pulse">
            {/* Back link */}
            <div className="h-4 w-28 rounded bg-white/[0.06] mb-4" />

            {/* Header card */}
            <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="h-7 w-52 rounded-lg bg-white/[0.06]" />
                        <div className="mt-2 h-4 w-28 rounded bg-white/[0.04]" />
                    </div>
                    <div className="h-6 w-20 rounded-full bg-white/[0.06]" />
                </div>
                <div className="h-4 w-full rounded bg-white/[0.04] mb-2" />
                <div className="h-4 w-3/4 rounded bg-white/[0.04] mb-6" />
                <div className="h-2 w-full rounded-full bg-white/[0.06] mb-6" />
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="rounded-xl bg-white/[0.03] p-3 h-20" />
                    ))}
                </div>
            </div>

            {/* Milestones */}
            <div className="mt-8">
                <div className="h-5 w-36 rounded bg-white/[0.06] mb-4" />
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 rounded-xl border border-white/[0.06] bg-white/[0.02]" />
                    ))}
                </div>
            </div>

            {/* Activity + Team */}
            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
                <div>
                    <div className="h-5 w-20 rounded bg-white/[0.06] mb-4" />
                    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] h-48" />
                </div>
                <div>
                    <div className="h-5 w-16 rounded bg-white/[0.06] mb-4" />
                    <div className="space-y-3">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-14 rounded-xl border border-white/[0.06] bg-white/[0.02]" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
