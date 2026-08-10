import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  verifyPassword,
  createSession,
  deleteSession,
  hashPassword,
  needsRehash,
  upgradePasswordHash,
} from "@/lib/auth";
import { cookies } from "next/headers";
import { enforceRateLimit } from "@/lib/rate-limit";

// POST /api/admin/auth - Login
export async function POST(request: NextRequest) {
  try {
    // The admin panel has a single account, so an unthrottled login form is a
    // straightforward offline-speed guessing target.
    const limited = enforceRateLimit(request, "admin-login", {
      limit: 8,
      windowMs: 15 * 60 * 1000,
      message: "Too many login attempts. Please wait 15 minutes and try again.",
    });
    if (limited) return limited;

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    const admin = await prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (!admin.isActive) {
      return NextResponse.json(
        { error: "Account is disabled" },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, admin.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Silently move an old SHA-256 hash onto bcrypt now that the plaintext is
    // in hand. Nobody has to reset anything, and the weak hash stops existing.
    if (needsRehash(admin.passwordHash)) {
      await upgradePasswordHash(admin.id, password);
    }

    const { token, expiresAt } = await createSession(admin.id, request);

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/auth - Logout
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;

    if (token) {
      await deleteSession(token);
    }

    cookieStore.delete("admin_session");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}

// GET /api/admin/auth - Get current admin
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;

    if (!token) {
      return NextResponse.json({ admin: null });
    }

    const session = await prisma.adminSession.findUnique({
      where: { token },
      include: { admin: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ admin: null });
    }

    return NextResponse.json({
      admin: {
        id: session.admin.id,
        email: session.admin.email,
        name: session.admin.name,
        role: session.admin.role,
      },
    });
  } catch (error) {
    console.error("Get admin error:", error);
    return NextResponse.json({ admin: null });
  }
}

// PATCH /api/admin/auth - Change password
export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const session = await prisma.adminSession.findUnique({
      where: { token },
      include: { admin: true },
    });

    if (!session || session.expiresAt < new Date()) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current and new password required" },
        { status: 400 }
      );
    }

    // Matches the minimum the setup route enforces. Without it, a hijacked
    // session could set the password to a single character.
    if (typeof newPassword !== "string" || newPassword.length < 12) {
      return NextResponse.json(
        { error: "New password must be at least 12 characters" },
        { status: 400 }
      );
    }

    const isValid = await verifyPassword(
      currentPassword,
      session.admin.passwordHash
    );

    if (!isValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    const newHash = await hashPassword(newPassword);

    await prisma.admin.update({
      where: { id: session.admin.id },
      data: { passwordHash: newHash },
    });

    // Changing a password is how someone responds to a suspected compromise, so
    // every other session is cut immediately. Previously a stolen cookie stayed
    // valid for up to seven days afterwards, which defeats the point.
    await prisma.adminSession.deleteMany({
      where: { adminId: session.admin.id, token: { not: token } },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json(
      { error: "Password change failed" },
      { status: 500 }
    );
  }
}
