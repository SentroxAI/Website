import { cn } from "@/lib/utils";

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
}

export default function GlassCard({
    children,
    className,
}: GlassCardProps) {
    return (
        <div
            className={cn(
                "rounded-3xl",
                "border border-white/10",
                "bg-white/5",
                "backdrop-blur-xl",
                "shadow-2xl",
                "p-6",
                className
            )}
        >
            {children}
        </div>
    );
}