import { z } from "zod";

/**
 * Product `images` and `tags` are stored as JSON-encoded string arrays rather
 * than native arrays, because the schema has to work on SQLite as well as
 * Postgres. Every read must go through `parseStringArray` and every write
 * through `serializeStringArray` — reading the raw column as if it were an
 * array yields the character "[", which is truthy and fails far from the cause.
 */

/** Placeholder / stock hosts that must never appear as real product photos. */
const DUMMY_IMAGE_MARKERS = [
  "/peacock-jewellery.jpeg",
  "peacock-jewellery.jpeg",
  "images.unsplash.com",
  "via.placeholder.com",
  "samplelib.com",
];

/** True when a URL is a real uploaded photo, not a seed/stock placeholder. */
export function isRealProductImage(url: string): boolean {
  const value = url.trim().toLowerCase();
  if (!value) return false;
  return !DUMMY_IMAGE_MARKERS.some((marker) => value.includes(marker));
}

/** True when a product was added within the last `days` days (default 14). */
export function isNewArrival(
  createdAt: Date | string | null | undefined,
  days = 14
): boolean {
  if (!createdAt) return false;
  const created = new Date(createdAt).getTime();
  if (!Number.isFinite(created)) return false;
  return Date.now() - created < days * 24 * 60 * 60 * 1000;
}

export function parseStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof value !== "string" || value.trim() === "") {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === "string")
      : [];
  } catch {
    return [];
  }
}

export function serializeStringArray(value: unknown): string {
  return JSON.stringify(parseStringArray(value));
}

type RawArrayFields = { images: unknown; tags: unknown };

export type WithParsedArrays<T extends RawArrayFields> = Omit<T, "images" | "tags"> & {
  images: string[];
  tags: string[];
};

/** Turns a Prisma product row into one whose `images`/`tags` are real arrays. */
export function normalizeProduct<T extends RawArrayFields>(product: T): WithParsedArrays<T> {
  return {
    ...product,
    // Drop seed/stock placeholders so the shop never shows dummy jewellery photos.
    images: parseStringArray(product.images).filter(isRealProductImage),
    tags: parseStringArray(product.tags),
  };
}

export function normalizeProducts<T extends RawArrayFields>(
  products: T[]
): WithParsedArrays<T>[] {
  return products.map(normalizeProduct);
}

/**
 * Validation for admin product writes.
 *
 * Money is in paise throughout, matching the schema. The forms are responsible
 * for multiplying rupee input by 100 before it reaches here — these rules
 * cannot detect a value that was simply sent in the wrong unit, so any change
 * to a price field needs checking on both sides.
 */

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const productFields = {
  name: z.string().trim().min(1, "Name is required"),
  slug: z
    .string()
    .trim()
    .min(1, "URL name is required")
    .regex(slugPattern, "Use lowercase letters, numbers and hyphens only"),
  description: z.string().trim().min(1, "Description is required"),
  silverWeight: z.number().positive("Weight must be greater than 0"),
  fixedPrice: z.number().int().positive().nullable(),
  category: z.string().trim().min(1, "Category is required"),
  images: z.array(z.string().trim().min(1)),
  videoUrl: z.union([z.string().trim().url(), z.literal(""), z.null()]),
  stock: z.number().int().min(0),
  material: z.string().trim().min(1),
  featured: z.boolean(),
  bestseller: z.boolean(),
  isActive: z.boolean(),
  metaTitle: z.string().trim().nullable(),
  metaDescription: z.string().trim().nullable(),
  tags: z.array(z.string().trim().min(1)),
};

/**
 * Turns a product name into a URL-safe slug.
 *
 * The admin form no longer asks for a slug. "URL name" meant nothing to the
 * people running the shop, and a mistyped one produced a broken link that only
 * showed up when a customer tapped it.
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const productCreateSchema = z.object({
  ...productFields,
  // Derived from the name when absent, so the form need not ask for it.
  slug: productFields.slug.optional(),
  fixedPrice: productFields.fixedPrice.default(null),
  images: productFields.images.default([]),
  videoUrl: productFields.videoUrl.default(null).transform((value) =>
    value && value.length > 0 ? value : null
  ),
  stock: productFields.stock.default(0),
  material: productFields.material.default("925 Silver"),
  featured: productFields.featured.default(false),
  bestseller: productFields.bestseller.default(false),
  isActive: productFields.isActive.default(true),
  metaTitle: productFields.metaTitle.default(null),
  metaDescription: productFields.metaDescription.default(null),
  tags: productFields.tags.default([]),
});

/** Only the listed keys can be updated — the request body is never spread into Prisma. */
export const productUpdateSchema = z.object(productFields).partial();

export type ProductCreateInput = z.infer<typeof productCreateSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;

/**
 * Maps validated input to Prisma data, encoding the array columns. The slug is
 * passed in separately because resolving a unique one needs the database.
 */
export function toProductCreateData(
  input: ProductCreateInput & { slug: string }
) {
  return {
    ...input,
    videoUrl: input.videoUrl && input.videoUrl.length > 0 ? input.videoUrl : null,
    images: serializeStringArray(input.images),
    tags: serializeStringArray(input.tags),
  };
}

export function toProductUpdateData(input: ProductUpdateInput) {
  const data: Record<string, unknown> = { ...input };
  if (input.images !== undefined) data.images = serializeStringArray(input.images);
  if (input.tags !== undefined) data.tags = serializeStringArray(input.tags);
  if (input.videoUrl !== undefined) {
    data.videoUrl = input.videoUrl && input.videoUrl.length > 0 ? input.videoUrl : null;
  }
  return data;
}
