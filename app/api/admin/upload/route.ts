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

/** Phones often send HEIC with a blank MIME type; fall back to the filename. */
function isImageFile(file: File): boolean {
  if (file.type.startsWith("image/")) return true;
  return /\.(jpe?g|png|webp|gif|heic|heif)$/i.test(file.name);
}

function isVideoFile(file: File): boolean {
  if (ALLOWED_VIDEO_TYPES.has(file.type)) return true;
  return /\.(mp4|webm|mov)$/i.test(file.name);
}

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

    const isImage = isImageFile(file);
    const isVideo = isVideoFile(file);

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

    // Cloudinary is the store the shop uses now, so it is tried first. It returns
    // null when unconfigured and throws on a genuine failure; both are handled so
    // the request can still fall through to Blob.
    try {
      const cloudinaryUrl = await uploadToCloudinary(file, isVideo);
      if (cloudinaryUrl) {
        return NextResponse.json({
          url: cloudinaryUrl,
          kind: isVideo ? "video" : "image",
        });
      }
    } catch (cloudinaryError) {
      console.error("[upload] Cloudinary failed, trying Blob:", cloudinaryError);
    }

    // Blob is only a fallback. An expired or revoked token must never hard-fail
    // the upload — that is what silently lost photos when the store expired, so
    // a failure here falls through to the clear 503 below instead of a 500.
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      try {
        const blob = await put(`${folder}/${file.name}`, file, {
          access: "public",
          addRandomSuffix: true,
          contentType: file.type,
        });

        return NextResponse.json({
          url: blob.url,
          kind: isVideo ? "video" : "image",
        });
      } catch (blobError) {
        console.error("[upload] Blob upload failed:", blobError);
      }
    }

    return NextResponse.json(
      {
        error:
          "Photo/video save nahi ho payi. Cloudinary keys check karein (ya Vercel par purana Blob token hata dein).",
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
  // Fall back to the public cloud name so only one cloud-name variable has to be
  // set. The upload also needs the key/secret, which are server-only.
  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  // "demo" is Cloudinary's shared sandbox; uploading there would fail or leak.
  if (!cloudName || cloudName === "demo" || !apiKey || !apiSecret) return null;

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
