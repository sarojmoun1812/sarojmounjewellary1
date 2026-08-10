// Checks that every page renders without a server error.
// Usage: ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/smoke-test-pages.mjs

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

async function getPage(path, cookie) {
  const res = await fetch(`${BASE}${path}`, {
    headers: cookie ? { Cookie: cookie } : {},
    redirect: "manual",
  });
  const html = res.status < 400 ? await res.text() : "";
  return { status: res.status, html, location: res.headers.get("location") };
}

async function main() {
  const product = await prisma.product.findFirst({ where: { isActive: true } });

  // Read the live rate and labour setting rather than assuming a number, so the
  // structured-data check keeps working after the daily refresh moves the rate.
  const [rate, settings] = await Promise.all([
    prisma.silverRate.findFirst({ orderBy: { updatedAt: "desc" } }),
    prisma.siteSettings.findUnique({ where: { id: "settings" } }),
  ]);
  const silverRatePerGram = rate?.ratePerGram ?? 235;
  const labourPerGram = settings?.labourPerGram ?? 100;

  console.log("\n1. Public pages render");
  const publicPaths = [
    "/",
    "/shop",
    `/product/${product.slug}`,
    "/cart",
    "/checkout",
    "/about",
    "/contact",
    "/terms",
    "/privacy",
    "/shipping",
    "/return-policy",
    "/sitemap.xml",
  ];

  for (const path of publicPaths) {
    const page = await getPage(path);
    check(`${path} renders`, page.status === 200, `HTTP ${page.status}`);
  }

  console.log("\n2. Rendered content is correct");
  const shop = await getPage("/shop");
  check(
    "shop page does not render a raw JSON string for images",
    !shop.html.includes('src="["') && !shop.html.includes("%5B%22"),
    "found an unparsed images column in the markup"
  );

  const detail = await getPage(`/product/${product.slug}`);
  check(
    "product page shows a price, not NaN",
    !detail.html.includes("NaN") && /₹|%E2%82%B9/.test(detail.html)
  );
  check(
    "structured data price matches the displayed price",
    (() => {
      const match = detail.html.match(/"price":"([\d.]+)"/);
      if (!match) return false;
      const schemaPrice = Math.round(parseFloat(match[1]) * 100);
      const expected =
        Math.round(
          (Math.round(product.silverWeight * silverRatePerGram * 100) +
            Math.round(labourPerGram * product.silverWeight * 100)) /
            100
        ) * 100;
      return schemaPrice === expected;
    })(),
    "JSON-LD price differs from the page price"
  );
  check(
    "og:image is not the literal '[' character",
    !detail.html.includes('property="og:image" content="["')
  );

  // These guard the Phase 2 cleanup. Each one shipped to customers at some
  // point, so a failure here means invented content has crept back in.
  console.log("\n3. No fabricated content");
  const home = await getPage("/");

  check(
    "product JSON-LD claims no review rating",
    !detail.html.includes("aggregateRating") && !detail.html.includes("ratingValue"),
    "there is no review system, so any rating here is invented"
  );
  check(
    "no invented strikethrough 'original' price",
    !shop.html.includes("line-through") && !home.html.includes("line-through"),
    "a struck-through price implies a discount that was never offered"
  );
  check(
    "no WELCOME500 coupon is promised",
    !home.html.includes("WELCOME500"),
    "the coupon does not exist and nothing redeems it"
  );
  check(
    "no invented customer counts or tenure",
    !/10K\+|10,000\+|25\+ Years|Years of trust/i.test(home.html),
    "these numbers have no source"
  );
  check(
    "no stock photography from image CDNs",
    !home.html.includes("images.unsplash.com") &&
      !shop.html.includes("images.unsplash.com"),
    "stock photos of other people's jewellery imply they are her products"
  );
  check(
    "no placeholder video or developer-facing copy",
    !home.html.includes("samplelib.com") &&
      !/[Pp]laceholder campaign|placeholder video|your real campaign/.test(home.html),
    "text addressed to the developer was visible to shoppers"
  );
  check(
    "no placeholder phone numbers or addresses",
    !/98765 43210|12345 67890|\+91 XXXXX|\[Your Business/.test(
      home.html + shop.html
    ),
    "dummy contact details were shown as real"
  );

  console.log("\n4. Homepage links resolve to real products");
  const homeSlugs = [...home.html.matchAll(/href="\/product\/([a-z0-9-]+)"/g)].map(
    (match) => match[1]
  );
  const realSlugs = new Set(
    (await prisma.product.findMany({ select: { slug: true } })).map((p) => p.slug)
  );
  check(
    "homepage features at least one product",
    homeSlugs.length > 0,
    "the catalogue sections rendered empty"
  );
  check(
    "every featured product link exists in the database",
    homeSlugs.every((slug) => realSlugs.has(slug)),
    `unknown slugs: ${homeSlugs.filter((s) => !realSlugs.has(s)).join(", ")}`
  );

  console.log("\n5. Share assets exist");
  for (const path of ["/icon.svg", "/opengraph-image"]) {
    const res = await fetch(`${BASE}${path}`);
    check(`${path} is served`, res.ok, `HTTP ${res.status}`);
  }

  // The domain was previously typed out by hand in the layout, the sitemap,
  // robots.txt and the structured data. Moving domain would have left some of
  // them pointing at the old one, and a wrong URL in a share preview is not
  // visible until a customer taps it and lands nowhere.
  console.log("\n6. Public URLs all follow the configured domain");
  const origin = (process.env.NEXT_PUBLIC_BASE_URL || BASE).replace(/\/+$/, "");

  const robots = await fetch(`${BASE}/robots.txt`);
  const robotsBody = await robots.text();
  check("robots.txt is served", robots.ok, `HTTP ${robots.status}`);
  check(
    "robots.txt points at the configured sitemap",
    robotsBody.includes(`${origin}/sitemap.xml`),
    robotsBody.split("\n").find((l) => l.startsWith("Sitemap"))
  );
  check("robots.txt keeps admin and api out of the index",
    robotsBody.includes("/admin") && robotsBody.includes("/api"));

  const sitemapBody = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const foreignLoc = [...sitemapBody.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1])
    .find((url) => !url.startsWith(origin));
  check("every sitemap URL uses the configured domain", !foreignLoc, foreignLoc);

  const pagesWithUrls = [
    ["homepage", (await getPage("/")).html],
    ["product page", (await getPage(`/product/${product.slug}`)).html],
  ];
  for (const [label, html] of pagesWithUrls) {
    check(`${label} canonical and JSON-LD use the configured domain`, html.includes(origin));
    // Matches her real domain and the sarojmoun.com the code used to assume.
    const literalDomain = /https:\/\/(www\.)?sarojmoun(jewellary)?\.com/;
    if (!literalDomain.test(origin)) {
      check(
        `${label} has no domain hardcoded past the config`,
        !literalDomain.test(html)
      );
    }
  }

  console.log("\n7. Admin pages require a session");
  for (const path of ["/admin", "/admin/products", "/admin/orders"]) {
    const page = await getPage(path);
    const redirected = page.status >= 300 && page.status < 400;
    check(
      `${path} redirects when signed out`,
      redirected,
      `HTTP ${page.status} -> ${page.location}`
    );
  }

  console.log("\n8. Admin pages render when signed in");
  const login = await fetch(`${BASE}/api/admin/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    }),
  });
  const cookie = (login.headers.get("set-cookie") || "").split(";")[0];
  check("logged in for admin page checks", login.status === 200);

  for (const path of [
    "/admin",
    "/admin/products",
    "/admin/orders",
    "/admin/leads",
    "/admin/customers",
    "/admin/messages",
    "/admin/settings",
    "/admin/products/new",
  ]) {
    const page = await getPage(path, cookie);
    check(`${path} renders`, page.status === 200, `HTTP ${page.status}`);
  }

  const adminProducts = await getPage("/admin/products", cookie);
  check(
    "admin product list shows product names",
    adminProducts.html.includes(product.name),
    "product name missing from the list page"
  );

  const editPage = await getPage(`/admin/products/${product.id}`, cookie);
  check("admin edit page renders", editPage.status === 200, `HTTP ${editPage.status}`);

  await prisma.adminSession.deleteMany({});

  console.log(`\n${passed} passed, ${failed} failed\n`);
  process.exitCode = failed > 0 ? 1 : 0;
}

main()
  .catch((error) => {
    console.error("\nPage smoke test crashed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
