// Node does not read .env on its own, so scripts run with plain `node` would
// otherwise inherit whatever DATABASE_URL happens to be in the shell — which is
// how these scripts once ran against the wrong database.
//
// Import for side effects before creating a PrismaClient:
//   import "./load-env.mjs";

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const envPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  ".env"
);

if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!match) continue;

    const [, key, rawValue] = match;
    // An explicitly exported variable still wins, so a one-off override works.
    if (process.env[key] !== undefined) continue;

    process.env[key] = rawValue.replace(/^["']|["']$/g, "");
  }
}
