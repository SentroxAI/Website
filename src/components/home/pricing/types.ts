export type Currency = "INR" | "USD" | "EUR";

export type BillingCycle = "monthly" | "yearly";

export interface Price {
    monthly: string;
    yearly: string;
}

export interface PricingPlan {
    id: number;
    name: string;
    description: string;

    buttonText: string;

    popular?: boolean;

    prices: {
        INR: Price;
        USD: Price;
        EUR: Price;
    };

    features: string[];
}