import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";

/**
 * First-admin bootstrap.
 *
 * "No admins exist yet" is not an authorisation check on a public URL — it is a
 * race that whoever posts first wins, and they would own the shop. So this
 * route only works while ADMIN_SETUP_TOKEN is set in the environment, and the
 * caller has to present it. Leave the variable unset once setup is done; the
 * normal way to create or reset an admin is scripts/create-admin.js.
 */

const MIN_PASSWORD_LENGTH = 12;

function getSetupToken(): string | null {
  const token = process.env.ADMIN_SETUP_TOKEN;
  return token && token.length >= 16 ? token : null;
}

function tokensMatch(provided: string, expected: string): boolean {
  if (provided.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < provided.length; i++) {
    mismatch |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}

export async function POST(request: NextRequest) {
  try {
    // The setup token is the only thing guarding creation of a SUPER_ADMIN, and
    // it was previously guessable at whatever rate the network allowed. Length
    // alone is not a defence without a limit on attempts.
    const limited = enforceRateLimit(request, "admin-init", {
      limit: 5,
      windowMs: 15 * 60 * 1000,
      message: "Too many setup attempts. Please wait 15 minutes and try again.",
    });
    if (limited) return limited;

    const expectedToken = getSetupToken();

    if (!expectedToken) {
      return NextResponse.json(
        {
          error:
            "Admin setup is disabled. Use scripts/create-admin.js, or set ADMIN_SETUP_TOKEN (16+ characters) to enable this route.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, password, name, setupToken } = body;

    if (typeof setupToken !== "string" || !tokensMatch(setupToken, expectedToken)) {
      return NextResponse.json({ error: "Invalid setup token" }, { status: 403 });
    }

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Email, password, and name required" },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
        { status: 400 }
      );
    }

    const adminCount = await prisma.admin.count();
    if (adminCount > 0) {
      return NextResponse.json({ error: "Admin already exists" }, { status: 400 });
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
    // The internal message is not returned — it has leaked schema and
    // configuration details in the past.
    return NextResponse.json(
      { error: "Failed to create admin" },
      { status: 500 }
    );
  }
}

// GET /api/admin/init - whether the setup form should be offered
export async function GET() {
  try {
    if (!getSetupToken()) {
      return NextResponse.json({ needsSetup: false });
    }

    const adminCount = await prisma.admin.count();
    return NextResponse.json({ needsSetup: adminCount === 0 });
  } catch (error) {
    console.error("Admin check error:", error);
    return NextResponse.json({ needsSetup: false });
  }
}
