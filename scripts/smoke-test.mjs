// End-to-end smoke test for the WhatsApp order flow.
// Usage: node scripts/smoke-test.mjs   (requires `npm run dev` to be running)

import "./load-env.mjs";
import { PrismaClient } from "@prisma/client";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const prisma = new PrismaClient();

let passed = 0;
let failed = 0;

function check(label, condition, detail = "") {
  if (condition) {
    passed++;
    console.log(`  PASS  ${label}`);
  } else {
    failed++;
    console.log(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  let json = null;
  try {
    json = await res.json();
  } catch {
    /* non-JSON response */
  }
  return { status: res.status, json };
}

const rupees = (paise) => `₹${(paise / 100).toLocaleString("en-IN")}`;

async function main() {
  const product = await prisma.product.findFirst({
    where: { isActive: true, stock: { gt: 2 } },
  });
  if (!product) throw new Error("No in-stock product to test with.");

  const rate = await prisma.silverRate.findFirst({ orderBy: { updatedAt: "desc" } });
  console.log(`\nProduct: ${product.name} (${product.silverWeight}g, stock ${product.stock})`);
  console.log(`Silver rate: ₹${rate.ratePerGram}/g\n`);

  console.log("1. Cart pricing");
  const expectedUnit = Math.round(
    product.silverWeight * rate.ratePerGram * 100 +
      product.makingCharges +
      product.profitPerGram * product.silverWeight * 100
  );

  const quote = await post("/api/cart/quote", [
    { productId: product.id, quantity: 2 },
  ]);
  check("quote returns 200", quote.status === 200, `got ${quote.status}`);
  check(
    `unit price is server-calculated (${rupees(expectedUnit)})`,
    quote.json?.lines?.[0]?.unitPrice === expectedUnit,
    `got ${quote.json?.lines?.[0]?.unitPrice}`
  );
  check(
    "line total = unit x quantity",
    quote.json?.lines?.[0]?.lineTotal === expectedUnit * 2
  );
  check(
    "free shipping applied above the threshold",
    quote.json?.subtotal >= 299900 ? quote.json?.shipping === 0 : quote.json?.shipping === 9900,
    `subtotal ${quote.json?.subtotal}, shipping ${quote.json?.shipping}`
  );
  check("images parsed as an array", Array.isArray(quote.json?.lines) &&
    (quote.json.lines[0].image === null || typeof quote.json.lines[0].image === "string"),
    `got ${JSON.stringify(quote.json?.lines?.[0]?.image)}`);

  console.log("\n2. Price tampering is ignored");
  const tampered = await post("/api/cart/quote", [
    { productId: product.id, quantity: 2, unitPrice: 1, price: 1, lineTotal: 1 },
  ]);
  check(
    "injected price fields do not change the total",
    tampered.json?.total === quote.json?.total,
    `got ${tampered.json?.total} vs ${quote.json?.total}`
  );

  console.log("\n3. Quantity cannot exceed stock");
  const overStock = await post("/api/cart/quote", [
    { productId: product.id, quantity: 99 },
  ]);
  check(
    "quantity capped at available stock",
    overStock.json?.lines?.[0]?.quantity === Math.min(99, product.stock),
    `got ${overStock.json?.lines?.[0]?.quantity}, stock ${product.stock}`
  );

  console.log("\n4. Order validation");
  const badPhone = await post("/api/orders", {
    customer: { name: "Test", phone: "123" },
    items: [{ productId: product.id, quantity: 1 }],
  });
  check("invalid phone rejected", badPhone.status === 400, `got ${badPhone.status}`);

  const noItems = await post("/api/orders", {
    customer: { name: "Test", phone: "9876543210" },
    items: [],
  });
  check("empty cart rejected", noItems.status === 400, `got ${noItems.status}`);

  const unknownProduct = await post("/api/orders", {
    customer: { name: "Test", phone: "9876543210" },
    items: [{ productId: "does-not-exist", quantity: 1 }],
  });
  check(
    "unknown product rejected",
    unknownProduct.status === 409,
    `got ${unknownProduct.status}`
  );

  console.log("\n5. Placing a real order");
  const stockBefore = (
    await prisma.product.findUnique({ where: { id: product.id } })
  ).stock;

  const order = await post("/api/orders", {
    customer: { name: "Smoke Test", phone: "+91 98765 43210", email: "test@example.com" },
    items: [{ productId: product.id, quantity: 2 }],
    shippingAddress: {
      address: "12 Test Lane",
      city: "Jind",
      state: "Haryana",
      pincode: "126102",
    },
    notes: "Smoke test order",
  });

  check("order created", order.status === 201, `got ${order.status} ${JSON.stringify(order.json)}`);
  check("order number returned", !!order.json?.orderNumber);
  check(
    "order total matches the quote",
    order.json?.total === quote.json?.total,
    `got ${order.json?.total} vs ${quote.json?.total}`
  );
  check(
    "whatsapp link points at her number",
    typeof order.json?.whatsappUrl === "string" &&
      order.json.whatsappUrl.startsWith("https://wa.me/918168790171?text="),
    order.json?.whatsappUrl?.slice(0, 60)
  );

  const decoded = decodeURIComponent(
    (order.json?.whatsappUrl || "").split("?text=")[1] || ""
  );
  check("message contains the order number", decoded.includes(order.json?.orderNumber ?? "x"));
  check("message contains the product name", decoded.includes(product.name));
  check("message contains the total", decoded.includes(rupees(order.json.total).replace("₹", "")));
  check("message contains the address", decoded.includes("126102"));

  const stockAfter = (await prisma.product.findUnique({ where: { id: product.id } })).stock;
  check(
    "stock is not silently decremented by an unconfirmed order",
    stockAfter === stockBefore,
    `${stockBefore} -> ${stockAfter}`
  );

  const saved = await prisma.order.findUnique({
    where: { orderNumber: order.json.orderNumber },
    include: { items: true, customer: true },
  });
  check("order persisted with items", saved?.items?.length === 1);
  check(
    "stored item price matches the server price",
    saved?.items?.[0]?.price === expectedUnit,
    `got ${saved?.items?.[0]?.price}`
  );
  check("phone normalised to 10 digits", saved?.customer?.phone === "9876543210",
    `got ${saved?.customer?.phone}`);
  check("payment method recorded as WHATSAPP", saved?.paymentMethod === "WHATSAPP");

  const lead = await prisma.lead.findFirst({
    where: { phone: "9876543210" },
    orderBy: { createdAt: "desc" },
  });
  check("lead created for the order", lead?.source === "WHATSAPP");

  console.log("\n6. Rate limiting");
  let sawLimit = false;
  for (let i = 0; i < 8; i++) {
    const res = await post("/api/orders", {
      customer: { name: "Flood", phone: "9876543211" },
      items: [{ productId: product.id, quantity: 1 }],
    });
    if (res.status === 429) {
      sawLimit = true;
      break;
    }
  }
  check("order endpoint rate limits repeated submissions", sawLimit);

  console.log("\n7. Cleanup");
  await prisma.orderItem.deleteMany({
    where: { order: { customer: { phone: { in: ["9876543210", "9876543211"] } } } },
  });
  await prisma.order.deleteMany({
    where: { customer: { phone: { in: ["9876543210", "9876543211"] } } },
  });
  await prisma.customer.deleteMany({
    where: { phone: { in: ["9876543210", "9876543211"] } },
  });
  await prisma.lead.deleteMany({
    where: { phone: { in: ["9876543210", "9876543211"] } },
  });
  console.log("  test data removed");

  console.log(`\n${passed} passed, ${failed} failed\n`);
  process.exitCode = failed > 0 ? 1 : 0;
}

main()
  .catch((error) => {
    console.error("\nSmoke test crashed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
