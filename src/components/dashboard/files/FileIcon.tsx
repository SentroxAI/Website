"use client";

/* -------------------------------------------------------------------------- */
/*                           FILE ICON                                        */
/*                                                                            */
/*  Maps FileType to a styled icon with background.                           */
/* -------------------------------------------------------------------------- */

import {
    FileText,
    Image,
    Film,
    FileSpreadsheet,
    PenTool,
    Archive,
    Code,
    Music,
    File,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { FileType } from "./data";

const iconConfig: Record<FileType, { icon: React.ReactNode; bg: string; text: string }> = {
    pdf: { icon: <FileText className="h-5 w-5" />, bg: "bg-red-500/10", text: "text-red-400" },
    image: { icon: <Image className="h-5 w-5" />, bg: "bg-emerald-500/10", text: "text-emerald-400" },
    video: { icon: <Film className="h-5 w-5" />, bg: "bg-violet-500/10", text: "text-violet-400" },
    document: { icon: <FileText className="h-5 w-5" />, bg: "bg-blue-500/10", text: "text-blue-400" },
    figma: { icon: <PenTool className="h-5 w-5" />, bg: "bg-pink-500/10", text: "text-pink-400" },
    spreadsheet: { icon: <FileSpreadsheet className="h-5 w-5" />, bg: "bg-emerald-500/10", text: "text-emerald-400" },
    archive: { icon: <Archive className="h-5 w-5" />, bg: "bg-amber-500/10", text: "text-amber-400" },
    code: { icon: <Code className="h-5 w-5" />, bg: "bg-cyan-500/10", text: "text-cyan-400" },
    audio: { icon: <Music className="h-5 w-5" />, bg: "bg-orange-500/10", text: "text-orange-400" },
};

interface FileIconProps {
    type: FileType;
    size?: "sm" | "md" | "lg";
    className?: string;
}

export default function FileIcon({ type, size = "md", className }: FileIconProps) {
    const config = iconConfig[type] || {
        icon: <File className="h-5 w-5" />,
        bg: "bg-slate-500/10",
        text: "text-slate-400",
    };

    const sizeClasses = {
        sm: "h-8 w-8 rounded-lg",
        md: "h-10 w-10 rounded-xl",
        lg: "h-14 w-14 rounded-2xl",
    };

    return (
        <div
            className={cn(
                "flex items-center justify-center shrink-0",
                sizeClasses[size],
                config.bg,
                config.text,
                className
            )}
        >
            {config.icon}
        </div>
    );
}
