/* -------------------------------------------------------------------------- */
/*                         FILES API                                          */
/*                                                                            */
/*  POST /api/files — Multipart file upload                                   */
/*  DELETE /api/files — Delete file(s)                                        */
/*  GET /api/files — List files in a bucket                                   */
/* -------------------------------------------------------------------------- */

import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { STORAGE_BUCKETS, type BucketName } from "@/lib/storage-config";

/* ── Constants ─────────────────────────────────────────────────────────────── */

function sanitizeFileName(name: string): string {
    return name
        .replace(/[^a-zA-Z0-9._-]/g, "_")
        .replace(/_+/g, "_")
        .toLowerCase();
}

/* ── POST — Upload file ───────────────────────────────────────────────────── */

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get("file") as File | null;
        const bucket = formData.get("bucket") as string | null;
        const folder = formData.get("folder") as string | null;
        const projectId = formData.get("project_id") as string | null;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        if (!bucket || !(bucket in STORAGE_BUCKETS)) {
            return NextResponse.json(
                { error: `Invalid bucket. Valid buckets: ${Object.keys(STORAGE_BUCKETS).join(", ")}` },
                { status: 400 },
            );
        }

        const bucketConfig = STORAGE_BUCKETS[bucket as BucketName];

        /* ── Validate size ─────────────────────────────────────────── */
        if (file.size > bucketConfig.maxSize) {
            const maxMB = Math.round(bucketConfig.maxSize / (1024 * 1024));
            return NextResponse.json(
                { error: `File exceeds ${maxMB}MB limit for bucket "${bucket}"` },
                { status: 413 },
            );
        }

        /* ── Validate type ─────────────────────────────────────────── */
        if (bucketConfig.allowedTypes[0] !== "*") {
            const isAllowed = bucketConfig.allowedTypes.some((allowed) => {
                if (allowed.endsWith("/*")) {
                    return file.type.startsWith(allowed.replace("/*", "/"));
                }
                return file.type === allowed;
            });
            if (!isAllowed) {
                return NextResponse.json(
                    { error: `File type "${file.type}" not allowed in "${bucket}". Allowed: ${bucketConfig.allowedTypes.join(", ")}` },
                    { status: 415 },
                );
            }
        }

        /* ── Upload to Supabase Storage ────────────────────────────── */
        const fileName = sanitizeFileName(file.name);
        const timestamp = Date.now();
        const ext = fileName.split(".").pop() || "";
        const baseName = fileName.replace(`.${ext}`, "");
        const filePath = folder
            ? `${folder}/${baseName}_${timestamp}.${ext}`
            : `${user.id}/${baseName}_${timestamp}.${ext}`;

        const admin = createAdminClient();
        const buffer = Buffer.from(await file.arrayBuffer());

        const { data: uploadData, error: uploadError } = await admin.storage
            .from(bucket)
            .upload(filePath, buffer, {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            console.error("❌ Upload failed:", uploadError);
            return NextResponse.json(
                { error: uploadError.message },
                { status: 500 },
            );
        }

        /* ── Get URL ────────────────────────────────────────────────── */
        let url: string | null = null;
        if (bucketConfig.public) {
            const { data: urlData } = admin.storage
                .from(bucket)
                .getPublicUrl(uploadData.path);
            url = urlData.publicUrl;
        } else {
            const { data: signedData } = await admin.storage
                .from(bucket)
                .createSignedUrl(uploadData.path, 3600);
            url = signedData?.signedUrl || null;
        }

        /* ── Record in files table ──────────────────────────────────── */
        let fileRecord = null;
        if (projectId) {
            const { data: insertData } = await admin
                .from("files")
                .insert({
                    file_name: file.name,
                    file_path: uploadData.path,
                    file_size: file.size,
                    mime_type: file.type,
                    project_id: projectId,
                    uploaded_by: user.id,
                })
                .select()
                .single();
            fileRecord = insertData;
        }

        return NextResponse.json({
            success: true,
            file: {
                name: file.name,
                path: uploadData.path,
                size: file.size,
                type: file.type,
                bucket,
                url,
                record: fileRecord,
            },
        });
    } catch (error) {
        console.error("❌ File upload failed:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Upload failed" },
            { status: 500 },
        );
    }
}

/* ── DELETE — Remove file(s) ──────────────────────────────────────────────── */

export async function DELETE(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { bucket, paths } = body as { bucket: string; paths: string[] };

        if (!bucket || !paths || paths.length === 0) {
            return NextResponse.json(
                { error: "Missing bucket or paths" },
                { status: 400 },
            );
        }

        const admin = createAdminClient();

        const { error } = await admin.storage
            .from(bucket)
            .remove(paths);

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 },
            );
        }

        // Clean up database records
        await admin.from("files").delete().in("file_path", paths);

        return NextResponse.json({
            success: true,
            deleted: paths.length,
        });
    } catch (error) {
        console.error("❌ File delete failed:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Delete failed" },
            { status: 500 },
        );
    }
}

/* ── GET — List files ─────────────────────────────────────────────────────── */

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const bucket = searchParams.get("bucket") as BucketName | null;
        const folder = searchParams.get("folder") || "";
        const limit = Number(searchParams.get("limit")) || 100;
        const offset = Number(searchParams.get("offset")) || 0;
        const search = searchParams.get("search") || undefined;

        if (!bucket || !(bucket in STORAGE_BUCKETS)) {
            return NextResponse.json(
                { error: "Invalid or missing bucket parameter" },
                { status: 400 },
            );
        }

        const admin = createAdminClient();

        const { data, error } = await admin.storage
            .from(bucket)
            .list(folder, {
                limit,
                offset,
                sortBy: { column: "created_at", order: "desc" },
                search,
            });

        if (error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 },
            );
        }

        const files = (data || [])
            .filter((item) => item.name !== ".emptyFolderPlaceholder")
            .map((item) => ({
                id: item.id || item.name,
                name: item.name,
                bucket,
                path: folder ? `${folder}/${item.name}` : item.name,
                size: item.metadata?.size || 0,
                mimeType: item.metadata?.mimetype || "application/octet-stream",
                createdAt: item.created_at || "",
                updatedAt: item.updated_at || "",
                metadata: item.metadata || null,
            }));

        return NextResponse.json({ files });
    } catch (error) {
        console.error("❌ File list failed:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "List failed" },
            { status: 500 },
        );
    }
}
