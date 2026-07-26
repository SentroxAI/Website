import { cn } from "@/lib/utils";

interface HeadingProps {
    title: string;
    subtitle?: string;
    center?: boolean;
}

export default function Heading({
    title,
    subtitle,
    center = false,
}: HeadingProps) {
    return (
        <div
            className={cn(
                "max-w-3xl",
                center && "mx-auto text-center"
            )}
        >
            {subtitle && (
                <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                    {subtitle}
                </p>
            )}

            <h2 className="text-4xl font-bold tracking-tight md:text-6xl">
                {title}
            </h2>
        </div>
    );
}