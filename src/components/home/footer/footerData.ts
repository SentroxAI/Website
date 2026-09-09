import { Mail } from "lucide-react";

import {
    FaGithub,
    FaLinkedin,
    FaInstagram,
    FaXTwitter,
} from "react-icons/fa6";

import {
    FooterColumn,
    SocialLink,
    ContactInfo,
} from "./types";

export const footerColumns: FooterColumn[] = [
    {
        title: "Company",
        links: [
            {
                label: "About",
                href: "/about",
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
                label: "Contact",
                href: "/contact",
            },
        ],
    },

    {
        title: "Services",
        links: [
            {
                label: "AI Websites",
                href: "/services/ai-websites",
            },
            {
                label: "Landing Pages",
                href: "/services/landing-pages",
            },
            {
                label: "AI Chatbots",
                href: "/services/chatbots",
            },
            {
                label: "SEO",
                href: "/services/seo",
            },
            {
                label: "Automation",
                href: "/services/automation",
            },
        ],
    },

    {
        title: "Industries",
        links: [
            {
                label: "Hotels",
                href: "/industries/hotels",
            },
            {
                label: "Restaurants",
                href: "/industries/restaurants",
            },
            {
                label: "Healthcare",
                href: "/industries/healthcare",
            },
            {
                label: "Real Estate",
                href: "/industries/real-estate",
            },
            {
                label: "Education",
                href: "/industries/education",
            },
        ],
    },

    {
        title: "Resources",
        links: [
            {
                label: "Blog",
                href: "/blog",
            },
            {
                label: "FAQ",
                href: "/#faq",
            },
            {
                label: "Privacy Policy",
                href: "/privacy-policy",
            },
            {
                label: "Terms of Service",
                href: "/terms",
            },
            {
                label: "Support",
                href: "/contact",
            },
        ],
    },
];

export const socialLinks = [
    {
        name: "GitHub",
        href: "https://github.com/",
        icon: FaGithub,
    },
    {
        name: "LinkedIn",
        href: "https://linkedin.com/",
        icon: FaLinkedin,
    },
    {
        name: "Instagram",
        href: "https://instagram.com/",
        icon: FaInstagram,
    },
    {
        name: "X",
        href: "https://x.com/",
        icon: FaXTwitter,
    },
    {
        name: "Email",
        href: "mailto:founder.sentrox@gmail.com",
        icon: Mail,
    },
];

export const contactInfo: ContactInfo = {
    email: "founder.sentrox@gmail.com",
    location: "India",
    description:
        "Building premium AI-powered websites, automations, and digital experiences for modern businesses.",
};