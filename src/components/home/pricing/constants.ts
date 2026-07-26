import { Currency } from "./types";

export interface CurrencyOption {
    code: Currency;
    label: string;
    symbol: string;
    flag: string;
}

export const CURRENCIES: CurrencyOption[] = [
    {
        code: "INR",
        label: "Indian Rupee",
        symbol: "₹",
        flag: "🇮🇳",
    },

    {
        code: "USD",
        label: "US Dollar",
        symbol: "$",
        flag: "🇺🇸",
    },

    {
        code: "EUR",
        label: "Euro",
        symbol: "€",
        flag: "🇪🇺",
    },
];