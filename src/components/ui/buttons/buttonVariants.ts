import { cva } from "class-variance-authority";

export const buttonVariants = cva(
    [
        "inline-flex items-center justify-center gap-2",
        "whitespace-nowrap rounded-2xl",
        "font-semibold",
        "transition-all duration-300",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-blue-500",
        "focus-visible:ring-offset-2",
        "disabled:pointer-events-none",
        "disabled:opacity-50",
        "select-none",
    ],
    {
        variants: {
            variant: {
                primary:
                    "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/25 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/40",

                secondary:
                    "border border-white/10 bg-white/5 text-white backdrop-blur-xl hover:bg-white/10",

                ghost:
                    "text-white hover:bg-white/10",

                outline:
                    "border border-blue-500 text-blue-400 hover:bg-blue-500/10",

                danger:
                    "bg-red-600 text-white hover:bg-red-700",
            },

            size: {
                sm: "h-10 px-4 text-sm",
                md: "h-12 px-6 text-base",
                lg: "h-14 px-8 text-lg",
                xl: "h-16 px-10 text-xl",
            },

            fullWidth: {
                true: "w-full",
                false: "",
            },
        },

        defaultVariants: {
            variant: "primary",
            size: "md",
            fullWidth: false,
        },
    }
);