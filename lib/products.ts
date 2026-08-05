import { z } from "zod";

/**
 * Product `images` and `tags` are stored as JSON-encoded string arrays rather
 * than native arrays, because the schema has to work on SQLite as well as
 * Postgres. Every read must go through `parseStringArray` and every write
 * through `serializeStringArray` — reading the raw column as if it were an
 * array yields the character "[", which is truthy and fails far from the cause.
 */

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
    images: parseStringArray(product.images),
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
  makingCharges: z.number().int().min(0),
  profitPerGram: z.number().min(0),
  fixedPrice: z.number().int().positive().nullable(),
  category: z.string().trim().min(1, "Category is required"),
  images: z.array(z.string().trim().min(1)),
  stock: z.number().int().min(0),
  material: z.string().trim().min(1),
  featured: z.boolean(),
  bestseller: z.boolean(),
  isActive: z.boolean(),
  metaTitle: z.string().trim().nullable(),
  metaDescription: z.string().trim().nullable(),
  tags: z.array(z.string().trim().min(1)),
};

export const productCreateSchema = z.object({
  ...productFields,
  profitPerGram: productFields.profitPerGram.default(100),
  fixedPrice: productFields.fixedPrice.default(null),
  images: productFields.images.default([]),
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

/** Maps validated input to Prisma data, encoding the array columns. */
export function toProductCreateData(input: ProductCreateInput) {
  return {
    ...input,
    images: serializeStringArray(input.images),
    tags: serializeStringArray(input.tags),
  };
}

export function toProductUpdateData(input: ProductUpdateInput) {
  const data: Record<string, unknown> = { ...input };
  if (input.images !== undefined) data.images = serializeStringArray(input.images);
  if (input.tags !== undefined) data.tags = serializeStringArray(input.tags);
  return data;
}
