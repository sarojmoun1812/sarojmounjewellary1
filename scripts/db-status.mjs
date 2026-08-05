// Prints what is currently in the database. Read-only.
// Usage: node scripts/db-status.mjs [--reset-admins]

import "./load-env.mjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const resetAdmins = process.argv.includes("--reset-admins");

const url = process.env.DATABASE_URL ?? "";
const host = url.replace(/\/\/[^:]+:[^@]+@/, "//***:***@");

async function main() {
  console.log(`\nDatabase: ${host}\n`);

  if (resetAdmins) {
    await prisma.adminSession.deleteMany({});
    const { count } = await prisma.admin.deleteMany({});
    console.log(`  removed ${count} admin account(s) and all sessions`);
  }

  const [products, active, orders, customers, leads, admins] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.customer.count(),
    prisma.lead.count(),
    prisma.admin.count(),
  ]);

  const rate = await prisma.silverRate.findFirst({ orderBy: { updatedAt: "desc" } });
  const settings = await prisma.siteSettings.findUnique({ where: { id: "settings" } });

  console.log(`  products    ${products} (${active} visible on the site)`);
  console.log(`  orders      ${orders}`);
  console.log(`  customers   ${customers}`);
  console.log(`  leads       ${leads}`);
  console.log(`  admins      ${admins}`);
  console.log(`  silver rate ₹${rate?.ratePerGram}/g (${rate?.source})`);
  console.log(
    `  shipping    ₹${settings?.shippingCharge / 100}, free above ₹${
      settings?.freeShippingMin / 100
    }`
  );
  console.log(`  whatsapp    ${settings?.whatsapp}\n`);
}

main()
  .catch((error) => {
    console.error("Failed:", error.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
