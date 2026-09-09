export interface FAQ {
    id: number;
    question: string;
    answer: string;
    category: FAQCategory;
}

export type FAQCategory =
    | "General"
    | "Website"
    | "AI"
    | "SEO"
    | "Pricing"
    | "Support";