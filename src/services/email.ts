/* -------------------------------------------------------------------------- */
/*                         EMAIL SERVICE — v2                                 */
/*                                                                            */
/*  Sprint 4 — Module 4: Full transactional email service with Resend.       */
/*  Template registry pattern, queue support, typed send methods.            */
/*  Falls back to console.log when RESEND_API_KEY is not set.                */
/* -------------------------------------------------------------------------- */

/* ── Types ─────────────────────────────────────────────────────────────────── */

export interface SendEmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    replyTo?: string;
    tags?: Array<{ name: string; value: string }>;
}

export interface SendEmailResult {
    success: boolean;
    id?: string;
    error?: string;
}

export type TemplateName =
    | "welcome"
    | "verify-email"
    | "password-reset"
    | "project-created"
    | "milestone-completed"
    | "invoice-generated"
    | "invoice-paid"
    | "meeting-reminder"
    | "new-message"
    | "lead-assigned"
    | "weekly-report"
    | "monthly-report"
    | "contact-notification"
    | "contact-auto-reply"
    | "newsletter-welcome";

/* ── Config ────────────────────────────────────────────────────────────────── */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "Sentrox AI <founder.sentrox@gmail.com>";
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || "founder.sentrox@gmail.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sentroxai.com";

export { NOTIFICATION_EMAIL, FROM_EMAIL, APP_URL };

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                         EMAIL SENDING                                      */
/* ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Send an email via Resend API.
 * Falls back to console.log if RESEND_API_KEY is not configured.
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
    if (!RESEND_API_KEY) {
        console.log("📧 [Email Service — No API key] Would send:", {
            to: options.to,
            subject: options.subject,
            replyTo: options.replyTo,
        });
        return { success: true, id: "dev-mode" };
    }

    try {
        const response = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${RESEND_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: FROM_EMAIL,
                to: Array.isArray(options.to) ? options.to : [options.to],
                subject: options.subject,
                html: options.html,
                reply_to: options.replyTo,
                tags: options.tags,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("❌ Resend API error:", data);
            return { success: false, error: data.message || "Failed to send email" };
        }

        return { success: true, id: data.id };
    } catch (error) {
        console.error("❌ Email send failed:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
        };
    }
}

/**
 * Send multiple emails (batch).
 */
export async function sendBulkEmails(
    emails: SendEmailOptions[],
): Promise<{ sent: number; failed: number; errors: string[] }> {
    let sent = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const email of emails) {
        const result = await sendEmail(email);
        if (result.success) {
            sent++;
        } else {
            failed++;
            if (result.error) errors.push(`${email.subject}: ${result.error}`);
        }
    }

    return { sent, failed, errors };
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                       BASE EMAIL LAYOUT                                    */
/* ═══════════════════════════════════════════════════════════════════════════ */

function emailLayout(content: string, preheader?: string): string {
    return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
${preheader ? `<span style="display:none;font-size:1px;color:#030712;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</span>` : ""}
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #030712; color: #e2e8f0; padding: 40px 20px; margin: 0;">
<div style="max-width: 600px; margin: 0 auto;">
  <!-- Logo -->
  <div style="text-align: center; margin-bottom: 24px;">
    <span style="font-size: 24px; font-weight: 800; background: linear-gradient(135deg, #2563eb, #06b6d4); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Sentrox AI</span>
  </div>
  
  <!-- Card -->
  <div style="background: #0a0f1e; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden;">
    ${content}
  </div>
  
  <!-- Footer -->
  <div style="text-align: center; margin-top: 32px; padding: 0 20px;">
    <p style="color: #64748b; font-size: 12px; line-height: 1.6; margin: 0;">
      © ${new Date().getFullYear()} Sentrox AI. All rights reserved.<br>
      <a href="${APP_URL}" style="color: #60a5fa; text-decoration: none;">sentroxai.com</a>
    </p>
    <p style="color: #475569; font-size: 11px; margin-top: 8px;">
      You received this email because you have an account with Sentrox AI.
    </p>
  </div>
</div>
</body>
</html>`;
}

function gradientHeader(title: string): string {
    return `<div style="background: linear-gradient(135deg, #2563eb, #06b6d4); padding: 24px 32px;">
      <h1 style="margin: 0; color: white; font-size: 20px; font-weight: 700;">${title}</h1>
    </div>`;
}

function ctaButton(text: string, url: string): string {
    return `<a href="${url}" style="display: inline-block; background: linear-gradient(135deg, #2563eb, #06b6d4); color: white; font-weight: 600; font-size: 14px; padding: 12px 28px; border-radius: 12px; text-decoration: none; margin-top: 16px;">${text}</a>`;
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                        EMAIL TEMPLATES                                     */
/* ═══════════════════════════════════════════════════════════════════════════ */

/* ── Welcome ───────────────────────────────────────────────────────────────── */

export function buildWelcomeEmail(data: { name: string; loginUrl?: string }): {
    subject: string;
    html: string;
} {
    return {
        subject: "Welcome to Sentrox AI! 🚀",
        html: emailLayout(
            `${gradientHeader("Welcome to Sentrox AI")}
      <div style="padding: 32px;">
        <p style="font-size: 18px; color: white; font-weight: 600; margin: 0 0 16px;">Hi ${data.name},</p>
        <p style="color: #94a3b8; line-height: 1.8; margin: 0 0 16px;">Welcome aboard! Your account has been created and you're all set to get started.</p>
        <p style="color: #94a3b8; line-height: 1.8; margin: 0 0 8px;">Here's what you can do:</p>
        <ul style="color: #94a3b8; line-height: 2; padding-left: 20px; margin: 0 0 24px;">
          <li>📊 Track your project progress in real-time</li>
          <li>💬 Communicate directly with our team</li>
          <li>📄 Access invoices and billing information</li>
          <li>📅 Schedule and manage meetings</li>
          <li>📁 Share and manage project files</li>
        </ul>
        ${ctaButton("Go to Dashboard", data.loginUrl || `${APP_URL}/dashboard`)}
      </div>`,
            "Your Sentrox AI account is ready!",
        ),
    };
}

/* ── Verify Email ──────────────────────────────────────────────────────────── */

export function buildVerifyEmailEmail(data: {
    name: string;
    verificationUrl: string;
}): { subject: string; html: string } {
    return {
        subject: "Verify your email — Sentrox AI",
        html: emailLayout(
            `${gradientHeader("Verify Your Email")}
      <div style="padding: 32px;">
        <p style="font-size: 18px; color: white; font-weight: 600; margin: 0 0 16px;">Hi ${data.name},</p>
        <p style="color: #94a3b8; line-height: 1.8; margin: 0 0 24px;">Please verify your email address by clicking the button below. This link will expire in 24 hours.</p>
        <div style="text-align: center;">
          ${ctaButton("Verify Email", data.verificationUrl)}
        </div>
        <p style="color: #64748b; font-size: 12px; margin-top: 24px; line-height: 1.6;">If you didn't create an account, you can safely ignore this email.</p>
      </div>`,
            "Please verify your email address",
        ),
    };
}

/* ── Password Reset ────────────────────────────────────────────────────────── */

export function buildPasswordResetEmail(data: {
    name: string;
    resetUrl: string;
}): { subject: string; html: string } {
    return {
        subject: "Reset your password — Sentrox AI",
        html: emailLayout(
            `${gradientHeader("Password Reset")}
      <div style="padding: 32px;">
        <p style="font-size: 18px; color: white; font-weight: 600; margin: 0 0 16px;">Hi ${data.name},</p>
        <p style="color: #94a3b8; line-height: 1.8; margin: 0 0 24px;">We received a request to reset your password. Click the button below to set a new password. This link expires in 1 hour.</p>
        <div style="text-align: center;">
          ${ctaButton("Reset Password", data.resetUrl)}
        </div>
        <p style="color: #64748b; font-size: 12px; margin-top: 24px; line-height: 1.6;">If you didn't request this, your account is still secure. No changes have been made.</p>
      </div>`,
            "Reset your Sentrox AI password",
        ),
    };
}

/* ── Project Created ───────────────────────────────────────────────────────── */

export function buildProjectCreatedEmail(data: {
    clientName: string;
    projectTitle: string;
    service: string;
    startDate?: string;
}): { subject: string; html: string } {
    return {
        subject: `New Project: ${data.projectTitle} — Sentrox AI`,
        html: emailLayout(
            `${gradientHeader("New Project Started")}
      <div style="padding: 32px;">
        <p style="font-size: 18px; color: white; font-weight: 600; margin: 0 0 16px;">Hi ${data.clientName},</p>
        <p style="color: #94a3b8; line-height: 1.8; margin: 0 0 24px;">Great news! Your project has been created and our team is getting started.</p>
        <div style="background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); padding: 20px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #94a3b8; width: 120px;">Project</td><td style="padding: 8px 0; color: white; font-weight: 600;">${data.projectTitle}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Service</td><td style="padding: 8px 0; color: #22d3ee;">${data.service}</td></tr>
            ${data.startDate ? `<tr><td style="padding: 8px 0; color: #94a3b8;">Start Date</td><td style="padding: 8px 0; color: white;">${data.startDate}</td></tr>` : ""}
          </table>
        </div>
        ${ctaButton("View Project", `${APP_URL}/dashboard/projects`)}
      </div>`,
            `Your project "${data.projectTitle}" has been created`,
        ),
    };
}

/* ── Milestone Completed ───────────────────────────────────────────────────── */

export function buildMilestoneCompletedEmail(data: {
    clientName: string;
    projectTitle: string;
    milestone: string;
    progress: number;
}): { subject: string; html: string } {
    return {
        subject: `🎯 Milestone: ${data.milestone} — ${data.projectTitle}`,
        html: emailLayout(
            `${gradientHeader("Milestone Completed 🎯")}
      <div style="padding: 32px;">
        <p style="font-size: 18px; color: white; font-weight: 600; margin: 0 0 16px;">Hi ${data.clientName},</p>
        <p style="color: #94a3b8; line-height: 1.8; margin: 0 0 24px;">A milestone has been completed on your project!</p>
        <div style="background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); padding: 20px; margin-bottom: 16px;">
          <p style="color: white; font-weight: 600; margin: 0 0 4px;">${data.milestone}</p>
          <p style="color: #94a3b8; font-size: 13px; margin: 0;">${data.projectTitle}</p>
        </div>
        <!-- Progress bar -->
        <div style="margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
            <span style="color: #94a3b8; font-size: 13px;">Overall Progress</span>
            <span style="color: #22d3ee; font-weight: 700;">${data.progress}%</span>
          </div>
          <div style="height: 8px; background: rgba(255,255,255,0.06); border-radius: 4px; overflow: hidden;">
            <div style="height: 100%; width: ${data.progress}%; background: linear-gradient(90deg, #2563eb, #06b6d4); border-radius: 4px;"></div>
          </div>
        </div>
        ${ctaButton("View Project", `${APP_URL}/dashboard/projects`)}
      </div>`,
            `Milestone "${data.milestone}" completed (${data.progress}%)`,
        ),
    };
}

/* ── Invoice Generated ─────────────────────────────────────────────────────── */

export function buildInvoiceGeneratedEmail(data: {
    clientName: string;
    invoiceNumber: string;
    amount: string;
    dueDate: string;
    invoiceUrl?: string;
}): { subject: string; html: string } {
    return {
        subject: `Invoice ${data.invoiceNumber} — ₹${data.amount} Due`,
        html: emailLayout(
            `${gradientHeader("New Invoice")}
      <div style="padding: 32px;">
        <p style="font-size: 18px; color: white; font-weight: 600; margin: 0 0 16px;">Hi ${data.clientName},</p>
        <p style="color: #94a3b8; line-height: 1.8; margin: 0 0 24px;">A new invoice has been generated for your account.</p>
        <div style="background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); padding: 20px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #94a3b8;">Invoice #</td><td style="padding: 8px 0; color: white; font-weight: 600;">${data.invoiceNumber}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Amount</td><td style="padding: 8px 0; color: #22d3ee; font-weight: 700; font-size: 18px;">₹${data.amount}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Due Date</td><td style="padding: 8px 0; color: white;">${data.dueDate}</td></tr>
          </table>
        </div>
        ${ctaButton("View Invoice", data.invoiceUrl || `${APP_URL}/dashboard/invoices`)}
      </div>`,
            `Invoice ${data.invoiceNumber} for ₹${data.amount} is due on ${data.dueDate}`,
        ),
    };
}

/* ── Invoice Paid ──────────────────────────────────────────────────────────── */

export function buildInvoicePaidEmail(data: {
    clientName: string;
    invoiceNumber: string;
    amount: string;
    paymentDate: string;
}): { subject: string; html: string } {
    return {
        subject: `Payment Received — Invoice ${data.invoiceNumber} ✅`,
        html: emailLayout(
            `${gradientHeader("Payment Confirmed ✅")}
      <div style="padding: 32px;">
        <p style="font-size: 18px; color: white; font-weight: 600; margin: 0 0 16px;">Hi ${data.clientName},</p>
        <p style="color: #94a3b8; line-height: 1.8; margin: 0 0 24px;">Thank you! We've received your payment.</p>
        <div style="background: rgba(16,185,129,0.08); border-radius: 12px; border: 1px solid rgba(16,185,129,0.2); padding: 20px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #94a3b8;">Invoice #</td><td style="padding: 8px 0; color: white; font-weight: 600;">${data.invoiceNumber}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Amount Paid</td><td style="padding: 8px 0; color: #10b981; font-weight: 700; font-size: 18px;">₹${data.amount}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Paid On</td><td style="padding: 8px 0; color: white;">${data.paymentDate}</td></tr>
          </table>
        </div>
        ${ctaButton("View Receipt", `${APP_URL}/dashboard/invoices`)}
      </div>`,
            `Payment of ₹${data.amount} confirmed for invoice ${data.invoiceNumber}`,
        ),
    };
}

/* ── Meeting Reminder ──────────────────────────────────────────────────────── */

export function buildMeetingReminderEmail(data: {
    name: string;
    meetingTitle: string;
    dateTime: string;
    duration: string;
    meetingUrl?: string;
    reminderType: "24h" | "1h";
}): { subject: string; html: string } {
    const urgency = data.reminderType === "1h" ? "in 1 hour" : "tomorrow";
    return {
        subject: `⏰ Meeting ${urgency}: ${data.meetingTitle}`,
        html: emailLayout(
            `${gradientHeader(`Meeting ${urgency.charAt(0).toUpperCase() + urgency.slice(1)} ⏰`)}
      <div style="padding: 32px;">
        <p style="font-size: 18px; color: white; font-weight: 600; margin: 0 0 16px;">Hi ${data.name},</p>
        <p style="color: #94a3b8; line-height: 1.8; margin: 0 0 24px;">This is a reminder that you have a meeting ${urgency}.</p>
        <div style="background: rgba(245,158,11,0.08); border-radius: 12px; border: 1px solid rgba(245,158,11,0.2); padding: 20px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #94a3b8; width: 100px;">Meeting</td><td style="padding: 8px 0; color: white; font-weight: 600;">${data.meetingTitle}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Date & Time</td><td style="padding: 8px 0; color: white;">${data.dateTime}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Duration</td><td style="padding: 8px 0; color: white;">${data.duration}</td></tr>
          </table>
        </div>
        ${data.meetingUrl ? ctaButton("Join Meeting", data.meetingUrl) : ctaButton("View Meetings", `${APP_URL}/dashboard/meetings`)}
      </div>`,
            `Reminder: ${data.meetingTitle} is ${urgency}`,
        ),
    };
}

/* ── New Message ───────────────────────────────────────────────────────────── */

export function buildNewMessageEmail(data: {
    recipientName: string;
    senderName: string;
    messagePreview: string;
}): { subject: string; html: string } {
    return {
        subject: `New message from ${data.senderName} — Sentrox AI`,
        html: emailLayout(
            `${gradientHeader("New Message 💬")}
      <div style="padding: 32px;">
        <p style="font-size: 18px; color: white; font-weight: 600; margin: 0 0 16px;">Hi ${data.recipientName},</p>
        <p style="color: #94a3b8; line-height: 1.8; margin: 0 0 24px;"><strong style="color: white;">${data.senderName}</strong> sent you a message:</p>
        <div style="background: rgba(255,255,255,0.03); border-radius: 12px; border-left: 3px solid #2563eb; padding: 16px 20px; margin-bottom: 24px;">
          <p style="color: #e2e8f0; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${data.messagePreview}</p>
        </div>
        ${ctaButton("Reply", `${APP_URL}/dashboard/messages`)}
      </div>`,
            `${data.senderName}: ${data.messagePreview.substring(0, 50)}...`,
        ),
    };
}

/* ── Lead Assigned ─────────────────────────────────────────────────────────── */

export function buildLeadAssignedEmail(data: {
    assigneeName: string;
    leadName: string;
    leadEmail: string;
    service: string;
    company?: string;
}): { subject: string; html: string } {
    return {
        subject: `New Lead: ${data.leadName} — ${data.service}`,
        html: emailLayout(
            `${gradientHeader("New Lead Assigned 🎯")}
      <div style="padding: 32px;">
        <p style="font-size: 18px; color: white; font-weight: 600; margin: 0 0 16px;">Hi ${data.assigneeName},</p>
        <p style="color: #94a3b8; line-height: 1.8; margin: 0 0 24px;">A new lead has been assigned to you.</p>
        <div style="background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); padding: 20px; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #94a3b8; width: 100px;">Name</td><td style="padding: 8px 0; color: white; font-weight: 600;">${data.leadName}</td></tr>
            <tr><td style="padding: 8px 0; color: #94a3b8;">Email</td><td style="padding: 8px 0;"><a href="mailto:${data.leadEmail}" style="color: #60a5fa;">${data.leadEmail}</a></td></tr>
            ${data.company ? `<tr><td style="padding: 8px 0; color: #94a3b8;">Company</td><td style="padding: 8px 0; color: white;">${data.company}</td></tr>` : ""}
            <tr><td style="padding: 8px 0; color: #94a3b8;">Service</td><td style="padding: 8px 0; color: #22d3ee; font-weight: 600;">${data.service}</td></tr>
          </table>
        </div>
        ${ctaButton("View Lead", `${APP_URL}/admin/leads`)}
      </div>`,
            `New lead: ${data.leadName} interested in ${data.service}`,
        ),
    };
}

/* ── Weekly Report ─────────────────────────────────────────────────────────── */

export function buildWeeklyReportEmail(data: {
    name: string;
    period: string;
    stats: {
        newLeads: number;
        projectsCompleted: number;
        revenue: string;
        messagesReceived: number;
        meetingsHeld: number;
    };
}): { subject: string; html: string } {
    return {
        subject: `📊 Weekly Report: ${data.period} — Sentrox AI`,
        html: emailLayout(
            `${gradientHeader("Weekly Report 📊")}
      <div style="padding: 32px;">
        <p style="font-size: 18px; color: white; font-weight: 600; margin: 0 0 8px;">Hi ${data.name},</p>
        <p style="color: #94a3b8; line-height: 1.8; margin: 0 0 24px;">Here's your weekly activity summary for <strong style="color: white;">${data.period}</strong>.</p>
        
        <div style="display: grid; gap: 12px; margin-bottom: 24px;">
          ${[
              { label: "New Leads", value: String(data.stats.newLeads), color: "#f472b6" },
              { label: "Projects Completed", value: String(data.stats.projectsCompleted), color: "#a78bfa" },
              { label: "Revenue", value: `₹${data.stats.revenue}`, color: "#34d399" },
              { label: "Messages", value: String(data.stats.messagesReceived), color: "#60a5fa" },
              { label: "Meetings", value: String(data.stats.meetingsHeld), color: "#fbbf24" },
          ]
              .map(
                  (s) => `
            <div style="background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); padding: 16px; display: flex; justify-content: space-between; align-items: center;">
              <span style="color: #94a3b8; font-size: 13px;">${s.label}</span>
              <span style="color: ${s.color}; font-weight: 700; font-size: 18px;">${s.value}</span>
            </div>`,
              )
              .join("")}
        </div>
        
        ${ctaButton("View Dashboard", `${APP_URL}/admin`)}
      </div>`,
            `Your weekly summary: ${data.stats.newLeads} leads, ₹${data.stats.revenue} revenue`,
        ),
    };
}

/* ── Monthly Report ────────────────────────────────────────────────────────── */

export function buildMonthlyReportEmail(data: {
    name: string;
    month: string;
    stats: {
        totalRevenue: string;
        newClients: number;
        activeProjects: number;
        completedProjects: number;
        totalLeads: number;
        conversionRate: string;
    };
}): { subject: string; html: string } {
    return {
        subject: `📈 Monthly Report: ${data.month} — Sentrox AI`,
        html: emailLayout(
            `${gradientHeader("Monthly Report 📈")}
      <div style="padding: 32px;">
        <p style="font-size: 18px; color: white; font-weight: 600; margin: 0 0 8px;">Hi ${data.name},</p>
        <p style="color: #94a3b8; line-height: 1.8; margin: 0 0 24px;">Here's your business overview for <strong style="color: white;">${data.month}</strong>.</p>
        
        <div style="background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); padding: 24px; margin-bottom: 24px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <p style="color: #94a3b8; font-size: 13px; margin: 0 0 4px;">Total Revenue</p>
            <p style="color: #34d399; font-size: 32px; font-weight: 800; margin: 0;">₹${data.stats.totalRevenue}</p>
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px 0; color: #94a3b8; border-top: 1px solid rgba(255,255,255,0.06);">New Clients</td><td style="padding: 10px 0; color: white; font-weight: 600; text-align: right;">${data.stats.newClients}</td></tr>
            <tr><td style="padding: 10px 0; color: #94a3b8; border-top: 1px solid rgba(255,255,255,0.06);">Active Projects</td><td style="padding: 10px 0; color: white; font-weight: 600; text-align: right;">${data.stats.activeProjects}</td></tr>
            <tr><td style="padding: 10px 0; color: #94a3b8; border-top: 1px solid rgba(255,255,255,0.06);">Completed</td><td style="padding: 10px 0; color: white; font-weight: 600; text-align: right;">${data.stats.completedProjects}</td></tr>
            <tr><td style="padding: 10px 0; color: #94a3b8; border-top: 1px solid rgba(255,255,255,0.06);">Total Leads</td><td style="padding: 10px 0; color: white; font-weight: 600; text-align: right;">${data.stats.totalLeads}</td></tr>
            <tr><td style="padding: 10px 0; color: #94a3b8; border-top: 1px solid rgba(255,255,255,0.06);">Conversion Rate</td><td style="padding: 10px 0; color: #22d3ee; font-weight: 600; text-align: right;">${data.stats.conversionRate}</td></tr>
          </table>
        </div>
        
        ${ctaButton("Full Dashboard", `${APP_URL}/admin/analytics`)}
      </div>`,
            `${data.month} summary: ₹${data.stats.totalRevenue} revenue, ${data.stats.newClients} new clients`,
        ),
    };
}

/* ── Contact Form (preserved from v1) ──────────────────────────────────────── */

export function buildContactNotificationEmail(data: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    service: string;
    budget?: string;
    message: string;
}): { subject: string; html: string } {
    return {
        subject: `🚀 New Contact: ${data.name} — ${data.service}`,
        html: emailLayout(
            `${gradientHeader("New Contact Form Submission")}
      <div style="padding: 32px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 12px 0; color: #94a3b8; width: 120px;">Name</td><td style="padding: 12px 0; color: white; font-weight: 600;">${data.name}</td></tr>
          <tr><td style="padding: 12px 0; color: #94a3b8;">Email</td><td style="padding: 12px 0;"><a href="mailto:${data.email}" style="color: #60a5fa;">${data.email}</a></td></tr>
          ${data.phone ? `<tr><td style="padding: 12px 0; color: #94a3b8;">Phone</td><td style="padding: 12px 0; color: white;">${data.phone}</td></tr>` : ""}
          ${data.company ? `<tr><td style="padding: 12px 0; color: #94a3b8;">Company</td><td style="padding: 12px 0; color: white;">${data.company}</td></tr>` : ""}
          <tr><td style="padding: 12px 0; color: #94a3b8;">Service</td><td style="padding: 12px 0; color: #22d3ee; font-weight: 600;">${data.service}</td></tr>
          ${data.budget ? `<tr><td style="padding: 12px 0; color: #94a3b8;">Budget</td><td style="padding: 12px 0; color: white;">${data.budget}</td></tr>` : ""}
        </table>
        <div style="margin-top: 24px; padding: 20px; background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
          <p style="margin: 0 0 8px; color: #94a3b8; font-size: 14px;">Message</p>
          <p style="margin: 0; color: white; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
        </div>
      </div>`,
        ),
    };
}

export function buildContactAutoReplyEmail(name: string): {
    subject: string;
    html: string;
} {
    return {
        subject: "Thanks for reaching out! — Sentrox AI",
        html: emailLayout(
            `${gradientHeader("Sentrox AI")}
      <div style="padding: 32px;">
        <p style="font-size: 18px; color: white; font-weight: 600;">Hi ${name},</p>
        <p style="color: #94a3b8; line-height: 1.8;">Thank you for reaching out to Sentrox AI! We've received your message and our team will review it shortly.</p>
        <p style="color: #94a3b8; line-height: 1.8;">You can expect a response within <strong style="color: white;">24 hours</strong> during business days.</p>
        <p style="color: #94a3b8; line-height: 1.8; margin-top: 24px;">Best regards,<br><strong style="color: white;">The Sentrox AI Team</strong></p>
      </div>`,
            "We received your message and will respond within 24 hours",
        ),
    };
}

export function buildNewsletterWelcomeEmail(): {
    subject: string;
    html: string;
} {
    return {
        subject: "Welcome to the Sentrox AI newsletter! 🚀",
        html: emailLayout(
            `${gradientHeader("Welcome to Sentrox AI")}
      <div style="padding: 32px;">
        <p style="font-size: 18px; color: white; font-weight: 600;">You're in! 🎉</p>
        <p style="color: #94a3b8; line-height: 1.8;">Thanks for subscribing to the Sentrox AI newsletter. You'll receive insights on:</p>
        <ul style="color: #94a3b8; line-height: 2;">
          <li>AI-powered web development trends</li>
          <li>Automation strategies for businesses</li>
          <li>Case studies and project showcases</li>
          <li>Tips on SEO and digital growth</li>
        </ul>
        <p style="color: #94a3b8; line-height: 1.8; margin-top: 24px;">Stay tuned,<br><strong style="color: white;">The Sentrox AI Team</strong></p>
      </div>`,
            "You're subscribed to the Sentrox AI newsletter",
        ),
    };
}

/* ── Quote Calculator ──────────────────────────────────────────────────────── */

export function buildQuoteNotificationEmail(data: {
    name: string;
    email: string;
    phone?: string;
    company?: string;
    notes?: string;
    line_items: Array<{ name: string; amount: number; unit: string; qty?: number }>;
    one_time_total: number;
    monthly_total: number;
    display_currency: string;
}): { subject: string; html: string } {
    const itemRows = data.line_items
        .map(
            (li) =>
                `<tr>
          <td style="padding: 10px; border: 1px solid rgba(255,255,255,0.08); color: white;">${li.name}</td>
          <td style="padding: 10px; border: 1px solid rgba(255,255,255,0.08); color: white; text-align: center;">${li.qty || 1}</td>
          <td style="padding: 10px; border: 1px solid rgba(255,255,255,0.08); color: #22d3ee; text-align: right; font-weight: 600;">₹${li.amount.toLocaleString("en-IN")}${li.unit === "mo" ? "/mo" : ""}</td>
        </tr>`,
        )
        .join("");

    return {
        subject: `💰 New Quote Request: ${data.name} — ₹${data.one_time_total.toLocaleString("en-IN")}`,
        html: emailLayout(
            `${gradientHeader("New Quote Calculator Submission")}
      <div style="padding: 32px;">
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <tr><td style="padding: 12px 0; color: #94a3b8; width: 120px;">Name</td><td style="padding: 12px 0; color: white; font-weight: 600;">${data.name}</td></tr>
          <tr><td style="padding: 12px 0; color: #94a3b8;">Email</td><td style="padding: 12px 0;"><a href="mailto:${data.email}" style="color: #60a5fa;">${data.email}</a></td></tr>
          ${data.phone ? `<tr><td style="padding: 12px 0; color: #94a3b8;">Phone</td><td style="padding: 12px 0; color: white;">${data.phone}</td></tr>` : ""}
          ${data.company ? `<tr><td style="padding: 12px 0; color: #94a3b8;">Company</td><td style="padding: 12px 0; color: white;">${data.company}</td></tr>` : ""}
          <tr><td style="padding: 12px 0; color: #94a3b8;">Currency</td><td style="padding: 12px 0; color: white;">${data.display_currency}</td></tr>
        </table>

        <div style="background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); padding: 24px; margin-bottom: 24px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
            <div>
              <p style="color: #94a3b8; font-size: 13px; margin: 0 0 4px;">One-time</p>
              <p style="color: #34d399; font-size: 28px; font-weight: 800; margin: 0;">₹${data.one_time_total.toLocaleString("en-IN")}</p>
            </div>
            ${data.monthly_total > 0 ? `<div style="text-align: right;">
              <p style="color: #94a3b8; font-size: 13px; margin: 0 0 4px;">Monthly</p>
              <p style="color: #22d3ee; font-size: 20px; font-weight: 700; margin: 0;">₹${data.monthly_total.toLocaleString("en-IN")}/mo</p>
            </div>` : ""}
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          <thead>
            <tr style="background: linear-gradient(135deg, #2563eb, #06b6d4);">
              <th style="padding: 10px; border: 1px solid rgba(255,255,255,0.08); color: white; text-align: left;">Service</th>
              <th style="padding: 10px; border: 1px solid rgba(255,255,255,0.08); color: white; text-align: center;">Qty</th>
              <th style="padding: 10px; border: 1px solid rgba(255,255,255,0.08); color: white; text-align: right;">Price (INR)</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>

        ${data.notes ? `<div style="padding: 20px; background: rgba(255,255,255,0.05); border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
          <p style="margin: 0 0 8px; color: #94a3b8; font-size: 14px;">Project Notes</p>
          <p style="margin: 0; color: white; line-height: 1.6; white-space: pre-wrap;">${data.notes}</p>
        </div>` : ""}
      </div>`,
        ),
    };
}

export function buildQuoteAutoReplyEmail(
    name: string,
    quote: {
        oneTime: number;
        monthly: number;
        currency: string;
        lineItems: Array<{ name: string; amount: number; unit: string; qty?: number }>;
    },
): { subject: string; html: string } {
    const itemRows = quote.lineItems
        .map(
            (li) =>
                `<tr>
          <td style="padding: 8px 0; color: white; border-bottom: 1px solid rgba(255,255,255,0.06);">${li.name}${li.qty ? ` ×${li.qty}` : ""}</td>
          <td style="padding: 8px 0; color: #22d3ee; font-weight: 600; text-align: right; border-bottom: 1px solid rgba(255,255,255,0.06);">₹${li.amount.toLocaleString("en-IN")}${li.unit === "mo" ? "/mo" : ""}</td>
        </tr>`,
        )
        .join("");

    return {
        subject: "Your Sentrox AI Project Estimate 💰",
        html: emailLayout(
            `${gradientHeader("Your Project Estimate")}
      <div style="padding: 32px;">
        <p style="font-size: 18px; color: white; font-weight: 600;">Hi ${name.split(" ")[0]},</p>
        <p style="color: #94a3b8; line-height: 1.8;">Thank you for configuring your project with Sentrox AI! Here's a summary of your estimate:</p>

        <div style="background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); padding: 24px; margin: 24px 0;">
          <p style="color: #94a3b8; font-size: 13px; margin: 0 0 4px;">One-time investment</p>
          <p style="font-size: 32px; font-weight: 800; margin: 0; background: linear-gradient(135deg, #22d3ee, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">₹${quote.oneTime.toLocaleString("en-IN")}</p>
          ${quote.monthly > 0 ? `<p style="color: #22d3ee; font-size: 16px; font-weight: 600; margin: 12px 0 0;">+ ₹${quote.monthly.toLocaleString("en-IN")}/mo</p>` : ""}
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
          ${itemRows}
        </table>

        <p style="color: #94a3b8; line-height: 1.8;">Our team will review your requirements and reach out within <strong style="color: white;">24 hours</strong> to discuss your project in detail.</p>

        ${ctaButton("Visit Sentrox AI", APP_URL)}

        <p style="color: #94a3b8; line-height: 1.8; margin-top: 24px;">Best regards,<br><strong style="color: white;">The Sentrox AI Team</strong></p>
      </div>`,
            `Your project estimate: ₹${quote.oneTime.toLocaleString("en-IN")} — Sentrox AI`,
        ),
    };
}

