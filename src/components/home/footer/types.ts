import { LucideIcon } from "lucide-react";
import { ComponentType } from "react";
export interface FooterLink {
    label: string;
    href: string;
}

export interface FooterColumn {
    title: string;
    links: FooterLink[];
}

export interface SocialLink {
    name: string;
    href: string;
    icon: ComponentType<{ className?: string }>;
}

export interface ContactInfo {
    email: string;
    location: string;
    description: string;
}