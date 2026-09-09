import {
    Zap,
    Search,
    Bot,
    TrendingUp,
    Smartphone,
    ShieldCheck,
} from "lucide-react";

import { FloatingMetric, Metric, Outcome } from "./types";

export const outcomes: Outcome[] = [
    {
        id: 1,
        title: "Lightning Fast Performance",
        description:
            "Every website is optimized for speed, responsiveness, and an exceptional user experience.",
        icon: Zap,
        gradient: "from-blue-500 to-cyan-500",
        features: [
            "95+ Lighthouse Score",
            "Core Web Vitals Optimized",
            "Fast Page Loading",
            "Optimized Assets",
        ],
    },

    {
        id: 2,
        title: "SEO Ready Architecture",
        description:
            "Built using modern SEO best practices to maximize discoverability on search engines.",
        icon: Search,
        gradient: "from-violet-500 to-fuchsia-500",
        features: [
            "Technical SEO",
            "Schema Markup",
            "Meta Optimization",
            "Search Friendly URLs",
        ],
    },

    {
        id: 3,
        title: "AI Powered Automation",
        description:
            "Reduce manual work with intelligent automation and AI-powered customer interactions.",
        icon: Bot,
        gradient: "from-cyan-500 to-emerald-500",
        features: [
            "AI Chatbots",
            "Lead Qualification",
            "Appointment Booking",
            "24/7 Assistance",
        ],
    },

    {
        id: 4,
        title: "Higher Conversion Potential",
        description:
            "Conversion-focused layouts designed to turn visitors into paying customers.",
        icon: TrendingUp,
        gradient: "from-orange-500 to-pink-500",
        features: [
            "Modern UX",
            "Strategic CTAs",
            "Optimized Landing Pages",
            "Lead Generation",
        ],
    },

    {
        id: 5,
        title: "Premium User Experience",
        description:
            "Elegant interfaces inspired by Apple's design philosophy with smooth animations.",
        icon: Smartphone,
        gradient: "from-indigo-500 to-blue-500",
        features: [
            "Responsive Design",
            "Premium UI",
            "Fluid Animations",
            "Accessibility",
        ],
    },

    {
        id: 6,
        title: "Enterprise Grade Development",
        description:
            "Scalable, secure, and maintainable architecture ready for long-term growth.",
        icon: ShieldCheck,
        gradient: "from-emerald-500 to-teal-500",
        features: [
            "Secure Code",
            "Scalable Architecture",
            "Production Ready",
            "Clean Development",
        ],
    },
];

export const metrics: Metric[] = [
    {
        id: 1,
        value: "95+",
        label: "Performance",
        description: "Lighthouse Optimized",
    },

    {
        id: 2,
        value: "100%",
        label: "Responsive",
        description: "Mobile First",
    },

    {
        id: 3,
        value: "SEO",
        label: "Ready",
        description: "Search Optimized",
    },

    {
        id: 4,
        value: "AI",
        label: "Powered",
        description: "Automation Ready",
    },
];

export const floatingMetrics: FloatingMetric[] = [
    {
        id: 1,
        title: "95+ Performance",
        subtitle: "Optimized Experience",
    },

    {
        id: 2,
        title: "SEO Ready",
        subtitle: "Search Optimized",
    },

    {
        id: 3,
        title: "AI Powered",
        subtitle: "Smart Automation",
    },
];