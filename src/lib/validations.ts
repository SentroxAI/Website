import { z } from "zod/v4";

/* -------------------------------------------------------------------------- */
/*                          VALIDATION SCHEMAS                                */
/* -------------------------------------------------------------------------- */

/**
 * Contact Form Schema
 * Shared between client (react-hook-form) and server (API route).
 */
export const contactFormSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be under 100 characters"),
    email: z
        .email("Please enter a valid email address"),
    phone: z
        .string()
        .optional()
        .or(z.literal("")),
    company: z
        .string()
        .optional()
        .or(z.literal("")),
    service: z
        .string()
        .min(1, "Please select a service"),
    budget: z
        .string()
        .optional()
        .or(z.literal("")),
    message: z
        .string()
        .min(20, "Message must be at least 20 characters")
        .max(5000, "Message must be under 5000 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Quote Calculator Form Schema
 * Used by the merged quote calculator + contact form on /contact.
 */
export const quoteFormSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be under 100 characters"),
    email: z.email("Please enter a valid email address"),
    phone: z
        .string()
        .optional()
        .or(z.literal("")),
    company: z
        .string()
        .optional()
        .or(z.literal("")),
    notes: z
        .string()
        .max(5000, "Notes must be under 5000 characters")
        .optional()
        .or(z.literal("")),
    line_items: z.array(
        z.object({
            name: z.string(),
            amount: z.number(),
            unit: z.string(),
            qty: z.number().optional(),
        })
    ),
    one_time_total: z.number(),
    monthly_total: z.number(),
    display_currency: z.string(),
});

export type QuoteFormData = z.infer<typeof quoteFormSchema>;

/**
 * Newsletter Subscription Schema
 */
export const newsletterSchema = z.object({
    email: z.email("Please enter a valid email address"),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

/* -------------------------------------------------------------------------- */
/*                        AUTH VALIDATION SCHEMAS                              */
/* -------------------------------------------------------------------------- */

/**
 * Sign Up Schema
 */
export const signUpSchema = z
    .object({
        full_name: z
            .string()
            .min(2, "Name must be at least 2 characters")
            .max(100, "Name must be under 100 characters"),
        email: z.email("Please enter a valid email address"),
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[a-zA-Z]/, "Password must contain at least one letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
        confirm_password: z.string(),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "Passwords do not match",
        path: ["confirm_password"],
    });

export type SignUpFormData = z.infer<typeof signUpSchema>;

/**
 * Sign In Schema
 */
export const signInSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});

export type SignInFormData = z.infer<typeof signInSchema>;

/**
 * Reset Password Schema (request email)
 */
export const resetPasswordSchema = z.object({
    email: z.email("Please enter a valid email address"),
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * Update Password Schema (set new password)
 */
export const updatePasswordSchema = z
    .object({
        password: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[a-zA-Z]/, "Password must contain at least one letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
        confirm_password: z.string(),
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "Passwords do not match",
        path: ["confirm_password"],
    });

export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;

/* -------------------------------------------------------------------------- */
/*                       BILLING VALIDATION SCHEMAS                            */
/* -------------------------------------------------------------------------- */

/**
 * Create Payment Schema
 */
export const createPaymentSchema = z.object({
    amount: z
        .number()
        .positive("Amount must be greater than 0")
        .max(10000000, "Amount exceeds maximum limit"),
    currency: z.string().default("INR"),
    client_id: z.string().uuid("Invalid client ID"),
    plan_id: z.string().uuid("Invalid plan ID").optional(),
    description: z.string().max(500, "Description too long").optional(),
});

export type CreatePaymentData = z.infer<typeof createPaymentSchema>;

/**
 * Create Invoice Schema
 */
export const createInvoiceSchema = z.object({
    client_id: z.string().uuid("Invalid client ID"),
    items: z
        .array(
            z.object({
                description: z.string().min(1, "Description is required"),
                quantity: z.number().int().positive("Quantity must be positive"),
                unit_price: z.number().positive("Unit price must be positive"),
                hsn_code: z.string().optional(),
            }),
        )
        .min(1, "At least one line item is required"),
    tax_rate: z.number().min(0).max(100).default(18),
    due_date: z.string().optional(),
    notes: z.string().max(2000).optional(),
    gst_number: z.string().max(20).optional(),
    billing_name: z.string().max(200).optional(),
    billing_address: z.string().max(500).optional(),
    billing_email: z.email("Invalid billing email").optional(),
    billing_phone: z.string().max(20).optional(),
});

export type CreateInvoiceFormData = z.infer<typeof createInvoiceSchema>;

/**
 * Create/Update Plan Schema
 */
export const planSchema = z.object({
    name: z
        .string()
        .min(2, "Plan name must be at least 2 characters")
        .max(100, "Plan name must be under 100 characters"),
    slug: z
        .string()
        .min(2, "Slug must be at least 2 characters")
        .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
    description: z.string().max(500).optional(),
    price_monthly: z.number().min(0, "Price cannot be negative"),
    price_yearly: z.number().min(0, "Price cannot be negative"),
    currency: z.string().default("INR"),
    features: z.array(z.string()).min(1, "At least one feature is required"),
    is_popular: z.boolean().default(false),
    sort_order: z.number().int().min(0).default(0),
});

export type PlanFormData = z.infer<typeof planSchema>;

/**
 * Refund Schema
 */
export const refundSchema = z.object({
    payment_id: z.string().uuid("Invalid payment ID"),
    amount: z.number().positive("Refund amount must be positive"),
    reason: z
        .string()
        .min(5, "Reason must be at least 5 characters")
        .max(500, "Reason must be under 500 characters"),
});

export type RefundFormData = z.infer<typeof refundSchema>;

/**
 * Subscription Create Schema
 */
export const createSubscriptionSchema = z.object({
    client_id: z.string().uuid("Invalid client ID"),
    plan_id: z.string().uuid("Invalid plan ID"),
    billing_cycle: z.enum(["monthly", "yearly"]),
});

export type CreateSubscriptionFormData = z.infer<typeof createSubscriptionSchema>;
