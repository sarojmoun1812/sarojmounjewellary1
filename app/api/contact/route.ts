import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/contact - Submit contact form
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Name, email, subject, and message are required" },
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

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone: phone || null,
        subject,
        message,
        isRead: false,
      },
    });

    // Also create a lead
    await prisma.lead.create({
      data: {
        name,
        email: email.toLowerCase(),
        phone: phone || "0000000000",
        source: "CONTACT_FORM",
        message: `${subject}: ${message}`,
        status: "NEW",
      },
    });

    return NextResponse.json(
      { success: true, id: contactMessage.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
