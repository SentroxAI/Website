"use client";

/* -------------------------------------------------------------------------- */
/*                        ADMIN BILLING PAGE                                  */
/*                                                                            */
/*  Sprint 4 — Module 1: Full billing dashboard for admins.                  */
/*  Revenue overview → Payment history → Plan management → Invoices          */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import AdminContainer from "@/components/admin/AdminContainer";
import {
    DynamicRevenueOverview as RevenueOverview,
    DynamicPaymentHistory as PaymentHistory,
    DynamicPlanManager as PlanManager,
    DynamicInvoiceManager as InvoiceManager,
} from "@/lib/dynamic-imports";
import {
    CreditCard,
    Receipt,
    TrendingUp,
    Package,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Tab Configuration ─────────────────────────────────────────────────────── */

const tabs = [
    { id: "overview", label: "Revenue", icon: <TrendingUp className="h-4 w-4" /> },
    { id: "payments", label: "Payments", icon: <CreditCard className="h-4 w-4" /> },
    { id: "plans", label: "Plans", icon: <Package className="h-4 w-4" /> },
    { id: "invoices", label: "Invoices", icon: <Receipt className="h-4 w-4" /> },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function AdminBillingPage() {
    const [activeTab, setActiveTab] = useState<TabId>("overview");

    return (
        <AdminContainer>
            {/* ── Header ───────────────────────────────────────────────── */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white">
                    Billing & Payments
                </h1>
                <p className="mt-1 text-sm text-sx-text-muted">
                    Manage subscriptions, payments, invoices, and revenue analytics.
                </p>
            </div>

            {/* ── Tab Navigation ───────────────────────────────────────── */}
            <div className="mb-6 flex gap-1 rounded-xl border border-white/[0.06] bg-white/[0.02] p-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
                            activeTab === tab.id
                                ? "bg-white/[0.08] text-white shadow-sm"
                                : "text-sx-text-muted hover:text-sx-text-subtle hover:bg-white/[0.04]",
                        )}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ── Tab Content ──────────────────────────────────────────── */}
            <div className="min-h-[400px]">
                {activeTab === "overview" && <RevenueOverview />}
                {activeTab === "payments" && <PaymentHistory />}
                {activeTab === "plans" && <PlanManager />}
                {activeTab === "invoices" && <InvoiceManager />}
            </div>
        </AdminContainer>
    );
}
