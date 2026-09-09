"use client";

/* -------------------------------------------------------------------------- */
/*                       SECURITY SECTION                                     */
/*                                                                            */
/*  Password change (connected to Supabase), 2FA toggle, active sessions.    */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Key,
    Shield,
    Smartphone,
    Monitor,
    Laptop,
    LogOut,
    CheckCircle2,
    AlertTriangle,
    Loader2,
    Eye,
    EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { securitySettings } from "./data";

export default function SecuritySection() {
    const [twoFactor, setTwoFactor] = useState(securitySettings.twoFactorEnabled);
    const [sessions, setSessions] = useState(securitySettings.activeSessions);

    /* ── Password change state ────────────────────────────────────── */
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    const handlePasswordChange = async () => {
        if (newPassword.length < 8) {
            toast.error("Password must be at least 8 characters.");
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setChangingPassword(true);
        try {
            const supabase = createClient();
            const { error } = await supabase.auth.updateUser({ password: newPassword });

            if (error) {
                toast.error("Failed: " + error.message);
            } else {
                toast.success("Password updated successfully!");
                setNewPassword("");
                setConfirmPassword("");
                setShowPasswordForm(false);
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setChangingPassword(false);
        }
    };

    const revokeSession = (id: string) => {
        setSessions((prev) => prev.filter((s) => s.id !== id));
        toast.success("Session revoked.");
    };

    const getDeviceIcon = (device: string) => {
        if (device.toLowerCase().includes("iphone") || device.toLowerCase().includes("android")) {
            return <Smartphone className="h-4 w-4" />;
        }
        if (device.toLowerCase().includes("macbook") || device.toLowerCase().includes("laptop")) {
            return <Laptop className="h-4 w-4" />;
        }
        return <Monitor className="h-4 w-4" />;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            {/* Password */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                            <Key className="h-5 w-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-white">Password</h4>
                            <p className="text-xs text-sx-text-muted mt-0.5">
                                Keep your account secure with a strong password.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowPasswordForm(!showPasswordForm)}
                        className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-sx-text-secondary hover:bg-white/[0.06] hover:text-white transition-colors w-fit"
                    >
                        {showPasswordForm ? "Cancel" : "Change Password"}
                    </button>
                </div>

                {/* Password form */}
                <AnimatePresence>
                    {showPasswordForm && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="mt-4 space-y-3 border-t border-white/[0.06] pt-4">
                                <div className="grid gap-3 sm:grid-cols-2">
                                    <div>
                                        <label className="block text-xs font-medium text-sx-text-muted mb-1.5">New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="Min. 8 characters"
                                                className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 pr-10 text-sm text-white placeholder:text-sx-text-subtle outline-none transition-colors focus:border-sx-primary/30"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-sx-text-subtle hover:text-white transition-colors"
                                            >
                                                {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-sx-text-muted mb-1.5">Confirm Password</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="Repeat password"
                                            className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-sx-text-subtle outline-none transition-colors focus:border-sx-primary/30"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        onClick={handlePasswordChange}
                                        disabled={changingPassword || !newPassword || !confirmPassword}
                                        className="flex items-center gap-2 rounded-xl bg-sx-primary-600 px-4 py-2 text-xs font-medium text-white hover:bg-sx-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {changingPassword ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Key className="h-3.5 w-3.5" />}
                                        {changingPassword ? "Updating..." : "Update Password"}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Two-Factor Auth */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-xl",
                            twoFactor ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                        )}>
                            <Shield className="h-5 w-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h4 className="text-sm font-semibold text-white">Two-Factor Authentication</h4>
                                {twoFactor ? (
                                    <Badge variant="success" size="sm">
                                        <CheckCircle2 className="h-2.5 w-2.5" />
                                        Enabled
                                    </Badge>
                                ) : (
                                    <Badge variant="destructive" size="sm">
                                        <AlertTriangle className="h-2.5 w-2.5" />
                                        Disabled
                                    </Badge>
                                )}
                            </div>
                            <p className="text-xs text-sx-text-muted mt-0.5">
                                {twoFactor
                                    ? "Your account is secured with 2FA."
                                    : "Add an extra layer of security to your account."}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setTwoFactor(!twoFactor)}
                        className={cn(
                            "rounded-xl px-3.5 py-2 text-xs font-medium transition-colors",
                            twoFactor
                                ? "border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                : "bg-sx-primary-600 text-white hover:bg-sx-primary-500 shadow-lg shadow-sx-primary/20"
                        )}
                    >
                        {twoFactor ? "Disable" : "Enable 2FA"}
                    </button>
                </div>
            </div>

            {/* Active Sessions */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
                <h4 className="text-sm font-semibold text-white mb-4">Active Sessions</h4>
                <div className="space-y-3">
                    {sessions.map((session, index) => (
                        <motion.div
                            key={session.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-white/[0.01] p-3 transition-colors hover:bg-white/[0.03]"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] text-sx-text-secondary">
                                {getDeviceIcon(session.device)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium text-sx-text-secondary">{session.device}</p>
                                    {session.current && (
                                        <Badge variant="success" size="sm">Current</Badge>
                                    )}
                                </div>
                                <p className="text-[11px] text-sx-text-muted">
                                    {session.browser} · {session.location} · {session.lastActive}
                                </p>
                            </div>
                            {!session.current && (
                                <button
                                    onClick={() => revokeSession(session.id)}
                                    className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                                >
                                    <LogOut className="h-3 w-3" />
                                    Revoke
                                </button>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
