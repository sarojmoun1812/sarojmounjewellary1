import { cookies } from "next/headers";
import { prisma } from "./db";

// Simple password hashing (in production, use bcrypt)
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + process.env.AUTH_SECRET);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

// Generate session token
export function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

// Create admin session
export async function createSession(adminId: string, request?: Request) {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  const session = await prisma.adminSession.create({
    data: {
      adminId,
      token,
      expiresAt,
      ipAddress: request?.headers.get("x-forwarded-for") || undefined,
      userAgent: request?.headers.get("user-agent") || undefined,
    },
  });

  // Update admin last login
  await prisma.admin.update({
    where: { id: adminId },
    data: { lastLogin: new Date() },
  });

  return { token, expiresAt };
}

// Get current admin from session
export async function getCurrentAdmin() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;

    if (!token) return null;

    const session = await prisma.adminSession.findUnique({
      where: { token },
      include: { admin: true },
    });

    if (!session || session.expiresAt < new Date()) {
      // Session expired, delete it
      if (session) {
        await prisma.adminSession.delete({ where: { id: session.id } });
      }
      return null;
    }

    if (!session.admin.isActive) return null;

    return session.admin;
  } catch {
    return null;
  }
}

// Logout - delete session
export async function deleteSession(token: string) {
  try {
    await prisma.adminSession.delete({ where: { token } });
    return true;
  } catch {
    return false;
  }
}

// Initialize first admin if none exists
export async function initializeAdmin() {
  const adminCount = await prisma.admin.count();
  if (adminCount === 0) {
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || "admin123";
    const passwordHash = await hashPassword(defaultPassword);

    await prisma.admin.create({
      data: {
        email: "admin@sarojmounjewellery.com",
        passwordHash,
        name: "Admin",
        role: "SUPER_ADMIN",
      },
    });

    console.log("Default admin created: admin@sarojmounjewellery.com");
  }
}
