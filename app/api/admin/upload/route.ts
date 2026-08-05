import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";

// POST /api/admin/upload - Upload image to Cloudinary
export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      return NextResponse.json(
        { error: "Only images and videos are allowed" },
        { status: 400 }
      );
    }

    const maxSize = isVideo ? 50 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `File too large (max ${isVideo ? "50MB" : "5MB"})` },
        { status: 400 }
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      // This used to return a placeholder.com URL and a 200, so an upload
      // appeared to succeed and the grey placeholder image was saved onto a real
      // product. Failing loudly is the only way she finds out before customers do.
      return NextResponse.json(
        {
          error:
            "Image hosting is not set up yet, so the file was not saved. Add the Cloudinary keys to the site settings and try again.",
        },
        { status: 503 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary using unsigned upload
    const timestamp = Math.round(Date.now() / 1000);
    const folder = "saroj-moun-jewellery";
    
    // Create signature for signed upload
    const crypto = require("crypto");
    const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto
      .createHash("sha1")
      .update(signatureString)
      .digest("hex");

    const uploadFormData = new FormData();
    uploadFormData.append("file", dataUri);
    uploadFormData.append("folder", folder);
    uploadFormData.append("timestamp", timestamp.toString());
    uploadFormData.append("api_key", apiKey);
    uploadFormData.append("signature", signature);

    // Cloudinary rejects video payloads sent to the image endpoint, so the
    // resource type has to follow the file we were actually given.
    const resourceType = isVideo ? "video" : "image";

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      {
        method: "POST",
        body: uploadFormData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cloudinary error:", errorText);
      return NextResponse.json(
        { error: "Upload failed" },
        { status: 500 }
      );
    }

    const result = await response.json();

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
}
