"use client";

/* -------------------------------------------------------------------------- */
/*                      PROFILE SECTION                                       */
/*                                                                            */
/*  Profile info with editable fields — connected to Supabase.                */
/*  Loads real user data from useAuth hook, saves to `users` table.           */
/* -------------------------------------------------------------------------- */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Camera, Save, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Avatar from "@/components/ui/Avatar";
import { useAuth } from "@/hooks/use-auth";
import { createClient } from "@/lib/supabase/client";

/* ── Field component ───────────────────────────────────────────────────────── */

interface FieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    type?: string;
    disabled?: boolean;
}

function Field({ label, value, onChange, type = "text", disabled }: FieldProps) {
    return (
        <div>
            <label className="block text-xs font-medium text-sx-text-muted mb-1.5">
                {label}
            </label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className={cn(
                    "w-full rounded-xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5 text-sm text-white placeholder:text-sx-text-subtle outline-none transition-colors",
                    "focus:border-sx-primary/30 focus:bg-white/[0.05]",
                    disabled && "opacity-50 cursor-not-allowed"
                )}
            />
        </div>
    );
}

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function ProfileSection() {
    const { user, profile, isLoading, refreshProfile } = useAuth();
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    /* ── Local form state ─────────────────────────────────────────── */
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [company, setCompany] = useState("");

    /* ── Sync from auth profile ───────────────────────────────────── */
    useEffect(() => {
        if (profile) {
            setFullName(profile.full_name || "");
            setEmail(profile.email || "");
            setPhone(profile.phone || "");
            setCompany(profile.company || "");
        } else if (user) {
            setFullName(user.user_metadata?.full_name || "");
            setEmail(user.email || "");
        }
    }, [profile, user]);

    /* ── Save handler ─────────────────────────────────────────────── */
    const handleSave = async () => {
        if (!user) return;

        setSaving(true);
        try {
            const supabase = createClient();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const { error } = await (supabase.from("users") as any)
                .update({
                    full_name: fullName,
                    phone: phone || null,
                    company: company || null,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", user.id);

            if (error) {
                toast.error("Failed to save: " + error.message);
            } else {
                setSaved(true);
                toast.success("Profile updated successfully!");
                await refreshProfile();
                setTimeout(() => setSaved(false), 2000);
            }
        } catch {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    /* ── Loading skeleton ─────────────────────────────────────────── */
    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-5">
                    <div className="h-20 w-20 animate-pulse rounded-full bg-white/[0.05]" />
                    <div className="space-y-2">
                        <div className="h-5 w-32 animate-pulse rounded bg-white/[0.05]" />
                        <div className="h-4 w-48 animate-pulse rounded bg-white/[0.05]" />
                    </div>
                </div>
                <div className="h-64 animate-pulse rounded-2xl bg-white/[0.02] border border-white/[0.06]" />
            </div>
        );
    }

    const displayName = fullName || "User";

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
        >
            {/* Avatar section */}
            <div className="flex items-center gap-5">
                <div className="relative group">
                    <Avatar fallback={displayName} src={profile?.avatar_url} size="lg" className="h-20 w-20 text-lg" />
                    <button className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="h-5 w-5 text-white" />
                    </button>
                </div>
                <div>
                    <h3 className="text-base font-semibold text-white">{displayName}</h3>
                    <p className="text-sm text-sx-text-muted">{email}</p>
                    <p className="text-xs text-sx-text-subtle mt-0.5 capitalize">
                        {profile?.role || "client"} {company ? `· ${company}` : ""}
                    </p>
                </div>
            </div>

            {/* Form fields */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-5">
                <h4 className="text-sm font-semibold text-white">Personal Information</h4>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Full Name" value={fullName} onChange={(v) => { setFullName(v); setSaved(false); }} />
                    <Field label="Email" value={email} onChange={setEmail} type="email" disabled />
                    <Field label="Phone" value={phone} onChange={(v) => { setPhone(v); setSaved(false); }} type="tel" />
                    <Field label="Company" value={company} onChange={(v) => { setCompany(v); setSaved(false); }} />
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={cn(
                            "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
                            saved
                                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                                : "bg-sx-primary-600 text-white hover:bg-sx-primary-500 shadow-lg shadow-sx-primary/20",
                            saving && "opacity-60 cursor-not-allowed"
                        )}
                    >
                        {saving ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : saved ? (
                            <Check className="h-4 w-4" />
                        ) : (
                            <Save className="h-4 w-4" />
                        )}
                        {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
