"use client";

import {
    motion,
    useMotionValue,
    useSpring,
} from "framer-motion";

import { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export default function MouseParallax({
    children,
}: Props) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const rotateX = useSpring(y, {
        stiffness: 120,
        damping: 20,
    });

    const rotateY = useSpring(x, {
        stiffness: 120,
        damping: 20,
    });

    function handleMove(
        e: React.MouseEvent<HTMLDivElement>
    ) {
        const rect = e.currentTarget.getBoundingClientRect();

        const px =
            (e.clientX - rect.left) / rect.width;

        const py =
            (e.clientY - rect.top) / rect.height;

        x.set((px - 0.5) * 12);

        y.set(-(py - 0.5) * 12);
    }

    return (
        <motion.div
            onMouseMove={handleMove}
            style={{
                rotateX,
                rotateY,
                transformPerspective: 1600,
            }}
            className="relative"
        >
            {children}
        </motion.div>
    );
}