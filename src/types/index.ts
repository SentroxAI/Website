/* -------------------------------------------------------------------------- */
/*                          SHARED TYPE DEFINITIONS                           */
/* -------------------------------------------------------------------------- */

/**
 * Re-export validated form types from Zod schemas
 */
export type {
    ContactFormData,
    NewsletterFormData,
    SignUpFormData,
    SignInFormData,
    ResetPasswordFormData,
    UpdatePasswordFormData,
} from "@/lib/validations";

/**
 * Re-export blog types
 */
export type { BlogPost } from "@/components/blog/blogData";

/**
 * Re-export database types
 */
export type {
    Database,
    Tables,
    TablesInsert,
    TablesUpdate,
    UserRole,
    ClientStatus,
    ProjectStatus,
    LeadStatus,
    MeetingStatus,
} from "@/types/database.types";

/* -------------------------------------------------------------------------- */
/*                            NAVIGATION TYPES                                */
/* -------------------------------------------------------------------------- */

export interface NavItem {
    label: string;
    href: string;
    children?: NavItem[];
}

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

/* -------------------------------------------------------------------------- */
/*                            SERVICE TYPES                                   */
/* -------------------------------------------------------------------------- */

export interface Service {
    id: string;
    title: string;
    description: string;
    icon: string;
    features: string[];
}

export interface Project {
    id: string;
    title: string;
    description: string;
    category: string;
    image?: string;
    url?: string;
    tags: string[];
}

export interface TeamMember {
    name: string;
    role: string;
    image?: string;
    bio?: string;
    socials?: {
        twitter?: string;
        linkedin?: string;
        github?: string;
    };
}

export interface Testimonial {
    id: string;
    name: string;
    role: string;
    company: string;
    content: string;
    avatar?: string;
    rating?: number;
}

export interface PricingPlan {
    id: string;
    name: string;
    description: string;
    price: string | number;
    period?: string;
    features: string[];
    highlighted?: boolean;
    cta?: string;
}

/* -------------------------------------------------------------------------- */
/*                            UTILITY TYPES                                   */
/* -------------------------------------------------------------------------- */

export type Status = "success" | "warning" | "danger" | "info";

export type Size = "xs" | "sm" | "md" | "lg" | "xl";

export type Variant = "default" | "outline" | "ghost" | "glass";
