import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./db";

/**
 * Password storage.
 *
 * bcrypt with a work factor, not a plain digest. The previous implementation was
 * SHA-256 over `password + AUTH_SECRET`, which is a keyed digest rather than a
 * password hash: no per-password salt and no deliberate cost. SHA-256 is built
 * to be fast, so a leaked database — a Render breach, a stray backup — would let
 * someone try billions of candidate passwords per second offline. A short,
 * memorable password like the one this shop uses would fall in under a second.
 * bcrypt at cost 12 makes each guess take roughly a quarter of a second.
 *
 * Hashes written by the old scheme still verify, and are quietly upgraded to
 * bcrypt the next time that password is used successfully — see needsRehash.
 */

const BCRYPT_COST = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_COST);
}

/** True for a hash written by the old SHA-256 scheme. */
export function needsRehash(hash: string): boolean {
  return !/^\$2[aby]?\$/.test(hash);
}

/** Verifies against the legacy SHA-256 + AUTH_SECRET scheme. */
async function verifyLegacyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const authSecret = process.env.AUTH_SECRET;
  if (!authSecret) return false;

  const data = new TextEncoder().encode(password + authSecret);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const computed = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  // Constant-time comparison so response timing cannot be used to guess a hash.
  if (computed.length !== hash.length) return false;

  let mismatch = 0;
  for (let i = 0; i < computed.length; i++) {
    mismatch |= computed.charCodeAt(i) ^ hash.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  if (needsRehash(hash)) {
    return verifyLegacyPassword(password, hash);
  }

  try {
    return await bcrypt.compare(password, hash);
  } catch {
    return false;
  }
}

/**
 * Replaces a legacy hash with a bcrypt one. Called after a successful login so
 * the upgrade happens without anyone having to reset a password, and without
 * needing to know the plaintext at migration time.
 */
export async function upgradePasswordHash(adminId: string, password: string) {
  try {
    await prisma.admin.update({
      where: { id: adminId },
      data: { passwordHash: await hashPassword(password) },
    });
  } catch (error) {
    // A failed upgrade must not fail the login; the old hash still works.
    console.error("[auth] Could not upgrade a password hash to bcrypt:", error);
  }
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
