import {
    Globe,
    Bot,
    BrainCircuit,
    Code2,
    Search,
    Wrench,
    Zap,
    Shield,
    BarChart3,
    Layers,
    Smartphone,
    Rocket,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                               SERVICES DATA                                */
/* -------------------------------------------------------------------------- */

export const servicesData = [
    {
        id: "ai-website",
        title: "AI Website Development",
        shortDescription:
            "Premium websites that combine beautiful design with AI-powered experiences.",
        description:
            "We build fast, modern, SEO-optimized websites powered by AI. From intelligent search and personalized content to chatbot integrations, every website is designed to convert visitors into customers.",
        icon: Globe,
        color: "blue",
        features: [
            {
                icon: Zap,
                title: "Lightning Performance",
                description: "Sub-second load times with Next.js and edge computing.",
            },
            {
                icon: Search,
                title: "SEO Optimized",
                description: "Technical SEO built in from day one for maximum visibility.",
            },
            {
                icon: Smartphone,
                title: "Responsive Design",
                description: "Pixel-perfect across all devices and screen sizes.",
            },
            {
                icon: Shield,
                title: "Secure & Reliable",
                description: "Enterprise-grade security with 99.9% uptime.",
            },
        ],
        process: [
            "Discovery & Requirements",
            "UI/UX Design",
            "Development & AI Integration",
            "Testing & QA",
            "Launch & Optimization",
        ],
        techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel", "AI APIs"],
    },
    {
        id: "ai-automation",
        title: "AI Automation",
        shortDescription:
            "Automate repetitive workflows and boost productivity with AI.",
        description:
            "Streamline your operations with custom AI automation. From email workflows and data processing to customer onboarding and reporting, we build systems that save hours of manual work every week.",
        icon: BrainCircuit,
        color: "cyan",
        features: [
            {
                icon: Layers,
                title: "Workflow Automation",
                description: "Automate complex multi-step business processes.",
            },
            {
                icon: BarChart3,
                title: "Smart Analytics",
                description: "AI-driven insights from your business data.",
            },
            {
                icon: Zap,
                title: "Real-Time Processing",
                description: "Instant data processing and decision making.",
            },
            {
                icon: Shield,
                title: "Error Reduction",
                description: "Eliminate human error in repetitive tasks.",
            },
        ],
        process: [
            "Workflow Analysis",
            "Solution Architecture",
            "Integration Development",
            "Testing & Monitoring",
            "Deployment & Training",
        ],
        techStack: ["Python", "Node.js", "Make", "Zapier", "OpenAI", "Custom APIs"],
    },
    {
        id: "ai-agents",
        title: "AI Agents & Chatbots",
        shortDescription:
            "Intelligent AI agents that handle customer interactions 24/7.",
        description:
            "Deploy smart AI agents that understand your business, answer customer questions, qualify leads, and handle support — all without human intervention. Custom-trained on your data for accurate, brand-consistent responses.",
        icon: Bot,
        color: "violet",
        features: [
            {
                icon: BrainCircuit,
                title: "Custom Training",
                description: "Trained on your specific business data and knowledge.",
            },
            {
                icon: Globe,
                title: "Multi-Channel",
                description: "Deploy on website, WhatsApp, Slack, and more.",
            },
            {
                icon: Zap,
                title: "Lead Qualification",
                description: "Automatically qualify and route leads to your team.",
            },
            {
                icon: BarChart3,
                title: "Analytics Dashboard",
                description: "Track conversations, satisfaction, and conversion rates.",
            },
        ],
        process: [
            "Knowledge Base Setup",
            "Agent Design & Training",
            "Integration & Testing",
            "Deployment",
            "Continuous Improvement",
        ],
        techStack: ["OpenAI", "LangChain", "Pinecone", "Vercel AI", "Next.js", "WebSocket"],
    },
    {
        id: "custom-software",
        title: "Custom Software Development",
        shortDescription:
            "Bespoke software solutions tailored to your unique business needs.",
        description:
            "When off-the-shelf solutions don't cut it, we build custom software. From internal tools and dashboards to full SaaS platforms, we develop scalable applications that solve your specific challenges.",
        icon: Code2,
        color: "emerald",
        features: [
            {
                icon: Layers,
                title: "Scalable Architecture",
                description: "Built to grow with your business from day one.",
            },
            {
                icon: Shield,
                title: "Enterprise Security",
                description: "Security best practices at every layer.",
            },
            {
                icon: Rocket,
                title: "Rapid Development",
                description: "Agile methodology for faster time-to-market.",
            },
            {
                icon: BarChart3,
                title: "Data-Driven",
                description: "Built-in analytics and reporting capabilities.",
            },
        ],
        process: [
            "Requirements & Planning",
            "Architecture Design",
            "Sprint Development",
            "Quality Assurance",
            "Deployment & Iteration",
        ],
        techStack: ["React", "Next.js", "Node.js", "PostgreSQL", "AWS", "Docker"],
    },
    {
        id: "seo",
        title: "SEO & Digital Growth",
        shortDescription:
            "Data-driven SEO strategies that drive organic traffic and conversions.",
        description:
            "Dominate search results with our comprehensive SEO service. We combine technical SEO, content strategy, and AI-powered optimization to drive sustainable organic growth.",
        icon: Search,
        color: "amber",
        features: [
            {
                icon: Search,
                title: "Technical SEO",
                description: "Site speed, schema markup, and crawlability optimization.",
            },
            {
                icon: BarChart3,
                title: "Keyword Strategy",
                description: "AI-powered keyword research and content planning.",
            },
            {
                icon: Globe,
                title: "Local SEO",
                description: "Dominate local search results and Google Maps.",
            },
            {
                icon: Zap,
                title: "Core Web Vitals",
                description: "Optimize performance metrics for ranking boosts.",
            },
        ],
        process: [
            "SEO Audit",
            "Strategy Development",
            "On-Page Optimization",
            "Content Creation",
            "Monitoring & Reporting",
        ],
        techStack: ["Google Search Console", "Ahrefs", "Screaming Frog", "GA4", "Schema.org"],
    },
    {
        id: "maintenance",
        title: "Maintenance & Support",
        shortDescription:
            "Ongoing maintenance, updates, and technical support for your digital products.",
        description:
            "Keep your digital products running smoothly with our maintenance service. Regular updates, security patches, performance monitoring, and priority support to ensure everything works perfectly.",
        icon: Wrench,
        color: "rose",
        features: [
            {
                icon: Shield,
                title: "Security Updates",
                description: "Regular patches and vulnerability monitoring.",
            },
            {
                icon: Zap,
                title: "Performance Monitoring",
                description: "24/7 uptime and performance tracking.",
            },
            {
                icon: Wrench,
                title: "Bug Fixes",
                description: "Priority issue resolution and troubleshooting.",
            },
            {
                icon: Rocket,
                title: "Feature Updates",
                description: "Regular improvements and new feature development.",
            },
        ],
        process: [
            "Assessment",
            "Maintenance Plan",
            "Regular Updates",
            "Monitoring",
            "Reporting",
        ],
        techStack: ["Vercel", "Sentry", "Uptime Robot", "GitHub Actions", "Cloudflare"],
    },
];
