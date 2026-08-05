// Smoke test for the admin product management flow.
// Usage: ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/smoke-test-admin.mjs

import "./load-env.mjs";
import { PrismaClient } from "@prisma/client";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const EMAIL = process.env.ADMIN_EMAIL;
const PASSWORD = process.env.ADMIN_PASSWORD;
const prisma = new PrismaClient();

let passed = 0;
let failed = 0;
let cookie = "";

function check(label, condition, detail = "") {
  if (condition) {
    passed++;
    console.log(`  PASS  ${label}`);
  } else {
    failed++;
    console.log(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

async function api(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const setCookie = res.headers.get("set-cookie");
  if (setCookie) cookie = setCookie.split(";")[0];

  let json = null;
  try {
    json = await res.json();
  } catch {
    /* non-JSON */
  }
  return { status: res.status, json };
}

const SLUG = "smoke-test-piece";

async function main() {
  if (!EMAIL || !PASSWORD) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD.");

  await prisma.product.deleteMany({ where: { slug: SLUG } });

  console.log("\n1. Login");
  const login = await api("POST", "/api/admin/auth", {
    email: EMAIL,
    password: PASSWORD,
  });
  check("admin can log in", login.status === 200, `got ${login.status}`);
  check("session cookie issued", cookie.startsWith("admin_session="));

  const badLogin = await fetch(`${BASE}/api/admin/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: "definitely-wrong" }),
  });
  check("wrong password rejected", badLogin.status === 401, `got ${badLogin.status}`);

  console.log("\n2. Creating a product (previously failed on array columns)");
  const created = await api("POST", "/api/admin/products", {
    name: "Smoke Test Piece",
    slug: SLUG,
    description: "Created by the admin smoke test.",
    category: "Rings",
    silverWeight: 10,
    makingCharges: 50000, // ₹500 in paise
    profitPerGram: 100,
    images: ["https://res.cloudinary.com/demo/image/upload/sample.jpg"],
    tags: ["test", "silver"],
    stock: 7,
    material: "925 Silver",
    featured: false,
    bestseller: false,
    isActive: true,
    metaTitle: "",
    metaDescription: "",
    videos: ["should-be-ignored"],
  });

  check("product created", created.status === 201, JSON.stringify(created.json));
  check(
    "images returned as an array, not a JSON string",
    Array.isArray(created.json?.product?.images),
    JSON.stringify(created.json?.product?.images)
  );
  check("tags returned as an array", Array.isArray(created.json?.product?.tags));
  check("stock saved", created.json?.product?.stock === 7);

  const stored = await prisma.product.findUnique({ where: { slug: SLUG } });
  check(
    "images stored as valid JSON in the database",
    (() => {
      try {
        return Array.isArray(JSON.parse(stored.images));
      } catch {
        return false;
      }
    })(),
    stored?.images
  );
  check("unknown field 'videos' stripped", !("videos" in stored));

  const productId = created.json?.product?.id;

  console.log("\n3. Validation");
  const dupe = await api("POST", "/api/admin/products", {
    name: "Dupe",
    slug: SLUG,
    description: "x",
    category: "Rings",
    silverWeight: 1,
    makingCharges: 1,
  });
  check("duplicate slug rejected", dupe.status === 400, `got ${dupe.status}`);

  const badSlug = await api("POST", "/api/admin/products", {
    name: "Bad",
    slug: "Not A Slug!",
    description: "x",
    category: "Rings",
    silverWeight: 1,
    makingCharges: 1,
  });
  check("malformed slug rejected", badSlug.status === 400, `got ${badSlug.status}`);

  const negWeight = await api("POST", "/api/admin/products", {
    name: "Bad",
    slug: "negative-weight",
    description: "x",
    category: "Rings",
    silverWeight: -5,
    makingCharges: 1,
  });
  check("negative weight rejected", negWeight.status === 400, `got ${negWeight.status}`);

  console.log("\n4. Reading it back (what the edit form does)");
  const fetched = await api("GET", `/api/admin/products/${productId}`);
  check("single product fetch works", fetched.status === 200);
  check(
    "response is wrapped in { product }",
    !!fetched.json?.product?.name,
    JSON.stringify(Object.keys(fetched.json ?? {}))
  );
  check("images are an array on read", Array.isArray(fetched.json?.product?.images));
  check(
    "making charges are in paise (₹500 => 50000)",
    fetched.json?.product?.makingCharges === 50000,
    `got ${fetched.json?.product?.makingCharges}`
  );

  console.log("\n5. Editing (previously sent PUT to a PATCH-only route)");
  const putRes = await fetch(`${BASE}/api/admin/products/${productId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Cookie: cookie },
    body: JSON.stringify({ name: "x" }),
  });
  check("PUT is not accepted (405)", putRes.status === 405, `got ${putRes.status}`);

  const updated = await api("PATCH", `/api/admin/products/${productId}`, {
    name: "Smoke Test Piece (edited)",
    makingCharges: 75000, // ₹750 in paise
    stock: 3,
    tags: ["updated"],
  });
  check("PATCH succeeds", updated.status === 200, JSON.stringify(updated.json));
  check("name updated", updated.json?.product?.name === "Smoke Test Piece (edited)");
  check(
    "making charges updated in paise",
    updated.json?.product?.makingCharges === 75000,
    `got ${updated.json?.product?.makingCharges}`
  );
  check("stock updated", updated.json?.product?.stock === 3);
  check(
    "tags round-trip as an array",
    Array.isArray(updated.json?.product?.tags) &&
      updated.json.product.tags[0] === "updated"
  );

  console.log("\n6. Mass assignment is blocked");
  const massAssign = await api("PATCH", `/api/admin/products/${productId}`, {
    id: "hijacked-id",
    createdAt: "1990-01-01T00:00:00.000Z",
    stock: 4,
  });
  const afterMass = await prisma.product.findUnique({ where: { slug: SLUG } });
  check("request succeeds", massAssign.status === 200);
  check("id could not be overwritten", afterMass?.id === productId, afterMass?.id);
  check(
    "createdAt could not be overwritten",
    afterMass?.createdAt.getFullYear() !== 1990,
    String(afterMass?.createdAt)
  );

  console.log("\n7. Admin product list");
  const list = await api("GET", "/api/admin/products");
  check("list returns 200", list.status === 200);
  check(
    "every product has array images (the list page crashed on this)",
    Array.isArray(list.json?.products) &&
      list.json.products.every((p) => Array.isArray(p.images)),
    "some product still has a raw string"
  );

  console.log("\n8. Silver rate override");
  const badRate = await api("POST", "/api/silver-rate", { ratePerGram: 999999 });
  check("implausible rate rejected", badRate.status === 400, `got ${badRate.status}`);

  const goodRate = await api("POST", "/api/silver-rate", { ratePerGram: 240 });
  check("valid rate accepted", goodRate.status === 200, JSON.stringify(goodRate.json));

  console.log("\n9. Delete");
  const del = await api("DELETE", `/api/admin/products/${productId}`);
  check("product deleted", del.status === 200);
  check(
    "gone from the database",
    (await prisma.product.findUnique({ where: { slug: SLUG } })) === null
  );

  console.log("\n10. Cleanup");
  await prisma.silverRate.deleteMany({ where: { source: { startsWith: "Manual" } } });
  await prisma.adminSession.deleteMany({});
  console.log("  test data removed, sessions cleared");

  console.log(`\n${passed} passed, ${failed} failed\n`);
  process.exitCode = failed > 0 ? 1 : 0;
}

main()
  .catch((error) => {
    console.error("\nAdmin smoke test crashed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
