import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/newsletter - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Check if already subscribed
    const existing = await prisma.newsletter.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existing) {
      if (existing.isSubscribed) {
        return NextResponse.json(
          { error: "Already subscribed" },
          { status: 400 }
        );
      }

      // Resubscribe
      await prisma.newsletter.update({
        where: { id: existing.id },
        data: { isSubscribed: true },
      });

      return NextResponse.json({ success: true, message: "Resubscribed successfully" });
    }

    await prisma.newsletter.create({
      data: {
        email: email.toLowerCase(),
        isSubscribed: true,
      },
    });

    // Also create a lead for tracking
    await prisma.lead.create({
      data: {
        name: email.split("@")[0],
        email: email.toLowerCase(),
        phone: "0000000000", // Placeholder
        source: "NEWSLETTER",
        message: "Subscribed to newsletter",
        status: "NEW",
      },
    });

    return NextResponse.json({ success: true, message: "Subscribed successfully" }, { status: 201 });
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}
