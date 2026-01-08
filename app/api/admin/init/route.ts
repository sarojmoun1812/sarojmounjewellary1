import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

// POST /api/admin/init - Initialize first admin
export async function POST(request: NextRequest) {
  try {
    // Only allow if no admins exist
    const adminCount = await prisma.admin.count();
    
    if (adminCount > 0) {
      return NextResponse.json(
        { error: "Admin already exists" },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name required" },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const admin = await prisma.admin.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        name,
        role: "SUPER_ADMIN",
      },
    });

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error("Admin init error:", error);
    return NextResponse.json(
      { error: "Failed to create admin" },
      { status: 500 }
    );
  }
}

// GET /api/admin/init - Check if admin exists
export async function GET() {
  try {
    const adminCount = await prisma.admin.count();
    return NextResponse.json({ needsSetup: adminCount === 0 });
  } catch (error) {
    console.error("Admin check error:", error);
    return NextResponse.json({ needsSetup: true });
  }
}
