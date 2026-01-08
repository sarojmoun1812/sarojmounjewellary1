import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/leads - Create new lead (public endpoint)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, source, message } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { error: "Name and phone are required" },
        { status: 400 }
      );
    }

    // Validate phone number
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, "").slice(-10))) {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        name,
        email: email || null,
        phone: phone.replace(/\D/g, "").slice(-10),
        source: source || "CONTACT_FORM",
        message: message || null,
        status: "NEW",
      },
    });

    return NextResponse.json({ success: true, lead: { id: lead.id } }, { status: 201 });
  } catch (error) {
    console.error("Create lead error:", error);
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}
