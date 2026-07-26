import { cn } from "@/lib/utils";

interface SectionProps {
    children: React.ReactNode;
    className?: string;
}

export default function Section({
    children,
    className,
}: SectionProps) {
    return (
        <section
            className={cn(
                "relative py-24 md:py-32",
                className
            )}
        >
            {children}
        </section>
    );
}