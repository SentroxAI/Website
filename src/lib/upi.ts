/* -------------------------------------------------------------------------- */
/*                          UPI PAYMENT UTILITIES                             */
/*                                                                            */
/*  Utility functions for UPI-based payments.                                 */
/*  Generates UPI payment URIs, order IDs, and currency formatters.           */
/* -------------------------------------------------------------------------- */

/* ── Environment ───────────────────────────────────────────────────────────── */

export const UPI_ID = process.env.NEXT_PUBLIC_UPI_ID || "";
export const UPI_PAYEE_NAME = process.env.NEXT_PUBLIC_UPI_NAME || "Sentrox AI";

/* ── UPI URI Builder ───────────────────────────────────────────────────────── */

export interface UpiUriParams {
    /** UPI ID of the payee (e.g. sentroxai@oksbi) */
    pa: string;
    /** Payee name */
    pn: string;
    /** Amount in INR (rupees, not paise) */
    am: number;
    /** Currency — always INR */
    cu?: string;
    /** Transaction reference ID (your order ID) */
    tr?: string;
    /** Transaction note / description */
    tn?: string;
}

/**
 * Build a UPI payment URI for QR code generation or deep-linking.
 *
 * @example
 * buildUpiUri({ pa: "sentrox@oksbi", pn: "Sentrox AI", am: 4999, tr: "STX-20260831-00001" })
 * // => "upi://pay?pa=sentrox%40oksbi&pn=Sentrox%20AI&am=4999&cu=INR&tr=STX-20260831-00001"
 */
export function buildUpiUri(params: UpiUriParams): string {
    const query = new URLSearchParams();
    query.set("pa", params.pa);
    query.set("pn", params.pn);
    query.set("am", String(params.am));
    query.set("cu", params.cu || "INR");
    if (params.tr) query.set("tr", params.tr);
    if (params.tn) query.set("tn", params.tn);
    return `upi://pay?${query.toString()}`;
}

/* ── Order ID Generator ────────────────────────────────────────────────────── */

/**
 * Generate a unique, human-readable order ID.
 * Format: STX-YYYYMMDD-XXXXX (e.g. STX-20260831-48A7F)
 */
export function generateOrderId(): string {
    const date = new Date();
    const dateStr = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("");

    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `STX-${dateStr}-${random}`;
}

/* ── Currency Formatter ────────────────────────────────────────────────────── */

/**
 * Format amount as INR display string.
 */
export function formatCurrency(
    amount: number,
    currency: string = "INR",
): string {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
}

/**
 * Check if the current device is likely mobile (for UPI deep-link).
 * Only intended for client-side use.
 */
export function isMobileDevice(): boolean {
    if (typeof window === "undefined") return false;
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}
