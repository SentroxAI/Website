import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                 AVATAR                                     */
/* -------------------------------------------------------------------------- */

interface AvatarProps {
    src?: string | null;
    alt?: string;
    name?: string;
    size?: "xs" | "sm" | "md" | "lg" | "xl";
    variant?: "circle" | "rounded";
    status?: "online" | "offline" | "away" | "busy";
    className?: string;
}

const sizeStyles = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-lg",
};

const statusSizeStyles = {
    xs: "w-1.5 h-1.5 border",
    sm: "w-2 h-2 border",
    md: "w-2.5 h-2.5 border-2",
    lg: "w-3 h-3 border-2",
    xl: "w-4 h-4 border-2",
};

const statusColorStyles = {
    online: "bg-emerald-500",
    offline: "bg-slate-500",
    away: "bg-amber-500",
    busy: "bg-red-500",
};

/* ── Generate consistent color from name ────────────────────────────────── */

const gradientPalette = [
    "from-blue-600 to-cyan-500",
    "from-violet-600 to-purple-500",
    "from-emerald-600 to-teal-500",
    "from-amber-600 to-orange-500",
    "from-rose-600 to-pink-500",
    "from-indigo-600 to-blue-500",
];

function getGradient(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return gradientPalette[Math.abs(hash) % gradientPalette.length];
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((w) => w[0])
        .filter(Boolean)
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

export default function Avatar({
    src,
    alt,
    name = "",
    size = "md",
    variant = "circle",
    status,
    className,
}: AvatarProps) {
    const initials = getInitials(name);

    return (
        <div className={cn("relative inline-flex shrink-0", className)}>
            {src ? (
                <img
                    src={src}
                    alt={alt || name}
                    className={cn(
                        "object-cover border border-white/10",
                        sizeStyles[size],
                        variant === "circle" ? "rounded-full" : "rounded-lg"
                    )}
                />
            ) : (
                <div
                    className={cn(
                        "flex items-center justify-center font-semibold text-white bg-gradient-to-br border border-white/10",
                        sizeStyles[size],
                        getGradient(name || "A"),
                        variant === "circle" ? "rounded-full" : "rounded-lg"
                    )}
                    aria-label={alt || name}
                >
                    {initials || "?"}
                </div>
            )}

            {status && (
                <span
                    className={cn(
                        "absolute bottom-0 right-0 rounded-full border-[#030712]",
                        statusSizeStyles[size],
                        statusColorStyles[status]
                    )}
                />
            )}
        </div>
    );
}
