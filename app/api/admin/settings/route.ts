import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

/**
 * Shop settings. Values here change what customers are charged, so the body is
 * validated rather than spread into Prisma — an empty numeric field previously
 * reached the database as NaN and took the settings page down with it.
 */

const optionalText = z
  .string()
  .trim()
  .max(500)
  .optional()
  .nullable()
  .transform((value) => (value ? value : null));

const settingsSchema = z.object({
  siteName: z.string().trim().min(1).max(120).default("Saroj Moun Jewellery"),
  tagline: optionalText,
  phone: optionalText,
  whatsapp: optionalText,
  email: optionalText,
  address: optionalText,
  gst: optionalText,
  // Defaults to 0: charging GST without a GSTIN is not allowed.
  gstRate: z.number().min(0, "GST cannot be negative").max(28).default(0),
  gstInclusive: z.boolean().default(false),
  shippingCharge: z.number().int().min(0).default(0),
  freeShippingMin: z.number().int().min(0).nullable().default(null),
  socialFacebook: optionalText,
  socialInstagram: optionalText,
  socialTwitter: optionalText,
  socialYoutube: optionalText,
  metaTitle: optionalText,
  metaDescription: optionalText,
});

// GET /api/admin/settings
export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let settings = await prisma.siteSettings.findUnique({
      where: { id: "settings" },
    });

    if (!settings) {
      settings = await prisma.siteSettings.create({
        data: {
          id: "settings",
          siteName: "Saroj Moun Jewellery",
        },
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// POST /api/admin/settings
export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = settingsSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: parsed.error.errors[0]?.message ?? "Please check these settings",
          details: parsed.error.errors,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const settings = await prisma.siteSettings.upsert({
      where: { id: "settings" },
      update: data,
      create: { id: "settings", ...data },
    });

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
