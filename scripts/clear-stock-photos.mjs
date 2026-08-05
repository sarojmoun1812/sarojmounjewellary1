// Replaces stock-photo product images with an obvious placeholder.
//
// The catalogue was seeded with Unsplash photos of other people's jewellery.
// The licence permits commercial use, but a customer who orders from one of
// those photos receives a different item, which is the part that matters. A
// visible placeholder is honest and makes the missing photography obvious.
//
// Usage: node scripts/clear-stock-photos.mjs [--dry-run]

import "./load-env.mjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PLACEHOLDER_IMAGE = "/peacock-jewellery.jpeg";
const STOCK_PHOTO_HOSTS = [
  "images.unsplash.com",
  "via.placeholder.com",
  "samplelib.com",
  "sample-videos.com",
];

const dryRun = process.argv.includes("--dry-run");

function isStockPhoto(url) {
  return STOCK_PHOTO_HOSTS.some((host) => url.includes(host));
}

async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, images: true },
  });

  let changed = 0;

  for (const product of products) {
    let images;
    try {
      images = JSON.parse(product.images);
    } catch {
      images = [];
    }
    if (!Array.isArray(images)) images = [];

    const kept = images.filter((url) => typeof url === "string" && !isStockPhoto(url));
    if (kept.length === images.length) continue;

    const next = kept.length > 0 ? kept : [PLACEHOLDER_IMAGE];
    changed++;

    console.log(
      `${dryRun ? "would update" : "updating"}  ${product.name}` +
        `\n    ${images.length} image(s) -> ${next.length}, ` +
        `${images.length - kept.length} stock photo(s) removed`
    );

    if (!dryRun) {
      await prisma.product.update({
        where: { id: product.id },
        data: { images: JSON.stringify(next) },
      });
    }
  }

  console.log(
    changed === 0
      ? "\nNo stock photos found — every product image is her own.\n"
      : `\n${changed} of ${products.length} product(s) ${
          dryRun ? "would be" : "were"
        } updated.\n` +
          "Upload real photographs from the admin panel to replace the placeholder.\n"
  );
}

main()
  .catch((error) => {
    console.error("Failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
