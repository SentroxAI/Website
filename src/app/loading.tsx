import LoadingSpinner from "@/components/ui/feedback/LoadingSpinner";

export default function Loading() {
    return (
        <main className="flex min-h-screen items-center justify-center">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.05),transparent_60%)]" />

            <LoadingSpinner size="xl" label="Loading..." />
        </main>
    );
}
