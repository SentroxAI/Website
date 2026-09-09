import { Variants } from "framer-motion";

export const fadeIn: Variants = {
    hidden: {
        opacity: 0,
    },
    visible: {
        opacity: 1,
        transition: {
            duration: 0.6,
            ease: "easeOut",
        },
    },
};

export const fadeUp: Variants = {
    hidden: {
        opacity: 0,
        y: 40,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
        },
    },
};

export const fadeDown: Variants = {
    hidden: {
        opacity: 0,
        y: -40,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
        },
    },
};

export const fadeLeft: Variants = {
    hidden: {
        opacity: 0,
        x: 40,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
        },
    },
};

export const fadeRight: Variants = {
    hidden: {
        opacity: 0,
        x: -40,
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut",
        },
    },
};

export const scaleIn: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.9,
    },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
};

export const staggerContainer: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
        },
    },
};

export const floating = {
    animate: {
        y: [0, -10, 0],
    },
    transition: {
        duration: 4,
        repeat: Infinity,
        repeatType: "mirror" as const,
        ease: "easeInOut",
    },
};

export const hoverScale = {
    whileHover: {
        scale: 1.05,
    },
    whileTap: {
        scale: 0.98,
    },
};

export const hoverLift = {
    whileHover: {
        y: -8,
    },
};

export const hoverCard = {
    whileHover: {
        y: -8,
        scale: 1.02,
        rotateX: 2,
        rotateY: 2,
        transition: {
            duration: 0.3,
        },
    },

    whileTap: {
        scale: 0.99,
    },
};

export const viewport = {
    once: true,
    amount: 0.2,
};