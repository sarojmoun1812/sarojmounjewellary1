import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getCurrentAdmin } from "@/lib/auth";

/**
 * Stores a product photo or video and returns the URL to save on the product.
 *
 * Backends, tried in order:
 *  1. Vercel Blob when BLOB_READ_WRITE_TOKEN is set
 *  2. Cloudinary when those keys are configured
 *
 * Without either, the request fails with 503 — never a fake placeholder URL.
 */

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 40 * 1024 * 1024;

const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "Koi file nahi mili. Dobara select karein." },
        { status: 400 }
      );
    }

    const isImage = file.type.startsWith("image/");
    const isVideo = ALLOWED_VIDEO_TYPES.has(file.type);

    if (!isImage && !isVideo) {
      return NextResponse.json(
        {
          error:
            "Sirf photo (JPG/PNG/WebP) ya video (MP4/WebM) upload kar sakte hain.",
        },
        { status: 400 }
      );
    }

    const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (file.size > maxBytes) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      const limitMb = isVideo ? "40" : "10";
      return NextResponse.json(
        {
          error: `File bahut badi hai (${sizeMb} MB). ${limitMb} MB se chhoti ${
            isVideo ? "video" : "photo"
          } daalein.`,
        },
        { status: 400 }
      );
    }

    const folder = isVideo ? "products/videos" : "products";

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`${folder}/${file.name}`, file, {
        access: "public",
        addRandomSuffix: true,
        contentType: file.type,
      });

      return NextResponse.json({ url: blob.url, kind: isVideo ? "video" : "image" });
    }

    const cloudinaryUrl = await uploadToCloudinary(file, isVideo);
    if (cloudinaryUrl) {
      return NextResponse.json({
        url: cloudinaryUrl,
        kind: isVideo ? "video" : "image",
      });
    }

    return NextResponse.json(
      {
        error:
          "Photo/video save karne ki jagah set nahi hai. Vercel par Blob store jodna hoga, ya Cloudinary keys set karein.",
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("[upload] Failed:", error);
    return NextResponse.json(
      {
        error:
          "Upload nahi ho payi. Thodi der baad dobara koshish karein.",
      },
      { status: 500 }
    );
  }
}

async function uploadToCloudinary(
  file: File,
  isVideo: boolean
): Promise<string | null> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) return null;

  const buffer = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

  const timestamp = Math.round(Date.now() / 1000);
  const folder = "saroj-moun-jewellery";
  const resourceType = isVideo ? "video" : "image";

  const crypto = await import("crypto");
  const signature = crypto
    .createHash("sha1")
    .update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`)
    .digest("hex");

  const uploadFormData = new FormData();
  uploadFormData.append("file", dataUri);
  uploadFormData.append("folder", folder);
  uploadFormData.append("timestamp", timestamp.toString());
  uploadFormData.append("api_key", apiKey);
  uploadFormData.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    { method: "POST", body: uploadFormData }
  );

  if (!response.ok) {
    console.error("[upload] Cloudinary error:", await response.text());
    throw new Error("Cloudinary upload failed");
  }

  const result = await response.json();
  return result.secure_url as string;
}
