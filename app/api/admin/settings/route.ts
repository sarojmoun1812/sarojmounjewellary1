import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

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

    const body = await request.json();

    const settings = await prisma.siteSettings.upsert({
      where: { id: "settings" },
      update: {
        siteName: body.siteName,
        tagline: body.tagline,
        phone: body.phone,
        whatsapp: body.whatsapp,
        email: body.email,
        address: body.address,
        gst: body.gst,
        shippingCharge: body.shippingCharge,
        freeShippingMin: body.freeShippingMin,
        socialFacebook: body.socialFacebook,
        socialInstagram: body.socialInstagram,
        socialTwitter: body.socialTwitter,
        socialYoutube: body.socialYoutube,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
      },
      create: {
        id: "settings",
        siteName: body.siteName || "Saroj Moun Jewellery",
        tagline: body.tagline,
        phone: body.phone,
        whatsapp: body.whatsapp,
        email: body.email,
        address: body.address,
        gst: body.gst,
        shippingCharge: body.shippingCharge,
        freeShippingMin: body.freeShippingMin,
        socialFacebook: body.socialFacebook,
        socialInstagram: body.socialInstagram,
        socialTwitter: body.socialTwitter,
        socialYoutube: body.socialYoutube,
        metaTitle: body.metaTitle,
        metaDescription: body.metaDescription,
      },
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
