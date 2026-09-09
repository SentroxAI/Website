"use client";

/* -------------------------------------------------------------------------- */
/*                         FILE UPLOAD COMPONENT                              */
/*                                                                            */
/*  Sprint 4 — Module 2: Drag & drop file upload with Framer Motion.         */
/*  Progress tracking, multi-file support, type/size validation.              */
/* -------------------------------------------------------------------------- */

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload,
    X,
    File as FileIcon,
    CheckCircle,
    AlertCircle,
    Loader2,
    CloudUpload,
    Image as ImageIcon,
    FileText,
    Film,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Types ─────────────────────────────────────────────────────────────────── */

interface UploadingFile {
    id: string;
    file: File;
    progress: number;
    status: "uploading" | "success" | "error";
    error?: string;
    url?: string;
}

interface FileUploadProps {
    bucket: string;
    folder?: string;
    projectId?: string;
    maxFiles?: number;
    maxSize?: number; // bytes
    allowedTypes?: string[];
    onUploadComplete?: (files: { name: string; path: string; url: string }[]) => void;
    onError?: (error: string) => void;
    className?: string;
    compact?: boolean;
}

/* ── Helpers ───────────────────────────────────────────────────────────────── */

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function getFileIconComponent(type: string) {
    if (type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />;
    if (type.startsWith("video/")) return <Film className="h-4 w-4" />;
    if (type === "application/pdf") return <FileText className="h-4 w-4" />;
    return <FileIcon className="h-4 w-4" />;
}

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function FileUpload({
    bucket,
    folder,
    projectId,
    maxFiles = 10,
    maxSize = 50 * 1024 * 1024,
    allowedTypes,
    onUploadComplete,
    onError,
    className,
    compact = false,
}: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [uploading, setUploading] = useState<UploadingFile[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    /* ── Drag handlers ─────────────────────────────────────────────── */

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);

            const files = Array.from(e.dataTransfer.files);
            handleFiles(files);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [bucket, folder, projectId],
    );

    /* ── File selection ────────────────────────────────────────────── */

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        handleFiles(files);
        // Reset input so the same file can be re-selected
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    /* ── Upload logic ──────────────────────────────────────────────── */

    const handleFiles = async (files: File[]) => {
        if (files.length === 0) return;

        // Validate count
        if (files.length > maxFiles) {
            onError?.(`Maximum ${maxFiles} files allowed at once`);
            return;
        }

        // Validate each file
        const validFiles: File[] = [];
        for (const file of files) {
            if (file.size > maxSize) {
                onError?.(`"${file.name}" exceeds ${formatSize(maxSize)} limit`);
                continue;
            }
            if (allowedTypes && allowedTypes.length > 0) {
                const isAllowed = allowedTypes.some((type) => {
                    if (type.endsWith("/*")) {
                        return file.type.startsWith(type.replace("/*", "/"));
                    }
                    return file.type === type;
                });
                if (!isAllowed) {
                    onError?.(`"${file.name}" has unsupported type "${file.type}"`);
                    continue;
                }
            }
            validFiles.push(file);
        }

        if (validFiles.length === 0) return;

        // Create upload entries
        const entries: UploadingFile[] = validFiles.map((file) => ({
            id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            file,
            progress: 0,
            status: "uploading" as const,
        }));

        setUploading((prev) => [...prev, ...entries]);

        // Upload each file
        const results: { name: string; path: string; url: string }[] = [];

        for (const entry of entries) {
            try {
                const formData = new FormData();
                formData.append("file", entry.file);
                formData.append("bucket", bucket);
                if (folder) formData.append("folder", folder);
                if (projectId) formData.append("project_id", projectId);

                // Simulate progress
                const progressInterval = setInterval(() => {
                    setUploading((prev) =>
                        prev.map((u) =>
                            u.id === entry.id && u.progress < 90
                                ? { ...u, progress: u.progress + 10 }
                                : u,
                        ),
                    );
                }, 200);

                const res = await fetch("/api/files", {
                    method: "POST",
                    body: formData,
                });

                clearInterval(progressInterval);

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || "Upload failed");
                }

                const data = await res.json();

                setUploading((prev) =>
                    prev.map((u) =>
                        u.id === entry.id
                            ? { ...u, progress: 100, status: "success", url: data.file.url }
                            : u,
                    ),
                );

                results.push({
                    name: entry.file.name,
                    path: data.file.path,
                    url: data.file.url || "",
                });
            } catch (err) {
                setUploading((prev) =>
                    prev.map((u) =>
                        u.id === entry.id
                            ? {
                                  ...u,
                                  progress: 0,
                                  status: "error",
                                  error: err instanceof Error ? err.message : "Upload failed",
                              }
                            : u,
                    ),
                );
            }
        }

        if (results.length > 0) {
            onUploadComplete?.(results);
        }

        // Clear completed uploads after 3 seconds
        setTimeout(() => {
            setUploading((prev) => prev.filter((u) => u.status === "uploading"));
        }, 3000);
    };

    /* ── Remove from list ──────────────────────────────────────────── */

    const removeEntry = (id: string) => {
        setUploading((prev) => prev.filter((u) => u.id !== id));
    };

    /* ── Render ────────────────────────────────────────────────────── */

    return (
        <div className={cn("space-y-3", className)}>
            {/* Drop zone */}
            <motion.div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                animate={{
                    borderColor: isDragging ? "rgba(14, 165, 233, 0.5)" : "rgba(255, 255, 255, 0.06)",
                    backgroundColor: isDragging ? "rgba(14, 165, 233, 0.05)" : "rgba(255, 255, 255, 0.01)",
                }}
                className={cn(
                    "relative cursor-pointer rounded-2xl border-2 border-dashed transition-all",
                    "hover:border-white/[0.12] hover:bg-white/[0.03]",
                    compact ? "px-6 py-6" : "px-8 py-12",
                )}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    accept={allowedTypes?.join(",")}
                />

                <div className="flex flex-col items-center text-center">
                    <motion.div
                        animate={{
                            scale: isDragging ? 1.1 : 1,
                            y: isDragging ? -4 : 0,
                        }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={cn(
                            "flex items-center justify-center rounded-2xl mb-3",
                            isDragging ? "bg-cyan-500/20" : "bg-white/[0.04]",
                            compact ? "h-10 w-10" : "h-14 w-14",
                        )}
                    >
                        <CloudUpload
                            className={cn(
                                isDragging ? "text-cyan-400" : "text-sx-text-subtle",
                                compact ? "h-5 w-5" : "h-6 w-6",
                            )}
                        />
                    </motion.div>

                    <p className={cn("font-medium text-white", compact ? "text-sm" : "text-base")}>
                        {isDragging ? "Drop files here" : "Drag & drop files"}
                    </p>
                    <p className="mt-1 text-xs text-sx-text-muted">
                        or{" "}
                        <span className="text-cyan-400 underline underline-offset-2">
                            browse
                        </span>{" "}
                        · Max {formatSize(maxSize)} per file
                    </p>
                    {allowedTypes && allowedTypes[0] !== "*" && (
                        <p className="mt-1 text-[10px] text-sx-text-subtle">
                            {allowedTypes.map((t) => t.replace("/*", "")).join(", ")}
                        </p>
                    )}
                </div>
            </motion.div>

            {/* Upload progress list */}
            <AnimatePresence>
                {uploading.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                    >
                        {uploading.map((entry) => (
                            <motion.div
                                key={entry.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3"
                            >
                                {/* Icon */}
                                <div
                                    className={cn(
                                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                                        entry.status === "success"
                                            ? "bg-emerald-500/10 text-emerald-400"
                                            : entry.status === "error"
                                              ? "bg-red-500/10 text-red-400"
                                              : "bg-cyan-500/10 text-cyan-400",
                                    )}
                                >
                                    {entry.status === "uploading" ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : entry.status === "success" ? (
                                        <CheckCircle className="h-4 w-4" />
                                    ) : (
                                        <AlertCircle className="h-4 w-4" />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm text-white truncate pr-2">
                                            {entry.file.name}
                                        </p>
                                        <span className="text-[10px] text-sx-text-subtle shrink-0">
                                            {formatSize(entry.file.size)}
                                        </span>
                                    </div>

                                    {/* Progress bar */}
                                    {entry.status === "uploading" && (
                                        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${entry.progress}%` }}
                                                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                                            />
                                        </div>
                                    )}

                                    {entry.status === "error" && entry.error && (
                                        <p className="mt-0.5 text-[10px] text-red-400 truncate">
                                            {entry.error}
                                        </p>
                                    )}
                                </div>

                                {/* Remove button */}
                                {entry.status !== "uploading" && (
                                    <button
                                        onClick={() => removeEntry(entry.id)}
                                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-sx-text-subtle hover:text-white hover:bg-white/[0.06] transition-colors"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
