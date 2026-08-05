// Points the project at a Postgres database (Render, Neon, Supabase, …).
//
// Usage:
//   node scripts/use-postgres.mjs "postgresql://user:pass@host/db?sslmode=require"
//
// Updates .env and prisma/schema.prisma together, so the connection string and
// the declared provider can never drift apart — that mismatch is what broke the
// build before.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const url = process.argv[2];

if (!url) {
  console.error(
    '\n  Usage: node scripts/use-postgres.mjs "postgresql://user:pass@host/db?sslmode=require"\n'
  );
  process.exit(1);
}

if (!/^postgres(ql)?:\/\//.test(url)) {
  console.error("\n  That does not look like a Postgres connection string.\n");
  process.exit(1);
}

// 1. Point the schema at postgresql.
const schemaPath = path.join(root, "prisma", "schema.prisma");
const schema = fs.readFileSync(schemaPath, "utf8");
const updatedSchema = schema.replace(
  /(datasource\s+db\s*\{[^}]*?provider\s*=\s*)"[^"]+"/,
  '$1"postgresql"'
);

if (updatedSchema === schema && !schema.includes('provider = "postgresql"')) {
  console.error("\n  Could not find the datasource provider in schema.prisma.\n");
  process.exit(1);
}
fs.writeFileSync(schemaPath, updatedSchema);
console.log("  schema.prisma  -> provider = postgresql");

// 2. Point .env at the new database.
const envPath = path.join(root, ".env");
let env = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";
const line = `DATABASE_URL="${url}"`;

env = /^DATABASE_URL\s*=.*$/m.test(env)
  ? env.replace(/^DATABASE_URL\s*=.*$/m, line)
  : `${env.trimEnd()}\n${line}\n`;

fs.writeFileSync(envPath, env);
console.log("  .env           -> DATABASE_URL updated");

// 3. Create the tables and seed the starting data.
const run = (command) => {
  console.log(`\n  $ ${command}`);
  execSync(command, { cwd: root, stdio: "inherit", env: { ...process.env, DATABASE_URL: url } });
};

try {
  run("npx prisma generate");
  run("npx prisma db push");
  run("npx tsx prisma/seed.ts");
} catch {
  console.error(
    "\n  A step failed. Check that the connection string is the *external* one\n" +
      "  from Render and that your IP is allowed to connect.\n"
  );
  process.exit(1);
}

console.log(
  "\n  Done. Next:\n" +
    "    1. Set the same DATABASE_URL and AUTH_SECRET in your hosting dashboard.\n" +
    "    2. Create the admin account:\n" +
    "       ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/create-admin.js\n"
);
