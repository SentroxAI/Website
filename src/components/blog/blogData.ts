

/* -------------------------------------------------------------------------- */
/*                                  TYPES                                     */
/* -------------------------------------------------------------------------- */

export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string[];
    category: string;
    author: {
        name: string;
        role: string;
    };
    publishedAt: string;
    readTime: string;
    featured: boolean;
    icon: string;
    color: string;
    tags: string[];
}

/* -------------------------------------------------------------------------- */
/*                               CATEGORIES                                   */
/* -------------------------------------------------------------------------- */

export const blogCategories = [
    "All",
    "AI & Automation",
    "Web Development",
    "Business Growth",
    "SEO",
    "Case Studies",
] as const;

/* -------------------------------------------------------------------------- */
/*                                  POSTS                                     */
/* -------------------------------------------------------------------------- */

export const blogPosts: BlogPost[] = [
    {
        id: "1",
        slug: "ai-chatbots-transforming-customer-support",
        title: "How AI Chatbots Are Transforming Customer Support in 2026",
        excerpt:
            "Discover how modern AI chatbots go beyond scripted responses to deliver personalized, context-aware customer experiences that increase satisfaction and reduce costs.",
        content: [
            "Customer support has undergone a radical transformation. Gone are the days of rigid decision trees and frustrating automated responses. In 2026, AI-powered chatbots leverage large language models to understand context, sentiment, and intent — delivering human-like interactions at scale.",
            "Modern AI chatbots can handle complex multi-turn conversations, access your knowledge base in real-time, and seamlessly escalate to human agents when needed. They operate 24/7, speak multiple languages, and learn from every interaction.",
            "The business impact is undeniable. Companies deploying AI chatbots report 40-60% reductions in support ticket volume, 35% improvements in customer satisfaction scores, and significantly faster response times. For businesses handling hundreds of inquiries daily, this translates to substantial cost savings.",
            "At Sentrox AI, we build custom chatbot solutions tailored to your business. Our chatbots integrate with your existing tools — CRM, helpdesk, scheduling, and more — creating a unified support experience that delights customers while freeing your team to focus on high-value work.",
            "The key to a successful chatbot implementation isn't just the technology — it's the training data, conversation design, and continuous optimization. We work closely with your team to ensure the chatbot reflects your brand voice and handles edge cases gracefully.",
        ],
        category: "AI & Automation",
        author: { name: "Sentrox AI", role: "Team" },
        publishedAt: "2026-07-15",
        readTime: "6 min read",
        featured: true,
        icon: "Bot",
        color: "blue",
        tags: ["AI Chatbots", "Customer Support", "Automation"],
    },
    {
        id: "2",
        slug: "why-businesses-need-ai-powered-websites",
        title: "Why Every Business Needs an AI-Powered Website in 2026",
        excerpt:
            "Static websites are dead. Learn how AI-powered features like personalized content, smart search, and dynamic CTAs are driving 3x more conversions.",
        content: [
            "The era of static, one-size-fits-all websites is over. In 2026, the most successful businesses are using AI to create dynamic, personalized web experiences that adapt to each visitor in real-time.",
            "An AI-powered website doesn't just look modern — it works smarter. Smart content personalization shows different messaging to first-time visitors versus returning customers. AI-driven search understands natural language queries and delivers relevant results instantly. Dynamic CTAs adjust based on user behavior and conversion likelihood.",
            "The results speak for themselves. Businesses with AI-enhanced websites see 2-3x higher conversion rates, 45% longer session durations, and significantly lower bounce rates compared to traditional static sites.",
            "Building an AI-powered website doesn't mean starting from scratch. Modern frameworks like Next.js combined with AI APIs allow us to progressively enhance your existing site with intelligent features — from chatbots and recommendation engines to automated content optimization.",
            "At Sentrox AI, we specialize in building these next-generation web experiences. Every website we create is optimized for performance (Lighthouse 95+), accessibility, and SEO, while incorporating AI features that give your business a genuine competitive advantage.",
        ],
        category: "Web Development",
        author: { name: "Sentrox AI", role: "Team" },
        publishedAt: "2026-07-08",
        readTime: "5 min read",
        featured: true,
        icon: "Globe",
        color: "cyan",
        tags: ["AI Websites", "Conversions", "Web Development"],
    },
    {
        id: "3",
        slug: "workflow-automation-small-business-guide",
        title: "The Small Business Guide to AI Workflow Automation",
        excerpt:
            "Automate repetitive tasks, reduce errors, and save 20+ hours per week. Here's how small businesses are leveraging AI automation without breaking the bank.",
        content: [
            "Small businesses often think automation is only for enterprises with massive budgets. That couldn't be further from the truth. In 2026, AI automation tools have become incredibly accessible, and the ROI is immediate.",
            "The most impactful automations for small businesses include: automated lead follow-up sequences that engage prospects within minutes, invoice generation and payment reminders that eliminate manual bookkeeping, social media scheduling with AI-generated captions, and customer onboarding workflows that run on autopilot.",
            "The average small business owner spends 15-25 hours per week on tasks that could be automated. At an hourly rate of $50-100, that's $3,000-$10,000 per month in potential savings — not including the reduction in errors and the consistency improvement.",
            "Getting started doesn't require a complete overhaul. We recommend beginning with your highest-volume repetitive task. Map the current process, identify decision points, and build a simple automation. Once you see the results, expanding becomes a no-brainer.",
            "Sentrox AI helps small businesses identify their biggest automation opportunities and build custom workflows using tools like n8n, Make, and custom AI agents. Our solutions integrate with the tools you already use — Gmail, Slack, Notion, Google Sheets, and more.",
        ],
        category: "AI & Automation",
        author: { name: "Sentrox AI", role: "Team" },
        publishedAt: "2026-06-28",
        readTime: "7 min read",
        featured: false,
        icon: "Zap",
        color: "amber",
        tags: ["Automation", "Small Business", "Productivity"],
    },
    {
        id: "4",
        slug: "seo-strategies-ai-era",
        title: "SEO in the AI Era: What Actually Works in 2026",
        excerpt:
            "Search algorithms have evolved dramatically. Learn the SEO strategies that drive organic traffic in an era of AI overviews, zero-click searches, and voice queries.",
        content: [
            "SEO in 2026 looks nothing like it did even two years ago. Google's AI Overviews, the rise of zero-click searches, and the growing importance of E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) have fundamentally changed how businesses need to approach search visibility.",
            "The fundamentals still matter — fast page speeds, mobile responsiveness, structured data, and quality content. But the bar for 'quality content' has risen dramatically. AI-generated fluff won't rank. Search engines reward content that demonstrates genuine expertise and provides unique value.",
            "Technical SEO has become more important than ever. Core Web Vitals are a ranking factor, and sites that nail performance (sub-2-second load times, minimal layout shift) have a significant advantage. Schema markup, proper canonicalization, and international SEO setup are table stakes.",
            "Content strategy has shifted toward topical authority. Instead of targeting individual keywords, successful sites build comprehensive content clusters around their core topics. This signals to search engines that you're a genuine authority in your space.",
            "At Sentrox AI, every website we build is SEO-optimized from the ground up — server-side rendering for instant indexability, structured data for rich snippets, automated sitemaps, and performance budgets that keep your Lighthouse scores above 95.",
        ],
        category: "SEO",
        author: { name: "Sentrox AI", role: "Team" },
        publishedAt: "2026-06-20",
        readTime: "8 min read",
        featured: false,
        icon: "Search",
        color: "emerald",
        tags: ["SEO", "AI Search", "Organic Traffic"],
    },
    {
        id: "5",
        slug: "nextjs-vs-wordpress-ai-websites",
        title: "Next.js vs WordPress: Why We Build on Next.js for AI Websites",
        excerpt:
            "A technical comparison of why modern AI-powered websites need the performance, flexibility, and developer experience that Next.js provides over WordPress.",
        content: [
            "WordPress powers over 40% of the web, and for good reason — it's accessible, has a massive ecosystem, and works well for content-heavy sites. But when it comes to building AI-powered, high-performance web applications, Next.js is in a different league.",
            "Performance is the most immediate difference. Next.js with React Server Components delivers sub-second page loads out of the box. WordPress sites, even heavily optimized ones, typically load in 2-4 seconds. In an era where Core Web Vitals impact rankings, this gap matters enormously.",
            "For AI integration, Next.js offers a decisive advantage. Server-side API routes make it trivial to connect to AI services, stream responses, and handle real-time data. WordPress requires plugins and workarounds for the same functionality, often introducing security vulnerabilities.",
            "The developer experience also translates to better outcomes for clients. TypeScript ensures type safety across the entire codebase, reducing bugs. Component-based architecture means features can be added, modified, or removed without affecting the rest of the site.",
            "We chose Next.js as our primary framework because it aligns with our mission: building premium, performant, AI-powered digital experiences. Every project benefits from server-side rendering, automatic code splitting, image optimization, and the ability to seamlessly integrate AI capabilities.",
        ],
        category: "Web Development",
        author: { name: "Sentrox AI", role: "Team" },
        publishedAt: "2026-06-12",
        readTime: "6 min read",
        featured: false,
        icon: "Cpu",
        color: "violet",
        tags: ["Next.js", "WordPress", "Performance"],
    },
    {
        id: "6",
        slug: "ai-security-best-practices-2026",
        title: "AI Security: Protecting Your Business in the Age of Intelligent Systems",
        excerpt:
            "As AI becomes integral to business operations, security risks evolve. Learn the essential practices to protect your AI-powered applications and data.",
        content: [
            "The rapid adoption of AI brings incredible opportunities — and new security challenges. Prompt injection attacks, data poisoning, model theft, and adversarial inputs are real threats that businesses need to address proactively.",
            "The first line of defense is input validation and sanitization. Every user input that reaches an AI model should be filtered for prompt injection attempts. This includes rate limiting, content moderation, and output validation to prevent the AI from leaking sensitive information.",
            "Data security is paramount. The training data, fine-tuning datasets, and user interactions that power your AI systems contain valuable — and often sensitive — information. Encryption at rest and in transit, access controls, and regular audits are non-negotiable.",
            "API security for AI endpoints requires special attention. AI inference endpoints are computationally expensive, making them attractive targets for DDoS attacks. Implement robust authentication, rate limiting, and monitoring. Use streaming responses with timeouts to prevent resource exhaustion.",
            "At Sentrox AI, security is built into every layer of our solutions. We follow OWASP guidelines for AI applications, implement comprehensive logging and monitoring, and conduct regular security reviews. Your AI systems should make your business stronger — not more vulnerable.",
        ],
        category: "Business Growth",
        author: { name: "Sentrox AI", role: "Team" },
        publishedAt: "2026-06-05",
        readTime: "7 min read",
        featured: false,
        icon: "Shield",
        color: "rose",
        tags: ["AI Security", "Data Protection", "Best Practices"],
    },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
    return blogPosts.find((post) => post.slug === slug);
}

export function getFeaturedPosts(): BlogPost[] {
    return blogPosts.filter((post) => post.featured);
}
