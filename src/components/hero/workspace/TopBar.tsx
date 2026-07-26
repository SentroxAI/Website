import {
    Search,
    Bell,
    UserCircle2,
} from "lucide-react";

export default function TopBar() {
    return (
        <header className="flex h-14 items-center justify-between border-b border-white/10 px-6">
            <div className="flex items-center gap-4">
                <div className="rounded-lg bg-white/5 px-4 py-2 text-sm text-slate-400">
                    Search AI...
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Bell className="size-5" />

                <UserCircle2 className="size-7" />
            </div>
        </header>
    );
}