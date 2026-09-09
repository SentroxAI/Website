/* -------------------------------------------------------------------------- */
/*                             PORTFOLIO DATA                                 */
/* -------------------------------------------------------------------------- */

export interface PortfolioProject {
    id: string;
    title: string;
    category: string;
    description: string;
    longDescription: string;
    tech: string[];
    metrics: { label: string; value: string }[];
    color: string;
    featured: boolean;
}

export const categories = [
    "All",
    "AI Websites",
    "Automation",
    "E-Commerce",
    "SaaS",
    "Chatbots",
];

export const portfolioProjects: PortfolioProject[] = [
    {
        id: "aurora-ai",
        title: "Aurora AI Platform",
        category: "SaaS",
        description: "AI-powered analytics and content platform for data-driven teams.",
        longDescription:
            "Built a comprehensive SaaS platform that uses machine learning to analyze business data, generate insights, and automate content creation. The platform serves 5,000+ users with real-time dashboards and AI-generated reports.",
        tech: ["Next.js", "TypeScript", "Python", "PostgreSQL", "OpenAI", "AWS"],
        metrics: [
            { label: "Users", value: "5,000+" },
            { label: "Uptime", value: "99.9%" },
            { label: "Load Time", value: "0.8s" },
            { label: "ROI", value: "340%" },
        ],
        color: "blue",
        featured: true,
    },
    {
        id: "nexus-ecom",
        title: "Nexus E-Commerce",
        category: "E-Commerce",
        description: "AI-powered shopping experience with personalized recommendations.",
        longDescription:
            "Developed a modern e-commerce platform with AI product recommendations, smart search, and automated inventory management. Increased conversions by 65% through personalized shopping experiences.",
        tech: ["Next.js", "Stripe", "AI Search", "Tailwind", "Vercel", "Redis"],
        metrics: [
            { label: "Conversion", value: "+65%" },
            { label: "Revenue", value: "+120%" },
            { label: "Speed", value: "95/100" },
            { label: "AOV", value: "+28%" },
        ],
        color: "emerald",
        featured: true,
    },
    {
        id: "pulse-health",
        title: "Pulse Health Portal",
        category: "AI Websites",
        description: "Intelligent healthcare portal with AI symptom analysis.",
        longDescription:
            "Created a HIPAA-compliant healthcare platform featuring AI-powered symptom checking, appointment scheduling, and telemedicine integration. Serving 10,000+ patients across 50 clinics.",
        tech: ["React", "Node.js", "PostgreSQL", "AI APIs", "WebRTC", "Docker"],
        metrics: [
            { label: "Patients", value: "10K+" },
            { label: "Clinics", value: "50+" },
            { label: "Satisfaction", value: "4.8/5" },
            { label: "Wait Time", value: "-40%" },
        ],
        color: "cyan",
        featured: true,
    },
    {
        id: "flow-automation",
        title: "FlowAI Automation Suite",
        category: "Automation",
        description: "Enterprise workflow automation saving 2,000+ hours monthly.",
        longDescription:
            "Designed and deployed a custom automation system for a mid-size enterprise, automating email workflows, data processing, invoice generation, and customer onboarding across 5 departments.",
        tech: ["Python", "Node.js", "Make", "Slack API", "PostgreSQL", "Docker"],
        metrics: [
            { label: "Hours Saved", value: "2,000+/mo" },
            { label: "Accuracy", value: "99.7%" },
            { label: "Departments", value: "5" },
            { label: "Cost Savings", value: "60%" },
        ],
        color: "violet",
        featured: false,
    },
    {
        id: "aria-chatbot",
        title: "Aria AI Assistant",
        category: "Chatbots",
        description: "Multilingual AI chatbot handling 90% of support queries.",
        longDescription:
            "Built a custom AI assistant trained on 100,000+ support articles. Handles customer queries in 12 languages with 90% resolution rate, reducing support costs by 45%.",
        tech: ["OpenAI", "LangChain", "Pinecone", "Next.js", "WebSocket", "Redis"],
        metrics: [
            { label: "Resolution", value: "90%" },
            { label: "Languages", value: "12" },
            { label: "Cost Reduction", value: "45%" },
            { label: "Satisfaction", value: "4.6/5" },
        ],
        color: "amber",
        featured: false,
    },
    {
        id: "venture-studio",
        title: "Venture Studio Website",
        category: "AI Websites",
        description: "Award-winning startup studio website with immersive animations.",
        longDescription:
            "Created a cutting-edge website for a venture studio featuring 3D animations, interactive scroll experiences, and AI-generated content sections. Won 3 design awards.",
        tech: ["Next.js", "Three.js", "Framer Motion", "GSAP", "Vercel", "Sanity"],
        metrics: [
            { label: "Awards", value: "3" },
            { label: "Bounce Rate", value: "-35%" },
            { label: "Time on Site", value: "+180%" },
            { label: "Leads", value: "+90%" },
        ],
        color: "rose",
        featured: false,
    },
];
