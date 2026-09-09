"use client";

/* -------------------------------------------------------------------------- */
/*                       STAR RATING                                          */
/*                                                                            */
/*  Reusable star rating display + interactive input.                        */
/* -------------------------------------------------------------------------- */

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
    rating: number;
    maxStars?: number;
    size?: "sm" | "md" | "lg";
    interactive?: boolean;
    onChange?: (rating: number) => void;
    className?: string;
}

export default function StarRating({
    rating,
    maxStars = 5,
    size = "sm",
    interactive = false,
    onChange,
    className,
}: StarRatingProps) {
    const sizeMap = {
        sm: "h-3.5 w-3.5",
        md: "h-4 w-4",
        lg: "h-5 w-5",
    };

    return (
        <div className={cn("inline-flex items-center gap-0.5", className)}>
            {Array.from({ length: maxStars }).map((_, i) => {
                const filled = i < rating;
                return (
                    <button
                        key={i}
                        type="button"
                        disabled={!interactive}
                        onClick={() => interactive && onChange?.(i + 1)}
                        className={cn(
                            "transition-colors",
                            interactive && "cursor-pointer hover:scale-110",
                            !interactive && "cursor-default",
                        )}
                    >
                        <Star
                            className={cn(
                                sizeMap[size],
                                filled
                                    ? "fill-amber-400 text-amber-400"
                                    : "fill-transparent text-white/[0.12]",
                                interactive && !filled && "hover:text-amber-400/50",
                            )}
                        />
                    </button>
                );
            })}
        </div>
    );
}
