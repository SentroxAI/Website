"use client";

import { motion } from "framer-motion";
import {
    LogIn,
    UserPlus,
    LayoutDashboard,
    FileText,
    MessageSquare,
    CreditCard,
    FolderOpen,
    Calendar,
    Sparkles,
    ArrowRight,
    Shield,
    Zap,
    Clock,
} from "lucide-react";
import Link from "next/link";

import PageHeader from "@/components/ui/section/PageHeader";
import Container from "@/components/ui/layout/Container";
import { fadeUp, viewport } from "@/lib/animations";

/* -------------------------------------------------------------------------- */
/*                              SOLUTIONS DATA                                 */
/* -------------------------------------------------------------------------- */

const portalFeatures = [
    {
        icon: LayoutDashboard,
        title: "Project Dashboard",
        description:
            "Track your project progress, milestones, and deliverables in real time.",
        color: "blue",
    },
    {
        icon: MessageSquare,
        title: "Direct Messaging",
        description:
            "Communicate with your dedicated project team instantly.",
        color: "cyan",
    },
    {
        icon: FileText,
        title: "File Sharing",
        description:
            "Upload and download project files, assets, and documents securely.",
        color: "violet",
    },
    {
        icon: CreditCard,
        title: "Billing & Invoices",
        description:
            "View invoices, make payments, and manage your subscription seamlessly.",
        color: "emerald",
    },
    {
        icon: FolderOpen,
        title: "Project Files",
        description:
            "Access all project deliverables, contracts, and resources in one place.",
        color: "amber",
    },
    {
        icon: Calendar,
        title: "Meeting Scheduler",
        description:
            "Book meetings with your project team directly from the dashboard.",
        color: "rose",
    },
];

const benefits = [
    {
        icon: Shield,
        title: "Enterprise Security",
        description: "End-to-end encryption with SOC 2 compliant infrastructure.",
    },
    {
        icon: Zap,
        title: "Real-Time Updates",
        description: "Instant notifications on project progress and milestones.",
    },
    {
        icon: Clock,
        title: "24/7 Access",
        description: "Access your projects and files anytime, from any device.",
    },
];

const colorMap: Record<string, string> = {
    blue: "from-blue-500/20 to-blue-600/5 border-blue-500/20 group-hover:border-blue-500/40",
    cyan: "from-cyan-500/20 to-cyan-600/5 border-cyan-500/20 group-hover:border-cyan-500/40",
    violet: "from-violet-500/20 to-violet-600/5 border-violet-500/20 group-hover:border-violet-500/40",
    emerald: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20 group-hover:border-emerald-500/40",
    amber: "from-amber-500/20 to-amber-600/5 border-amber-500/20 group-hover:border-amber-500/40",
    rose: "from-rose-500/20 to-rose-600/5 border-rose-500/20 group-hover:border-rose-500/40",
};

const iconColorMap: Record<string, string> = {
    blue: "text-blue-400",
    cyan: "text-cyan-400",
    violet: "text-violet-400",
    emerald: "text-emerald-400",
    amber: "text-amber-400",
    rose: "text-rose-400",
};

/* -------------------------------------------------------------------------- */
/*                              HERO SECTION                                   */
/* -------------------------------------------------------------------------- */

function SolutionsHero() {
    return (
        <PageHeader
            badge="Client Portal"
            badgeIcon={<Sparkles className="h-4 w-4" />}
            title="Your Projects, Simplified"
            description="Access your dedicated client dashboard to track projects, communicate with your team, manage files, and handle billing — all in one place."
            breadcrumbs={[{ label: "Solutions" }]}
            actions={
                <>
                    <Link
                        href="/login"
                        className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 hover:brightness-110"
                    >
                        <LogIn className="h-4 w-4" />
                        Sign In
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>

                    <Link
                        href="/signup"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/10"
                    >
                        <UserPlus className="h-4 w-4" />
                        Create Account
                    </Link>
                </>
            }
        />
    );
}

/* -------------------------------------------------------------------------- */
/*                            FEATURES GRID                                    */
/* -------------------------------------------------------------------------- */

function PortalFeatures() {
    return (
        <section className="relative py-24">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.06),transparent_50%)]" />

            <Container>
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mx-auto max-w-3xl text-center"
                >
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Everything You Need in One Dashboard
                    </h2>
                    <p className="mt-4 text-lg text-slate-400">
                        Your client portal provides all the tools you need to stay on top of your project and collaborate with our team.
                    </p>
                </motion.div>

                <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {portalFeatures.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={feature.title}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={viewport}
                                transition={{ delay: index * 0.08 }}
                                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-2xl transition-all duration-500 hover:-translate-y-1"
                            >
                                {/* Gradient overlay */}
                                <div
                                    className={`absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${colorMap[feature.color]}`}
                                />

                                <div className="relative">
                                    <div
                                        className={`mb-5 inline-flex rounded-xl border border-white/10 bg-white/5 p-3 ${iconColorMap[feature.color]}`}
                                    >
                                        <Icon className="h-6 w-6" />
                                    </div>

                                    <h3 className="text-lg font-semibold text-white">
                                        {feature.title}
                                    </h3>

                                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                                        {feature.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}

/* -------------------------------------------------------------------------- */
/*                            BENEFITS STRIP                                   */
/* -------------------------------------------------------------------------- */

function Benefits() {
    return (
        <section className="relative border-y border-white/5 py-16">
            <Container>
                <div className="grid gap-8 sm:grid-cols-3">
                    {benefits.map((benefit, index) => {
                        const Icon = benefit.icon;
                        return (
                            <motion.div
                                key={benefit.title}
                                variants={fadeUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={viewport}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-4"
                            >
                                <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-2.5">
                                    <Icon className="h-5 w-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">
                                        {benefit.title}
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-400">
                                        {benefit.description}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </Container>
        </section>
    );
}

/* -------------------------------------------------------------------------- */
/*                             CTA SECTION                                     */
/* -------------------------------------------------------------------------- */

function SolutionsCTA() {
    return (
        <section className="relative py-24">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom,rgba(37,99,235,0.08),transparent_60%)]" />

            <Container>
                <motion.div
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewport}
                    className="mx-auto max-w-3xl text-center"
                >
                    <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Ready to Get Started?
                    </h2>
                    <p className="mt-4 text-lg text-slate-400">
                        Already a client? Sign in to access your dashboard. New
                        here? Create an account or contact us to discuss your
                        project.
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link
                            href="/login"
                            className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-blue-500/40 hover:brightness-110"
                        >
                            <LogIn className="h-4 w-4" />
                            Sign In to Dashboard
                            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>

                        <Link
                            href="/signup"
                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/10"
                        >
                            <UserPlus className="h-4 w-4" />
                            Create Account
                        </Link>

                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/10"
                        >
                            Contact Us
                        </Link>
                    </div>
                </motion.div>
            </Container>
        </section>
    );
}

/* -------------------------------------------------------------------------- */
/*                              EXPORTS                                        */
/* -------------------------------------------------------------------------- */

export { SolutionsHero, PortalFeatures, Benefits, SolutionsCTA };
