import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getCurrentAdmin } from "@/lib/auth";

/**
 * Stores a product photograph and returns the URL to save against the product.
 *
 * Two backends are supported, tried in this order:
 *
 *  1. Vercel Blob, used when BLOB_READ_WRITE_TOKEN is present. On Vercel that
 *     token appears by itself once a Blob store is connected to the project,
 *     so this is the path that requires no third-party account and no keys
 *     copied by hand.
 *  2. Cloudinary, kept for the case where those keys are already configured.
 *
 * If neither is available the request fails with a 503 and an explanation. It
 * used to return a placeholder.com URL with a 200, so an upload appeared to
 * succeed and a grey placeholder was saved onto a real product — the kind of
 * failure nobody notices until a customer is looking at it.
 */

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

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
        { error: "Koi photo nahi mili. Dobara select karein." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Sirf photo upload kar sakte hain (JPG ya PNG)." },
        { status: 400 }
      );
    }

    if (file.size > MAX_IMAGE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      return NextResponse.json(
        {
          error: `Photo bahut badi hai (${sizeMb} MB). 10 MB se chhoti photo daalein.`,
        },
        { status: 400 }
      );
    }

    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // addRandomSuffix keeps two photos with the same filename from
      // overwriting each other, which is easy to do when phones name every
      // picture IMG_0001.jpg.
      const blob = await put(`products/${file.name}`, file, {
        access: "public",
        addRandomSuffix: true,
        contentType: file.type,
      });

      return NextResponse.json({ url: blob.url });
    }

    const cloudinaryUrl = await uploadToCloudinary(file);
    if (cloudinaryUrl) {
      return NextResponse.json({ url: cloudinaryUrl });
    }

    return NextResponse.json(
      {
        error:
          "Photo save karne ki jagah set nahi hai, isliye photo upload nahi hui. Vercel par Blob store jodna hoga.",
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("[upload] Failed:", error);
    return NextResponse.json(
      { error: "Photo upload nahi ho payi. Thodi der baad dobara koshish karein." },
      { status: 500 }
    );
  }
}

/** Returns the hosted URL, or null when Cloudinary is not configured. */
async function uploadToCloudinary(file: File): Promise<string | null> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) return null;

  const buffer = Buffer.from(await file.arrayBuffer());
  const dataUri = `data:${file.type};base64,${buffer.toString("base64")}`;

  const timestamp = Math.round(Date.now() / 1000);
  const folder = "saroj-moun-jewellery";

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
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: uploadFormData }
  );

  if (!response.ok) {
    console.error("[upload] Cloudinary error:", await response.text());
    throw new Error("Cloudinary upload failed");
  }

  const result = await response.json();
  return result.secure_url as string;
}
