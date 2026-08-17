import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Eye, EyeOff, ImageOff, Pencil, Plus, Search } from "lucide-react";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { getCurrentAdmin } from "@/lib/auth";
import { containsInsensitive, prisma } from "@/lib/db";
import { calculateProductPrice, formatPrice } from "@/lib/pricing";
import { normalizeProducts } from "@/lib/products";
import { getCurrentSilverRate } from "@/lib/silver-rate";

export const dynamic = "force-dynamic";

/**
 * The item list.
 *
 * A six-column table used to live here, which meant sideways scrolling on the
 * phone this is mostly used from — and the price, the number they most want to
 * check, was not shown at all. Cards fit a narrow screen and each one carries
 * the live price so they can confirm at a glance that a piece is priced sanely.
 */

async function getProducts(search?: string, category?: string) {
  const where: any = {};

  if (search) {
    where.OR = [
      { name: containsInsensitive(search) },
      { category: containsInsensitive(search) },
    ];
  }

  if (category) {
    where.category = category;
  }

  return prisma.product.findMany({ where, orderBy: { createdAt: "desc" } });
}

async function getCategories() {
  const rows = await prisma.product.findMany({
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  return rows.map((row) => row.category);
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { search?: string; category?: string };
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const [rawProducts, categories, silverRate] = await Promise.all([
    getProducts(searchParams.search, searchParams.category),
    getCategories(),
    getCurrentSilverRate(),
  ]);

  const products = normalizeProducts(rawProducts).map((product) => ({
    ...product,
    price: calculateProductPrice(
      {
        silverWeight: product.silverWeight,
        fixedPrice: product.fixedPrice ?? undefined,
      },
      silverRate.ratePerGram,
      silverRate.labourPerGram
    ).finalPrice,
  }));

  const isFiltered = Boolean(searchParams.search || searchParams.category);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 sm:text-2xl">Saara saaman</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {products.length} item website par hain · chandi ka aaj ka rate ₹
            {silverRate.ratePerGram}/g
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Naya item jodein
        </Link>
      </div>

      <form className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            name="search"
            defaultValue={searchParams.search}
            placeholder="Item ka naam likhein..."
            aria-label="Item dhoondhein"
            className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
        </div>
        <select
          name="category"
          defaultValue={searchParams.category}
          aria-label="Category chunein"
          className="rounded-xl border border-slate-200 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        >
          <option value="">Sabhi category</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="rounded-xl bg-slate-100 px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-200"
        >
          Dhoondhein
        </button>
      </form>

      {products.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
          <p className="font-medium text-slate-700">
            {isFiltered ? "Koi item nahi mila." : "Abhi koi item nahi hai."}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {isFiltered
              ? "Doosra naam ya category try karein."
              : "Pehla item jodkar shuru karein."}
          </p>
          {isFiltered ? (
            <Link
              href="/admin/products"
              className="mt-4 inline-block rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-medium text-slate-700"
            >
              Poori list dekhein
            </Link>
          ) : (
            <Link
              href="/admin/products/new"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              Naya item jodein
            </Link>
          )}
        </div>
      ) : (
        <ul className="space-y-3">
          {products.map((product) => (
            <li
              key={product.id}
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-3 sm:p-4"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                {product.images[0] ? (
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-1 text-slate-400">
                    <ImageOff className="h-5 w-5" />
                    <span className="text-[10px]">Photo nahi</span>
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-900">
                  {product.name}
                </p>
                <p className="mt-0.5 text-sm text-slate-500">
                  {product.category} · {product.silverWeight}g chandi
                </p>
                <p className="mt-1 font-semibold text-emerald-700">
                  {formatPrice(product.price)}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      product.stock > 0
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    {product.stock > 0
                      ? `${product.stock} piece hain`
                      : "Stock khatam"}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                      product.isActive
                        ? "bg-slate-100 text-slate-600"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {product.isActive ? (
                      <>
                        <Eye className="h-3 w-3" />
                        Website par hai
                      </>
                    ) : (
                      <>
                        <EyeOff className="h-3 w-3" />
                        Chhupa hua
                      </>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 flex-col gap-2">
                <Link
                  href={`/admin/products/${product.id}`}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                >
                  <Pencil className="h-4 w-4" />
                  Badlein
                </Link>
                <Link
                  href={`/product/${product.slug}`}
                  target="_blank"
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                >
                  <Eye className="h-4 w-4" />
                  Dekhein
                </Link>
                <DeleteProductButton
                  productId={product.id}
                  productName={product.name}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
