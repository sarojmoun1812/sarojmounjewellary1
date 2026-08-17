"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AlertCircle, Loader2 } from "lucide-react";
import { ProductForm, type ProductFormValues } from "../product-form";

export default function EditProductPage() {
  const params = useParams();
  const productId = params.id as string;

  const [values, setValues] = useState<ProductFormValues | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/api/admin/products/${productId}`);
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          throw new Error(data.error || "Item load nahi hua.");
        }

        // Read from data.product, which is the shape the API returns.
        const product = data.product;
        if (cancelled) return;

        setValues({
          name: product.name ?? "",
          description: product.description ?? "",
          silverWeight: product.silverWeight?.toString() ?? "",
          category: product.category ?? "",
          stock: product.stock?.toString() ?? "0",
          images: Array.isArray(product.images) ? product.images : [],
          videoUrl: product.videoUrl ?? "",
          featured: product.featured ?? false,
          bestseller: product.bestseller ?? false,
          isActive: product.isActive ?? true,
          metaTitle: product.metaTitle ?? "",
          metaDescription: product.metaDescription ?? "",
          tags: Array.isArray(product.tags) ? product.tags.join(", ") : "",
        });
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Item load nahi hua.");
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [productId]);

  if (error) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
        <p className="mt-3 font-medium text-red-800">{error}</p>
        <Link
          href="/admin/products"
          className="mt-4 inline-block rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm"
        >
          Item list par wapas jayein
        </Link>
      </div>
    );
  }

  if (!values) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-gray-500">
        <Loader2 className="h-7 w-7 animate-spin" />
        <p className="text-sm">Item khul raha hai...</p>
      </div>
    );
  }

  return <ProductForm mode="edit" productId={productId} initialValues={values} />;
}
