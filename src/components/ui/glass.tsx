import { cn } from "@/lib/utils";

interface GlassProps {
    children: React.ReactNode;
    className?: string;
}

export default function Glass({
    children,
    className,
}: GlassProps) {
    return (
        <div
            className={cn(
                "rounded-2xl",
                "border border-white/10",
                "bg-white/5",
                "backdrop-blur-2xl",
                "shadow-[0_8px_40px_rgba(0,0,0,0.25)]",
                className
            )}
        >
            {children}
        </div>
    );
}