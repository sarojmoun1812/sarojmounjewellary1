import { cookies } from "next/headers";
import { prisma } from "./db";

// Simple password hashing (in production, use bcrypt)
export async function hashPassword(password: string): Promise<string> {
  const authSecret = process.env.AUTH_SECRET;

  // Without this guard a missing AUTH_SECRET silently hashes
  // `password + "undefined"`, so every deployment that forgot to set it shares
  // the same predictable hashes. Refusing is the safe outcome.
  if (!authSecret) {
    throw new Error("AUTH_SECRET is not set; refusing to hash a password.");
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(password + authSecret);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const passwordHash = await hashPassword(password);

  // Constant-time comparison so response timing cannot be used to guess a hash.
  if (passwordHash.length !== hash.length) return false;

  let mismatch = 0;
  for (let i = 0; i < passwordHash.length; i++) {
    mismatch |= passwordHash.charCodeAt(i) ^ hash.charCodeAt(i);
  }
  return mismatch === 0;
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

/**
 * Creates the first admin, using credentials supplied through the environment.
 * There is deliberately no default password: a well-known one on a public URL
 * is the same as no password at all. Use scripts/create-admin.js instead when
 * setting up or resetting access.
 */
export async function initializeAdmin() {
  const adminCount = await prisma.admin.count();
  if (adminCount > 0) return { created: false as const };

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_DEFAULT_PASSWORD;

  if (!email || !password) {
    throw new Error(
      "Set ADMIN_EMAIL and ADMIN_DEFAULT_PASSWORD to create the first admin."
    );
  }

  if (password.length < 12) {
    throw new Error("ADMIN_DEFAULT_PASSWORD must be at least 12 characters.");
  }

  const passwordHash = await hashPassword(password);

  await prisma.admin.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
      name: process.env.ADMIN_NAME || "Admin",
      role: "SUPER_ADMIN",
    },
  });

  return { created: true as const, email: email.toLowerCase() };
}
