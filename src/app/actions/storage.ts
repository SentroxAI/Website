"use server";

/* -------------------------------------------------------------------------- */
/*                       STORAGE SERVER ACTIONS                               */
/*                                                                            */
/*  Sprint 4 — Module 2: Supabase Storage operations.                        */
/*  Upload, download, delete, list files across all buckets.                  */
/* -------------------------------------------------------------------------- */

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { STORAGE_BUCKETS, type BucketName, type UploadResult, type SignedUrlResult, type StorageFile } from "@/lib/storage-config";

/* ── Helpers ───────────────────────────────────────────────────────────────── */

async function requireAuth() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");
    return { supabase, user };
}

async function requireAdmin() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single<{ role: string }>();

    if (profile?.role !== "admin") throw new Error("Forbidden");
    return { supabase, user };
}

function sanitizeFileName(name: string): string {
    return name
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .replace(/_+/g, "_")
        .toLowerCase();
}

function generateFilePath(bucket: BucketName, userId: string, fileName: string): string {
    const sanitized = sanitizeFileName(fileName);
    const timestamp = Date.now();
    const ext = sanitized.split(".").pop() || "";
    const baseName = sanitized.replace(`.${ext}`, "");
    return `${userId}/${baseName}_${timestamp}.${ext}`;
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                           UPLOAD                                           */
/* ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Upload a file to a Supabase Storage bucket.
 * Uses the admin client to bypass RLS for server-side operations.
 */
export async function uploadFile(
    formData: FormData,
): Promise<UploadResult> {
    try {
        const { user } = await requireAuth();

        const file = formData.get("file") as File | null;
        const bucket = formData.get("bucket") as BucketName | null;
        const folder = formData.get("folder") as string | null;

        if (!file || !bucket) {
            return { success: false, error: "Missing file or bucket" };
        }

        const bucketConfig = STORAGE_BUCKETS[bucket];
        if (!bucketConfig) {
            return { success: false, error: `Invalid bucket: ${bucket}` };
        }

        // Validate file size
        if (file.size > bucketConfig.maxSize) {
            const maxMB = Math.round(bucketConfig.maxSize / (1024 * 1024));
            return { success: false, error: `File exceeds maximum size of ${maxMB}MB` };
        }

        // Validate file type
        if (bucketConfig.allowedTypes[0] !== "*") {
            const isAllowed = bucketConfig.allowedTypes.some((allowed) => {
                if (allowed.endsWith("/*")) {
                    return file.type.startsWith(allowed.replace("/*", "/"));
                }
                return file.type === allowed;
            });
            if (!isAllowed) {
                return { success: false, error: `File type "${file.type}" is not allowed in this bucket` };
            }
        }

        // Build file path
        const fileName = sanitizeFileName(file.name);
        const basePath = folder ? `${folder}/${fileName}` : generateFilePath(bucket, user.id, file.name);

        const admin = createAdminClient();
        const buffer = Buffer.from(await file.arrayBuffer());

        const { data, error } = await admin.storage
            .from(bucket)
            .upload(basePath, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (error) {
            console.error("❌ Upload failed:", error);
            return { success: false, error: error.message };
        }

        // Get public URL for public buckets
        let url: string | undefined;
        if (bucketConfig.public) {
            const { data: urlData } = admin.storage
                .from(bucket)
                .getPublicUrl(data.path);
            url = urlData.publicUrl;
        }

        // Record file in the database (for client-files)
        if (bucket === "client-files") {
            const { data: clientRecord } = await admin
                .from("clients")
                .select("id")
                .eq("user_id", user.id)
                .maybeSingle();

            if (clientRecord) {
                // Check if a project_id was provided
                const projectId = formData.get("project_id") as string | null;
                if (projectId) {
                    await admin.from("files").insert({
                        file_name: file.name,
                        file_path: data.path,
                        file_size: file.size,
                        mime_type: file.type,
                        project_id: projectId,
                        uploaded_by: user.id,
                    });
                }
            }
        }

        return { success: true, path: data.path, url };
    } catch (error) {
        console.error("❌ Upload error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Upload failed",
        };
    }
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                         SIGNED URLS                                        */
/* ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Generate a signed URL for a private file (valid for 1 hour by default).
 */
export async function getSignedUrl(
    bucket: BucketName,
    path: string,
    expiresIn: number = 3600,
): Promise<SignedUrlResult> {
    try {
        await requireAuth();

        const admin = createAdminClient();
        const { data, error } = await admin.storage
            .from(bucket)
            .createSignedUrl(path, expiresIn);

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true, signedUrl: data.signedUrl };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to generate URL",
        };
    }
}

/**
 * Get a public URL for a public bucket file.
 */
export async function getPublicUrl(
    bucket: BucketName,
    path: string,
): Promise<string> {
    const admin = createAdminClient();
    const { data } = admin.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                           LIST                                             */
/* ═══════════════════════════════════════════════════════════════════════════ */

/**
 * List files in a bucket, optionally within a folder.
 */
export async function listFiles(
    bucket: BucketName,
    folder?: string,
    options?: {
        limit?: number;
        offset?: number;
        sortBy?: { column: string; order: "asc" | "desc" };
        search?: string;
    },
): Promise<{ files: StorageFile[]; error?: string }> {
    try {
        await requireAuth();
        const admin = createAdminClient();

        const { data, error } = await admin.storage
            .from(bucket)
            .list(folder || "", {
                limit: options?.limit || 100,
                offset: options?.offset || 0,
                sortBy: options?.sortBy || { column: "created_at", order: "desc" },
                search: options?.search,
            });

        if (error) {
            console.error("❌ List files failed:", error);
            return { files: [], error: error.message };
        }

        const files: StorageFile[] = (data || [])
            .filter((item) => item.name !== ".emptyFolderPlaceholder")
            .map((item) => ({
                id: item.id || item.name,
                name: item.name,
                bucket_id: bucket,
                path: folder ? `${folder}/${item.name}` : item.name,
                size: item.metadata?.size || 0,
                mime_type: item.metadata?.mimetype || "application/octet-stream",
                created_at: item.created_at || "",
                updated_at: item.updated_at || "",
                last_accessed_at: item.last_accessed_at || null,
                metadata: item.metadata || null,
            }));

        return { files };
    } catch (error) {
        return {
            files: [],
            error: error instanceof Error ? error.message : "Failed to list files",
        };
    }
}

/**
 * List all client files from the database (joined with project info).
 */
export async function listClientFiles(clientId?: string): Promise<{
    files: Array<{
        id: string;
        file_name: string;
        file_path: string;
        file_size: number;
        mime_type: string;
        created_at: string;
        uploaded_by: string;
        project: { id: string; title: string } | null;
        uploader: { full_name: string } | null;
    }>;
    error?: string;
}> {
    try {
        const { supabase, user } = await requireAuth();

        // Get user's role
        const { data: profile } = await supabase
            .from("users")
            .select("role")
            .eq("id", user.id)
            .single<{ role: string }>();

        const admin = createAdminClient();

        let query = admin
            .from("files")
            .select(`
                *,
                project:projects(id, title),
                uploader:users!files_uploaded_by_fkey(full_name)
            `)
            .order("created_at", { ascending: false });

        if (profile?.role === "client" && clientId) {
            // Client can only see files in their projects
            const { data: projects } = await admin
                .from("projects")
                .select("id")
                .eq("client_id", clientId);

            const projectIds = (projects || []).map((p) => p.id);
            if (projectIds.length > 0) {
                query = query.in("project_id", projectIds);
            } else {
                return { files: [] };
            }
        }

        const { data, error } = await query;

        if (error) {
            console.error("❌ Failed to list client files:", error);
            return { files: [], error: error.message };
        }

        return {
            files: (data || []).map((f) => ({
                id: f.id,
                file_name: f.file_name,
                file_path: f.file_path,
                file_size: f.file_size,
                mime_type: f.mime_type,
                created_at: f.created_at,
                uploaded_by: f.uploaded_by,
                project: f.project as { id: string; title: string } | null,
                uploader: f.uploader as { full_name: string } | null,
            })),
        };
    } catch (error) {
        return {
            files: [],
            error: error instanceof Error ? error.message : "Failed to list files",
        };
    }
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                          DELETE                                            */
/* ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Delete a file from a storage bucket.
 */
export async function deleteFile(
    bucket: BucketName,
    path: string,
): Promise<{ success: boolean; error?: string }> {
    try {
        await requireAuth();
        const admin = createAdminClient();

        const { error } = await admin.storage
            .from(bucket)
            .remove([path]);

        if (error) {
            console.error("❌ Delete failed:", error);
            return { success: false, error: error.message };
        }

        // Also remove from files table if it's a client file
        if (bucket === "client-files") {
            await admin.from("files").delete().eq("file_path", path);
        }

        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Delete failed",
        };
    }
}

/**
 * Delete multiple files from a storage bucket.
 */
export async function deleteFiles(
    bucket: BucketName,
    paths: string[],
): Promise<{ success: boolean; error?: string; deleted: number }> {
    try {
        await requireAuth();
        const admin = createAdminClient();

        const { error } = await admin.storage
            .from(bucket)
            .remove(paths);

        if (error) {
            console.error("❌ Bulk delete failed:", error);
            return { success: false, error: error.message, deleted: 0 };
        }

        // Also remove from files table
        if (bucket === "client-files") {
            await admin.from("files").delete().in("file_path", paths);
        }

        return { success: true, deleted: paths.length };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Bulk delete failed",
            deleted: 0,
        };
    }
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                        COPY / MOVE                                         */
/* ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Copy a file within a bucket (copy-on-write versioning).
 */
export async function copyFile(
    bucket: BucketName,
    fromPath: string,
    toPath: string,
): Promise<{ success: boolean; error?: string }> {
    try {
        await requireAdmin();
        const admin = createAdminClient();

        const { error } = await admin.storage
            .from(bucket)
            .copy(fromPath, toPath);

        if (error) {
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Copy failed",
        };
    }
}

/**
 * Move a file within a bucket.
 */
export async function moveFile(
    bucket: BucketName,
    fromPath: string,
    toPath: string,
): Promise<{ success: boolean; error?: string }> {
    try {
        await requireAdmin();
        const admin = createAdminClient();

        const { error } = await admin.storage
            .from(bucket)
            .move(fromPath, toPath);

        if (error) {
            return { success: false, error: error.message };
        }

        // Update path in files table
        if (bucket === "client-files") {
            await admin
                .from("files")
                .update({ file_path: toPath })
                .eq("file_path", fromPath);
        }

        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Move failed",
        };
    }
}

/* ═══════════════════════════════════════════════════════════════════════════ */
/*                      STORAGE STATS                                         */
/* ═══════════════════════════════════════════════════════════════════════════ */

/**
 * Get storage usage statistics.
 */
export async function getStorageStats(): Promise<{
    totalFiles: number;
    totalSize: number;
    bucketBreakdown: Array<{ bucket: string; fileCount: number; totalSize: number }>;
}> {
    try {
        await requireAuth();
        const admin = createAdminClient();

        // Get counts from files table
        const { data: dbFiles } = await admin
            .from("files")
            .select("file_size, project_id");

        const totalFiles = dbFiles?.length || 0;
        const totalSize = (dbFiles || []).reduce((sum, f) => sum + (f.file_size || 0), 0);

        // List buckets usage
        const bucketBreakdown: Array<{ bucket: string; fileCount: number; totalSize: number }> = [];

        for (const [key, config] of Object.entries(STORAGE_BUCKETS)) {
            try {
                const { data } = await admin.storage.from(config.name).list("", { limit: 1000 });
                const files = (data || []).filter((f) => f.name !== ".emptyFolderPlaceholder");
                const bucketSize = files.reduce((sum, f) => sum + (f.metadata?.size || 0), 0);
                bucketBreakdown.push({
                    bucket: key,
                    fileCount: files.length,
                    totalSize: bucketSize,
                });
            } catch {
                bucketBreakdown.push({ bucket: key, fileCount: 0, totalSize: 0 });
            }
        }

        return { totalFiles, totalSize, bucketBreakdown };
    } catch {
        return { totalFiles: 0, totalSize: 0, bucketBreakdown: [] };
    }
}
