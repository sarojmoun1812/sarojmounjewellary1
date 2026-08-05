// Creates or resets the admin account.
//
// Usage:
//   ADMIN_EMAIL=her@email.com ADMIN_PASSWORD='new-password' node scripts/create-admin.js
//
// Never hardcode credentials in this file — it is committed to git.

const { PrismaClient } = require("@prisma/client");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

// Node does not read .env on its own, and AUTH_SECRET has to match the value
// the app runs with or the new password will never work at login.
function loadEnvFile() {
  const envPath = path.join(__dirname, "..", ".env");
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;

    process.env[key] = rawValue.replace(/^["']|["']$/g, "");
  }
}

loadEnvFile();

const prisma = new PrismaClient();

// Must stay identical to hashPassword() in lib/auth.ts.
async function hashPassword(password, authSecret) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + authSecret);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function fail(message) {
  console.error(`\n  ${message}\n`);
  process.exit(1);
}

async function createAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Admin";
  const authSecret = process.env.AUTH_SECRET;

  if (!email || !password) {
    fail(
      "Set ADMIN_EMAIL and ADMIN_PASSWORD when running this script.\n" +
        "  Example: ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='...' node scripts/create-admin.js"
    );
  }

  // Password hashes are derived from AUTH_SECRET. If it is missing here but set
  // in the app (or vice versa), the resulting hash will never match at login.
  if (!authSecret) {
    fail(
      "AUTH_SECRET is not set. It must be present and identical to the value the app runs with,\n" +
        "  otherwise the password created here will not work at login."
    );
  }

  if (password.length < 12) {
    fail("Choose a password of at least 12 characters.");
  }

  const passwordHash = await hashPassword(password, authSecret);
  const normalizedEmail = email.toLowerCase();

  try {
    const existing = await prisma.admin.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      await prisma.admin.update({
        where: { email: normalizedEmail },
        data: { passwordHash, name, isActive: true },
      });
      console.log(`\n  Password updated for ${normalizedEmail}`);
    } else {
      await prisma.admin.create({
        data: {
          email: normalizedEmail,
          passwordHash,
          name,
          role: "SUPER_ADMIN",
          isActive: true,
        },
      });
      console.log(`\n  Admin account created for ${normalizedEmail}`);
    }

    // Any existing sessions were issued against the old password.
    const { count } = await prisma.adminSession.deleteMany({
      where: { admin: { email: normalizedEmail } },
    });
    if (count > 0) {
      console.log(`  Signed out ${count} existing session(s).`);
    }

    console.log("  You can now log in at /admin\n");
  } catch (error) {
    fail(`Failed: ${error.message}`);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
