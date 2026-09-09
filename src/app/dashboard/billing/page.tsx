"use client";

/* -------------------------------------------------------------------------- */
/*                      CLIENT BILLING PAGE                                   */
/*                                                                            */
/*  Sprint 4 — Module 1: Client-facing billing & subscription management.    */
/*  Shows current plan, upgrade options, payment history, and invoices.       */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { motion } from "framer-motion";
import {
    CreditCard,
    Receipt,
    Crown,
    ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import DashboardContainer from "@/components/dashboard/DashboardContainer";
import CurrentPlan from "@/components/dashboard/billing/CurrentPlan";
import PlanSelector from "@/components/dashboard/billing/PlanSelector";
import ClientPaymentHistory from "@/components/dashboard/billing/ClientPaymentHistory";
import ClientInvoiceList from "@/components/dashboard/billing/ClientInvoiceList";

/* ── Tabs ──────────────────────────────────────────────────────────────────── */

const tabs = [
    { id: "plan", label: "Current Plan", icon: <Crown className="h-4 w-4" /> },
    { id: "upgrade", label: "Upgrade", icon: <ArrowUpRight className="h-4 w-4" /> },
    { id: "payments", label: "Payments", icon: <CreditCard className="h-4 w-4" /> },
    { id: "invoices", label: "Invoices", icon: <Receipt className="h-4 w-4" /> },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function ClientBillingPage() {
    const [activeTab, setActiveTab] = useState<TabId>("plan");

    return (
        <DashboardContainer>
            {/* ── Header ───────────────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-2xl font-bold text-white">
                    Billing & Subscription
                </h1>
                <p className="mt-1 text-sm text-sx-text-muted">
                    Manage your plan, view payment history, and download invoices.
                </p>
            </motion.div>

            {/* ── Tab Navigation ───────────────────────────────────────── */}
            <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl border border-white/[0.06] bg-white/[0.02] p-1">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
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
                {activeTab === "plan" && <CurrentPlan />}
                {activeTab === "upgrade" && <PlanSelector />}
                {activeTab === "payments" && <ClientPaymentHistory />}
                {activeTab === "invoices" && <ClientInvoiceList />}
            </div>
        </DashboardContainer>
    );
}
