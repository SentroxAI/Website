import Link from "next/link";

export default function HeroButtons() {
    return (
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
                href="/contact"
                className="rounded-xl bg-blue-600 px-8 py-4 text-center font-semibold text-white transition hover:bg-blue-700"
            >
                Start Your Project
            </Link>

            <Link
                href="/portfolio"
                className="rounded-xl border border-border px-8 py-4 text-center font-semibold transition hover:bg-muted"
            >
                View Our Work
            </Link>
        </div>
    );
}