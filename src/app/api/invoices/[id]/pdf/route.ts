/* -------------------------------------------------------------------------- */
/*                     INVOICE PDF DOWNLOAD                                   */
/*                                                                            */
/*  GET /api/invoices/[id]/pdf                                                */
/*  Generates and returns a PDF for a given invoice.                          */
/*  Uses server-side HTML-to-PDF rendering without external dependencies.     */
/* -------------------------------------------------------------------------- */

import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";

/**
 * Generate invoice PDF as HTML (rendered as a downloadable page).
 * For a full binary PDF, you'd integrate a library like `puppeteer` or `@react-pdf/renderer`.
 * This implementation returns a print-ready HTML document that browsers can save as PDF.
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const admin = createAdminClient();

        /* ── Fetch invoice with items and client info ──────────────────── */
        const { data: invoice, error } = await admin
            .from("invoices")
            .select(`
                *,
                items:invoice_items(*),
                client:clients(id, company, users:users(full_name, email))
            `)
            .eq("id", id)
            .single();

        if (error || !invoice) {
            return NextResponse.json(
                { error: "Invoice not found" },
                { status: 404 },
            );
        }

        /* ── Verify access (admin or own invoice) ─────────────────────── */
        const { data: profile } = await supabase
            .from("users")
            .select("role")
            .eq("id", user.id)
            .single<{ role: string }>();

        const { data: clientRecord } = await admin
            .from("clients")
            .select("id")
            .eq("user_id", user.id)
            .maybeSingle();

        const isAdmin = profile?.role === "admin";
        const isOwner = clientRecord?.id === invoice.client_id;

        if (!isAdmin && !isOwner) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        /* ── Build items table ────────────────────────────────────────── */
        const items = (invoice.items || []) as Array<{
            description: string;
            quantity: number;
            unit_price: number;
            amount: number;
            hsn_code: string | null;
        }>;

        const itemRows = items.map((item) => `
            <tr>
                <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">${item.description}</td>
                ${item.hsn_code ? `<td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.hsn_code}</td>` : `<td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: center;">—</td>`}
                <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
                <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${Number(item.unit_price).toLocaleString("en-IN")}</td>
                <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${Number(item.amount).toLocaleString("en-IN")}</td>
            </tr>
        `).join("");

        /* ── Client info ──────────────────────────────────────────────── */
        const client = invoice.client as { company: string; users: { full_name: string; email: string } | null } | null;
        const clientName = invoice.billing_name || client?.company || "N/A";
        const clientEmail = invoice.billing_email || client?.users?.email || "";

        /* ── Generate HTML invoice ────────────────────────────────────── */
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${invoice.invoice_number}</title>
    <style>
        @media print {
            body { margin: 0; padding: 20px; }
            .no-print { display: none !important; }
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            color: #111827;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
            background: white;
        }
        .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
        .logo { font-size: 24px; font-weight: 700; color: #0ea5e9; }
        .logo span { color: #6366f1; }
        .invoice-title { font-size: 28px; font-weight: 700; color: #111827; text-align: right; }
        .invoice-number { font-size: 14px; color: #6b7280; margin-top: 4px; text-align: right; }
        .status-badge {
            display: inline-block; padding: 4px 12px; border-radius: 20px;
            font-size: 12px; font-weight: 600; text-transform: uppercase;
        }
        .status-paid { background: #d1fae5; color: #065f46; }
        .status-draft { background: #e5e7eb; color: #374151; }
        .status-sent { background: #dbeafe; color: #1e40af; }
        .status-overdue { background: #fee2e2; color: #991b1b; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px; }
        .info-section h3 { font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 8px; }
        .info-section p { font-size: 14px; margin: 4px 0; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        thead th {
            padding: 12px 16px; text-align: left; font-size: 12px;
            font-weight: 600; color: #6b7280; text-transform: uppercase;
            background: #f9fafb; border-bottom: 2px solid #e5e7eb;
        }
        .totals { width: 300px; margin-left: auto; }
        .totals tr td { padding: 8px 16px; font-size: 14px; }
        .totals .total-row td { font-weight: 700; font-size: 16px; border-top: 2px solid #111827; padding-top: 12px; }
        .footer { margin-top: 60px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; text-align: center; }
        .print-btn {
            position: fixed; bottom: 24px; right: 24px;
            background: #0ea5e9; color: white; border: none;
            padding: 12px 24px; border-radius: 8px; cursor: pointer;
            font-size: 14px; font-weight: 600; box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
        }
        .print-btn:hover { background: #0284c7; }
    </style>
</head>
<body>
    <button class="print-btn no-print" onclick="window.print()">🖨️ Download PDF</button>

    <div class="header">
        <div>
            <div class="logo">Sentrox <span>AI</span></div>
            <p style="font-size: 13px; color: #6b7280; margin-top: 4px;">
                AI-Powered Digital Solutions<br>
                hello@sentroxai.com
            </p>
        </div>
        <div>
            <div class="invoice-title">INVOICE</div>
            <div class="invoice-number">${invoice.invoice_number}</div>
            <div style="text-align: right; margin-top: 8px;">
                <span class="status-badge status-${invoice.status}">${invoice.status}</span>
            </div>
        </div>
    </div>

    <div class="info-grid">
        <div class="info-section">
            <h3>Bill To</h3>
            <p style="font-weight: 600;">${clientName}</p>
            ${clientEmail ? `<p>${clientEmail}</p>` : ""}
            ${invoice.billing_phone ? `<p>${invoice.billing_phone}</p>` : ""}
            ${invoice.billing_address ? `<p>${invoice.billing_address}</p>` : ""}
            ${invoice.gst_number ? `<p>GST: ${invoice.gst_number}</p>` : ""}
        </div>
        <div class="info-section" style="text-align: right;">
            <h3>Invoice Details</h3>
            <p><strong>Issue Date:</strong> ${new Date(invoice.issue_date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>
            <p><strong>Due Date:</strong> ${new Date(invoice.due_date).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>
            ${invoice.paid_at ? `<p><strong>Paid:</strong> ${new Date(invoice.paid_at).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}</p>` : ""}
            <p><strong>Currency:</strong> ${invoice.currency}</p>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th>Description</th>
                <th style="text-align: center;">HSN</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Amount</th>
            </tr>
        </thead>
        <tbody>
            ${itemRows}
        </tbody>
    </table>

    <table class="totals">
        <tbody>
            <tr>
                <td>Subtotal</td>
                <td style="text-align: right;">₹${Number(invoice.subtotal).toLocaleString("en-IN")}</td>
            </tr>
            <tr>
                <td>GST (${invoice.tax_rate}%)</td>
                <td style="text-align: right;">₹${Number(invoice.tax_amount).toLocaleString("en-IN")}</td>
            </tr>
            <tr class="total-row">
                <td>Total</td>
                <td style="text-align: right;">₹${Number(invoice.total).toLocaleString("en-IN")}</td>
            </tr>
        </tbody>
    </table>

    ${invoice.notes ? `
    <div style="margin-top: 32px; padding: 16px; background: #f9fafb; border-radius: 8px;">
        <h3 style="font-size: 12px; font-weight: 600; color: #6b7280; text-transform: uppercase; margin-bottom: 8px;">Notes</h3>
        <p style="font-size: 14px; color: #374151;">${invoice.notes}</p>
    </div>
    ` : ""}

    <div class="footer">
        <p>Sentrox AI — sentroxai.com</p>
        <p>Thank you for your business!</p>
    </div>
</body>
</html>`;

        return new NextResponse(html, {
            headers: {
                "Content-Type": "text/html; charset=utf-8",
                "Content-Disposition": `inline; filename="invoice-${invoice.invoice_number}.html"`,
            },
        });
    } catch (error) {
        console.error("❌ PDF generation failed:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "PDF generation failed" },
            { status: 500 },
        );
    }
}
