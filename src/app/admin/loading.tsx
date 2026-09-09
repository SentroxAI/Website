import AdminContainer from "@/components/admin/AdminContainer";

export default function AdminLoading() {
    return (
        <AdminContainer>
            <div className="space-y-6 animate-pulse">
                {/* Header skeleton */}
                <div className="flex items-center justify-between">
                    <div>
                        <div className="h-7 w-48 rounded-lg bg-white/[0.06]" />
                        <div className="mt-2 h-4 w-72 rounded-lg bg-white/[0.04]" />
                    </div>
                    <div className="h-10 w-32 rounded-xl bg-white/[0.06]" />
                </div>

                {/* Stats grid skeleton */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-28 rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
                    ))}
                </div>

                {/* Content skeleton */}
                <div className="h-64 rounded-2xl border border-white/[0.06] bg-white/[0.02]" />
            </div>
        </AdminContainer>
    );
}
