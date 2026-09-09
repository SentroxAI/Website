"use client";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                 AVATAR                                     */
/*                                                                            */
/*  Displays user avatar with image or initials fallback.                     */
/*  Supports multiple sizes with consistent styling.                          */
/* -------------------------------------------------------------------------- */

interface AvatarProps {
    src?: string | null;
    alt?: string;
    fallback?: string;
    size?: "xs" | "sm" | "md" | "lg";
    className?: string;
}

const sizeClasses = {
    xs: "h-6 w-6 text-[10px]",
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
};

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

export default function Avatar({
    src,
    alt = "Avatar",
    fallback = "U",
    size = "md",
    className,
}: AvatarProps) {
    const initials = fallback.length > 2 ? getInitials(fallback) : fallback;

    return (
        <div
            data-slot="avatar"
            className={cn(
                "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
                "bg-gradient-to-br from-sx-primary-600/30 to-sx-accent-600/30",
                "border border-white/10",
                "ring-1 ring-white/5",
                sizeClasses[size],
                className
            )}
        >
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    className="h-full w-full object-cover"
                />
            ) : (
                <span className="font-semibold text-sx-text-secondary select-none">
                    {initials}
                </span>
            )}
        </div>
    );
}
