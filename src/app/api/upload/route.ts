import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/middleware/auth";
import { writeFile } from "fs/promises";
import { join } from "path";
import { getCloudinaryConfig } from "@/lib/cloudinary";
import { getS3Config } from "@/lib/s3";

/**
 * File upload endpoint
 * Supports:
 * - Local file system (default)
 * - Cloudinary (if configured)
 * - AWS S3 (if configured)
 */
export async function POST(request: NextRequest) {
  const auth = requireAuth(request);
  if ("error" in auth) {
    return auth.error;
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Try Cloudinary first
    const cloudinaryConfig = getCloudinaryConfig();
    if (cloudinaryConfig) {
      try {
        const { uploadToCloudinary } = await import("@/lib/cloudinary");
        const result = await uploadToCloudinary(buffer, file.name, "banners");
        return NextResponse.json({
          url: result.url,
          filename: file.name,
          provider: "cloudinary",
        });
      } catch (error) {
        console.error("Cloudinary upload failed:", error);
        // Fall back to local storage
      }
    }

    // Try S3 next
    const s3Config = getS3Config();
    if (s3Config) {
      try {
        const { uploadToS3 } = await import("@/lib/s3");
        const url = await uploadToS3(buffer, file.name, "banners");
        return NextResponse.json({
          url,
          filename: file.name,
          provider: "s3",
        });
      } catch (error) {
        console.error("S3 upload failed:", error);
        // Fall back to local storage
      }
    }

    // Fall back to local file system
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name}`;
    const uploadPath = join(process.cwd(), "public", "uploads", filename);

    const uploadsDir = join(process.cwd(), "public", "uploads");
    try {
      await writeFile(uploadPath, buffer);
    } catch (error: any) {
      if (error.code === "ENOENT") {
        const { mkdir } = await import("fs/promises");
        await mkdir(uploadsDir, { recursive: true });
        await writeFile(uploadPath, buffer);
      } else {
        throw error;
      }
    }

    const imageUrl = `/uploads/${filename}`;

    return NextResponse.json({
      url: imageUrl,
      filename,
      provider: "local",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload an image file (Admin only)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                 filename:
 *                   type: string
 *       401:
 *         description: Unauthorized
 */

