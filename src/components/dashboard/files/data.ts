/* -------------------------------------------------------------------------- */
/*                        FILES MODULE – MOCK DATA                            */
/*                                                                            */
/*  File and folder data for the file management page.                        */
/*  Interfaces mirror Supabase `files` table for easy migration.              */
/* -------------------------------------------------------------------------- */

/* ── Types ─────────────────────────────────────────────────────────────────── */

export type FileType = "pdf" | "image" | "video" | "document" | "figma" | "spreadsheet" | "archive" | "code" | "audio";
export type ViewMode = "grid" | "list";
export type SortField = "name" | "size" | "date" | "type";

export interface FileEntry {
    id: string;
    name: string;
    type: FileType;
    mimeType: string;
    size: number; // bytes
    sizeFormatted: string;
    uploadedAt: string;
    relativeTime: string;
    uploadedBy: string;
    projectName?: string;
    starred?: boolean;
}

/* ── Helpers ───────────────────────────────────────────────────────────────── */

export function getFileType(name: string): FileType {
    const ext = name.split(".").pop()?.toLowerCase() || "";
    if (["pdf"].includes(ext)) return "pdf";
    if (["png", "jpg", "jpeg", "gif", "webp", "svg", "ico"].includes(ext)) return "image";
    if (["mp4", "webm", "mov", "avi"].includes(ext)) return "video";
    if (["fig", "sketch"].includes(ext)) return "figma";
    if (["xlsx", "csv", "xls"].includes(ext)) return "spreadsheet";
    if (["zip", "rar", "7z", "tar", "gz"].includes(ext)) return "archive";
    if (["js", "ts", "tsx", "jsx", "py", "html", "css", "json"].includes(ext)) return "code";
    if (["mp3", "wav", "ogg", "flac"].includes(ext)) return "audio";
    return "document";
}

export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/* ── Mock files ────────────────────────────────────────────────────────────── */

export const files: FileEntry[] = [
    {
        id: "f1",
        name: "brand-guidelines-v3.pdf",
        type: "pdf",
        mimeType: "application/pdf",
        size: 2936012,
        sizeFormatted: "2.8 MB",
        uploadedAt: "2026-08-04",
        relativeTime: "Today",
        uploadedBy: "Alice Johnson",
        projectName: "Website Redesign",
        starred: true,
    },
    {
        id: "f2",
        name: "wireframes-desktop.fig",
        type: "figma",
        mimeType: "application/figma",
        size: 13421772,
        sizeFormatted: "12.8 MB",
        uploadedAt: "2026-08-03",
        relativeTime: "Yesterday",
        uploadedBy: "Alice Johnson",
        projectName: "Website Redesign",
        starred: true,
    },
    {
        id: "f3",
        name: "homepage-hero.png",
        type: "image",
        mimeType: "image/png",
        size: 876544,
        sizeFormatted: "856 KB",
        uploadedAt: "2026-08-02",
        relativeTime: "2 days ago",
        uploadedBy: "Bob Smith",
        projectName: "Website Redesign",
    },
    {
        id: "f4",
        name: "project-proposal.docx",
        type: "document",
        mimeType: "application/vnd.openxmlformats",
        size: 348160,
        sizeFormatted: "340 KB",
        uploadedAt: "2026-08-01",
        relativeTime: "3 days ago",
        uploadedBy: "Diana Wilson",
        projectName: "Mobile App v2.0",
    },
    {
        id: "f5",
        name: "budget-tracker.xlsx",
        type: "spreadsheet",
        mimeType: "application/vnd.openxmlformats",
        size: 131072,
        sizeFormatted: "128 KB",
        uploadedAt: "2026-07-30",
        relativeTime: "5 days ago",
        uploadedBy: "Charlie Davis",
    },
    {
        id: "f6",
        name: "app-architecture.pdf",
        type: "pdf",
        mimeType: "application/pdf",
        size: 1258291,
        sizeFormatted: "1.2 MB",
        uploadedAt: "2026-07-28",
        relativeTime: "1 week ago",
        uploadedBy: "Diana Wilson",
        projectName: "Mobile App v2.0",
    },
    {
        id: "f7",
        name: "api-documentation.pdf",
        type: "pdf",
        mimeType: "application/pdf",
        size: 3250585,
        sizeFormatted: "3.1 MB",
        uploadedAt: "2026-07-25",
        relativeTime: "10 days ago",
        uploadedBy: "Ivan Chen",
        projectName: "E-commerce Integration",
    },
    {
        id: "f8",
        name: "product-demo.mp4",
        type: "video",
        mimeType: "video/mp4",
        size: 52428800,
        sizeFormatted: "50.0 MB",
        uploadedAt: "2026-07-22",
        relativeTime: "2 weeks ago",
        uploadedBy: "Eve Martinez",
        projectName: "Mobile App v2.0",
    },
    {
        id: "f9",
        name: "ui-components.zip",
        type: "archive",
        mimeType: "application/zip",
        size: 8388608,
        sizeFormatted: "8.0 MB",
        uploadedAt: "2026-07-20",
        relativeTime: "2 weeks ago",
        uploadedBy: "Bob Smith",
        projectName: "Website Redesign",
    },
    {
        id: "f10",
        name: "meeting-notes-jul.docx",
        type: "document",
        mimeType: "application/vnd.openxmlformats",
        size: 98304,
        sizeFormatted: "96 KB",
        uploadedAt: "2026-07-18",
        relativeTime: "2 weeks ago",
        uploadedBy: "Diana Wilson",
    },
    {
        id: "f11",
        name: "icon-set.svg",
        type: "image",
        mimeType: "image/svg+xml",
        size: 45056,
        sizeFormatted: "44 KB",
        uploadedAt: "2026-07-15",
        relativeTime: "3 weeks ago",
        uploadedBy: "Alice Johnson",
        projectName: "Website Redesign",
        starred: true,
    },
    {
        id: "f12",
        name: "analytics-export.csv",
        type: "spreadsheet",
        mimeType: "text/csv",
        size: 204800,
        sizeFormatted: "200 KB",
        uploadedAt: "2026-07-12",
        relativeTime: "3 weeks ago",
        uploadedBy: "Frank Lee",
        projectName: "SEO Optimization",
    },
];

/* ── Filter helpers ────────────────────────────────────────────────────────── */

export function getUniqueProjects(): string[] {
    const set = new Set<string>();
    files.forEach((f) => { if (f.projectName) set.add(f.projectName); });
    return Array.from(set);
}

export function getTotalSize(): number {
    return files.reduce((sum, f) => sum + f.size, 0);
}
