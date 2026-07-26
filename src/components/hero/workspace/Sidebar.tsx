import {
    Bot,
    BarChart3,
    Sparkles,
    Settings,
} from "lucide-react";

const items = [
    Bot,
    BarChart3,
    Sparkles,
    Settings,
];

export default function Sidebar() {
    return (
        <aside className="flex w-16 flex-col items-center gap-6 border-r border-white/10 py-6">
            {items.map((Icon, index) => (
                <div
                    key={index}
                    className="
          flex
          size-10
          items-center
          justify-center
          rounded-xl
          bg-white/5
          hover:bg-white/10
          transition
        "
                >
                    <Icon className="size-5" />
                </div>
            ))}
        </aside>
    );
}