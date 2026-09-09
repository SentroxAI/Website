"use client";

/* -------------------------------------------------------------------------- */
/*                         FILE LIST VIEW                                     */
/*                                                                            */
/*  Table-style file list with columns: name, type, size, project, date.      */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { Download, Star, MoreHorizontal, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import FileIcon from "./FileIcon";
import EmptyState from "@/components/dashboard/overview/EmptyState";
import type { FileEntry } from "./data";

interface FileListViewProps {
    files: FileEntry[];
}

export default function FileListView({ files }: FileListViewProps) {
    if (files.length === 0) {
        return (
            <EmptyState
                icon={<FolderOpen className="h-6 w-6" />}
                title="No files found"
                description="Try adjusting your filters or upload a new file."
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02]"
            />
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
            {/* Header row */}
            <div className="hidden sm:grid sm:grid-cols-[1fr_100px_80px_140px_100px] gap-4 px-5 py-2.5 border-b border-white/[0.06] text-[11px] font-semibold uppercase tracking-wider text-sx-text-subtle">
                <span>Name</span>
                <span>Type</span>
                <span>Size</span>
                <span>Project</span>
                <span className="text-right">Uploaded</span>
            </div>

            {/* File rows */}
            <div className="divide-y divide-white/[0.04]">
                {files.map((file, index) => (
                    <motion.div
                        key={file.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        className="group flex items-center gap-3 px-5 py-3 sm:grid sm:grid-cols-[1fr_100px_80px_140px_100px] sm:gap-4 transition-colors hover:bg-white/[0.02]"
                    >
                        {/* Name + icon */}
                        <div className="flex items-center gap-3 min-w-0 flex-1 sm:flex-initial">
                            <FileIcon type={file.type} size="sm" />
                            <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <p className="text-sm font-medium text-sx-text-secondary truncate group-hover:text-white transition-colors">
                                        {file.name}
                                    </p>
                                    {file.starred && (
                                        <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" />
                                    )}
                                </div>
                                {/* Mobile: show metadata inline */}
                                <p className="sm:hidden text-[11px] text-sx-text-muted mt-0.5">
                                    {file.sizeFormatted} · {file.relativeTime}
                                </p>
                            </div>
                        </div>

                        {/* Type */}
                        <span className="hidden sm:block text-xs text-sx-text-muted capitalize">
                            {file.type}
                        </span>

                        {/* Size */}
                        <span className="hidden sm:block text-xs text-sx-text-muted tabular-nums">
                            {file.sizeFormatted}
                        </span>

                        {/* Project */}
                        <span className="hidden sm:block text-xs text-sx-text-subtle truncate">
                            {file.projectName || "—"}
                        </span>

                        {/* Date + actions */}
                        <div className="hidden sm:flex items-center justify-end gap-2">
                            <span className="text-xs text-sx-text-muted">
                                {file.relativeTime}
                            </span>
                            <div className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                                <button className="flex h-7 w-7 items-center justify-center rounded-lg text-sx-text-subtle hover:bg-white/5 hover:text-white transition-colors">
                                    <Download className="h-3.5 w-3.5" />
                                </button>
                                <button className="flex h-7 w-7 items-center justify-center rounded-lg text-sx-text-subtle hover:bg-white/5 hover:text-white transition-colors">
                                    <MoreHorizontal className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </div>

                        {/* Mobile actions */}
                        <div className="sm:hidden flex gap-1">
                            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-sx-text-subtle hover:bg-white/5 hover:text-white transition-colors">
                                <Download className="h-4 w-4" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
