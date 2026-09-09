"use client";

import { type ReactNode } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import Container from "@/components/ui/layout/Container";
import Breadcrumbs from "@/components/ui/navigation/Breadcrumbs";
import GradientBadge from "@/components/ui/badges/GradientBadge";
import { fadeUp, viewport } from "@/lib/animations";

/* -------------------------------------------------------------------------- */
/*                                  TYPES                                     */
/* -------------------------------------------------------------------------- */

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface PageHeaderProps {
    badge?: string;
    badgeIcon?: ReactNode;
    title: string;
    description?: string;
    breadcrumbs?: BreadcrumbItem[];
    actions?: ReactNode;
    className?: string;
}

/* -------------------------------------------------------------------------- */
/*                                COMPONENT                                   */
/* -------------------------------------------------------------------------- */

export default function PageHeader({
    badge,
    badgeIcon,
    title,
    description,
    breadcrumbs,
    actions,
    className,
}: PageHeaderProps) {
    return (
        <section
            className={cn(
                "relative overflow-hidden pt-28 pb-12 sm:pt-36 sm:pb-20",
                className
            )}
        >
            {/* Background Effects */}

            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.10),transparent_60%)]" />

            <div className="absolute left-1/2 top-20 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/8 blur-[140px]" />

            <Container>
                {/* Breadcrumbs */}

                {breadcrumbs && breadcrumbs.length > 0 && (
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        animate="visible"
                        className="mb-8"
                    >
                        <Breadcrumbs items={breadcrumbs} />
                    </motion.div>
                )}

                {/* Content */}

                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mx-auto max-w-4xl text-center"
                >
                    {/* Badge */}

                    {badge && (
                        <div className="mb-6 flex justify-center">
                            <GradientBadge
                                variant="primary"
                                leftIcon={badgeIcon}
                            >
                                {badge}
                            </GradientBadge>
                        </div>
                    )}

                    {/* Title */}

                    <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
                        {title}
                    </h1>

                    {/* Description */}

                    {description && (
                        <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg leading-7 sm:leading-8 text-slate-400">
                            {description}
                        </p>
                    )}

                    {/* Actions */}

                    {actions && (
                        <div className="mt-10 flex flex-wrap justify-center gap-4">
                            {actions}
                        </div>
                    )}
                </motion.div>
            </Container>
        </section>
    );
}
