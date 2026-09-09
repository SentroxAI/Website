"use client";

/* -------------------------------------------------------------------------- */
/*                           RECENT FILES                                     */
/*                                                                            */
/*  File list with type icons, name, size, upload time, and download button.  */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import {
    FileText,
    Image,
    Film,
    FileSpreadsheet,
    PenTool,
    File,
    Download,
    FolderOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { filesData, type FileItem } from "./data";
import EmptyState from "./EmptyState";

/* ── File type config ──────────────────────────────────────────────────────── */

const fileTypeConfig: Record<
    FileItem["type"],
    { icon: React.ReactNode; bg: string; text: string }
> = {
    pdf: {
        icon: <FileText className="h-4 w-4" />,
        bg: "bg-red-500/10",
        text: "text-red-400",
    },
    image: {
        icon: <Image className="h-4 w-4" />,
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
    },
    video: {
        icon: <Film className="h-4 w-4" />,
        bg: "bg-violet-500/10",
        text: "text-violet-400",
    },
    document: {
        icon: <FileText className="h-4 w-4" />,
        bg: "bg-blue-500/10",
        text: "text-blue-400",
    },
    figma: {
        icon: <PenTool className="h-4 w-4" />,
        bg: "bg-pink-500/10",
        text: "text-pink-400",
    },
    spreadsheet: {
        icon: <FileSpreadsheet className="h-4 w-4" />,
        bg: "bg-emerald-500/10",
        text: "text-emerald-400",
    },
};

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function RecentFiles() {
    if (filesData.length === 0) {
        return (
            <EmptyState
                icon={<FolderOpen className="h-6 w-6" />}
                title="No files uploaded"
                description="Upload files to see them appear here."
                action={{
                    label: "Upload Files",
                    onClick: () => {},
                }}
            />
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
            <div className="divide-y divide-white/[0.04]">
                {filesData.map((file, index) => {
                    const config = fileTypeConfig[file.type] || {
                        icon: <File className="h-4 w-4" />,
                        bg: "bg-slate-500/10",
                        text: "text-slate-400",
                    };

                    return (
                        <motion.div
                            key={file.id}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.3,
                                delay: index * 0.05,
                                ease: "easeOut",
                            }}
                            className="group flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-white/[0.02]"
                        >
                            {/* File icon */}
                            <div
                                className={cn(
                                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                                    config.bg,
                                    config.text
                                )}
                            >
                                {config.icon}
                            </div>

                            {/* File info */}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-sx-text-secondary truncate">
                                    {file.name}
                                </p>
                                <p className="text-[11px] text-sx-text-muted">
                                    {file.size} · {file.relativeTime}
                                </p>
                            </div>

                            {/* Download button */}
                            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-sx-text-subtle opacity-0 transition-all hover:bg-white/5 hover:text-white group-hover:opacity-100">
                                <Download className="h-4 w-4" />
                            </button>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
