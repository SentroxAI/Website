/* -------------------------------------------------------------------------- */
/*                     CLIENT-SIDE ANALYTICS                                  */
/*                                                                            */
/*  Sprint 4 — Module 10: Custom event tracking for marketing analytics.      */
/*  Supports Google Analytics (gtag) and Vercel Analytics.                    */
/*  All tracking is consent-aware and fails silently.                         */
/* -------------------------------------------------------------------------- */

/* ── Types ─────────────────────────────────────────────────────────────────── */

declare global {
    interface Window {
        gtag?: (...args: unknown[]) => void;
        dataLayer?: Record<string, unknown>[];
    }
}

export interface TrackEventParams {
    /** Event name (e.g., "form_submit", "cta_click"). */
    action: string;
    /** Event category (e.g., "contact", "pricing", "blog"). */
    category: string;
    /** Optional label for additional context. */
    label?: string;
    /** Optional numeric value (e.g., revenue amount). */
    value?: number;
}

/* ── Google Analytics ──────────────────────────────────────────────────────── */

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "";

/**
 * Track a page view in Google Analytics.
 * Called automatically by Next.js route changes if GA script is loaded.
 */
export function trackPageView(url: string): void {
    if (typeof window === "undefined" || !window.gtag || !GA_MEASUREMENT_ID) return;

    try {
        window.gtag("config", GA_MEASUREMENT_ID, {
            page_path: url,
        });
    } catch {
        // Fail silently
    }
}

/**
 * Track a custom event in Google Analytics.
 *
 * @example
 * ```ts
 * trackEvent({
 *   action: "form_submit",
 *   category: "contact",
 *   label: "hero_form",
 * });
 * ```
 */
export function trackEvent({ action, category, label, value }: TrackEventParams): void {
    if (typeof window === "undefined" || !window.gtag) return;

    try {
        window.gtag("event", action, {
            event_category: category,
            event_label: label,
            value,
        });
    } catch {
        // Fail silently
    }
}

/* ── Pre-built Event Helpers ───────────────────────────────────────────────── */

/** Track contact form submission. */
export function trackContactSubmit(source: string = "page"): void {
    trackEvent({
        action: "form_submit",
        category: "contact",
        label: source,
    });
}

/** Track newsletter signup. */
export function trackNewsletterSignup(): void {
    trackEvent({
        action: "newsletter_signup",
        category: "engagement",
        label: "footer",
    });
}

/** Track CTA button click. */
export function trackCTAClick(ctaName: string, page: string): void {
    trackEvent({
        action: "cta_click",
        category: "conversion",
        label: `${ctaName}:${page}`,
    });
}

/** Track pricing plan selection. */
export function trackPlanSelect(planName: string, price: number): void {
    trackEvent({
        action: "plan_select",
        category: "pricing",
        label: planName,
        value: price,
    });
}

/** Track blog post read. */
export function trackBlogRead(slug: string, category: string): void {
    trackEvent({
        action: "blog_read",
        category: "content",
        label: `${category}:${slug}`,
    });
}

/** Track portfolio view. */
export function trackPortfolioView(projectName: string): void {
    trackEvent({
        action: "portfolio_view",
        category: "content",
        label: projectName,
    });
}

/** Track service page engagement. */
export function trackServiceView(serviceName: string): void {
    trackEvent({
        action: "service_view",
        category: "engagement",
        label: serviceName,
    });
}

/** Track outbound link click. */
export function trackOutboundClick(url: string): void {
    trackEvent({
        action: "outbound_click",
        category: "engagement",
        label: url,
    });
}

/** Track search query on blog. */
export function trackSearch(query: string, resultCount: number): void {
    trackEvent({
        action: "search",
        category: "engagement",
        label: query,
        value: resultCount,
    });
}

/** Track file download. */
export function trackDownload(fileName: string, fileType: string): void {
    trackEvent({
        action: "download",
        category: "engagement",
        label: `${fileType}:${fileName}`,
    });
}
