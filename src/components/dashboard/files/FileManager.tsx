"use client";

/* -------------------------------------------------------------------------- */
/*                         FILE MANAGER COMPONENT                             */
/*                                                                            */
/*  Sprint 4 — Module 2: Full file management with grid/list views,          */
/*  folder navigation, search, upload, preview, and bulk actions.             */
/* -------------------------------------------------------------------------- */

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Upload,
    Search,
    X,
    LayoutGrid,
    List,
    Filter,
    FolderOpen,
    Trash2,
    Download,
    Star,
    MoreHorizontal,
    ChevronRight,
    Home,
    Loader2,
    RefreshCw,
    CheckSquare,
    Square,
    HardDrive,
    ArrowUpDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
    listFiles,
    deleteFile,
    deleteFiles,
    getSignedUrl,
} from "@/app/actions/storage";
import {
    type StorageFile,
    type BucketName,
    STORAGE_BUCKETS,
} from "@/lib/storage-config";
import FileIcon from "@/components/dashboard/files/FileIcon";
import FileUpload from "@/components/common/FileUpload";
import FilePreview from "@/components/common/FilePreview";
import { formatFileSize, getFileType, type FileType } from "@/components/dashboard/files/data";

/* ── Types ─────────────────────────────────────────────────────────────────── */

type ViewMode = "grid" | "list";
type SortField = "name" | "size" | "date";
type SortOrder = "asc" | "desc";

interface FileManagerProps {
    defaultBucket?: BucketName;
    projectId?: string;
    className?: string;
}

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function FileManager({
    defaultBucket = "client-files",
    projectId,
    className,
}: FileManagerProps) {
    /* ── State ─────────────────────────────────────────────────────── */
    const [files, setFiles] = useState<StorageFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<ViewMode>("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [activeBucket, setActiveBucket] = useState<BucketName>(defaultBucket);
    const [currentFolder, setCurrentFolder] = useState("");
    const [showUpload, setShowUpload] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
    const [previewFile, setPreviewFile] = useState<{
        name: string;
        path: string;
        url: string;
        size: number;
        mimeType: string;
        bucket: string;
        createdAt?: string;
    } | null>(null);
    const [showPreview, setShowPreview] = useState(false);
    const [sortField, setSortField] = useState<SortField>("date");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
    const [bulkDeleting, setBulkDeleting] = useState(false);

    /* ── Breadcrumbs ───────────────────────────────────────────────── */
    const breadcrumbs = useMemo(() => {
        const parts = currentFolder ? currentFolder.split("/").filter(Boolean) : [];
        return [
            { label: activeBucket, path: "" },
            ...parts.map((part, i) => ({
                label: part,
                path: parts.slice(0, i + 1).join("/"),
            })),
        ];
    }, [currentFolder, activeBucket]);

    /* ── Load files ────────────────────────────────────────────────── */
    const loadFiles = useCallback(async () => {
        setLoading(true);
        try {
            const result = await listFiles(activeBucket, currentFolder || undefined, {
                limit: 200,
                sortBy: {
                    column: sortField === "date" ? "created_at" : sortField === "size" ? "metadata" : "name",
                    order: sortOrder,
                },
            });
            setFiles(result.files);
        } catch (error) {
            console.error("Failed to load files:", error);
        } finally {
            setLoading(false);
        }
    }, [activeBucket, currentFolder, sortField, sortOrder]);

    useEffect(() => {
        loadFiles();
    }, [loadFiles]);

    /* ── Filtered & sorted ─────────────────────────────────────────── */
    const filteredFiles = useMemo(() => {
        let result = files;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter((f) => f.name.toLowerCase().includes(q));
        }
        return result;
    }, [files, searchQuery]);

    /* ── Selection ─────────────────────────────────────────────────── */
    const toggleSelect = (id: string) => {
        setSelectedFiles((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedFiles.size === filteredFiles.length) {
            setSelectedFiles(new Set());
        } else {
            setSelectedFiles(new Set(filteredFiles.map((f) => f.id)));
        }
    };

    /* ── Actions ───────────────────────────────────────────────────── */
    const handlePreview = async (file: StorageFile) => {
        let url = "";
        const config = STORAGE_BUCKETS[activeBucket];
        if (config.public) {
            // For public buckets, construct the URL
            url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${activeBucket}/${file.path}`;
        } else {
            const result = await getSignedUrl(activeBucket, file.path);
            url = result.signedUrl || "";
        }

        setPreviewFile({
            name: file.name,
            path: file.path,
            url,
            size: file.size,
            mimeType: file.mime_type,
            bucket: activeBucket,
            createdAt: file.created_at,
        });
        setShowPreview(true);
    };

    const handleDelete = async (path: string) => {
        await deleteFile(activeBucket, path);
        setShowPreview(false);
        setPreviewFile(null);
        loadFiles();
    };

    const handleBulkDelete = async () => {
        if (selectedFiles.size === 0) return;
        if (!confirm(`Delete ${selectedFiles.size} selected file(s)?`)) return;

        setBulkDeleting(true);
        const paths = filteredFiles
            .filter((f) => selectedFiles.has(f.id))
            .map((f) => f.path);

        await deleteFiles(activeBucket, paths);
        setSelectedFiles(new Set());
        setBulkDeleting(false);
        loadFiles();
    };

    const handleUploadComplete = () => {
        setShowUpload(false);
        loadFiles();
    };

    const handleFolderNavigate = (path: string) => {
        setCurrentFolder(path);
        setSelectedFiles(new Set());
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortField(field);
            setSortOrder("asc");
        }
    };

    /* ── Stats ─────────────────────────────────────────────────────── */
    const totalSize = filteredFiles.reduce((sum, f) => sum + f.size, 0);

    /* ── Bucket tabs (accessible) ─────────────────────────────────── */
    const bucketTabs = Object.entries(STORAGE_BUCKETS).map(([key, config]) => ({
        id: key as BucketName,
        label: key.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        isPublic: config.public,
    }));

    return (
        <div className={cn("space-y-6", className)}>
            {/* ── Upload Modal ─────────────────────────────────────────── */}
            <AnimatePresence>
                {showUpload && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowUpload(false)}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2"
                        >
                            <div className="rounded-2xl border border-white/[0.08] bg-[#0c1220] p-6 shadow-2xl">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-white">
                                        Upload to {activeBucket}
                                    </h2>
                                    <button
                                        onClick={() => setShowUpload(false)}
                                        className="flex h-8 w-8 items-center justify-center rounded-lg text-sx-text-subtle hover:bg-white/[0.06] hover:text-white transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                                <FileUpload
                                    bucket={activeBucket}
                                    folder={currentFolder || undefined}
                                    projectId={projectId}
                                    maxSize={STORAGE_BUCKETS[activeBucket].maxSize}
                                    allowedTypes={[...STORAGE_BUCKETS[activeBucket].allowedTypes]}
                                    onUploadComplete={handleUploadComplete}
                                />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ── Bucket Tabs ──────────────────────────────────────────── */}
            <div className="flex items-center gap-1 overflow-x-auto rounded-xl bg-white/[0.02] p-1 border border-white/[0.06]">
                {bucketTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => {
                            setActiveBucket(tab.id);
                            setCurrentFolder("");
                            setSelectedFiles(new Set());
                        }}
                        className={cn(
                            "relative whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all",
                            activeBucket === tab.id
                                ? "text-white"
                                : "text-sx-text-muted hover:text-sx-text-secondary",
                        )}
                    >
                        {activeBucket === tab.id && (
                            <motion.div
                                layoutId="bucket-tab"
                                className="absolute inset-0 rounded-lg bg-white/[0.08] border border-white/[0.08]"
                                transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 30,
                                }}
                            />
                        )}
                        <span className="relative flex items-center gap-1.5">
                            {tab.label}
                            {tab.isPublic && (
                                <span className="rounded-full bg-emerald-500/10 px-1.5 py-px text-[9px] text-emerald-400">
                                    Public
                                </span>
                            )}
                        </span>
                    </button>
                ))}
            </div>

            {/* ── Breadcrumbs ──────────────────────────────────────────── */}
            {breadcrumbs.length > 1 && (
                <div className="flex items-center gap-1 text-xs text-sx-text-muted">
                    <button
                        onClick={() => handleFolderNavigate("")}
                        className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                        <Home className="h-3 w-3" />
                    </button>
                    {breadcrumbs.map((crumb, i) => (
                        <span key={crumb.path} className="flex items-center gap-1">
                            <ChevronRight className="h-3 w-3" />
                            <button
                                onClick={() => handleFolderNavigate(crumb.path)}
                                className={cn(
                                    "hover:text-white transition-colors",
                                    i === breadcrumbs.length - 1 && "text-white font-medium",
                                )}
                            >
                                {crumb.label}
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* ── Toolbar ──────────────────────────────────────────────── */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {/* Left: search + stats */}
                <div className="flex items-center gap-3 flex-1">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sx-text-subtle" />
                        <input
                            type="text"
                            placeholder="Search files…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-white/[0.06] bg-white/[0.03] py-2 pl-9 pr-8 text-sm text-white placeholder:text-sx-text-subtle outline-none transition-colors focus:border-sx-primary/30 focus:bg-white/[0.05]"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sx-text-subtle hover:text-white transition-colors"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-xs text-sx-text-muted">
                        <HardDrive className="h-3.5 w-3.5" />
                        <span>{filteredFiles.length} files</span>
                        <span>·</span>
                        <span>{formatFileSize(totalSize)}</span>
                    </div>
                </div>

                {/* Right: actions */}
                <div className="flex items-center gap-2">
                    {selectedFiles.size > 0 && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={handleBulkDelete}
                            disabled={bulkDeleting}
                            className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                        >
                            {bulkDeleting ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                            )}
                            Delete ({selectedFiles.size})
                        </motion.button>
                    )}

                    <button
                        onClick={loadFiles}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] bg-white/[0.02] text-sx-text-subtle hover:text-white hover:bg-white/[0.06] transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
                    </button>

                    {/* View toggle */}
                    <div className="flex items-center gap-1 rounded-lg bg-white/[0.03] p-1 border border-white/[0.06]">
                        <button
                            onClick={() => setViewMode("grid")}
                            className={cn(
                                "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
                                viewMode === "grid"
                                    ? "bg-white/[0.08] text-white"
                                    : "text-sx-text-subtle hover:text-white",
                            )}
                        >
                            <LayoutGrid className="h-3.5 w-3.5" />
                        </button>
                        <button
                            onClick={() => setViewMode("list")}
                            className={cn(
                                "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
                                viewMode === "list"
                                    ? "bg-white/[0.08] text-white"
                                    : "text-sx-text-subtle hover:text-white",
                            )}
                        >
                            <List className="h-3.5 w-3.5" />
                        </button>
                    </div>

                    <button
                        onClick={() => setShowUpload(true)}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all"
                    >
                        <Upload className="h-4 w-4" />
                        Upload
                    </button>
                </div>
            </div>

            {/* ── Content ──────────────────────────────────────────────── */}
            {loading ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="h-6 w-6 animate-spin text-sx-text-subtle" />
                </div>
            ) : filteredFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.01] px-6 py-24">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 mb-4">
                        <FolderOpen className="h-6 w-6 text-cyan-400" />
                    </div>
                    <p className="text-lg font-semibold text-white">
                        {searchQuery ? "No files match your search" : "No files yet"}
                    </p>
                    <p className="mt-1 text-sm text-sx-text-muted">
                        {searchQuery
                            ? "Try a different search term."
                            : "Upload your first file to get started."}
                    </p>
                    {!searchQuery && (
                        <button
                            onClick={() => setShowUpload(true)}
                            className="mt-4 flex items-center gap-2 rounded-xl bg-white/[0.06] px-4 py-2 text-sm font-medium text-white hover:bg-white/[0.1] transition-colors"
                        >
                            <Upload className="h-4 w-4" />
                            Upload Files
                        </button>
                    )}
                </div>
            ) : viewMode === "grid" ? (
                /* Grid view */
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredFiles.map((file, i) => {
                        const fileType = getFileType(file.name);
                        const isSelected = selectedFiles.has(file.id);

                        return (
                            <motion.div
                                key={file.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: i * 0.03 }}
                                onClick={() => handlePreview(file)}
                                className={cn(
                                    "group relative cursor-pointer overflow-hidden rounded-2xl",
                                    "border bg-white/[0.02] transition-all duration-300",
                                    "hover:bg-white/[0.04] hover:shadow-lg hover:-translate-y-0.5",
                                    isSelected
                                        ? "border-cyan-500/30 bg-cyan-500/[0.04]"
                                        : "border-white/[0.06] hover:border-white/[0.12]",
                                )}
                            >
                                {/* Preview area */}
                                <div className="flex h-28 items-center justify-center bg-white/[0.01] border-b border-white/[0.04]">
                                    <FileIcon type={fileType} size="lg" />
                                </div>

                                {/* Select checkbox */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleSelect(file.id);
                                    }}
                                    className={cn(
                                        "absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-md transition-all",
                                        isSelected
                                            ? "bg-cyan-500 text-white"
                                            : "bg-black/40 backdrop-blur-sm text-white/60 opacity-0 group-hover:opacity-100",
                                    )}
                                >
                                    {isSelected ? (
                                        <CheckSquare className="h-3.5 w-3.5" />
                                    ) : (
                                        <Square className="h-3.5 w-3.5" />
                                    )}
                                </button>

                                {/* Info */}
                                <div className="p-4">
                                    <p className="text-sm font-medium text-white truncate mb-1 group-hover:text-sx-primary-400 transition-colors">
                                        {file.name}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div className="text-[11px] text-sx-text-muted">
                                            <span>{formatFileSize(file.size)}</span>
                                            {file.created_at && (
                                                <>
                                                    <span className="mx-1">·</span>
                                                    <span>
                                                        {new Date(
                                                            file.created_at,
                                                        ).toLocaleDateString("en-IN", {
                                                            month: "short",
                                                            day: "numeric",
                                                        })}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                /* List view */
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/[0.06]">
                                <th className="w-10 px-3 py-3">
                                    <button
                                        onClick={toggleSelectAll}
                                        className="flex h-5 w-5 items-center justify-center rounded text-sx-text-subtle hover:text-white transition-colors"
                                    >
                                        {selectedFiles.size === filteredFiles.length &&
                                        filteredFiles.length > 0 ? (
                                            <CheckSquare className="h-3.5 w-3.5 text-cyan-400" />
                                        ) : (
                                            <Square className="h-3.5 w-3.5" />
                                        )}
                                    </button>
                                </th>
                                <th
                                    onClick={() => handleSort("name")}
                                    className="cursor-pointer px-4 py-3 text-left text-xs font-semibold text-sx-text-muted uppercase tracking-wider hover:text-white transition-colors"
                                >
                                    <span className="flex items-center gap-1">
                                        Name
                                        {sortField === "name" && (
                                            <ArrowUpDown className="h-3 w-3" />
                                        )}
                                    </span>
                                </th>
                                <th
                                    onClick={() => handleSort("size")}
                                    className="cursor-pointer px-4 py-3 text-left text-xs font-semibold text-sx-text-muted uppercase tracking-wider hover:text-white transition-colors"
                                >
                                    <span className="flex items-center gap-1">
                                        Size
                                        {sortField === "size" && (
                                            <ArrowUpDown className="h-3 w-3" />
                                        )}
                                    </span>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-semibold text-sx-text-muted uppercase tracking-wider">
                                    Type
                                </th>
                                <th
                                    onClick={() => handleSort("date")}
                                    className="cursor-pointer px-4 py-3 text-left text-xs font-semibold text-sx-text-muted uppercase tracking-wider hover:text-white transition-colors"
                                >
                                    <span className="flex items-center gap-1">
                                        Date
                                        {sortField === "date" && (
                                            <ArrowUpDown className="h-3 w-3" />
                                        )}
                                    </span>
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-semibold text-sx-text-muted uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filteredFiles.map((file, i) => {
                                    const fileType = getFileType(file.name);
                                    const isSelected = selectedFiles.has(file.id);

                                    return (
                                        <motion.tr
                                            key={file.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: i * 0.02 }}
                                            onClick={() => handlePreview(file)}
                                            className={cn(
                                                "cursor-pointer border-b border-white/[0.04] transition-colors",
                                                isSelected
                                                    ? "bg-cyan-500/[0.04]"
                                                    : "hover:bg-white/[0.02]",
                                            )}
                                        >
                                            <td className="w-10 px-3 py-3">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleSelect(file.id);
                                                    }}
                                                    className="flex h-5 w-5 items-center justify-center rounded text-sx-text-subtle hover:text-white transition-colors"
                                                >
                                                    {isSelected ? (
                                                        <CheckSquare className="h-3.5 w-3.5 text-cyan-400" />
                                                    ) : (
                                                        <Square className="h-3.5 w-3.5" />
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <FileIcon
                                                        type={fileType}
                                                        size="sm"
                                                    />
                                                    <span className="text-sm font-medium text-white truncate max-w-[200px]">
                                                        {file.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-sx-text-muted">
                                                {formatFileSize(file.size)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="rounded-full bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-sx-text-subtle uppercase">
                                                    {file.mime_type.split("/").pop()}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-sx-text-muted">
                                                {file.created_at
                                                    ? new Date(
                                                          file.created_at,
                                                      ).toLocaleDateString("en-IN", {
                                                          month: "short",
                                                          day: "numeric",
                                                          year: "numeric",
                                                      })
                                                    : "—"}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDelete(file.path);
                                                        }}
                                                        className="flex h-7 w-7 items-center justify-center rounded-lg text-sx-text-subtle hover:bg-red-500/10 hover:text-red-400 transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── Preview Panel ─────────────────────────────────────────── */}
            <FilePreview
                isOpen={showPreview}
                onClose={() => {
                    setShowPreview(false);
                    setPreviewFile(null);
                }}
                file={previewFile}
                onDelete={handleDelete}
            />
        </div>
    );
}
