// Removes stock / dummy product images so the catalogue only shows real photos.
//
// Usage: node scripts/clear-stock-photos.mjs [--dry-run]

import "./load-env.mjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DUMMY_MARKERS = [
  "images.unsplash.com",
  "via.placeholder.com",
  "samplelib.com",
  "sample-videos.com",
  "peacock-jewellery.jpeg",
];

const dryRun = process.argv.includes("--dry-run");

function isDummyPhoto(url) {
  const value = String(url).toLowerCase();
  return DUMMY_MARKERS.some((marker) => value.includes(marker));
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

    const kept = images.filter(
      (url) => typeof url === "string" && url.trim() && !isDummyPhoto(url)
    );
    if (kept.length === images.length) continue;

    changed++;

    console.log(
      `${dryRun ? "would update" : "updating"}  ${product.name}` +
        `\n    ${images.length} image(s) -> ${kept.length}, ` +
        `${images.length - kept.length} dummy photo(s) removed`
    );

    if (!dryRun) {
      await prisma.product.update({
        where: { id: product.id },
        data: { images: JSON.stringify(kept) },
      });
    }
  }

  console.log(
    changed === 0
      ? "\nNo dummy photos found — every product image is her own.\n"
      : `\n${changed} of ${products.length} product(s) ${
          dryRun ? "would be" : "were"
        } updated.\n` +
          "Upload real photographs from the admin panel.\n"
  );
}

main()
  .catch((error) => {
    console.error("Failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
