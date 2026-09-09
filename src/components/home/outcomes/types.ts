import { LucideIcon } from "lucide-react";

export interface Outcome {
    id: number;
    title: string;
    description: string;
    icon: LucideIcon;
    gradient: string;
    features: string[];
}

export interface Metric {
    id: number;
    value: string;
    label: string;
    description: string;
}

export interface FloatingMetric {
    id: number;
    title: string;
    subtitle: string;
}