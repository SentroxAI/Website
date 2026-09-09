"use client";

/* -------------------------------------------------------------------------- */
/*                        PROJECT FILES LIST                                  */
/*                                                                            */
/*  File list for the project detail page.                                    */
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
import EmptyState from "@/components/dashboard/overview/EmptyState";
import type { ProjectFile } from "./data";

const fileTypeConfig: Record<string, { icon: React.ReactNode; bg: string; text: string }> = {
    pdf: { icon: <FileText className="h-4 w-4" />, bg: "bg-red-500/10", text: "text-red-400" },
    image: { icon: <Image className="h-4 w-4" />, bg: "bg-emerald-500/10", text: "text-emerald-400" },
    video: { icon: <Film className="h-4 w-4" />, bg: "bg-violet-500/10", text: "text-violet-400" },
    document: { icon: <FileText className="h-4 w-4" />, bg: "bg-blue-500/10", text: "text-blue-400" },
    figma: { icon: <PenTool className="h-4 w-4" />, bg: "bg-pink-500/10", text: "text-pink-400" },
    spreadsheet: { icon: <FileSpreadsheet className="h-4 w-4" />, bg: "bg-emerald-500/10", text: "text-emerald-400" },
};

function getFileType(name: string): string {
    const ext = name.split(".").pop()?.toLowerCase() || "";
    if (["pdf"].includes(ext)) return "pdf";
    if (["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(ext)) return "image";
    if (["mp4", "webm", "mov"].includes(ext)) return "video";
    if (["fig"].includes(ext)) return "figma";
    if (["xlsx", "csv"].includes(ext)) return "spreadsheet";
    return "document";
}

interface ProjectFilesListProps {
    files: ProjectFile[];
}

export default function ProjectFilesList({ files }: ProjectFilesListProps) {
    if (files.length === 0) {
        return (
            <EmptyState
                icon={<FolderOpen className="h-6 w-6" />}
                title="No files uploaded"
                description="Project files will appear here once uploaded."
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02]"
            />
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <div className="divide-y divide-white/[0.04]">
                {files.map((file, index) => {
                    const type = file.type || getFileType(file.name);
                    const config = fileTypeConfig[type] || {
                        icon: <File className="h-4 w-4" />,
                        bg: "bg-slate-500/10",
                        text: "text-slate-400",
                    };

                    return (
                        <motion.div
                            key={file.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.02]"
                        >
                            <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", config.bg, config.text)}>
                                {config.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-sx-text-secondary truncate">
                                    {file.name}
                                </p>
                                <p className="text-[11px] text-sx-text-muted">
                                    {file.size} · by {file.uploadedBy}
                                </p>
                            </div>
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
