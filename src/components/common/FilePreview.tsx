"use client";

/* -------------------------------------------------------------------------- */
/*                         FILE PREVIEW COMPONENT                             */
/*                                                                            */
/*  Sprint 4 — Module 2: Image preview, PDF viewer, video player,            */
/*  file metadata display, download/delete actions.                           */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Download,
    Trash2,
    ExternalLink,
    FileText,
    Image as ImageIcon,
    Film,
    Music,
    FileCode,
    FileSpreadsheet,
    Archive,
    File as FileIconGeneric,
    Loader2,
    Copy,
    Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────────────────────────────── */

interface FilePreviewProps {
    isOpen: boolean;
    onClose: () => void;
    file: {
        name: string;
        path: string;
        url: string;
        size: number;
        mimeType: string;
        bucket: string;
        createdAt?: string;
        uploadedBy?: string;
    } | null;
    onDelete?: (path: string) => void;
    showDelete?: boolean;
}

/* ── Helpers ───────────────────────────────────────────────────────────────── */

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function getPreviewType(
    mimeType: string,
): "image" | "video" | "audio" | "pdf" | "code" | "none" {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("audio/")) return "audio";
    if (mimeType === "application/pdf") return "pdf";
    if (
        mimeType.startsWith("text/") ||
        ["application/json", "application/javascript", "application/xml"].includes(mimeType)
    )
        return "code";
    return "none";
}

function getFileTypeIcon(mimeType: string) {
    if (mimeType.startsWith("image/")) return <ImageIcon className="h-8 w-8" />;
    if (mimeType.startsWith("video/")) return <Film className="h-8 w-8" />;
    if (mimeType.startsWith("audio/")) return <Music className="h-8 w-8" />;
    if (mimeType === "application/pdf") return <FileText className="h-8 w-8" />;
    if (
        mimeType.startsWith("text/") ||
        mimeType.includes("javascript") ||
        mimeType.includes("json")
    )
        return <FileCode className="h-8 w-8" />;
    if (mimeType.includes("spreadsheet") || mimeType.includes("csv") || mimeType.includes("excel"))
        return <FileSpreadsheet className="h-8 w-8" />;
    if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("tar"))
        return <Archive className="h-8 w-8" />;
    return <FileIconGeneric className="h-8 w-8" />;
}

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function FilePreview({
    isOpen,
    onClose,
    file,
    onDelete,
    showDelete = true,
}: FilePreviewProps) {
    const [deleting, setDeleting] = useState(false);
    const [copied, setCopied] = useState(false);

    if (!file) return null;

    const previewType = getPreviewType(file.mimeType);

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = file.url;
        link.download = file.name;
        link.target = "_blank";
        link.click();
    };

    const handleDelete = async () => {
        if (!confirm(`Delete "${file.name}"? This cannot be undone.`)) return;
        setDeleting(true);
        try {
            onDelete?.(file.path);
            onClose();
        } finally {
            setDeleting(false);
        }
    };

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(file.url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ opacity: 0, x: 400 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 400 }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 z-50 h-full w-full max-w-lg overflow-y-auto border-l border-white/[0.06] bg-[#0a0f1a]"
                    >
                        {/* Header */}
                        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.06] bg-[#0a0f1a]/95 backdrop-blur-sm px-6 py-4">
                            <div className="flex-1 min-w-0 mr-3">
                                <h2 className="text-base font-semibold text-white truncate">
                                    {file.name}
                                </h2>
                                <p className="text-xs text-sx-text-muted mt-0.5">
                                    {formatSize(file.size)} · {file.mimeType}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sx-text-subtle hover:bg-white/[0.06] hover:text-white transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Preview area */}
                        <div className="px-6 py-6">
                            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                                {previewType === "image" && (
                                    <div className="relative aspect-video flex items-center justify-center bg-black/20">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={file.url}
                                            alt={file.name}
                                            className="max-h-80 w-auto object-contain"
                                        />
                                    </div>
                                )}

                                {previewType === "video" && (
                                    <div className="aspect-video bg-black">
                                        <video
                                            src={file.url}
                                            controls
                                            className="h-full w-full"
                                        />
                                    </div>
                                )}

                                {previewType === "audio" && (
                                    <div className="flex flex-col items-center gap-4 p-8">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-500/10">
                                            <Music className="h-8 w-8 text-purple-400" />
                                        </div>
                                        <audio src={file.url} controls className="w-full" />
                                    </div>
                                )}

                                {previewType === "pdf" && (
                                    <div className="h-[500px]">
                                        <iframe
                                            src={file.url}
                                            className="h-full w-full"
                                            title={file.name}
                                        />
                                    </div>
                                )}

                                {previewType === "none" && (
                                    <div className="flex flex-col items-center gap-3 py-16">
                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04] text-sx-text-subtle">
                                            {getFileTypeIcon(file.mimeType)}
                                        </div>
                                        <p className="text-sm text-sx-text-muted">
                                            Preview not available
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Metadata */}
                        <div className="px-6 pb-4">
                            <h3 className="text-xs font-semibold text-sx-text-muted uppercase tracking-wider mb-3">
                                Details
                            </h3>
                            <div className="space-y-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                                {[
                                    { label: "Name", value: file.name },
                                    { label: "Size", value: formatSize(file.size) },
                                    { label: "Type", value: file.mimeType },
                                    { label: "Bucket", value: file.bucket },
                                    ...(file.createdAt
                                        ? [
                                              {
                                                  label: "Uploaded",
                                                  value: new Date(
                                                      file.createdAt,
                                                  ).toLocaleDateString("en-IN", {
                                                      year: "numeric",
                                                      month: "short",
                                                      day: "numeric",
                                                      hour: "2-digit",
                                                      minute: "2-digit",
                                                  }),
                                              },
                                          ]
                                        : []),
                                    ...(file.uploadedBy
                                        ? [{ label: "Uploaded by", value: file.uploadedBy }]
                                        : []),
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="flex items-start justify-between text-sm"
                                    >
                                        <span className="text-sx-text-muted shrink-0">
                                            {item.label}
                                        </span>
                                        <span className="text-white text-right ml-4 break-all">
                                            {item.value}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="sticky bottom-0 border-t border-white/[0.06] bg-[#0a0f1a]/95 backdrop-blur-sm px-6 py-4">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleDownload}
                                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all flex-1"
                                >
                                    <Download className="h-4 w-4" />
                                    Download
                                </button>

                                <button
                                    onClick={handleCopyUrl}
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-sx-text-subtle hover:bg-white/[0.06] hover:text-white transition-colors"
                                    title="Copy URL"
                                >
                                    {copied ? (
                                        <Check className="h-4 w-4 text-emerald-400" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </button>

                                <a
                                    href={file.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.02] text-sx-text-subtle hover:bg-white/[0.06] hover:text-white transition-colors"
                                    title="Open in new tab"
                                >
                                    <ExternalLink className="h-4 w-4" />
                                </a>

                                {showDelete && onDelete && (
                                    <button
                                        onClick={handleDelete}
                                        disabled={deleting}
                                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                                        title="Delete"
                                    >
                                        {deleting ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
