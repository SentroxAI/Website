/* -------------------------------------------------------------------------- */
/*                       STORAGE CONFIGURATION                                */
/*                                                                            */
/*  Shared bucket definitions — importable from both server actions           */
/*  and API routes without "use server" constraints.                          */
/* -------------------------------------------------------------------------- */

export interface StorageFile {
    id: string;
    name: string;
    bucket_id: string;
    path: string;
    size: number;
    mime_type: string;
    created_at: string;
    updated_at: string;
    last_accessed_at: string | null;
    metadata: Record<string, unknown> | null;
}

export interface UploadResult {
    success: boolean;
    path?: string;
    url?: string;
    error?: string;
}

export interface SignedUrlResult {
    success: boolean;
    signedUrl?: string;
    error?: string;
}

/* ── Bucket definitions ────────────────────────────────────────────────────── */

export const STORAGE_BUCKETS = {
    avatars: { name: "avatars", public: true, maxSize: 2 * 1024 * 1024, allowedTypes: ["image/*"] },
    blog: { name: "blog", public: true, maxSize: 10 * 1024 * 1024, allowedTypes: ["image/*", "video/*"] },
    portfolio: { name: "portfolio", public: true, maxSize: 20 * 1024 * 1024, allowedTypes: ["image/*", "video/*", "application/pdf"] },
    team: { name: "team", public: true, maxSize: 5 * 1024 * 1024, allowedTypes: ["image/*"] },
    logos: { name: "logos", public: true, maxSize: 2 * 1024 * 1024, allowedTypes: ["image/*", "image/svg+xml"] },
    "client-files": { name: "client-files", public: false, maxSize: 50 * 1024 * 1024, allowedTypes: ["*"] },
    contracts: { name: "contracts", public: false, maxSize: 20 * 1024 * 1024, allowedTypes: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"] },
    invoices: { name: "invoices", public: false, maxSize: 10 * 1024 * 1024, allowedTypes: ["application/pdf"] },
} as const;

export type BucketName = keyof typeof STORAGE_BUCKETS;
