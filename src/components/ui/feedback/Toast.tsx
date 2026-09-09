"use client";

import { Toaster } from "sonner";

/* -------------------------------------------------------------------------- */
/*                       TOAST PROVIDER — BRAND STYLED                        */
/* -------------------------------------------------------------------------- */

/**
 * Drop-in Sonner toaster pre-styled for the Sentrox dark glass theme.
 *
 * Usage:
 *   Add <ToastProvider /> once in layout or a provider.
 *   Then call: toast.success("Done!"), toast.error("Failed"), etc.
 */
export default function ToastProvider() {
    return (
        <Toaster
            position="bottom-right"
            toastOptions={{
                unstyled: false,
                classNames: {
                    toast:
                        "!rounded-2xl !border !border-white/10 !bg-slate-900/90 !backdrop-blur-2xl !text-white !shadow-2xl",
                    title: "!text-white !font-semibold",
                    description: "!text-slate-400",
                    actionButton:
                        "!bg-blue-600 !text-white !rounded-xl !font-semibold hover:!bg-blue-500",
                    cancelButton:
                        "!bg-white/5 !text-white !rounded-xl hover:!bg-white/10",
                    closeButton: "!text-slate-400 hover:!text-white",
                    success: "!border-emerald-500/20",
                    error: "!border-red-500/20",
                    warning: "!border-amber-500/20",
                    info: "!border-blue-500/20",
                },
            }}
            closeButton
            richColors
            expand
            gap={8}
        />
    );
}
