import { PricingPlan } from "./types";

export const pricingPlans: PricingPlan[] = [
    {
        id: 1,

        name: "Starter",

        description:
            "Perfect for startups and local businesses looking for a premium online presence.",

        buttonText: "Get Started",

        prices: {
            INR: {
                monthly: "₹24,999",
                yearly: "₹2,49,999",
            },

            USD: {
                monthly: "$699",
                yearly: "$6,999",
            },

            EUR: {
                monthly: "€649",
                yearly: "€6,499",
            },
        },

        features: [
            "Premium Landing Page",
            "Responsive Design",
            "Basic SEO",
            "Contact Form",
            "Google Maps Integration",
            "SSL Security",
            "Performance Optimization",
            "30 Days Support",
        ],
    },

    {
        id: 2,

        name: "Professional",

        description:
            "Best for growing businesses that need AI automation and lead generation.",

        buttonText: "Most Popular",

        popular: true,

        prices: {
            INR: {
                monthly: "₹59,999",
                yearly: "₹5,99,999",
            },

            USD: {
                monthly: "$1,499",
                yearly: "$14,999",
            },

            EUR: {
                monthly: "€1,399",
                yearly: "€13,999",
            },
        },

        features: [
            "Everything in Starter",
            "AI Chatbot",
            "Advanced SEO",
            "Booking System",
            "Analytics Dashboard",
            "Google Business Profile",
            "Email Automation",
            "Lead Capture",
            "Performance Monitoring",
            "Priority Support",
        ],
    },

    {
        id: 3,

        name: "Enterprise",

        description:
            "Tailored enterprise solution with unlimited scalability and dedicated support.",

        buttonText: "Contact Sales",

        prices: {
            INR: {
                monthly: "Custom",
                yearly: "Custom",
            },

            USD: {
                monthly: "Custom",
                yearly: "Custom",
            },

            EUR: {
                monthly: "Custom",
                yearly: "Custom",
            },
        },

        features: [
            "Everything in Professional",
            "Unlimited Pages",
            "Custom AI Solutions",
            "CRM Integration",
            "API Development",
            "Cloud Infrastructure",
            "Advanced Security",
            "Dedicated Project Manager",
            "24/7 Premium Support",
            "Custom Integrations",
            "Training & Onboarding",
            "Lifetime Consultation",
        ],
    },
];