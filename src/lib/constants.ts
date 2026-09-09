/* -------------------------------------------------------------------------- */
/*                                   SITE                                     */
/* -------------------------------------------------------------------------- */

export const SITE = {
    name: "Sentrox AI",
    shortName: "Sentrox",
    description:
        "Premium AI Website Agency specializing in AI-powered websites, automations, chatbots, SEO, and modern digital experiences.",
    url: "https://sentrox.ai",
    email: "founder.sentrox@gmail.com",
    phone: "+91 XXXXX XXXXX",
    location: "India",
} as const;

/* -------------------------------------------------------------------------- */
/*                                NAVIGATION                                  */
/* -------------------------------------------------------------------------- */

export const NAVIGATION = [
    {
        label: "Home",
        href: "/",
    },
    {
        label: "About",
        href: "/about",
    },
    {
        label: "Services",
        href: "/services",
    },
    {
        label: "Portfolio",
        href: "/portfolio",
    },
    {
        label: "Pricing",
        href: "/pricing",
    },
    {
        label: "Blog",
        href: "/blog",
    },
    {
        label: "Contact",
        href: "/contact",
    },
] as const;

/* -------------------------------------------------------------------------- */
/*                                 SERVICES                                   */
/* -------------------------------------------------------------------------- */

export const SERVICES = [
    "AI Websites",
    "Landing Pages",
    "Website Redesign",
    "AI Chatbots",
    "Workflow Automation",
    "SEO",
    "Hosting",
    "Maintenance",
] as const;

/* -------------------------------------------------------------------------- */
/*                                INDUSTRIES                                  */
/* -------------------------------------------------------------------------- */

export const INDUSTRIES = [
    "Hotels",
    "Restaurants",
    "Healthcare",
    "Fitness",
    "Education",
    "Real Estate",
    "Law Firms",
    "Clinics",
] as const;

/* -------------------------------------------------------------------------- */
/*                                BRAND COLORS                                */
/* -------------------------------------------------------------------------- */

export const COLORS = {
    primary: "#2563EB",

    secondary: "#0F172A",

    accent: "#06B6D4",

    success: "#22C55E",

    warning: "#F59E0B",

    danger: "#EF4444",

    white: "#FFFFFF",

    black: "#000000",
} as const;

/* -------------------------------------------------------------------------- */
/*                              BORDER RADIUS                                 */
/* -------------------------------------------------------------------------- */

export const RADIUS = {
    sm: "0.5rem",

    md: "0.75rem",

    lg: "1rem",

    xl: "1.5rem",

    "2xl": "2rem",

    "3xl": "2.5rem",
} as const;

/* -------------------------------------------------------------------------- */
/*                                  SPACING                                   */
/* -------------------------------------------------------------------------- */

export const SPACING = {
    section: "8rem",

    container: "7xl",

    card: "2rem",
} as const;

/* -------------------------------------------------------------------------- */
/*                               BREAKPOINTS                                  */
/* -------------------------------------------------------------------------- */

export const BREAKPOINTS = {
    sm: 640,

    md: 768,

    lg: 1024,

    xl: 1280,

    "2xl": 1536,
} as const;

/* -------------------------------------------------------------------------- */
/*                                ANIMATIONS                                  */
/* -------------------------------------------------------------------------- */

export const ANIMATION = {
    fast: 0.2,

    normal: 0.4,

    slow: 0.6,

    stagger: 0.08,

    floating: 4,
} as const;

/* -------------------------------------------------------------------------- */
/*                               PERFORMANCE                                  */
/* -------------------------------------------------------------------------- */

export const PERFORMANCE = {
    lighthouse: "95+",

    seo: "100",

    accessibility: "100",

    bestPractices: "100",
} as const;

/* -------------------------------------------------------------------------- */
/*                               SOCIAL LINKS                                 */
/* -------------------------------------------------------------------------- */

export const SOCIALS = {
    github: "https://github.com/",

    linkedin: "https://linkedin.com/",

    instagram: "https://instagram.com/",

    twitter: "https://x.com/",
} as const;

/* -------------------------------------------------------------------------- */
/*                                  CONTACT                                   */
/* -------------------------------------------------------------------------- */

export const CONTACT = {
    email: "founder.sentrox@gmail.com",

    phone: "+91 XXXXX XXXXX",

    address: "India",
} as const;

/* -------------------------------------------------------------------------- */
/*                               CTA BUTTONS                                  */
/* -------------------------------------------------------------------------- */

export const CTA = {
    primary: "Start Your Project",

    secondary: "Book Free Consultation",
} as const;