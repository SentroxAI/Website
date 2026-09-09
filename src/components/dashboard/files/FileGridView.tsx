"use client";

/* -------------------------------------------------------------------------- */
/*                         FILE GRID VIEW                                     */
/*                                                                            */
/*  Grid of file cards with icon, name, metadata, and actions.                */
/* -------------------------------------------------------------------------- */

import { motion } from "framer-motion";
import { Download, Star, MoreHorizontal, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import FileIcon from "./FileIcon";
import EmptyState from "@/components/dashboard/overview/EmptyState";
import type { FileEntry } from "./data";

interface FileGridViewProps {
    files: FileEntry[];
}

export default function FileGridView({ files }: FileGridViewProps) {
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {files.map((file, index) => (
                <motion.div
                    key={file.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.04, ease: "easeOut" }}
                    className={cn(
                        "group relative overflow-hidden rounded-2xl",
                        "border border-white/[0.06] bg-white/[0.02]",
                        "transition-all duration-300",
                        "hover:border-white/[0.12] hover:bg-white/[0.04]",
                        "hover:shadow-lg hover:-translate-y-0.5"
                    )}
                >
                    {/* Preview area */}
                    <div className="flex h-28 items-center justify-center bg-white/[0.01] border-b border-white/[0.04]">
                        <FileIcon type={file.type} size="lg" />
                    </div>

                    {/* Star button */}
                    {file.starred && (
                        <div className="absolute top-2 right-2">
                            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        </div>
                    )}

                    {/* Info */}
                    <div className="p-4">
                        <p className="text-sm font-medium text-white truncate mb-1 group-hover:text-sx-primary-400 transition-colors">
                            {file.name}
                        </p>
                        <div className="flex items-center justify-between">
                            <div className="text-[11px] text-sx-text-muted">
                                <span>{file.sizeFormatted}</span>
                                <span className="mx-1">·</span>
                                <span>{file.relativeTime}</span>
                            </div>
                        </div>
                        {file.projectName && (
                            <p className="mt-1.5 text-[10px] font-medium text-sx-primary-400/70 truncate">
                                {file.projectName}
                            </p>
                        )}
                    </div>

                    {/* Hover actions */}
                    <div className="absolute top-2 left-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 backdrop-blur-sm text-white/80 hover:text-white transition-colors">
                            <Download className="h-3.5 w-3.5" />
                        </button>
                        <button className="flex h-7 w-7 items-center justify-center rounded-lg bg-black/60 backdrop-blur-sm text-white/80 hover:text-white transition-colors">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
