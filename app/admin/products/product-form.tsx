"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Camera,
  ChevronDown,
  Loader2,
  Save,
  Star,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { calculateProductPrice, formatPrice } from "@/lib/pricing";
import { useSilverRate } from "@/lib/use-silver-rate";

/**
 * The one screen the shop is actually run from.
 *
 * It is written for two people who are not comfortable with computers, so the
 * design rules here are deliberate and worth keeping:
 *
 *  - Photos come first, because that is how they think about a piece.
 *  - There is exactly one number that decides the price: the weight in grams.
 *    Making charges, profit per gram, a fixed price override and the URL slug
 *    were all removed from this form. Every one of them was a second way to get
 *    the price wrong, and none of them matched how she actually prices.
 *  - The price is shown in large type as they type the weight, so the result is
 *    never a surprise after saving.
 *  - Anything only needed for Google is folded away out of sight.
 *  - Labels are Hinglish, the way they speak, not translated Hindi.
 */

const CATEGORIES = [
  "Necklaces",
  "Earrings",
  "Rings",
  "Kadas",
  "Bracelets",
  "Bangles",
  "Anklets",
  "Pendants",
  "Chains",
  "Temple Jewellery",
  "Oxidized",
  "Jewellery Sets",
  "Bridal Collection",
];

export type ProductFormValues = {
  name: string;
  description: string;
  silverWeight: string;
  category: string;
  stock: string;
  images: string[];
  videoUrl: string;
  featured: boolean;
  bestseller: boolean;
  isActive: boolean;
  metaTitle: string;
  metaDescription: string;
  tags: string;
};

export const EMPTY_PRODUCT: ProductFormValues = {
  name: "",
  description: "",
  silverWeight: "",
  category: "",
  stock: "1",
  images: [],
  videoUrl: "",
  featured: false,
  bestseller: false,
  isActive: true,
  metaTitle: "",
  metaDescription: "",
  tags: "",
};

type Props = {
  mode: "new" | "edit";
  productId?: string;
  initialValues?: ProductFormValues;
};

export function ProductForm({ mode, productId, initialValues }: Props) {
  const router = useRouter();
  const { silverRate, labourPerGram } = useSilverRate();

  const [values, setValues] = useState<ProductFormValues>(
    initialValues ?? EMPTY_PRODUCT
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [error, setError] = useState("");
  const [showExtras, setShowExtras] = useState(false);

  useEffect(() => {
    if (initialValues) setValues(initialValues);
  }, [initialValues]);

  const set = <K extends keyof ProductFormValues>(
    key: K,
    value: ProductFormValues[K]
  ) => setValues((current) => ({ ...current, [key]: value }));

  const preview = useMemo(() => {
    const weight = parseFloat(values.silverWeight);
    if (!Number.isFinite(weight) || weight <= 0 || !silverRate) return null;
    return calculateProductPrice({ silverWeight: weight }, silverRate, labourPerGram);
  }, [values.silverWeight, silverRate, labourPerGram]);

  const uploadFile = async (file: File): Promise<string> => {
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.error || "Upload nahi hua.");
    }
    return data.url as string;
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files?.length) return;

    setUploadingImages(true);
    setError("");

    // One at a time so a single bad file does not discard the rest.
    const uploaded: string[] = [];
    let failure = "";

    for (const file of Array.from(files)) {
      try {
        uploaded.push(await uploadFile(file));
      } catch (err) {
        failure =
          err instanceof Error
            ? err.message
            : "Internet check karein, photo upload nahi hui.";
      }
    }

    if (uploaded.length) {
      setValues((current) => ({
        ...current,
        images: [...current.images, ...uploaded],
      }));
    }
    if (failure) setError(failure);

    setUploadingImages(false);
  };

  const handleVideoUpload = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    setError("");

    try {
      const url = await uploadFile(file);
      set("videoUrl", url);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Internet check karein, video upload nahi hui."
      );
    } finally {
      setUploadingVideo(false);
    }
  };

  const removeImage = (index: number) =>
    setValues((current) => ({
      ...current,
      images: current.images.filter((_, i) => i !== index),
    }));

  const makeMainImage = (index: number) =>
    setValues((current) => {
      const images = [...current.images];
      const [chosen] = images.splice(index, 1);
      return { ...current, images: [chosen, ...images] };
    });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    const weight = parseFloat(values.silverWeight);
    if (!Number.isFinite(weight) || weight <= 0) {
      setError("Chandi ka weight grams mein daalein (jaise 25.5).");
      return;
    }

    setSaving(true);

    // Only the fields this form owns are sent. The payload is never the raw
    // form state, so a stray key cannot reach the database.
    const payload = {
      name: values.name.trim(),
      description: values.description.trim(),
      silverWeight: weight,
      category: values.category,
      stock: parseInt(values.stock, 10) || 0,
      images: values.images,
      videoUrl: values.videoUrl.trim() || null,
      material: "925 Silver",
      featured: values.featured,
      bestseller: values.bestseller,
      isActive: values.isActive,
      metaTitle: values.metaTitle.trim() || null,
      metaDescription: values.metaDescription.trim() || null,
      tags: values.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch(
        mode === "edit" ? `/api/admin/products/${productId}` : "/api/admin/products",
        {
          method: mode === "edit" ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || "Save nahi hua. Dobara koshish karein.");
      }

      router.push("/admin/products");
    } catch (err) {
      // The form keeps everything they typed, so a failure never costs them
      // their work.
      setError(err instanceof Error ? err.message : "Kuch galat ho gaya.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!productId) return;
    if (!confirm(`"${values.name}" ko hamesha ke liye hata dein?`)) return;

    setDeleting(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete nahi hua.");
      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete nahi hua.");
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl pb-28">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/admin/products"
          aria-label="Wapas jayein"
          className="rounded-xl p-2.5 text-gray-600 transition-colors hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            {mode === "edit" ? "Item badlein" : "Naya item jodein"}
          </h1>
          <p className="mt-0.5 text-sm text-gray-500">
            Sirf photo, naam aur chandi ka weight — price khud ban jayega.
          </p>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="text-base font-semibold text-gray-900">
            1. Photos aur video
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Kai photos ek saath select kar sakte hain. Pehli photo website par
            dikhegi. Video optional hai — item ghumate hue dikhana achha lagta hai.
          </p>

          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {values.images.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="group relative aspect-square overflow-hidden rounded-xl border border-gray-200 bg-gray-100"
              >
                <Image
                  src={url}
                  alt={`Photo ${index + 1}`}
                  fill
                  sizes="150px"
                  className="object-cover"
                />

                {index === 0 ? (
                  <span className="absolute bottom-1.5 left-1.5 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                    Main
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => makeMainImage(index)}
                    aria-label="Isko main photo banayein"
                    className="absolute bottom-1.5 left-1.5 rounded-full bg-black/60 p-1.5 text-white"
                  >
                    <Star className="h-3.5 w-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  aria-label="Photo hatayein"
                  className="absolute right-1.5 top-1.5 rounded-full bg-red-600 p-1.5 text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}

            <label
              className={`flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 transition-colors hover:border-emerald-500 hover:text-emerald-600 ${
                uploadingImages ? "pointer-events-none opacity-50" : ""
              }`}
            >
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={(event) => {
                  handleImageUpload(event.target.files);
                  event.target.value = "";
                }}
              />
              {uploadingImages ? (
                <>
                  <Loader2 className="h-7 w-7 animate-spin" />
                  <span className="text-xs">Ho raha hai...</span>
                </>
              ) : (
                <>
                  <Camera className="h-7 w-7" />
                  <span className="text-xs font-medium">Photos jodein</span>
                  <span className="px-1 text-center text-[10px] leading-tight">
                    Kai ek saath
                  </span>
                </>
              )}
            </label>
          </div>

          <div className="mt-5 border-t border-gray-100 pt-5">
            <p className="text-sm font-medium text-gray-800">Video (optional)</p>
            <p className="mt-0.5 text-xs text-gray-500">
              MP4 ya WebM, 40 MB tak. Ek hi video.
            </p>

            {values.videoUrl ? (
              <div className="relative mt-3 overflow-hidden rounded-xl border border-gray-200 bg-black">
                <video
                  src={values.videoUrl}
                  controls
                  playsInline
                  className="max-h-64 w-full"
                />
                <button
                  type="button"
                  onClick={() => set("videoUrl", "")}
                  aria-label="Video hatayein"
                  className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1.5 text-xs font-medium text-white"
                >
                  <X className="h-3.5 w-3.5" />
                  Hatayein
                </button>
              </div>
            ) : (
              <label
                className={`mt-3 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 px-4 py-8 text-gray-500 transition-colors hover:border-emerald-500 hover:text-emerald-600 ${
                  uploadingVideo ? "pointer-events-none opacity-50" : ""
                }`}
              >
                <input
                  type="file"
                  className="hidden"
                  accept="video/mp4,video/webm,video/quicktime"
                  onChange={(event) => {
                    handleVideoUpload(event.target.files);
                    event.target.value = "";
                  }}
                />
                {uploadingVideo ? (
                  <>
                    <Loader2 className="h-7 w-7 animate-spin" />
                    <span className="text-sm">Video upload ho rahi hai...</span>
                  </>
                ) : (
                  <>
                    <Video className="h-7 w-7" />
                    <span className="text-sm font-medium">Video jodein</span>
                  </>
                )}
              </label>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="text-base font-semibold text-gray-900">
            2. Item ki jaankari
          </h2>

          <div className="mt-4 space-y-4">
            <div>
              <label
                htmlFor="product-name"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Item ka naam
              </label>
              <input
                id="product-name"
                type="text"
                required
                value={values.name}
                onChange={(event) => set("name", event.target.value)}
                placeholder="jaise: Peacock Temple Necklace"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label
                htmlFor="product-category"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Kis category mein hai
              </label>
              <select
                id="product-category"
                required
                value={values.category}
                onChange={(event) => set("category", event.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">Chunein...</option>
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="product-description"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Item ke baare mein likhein
              </label>
              <textarea
                id="product-description"
                required
                rows={4}
                value={values.description}
                onChange={(event) => set("description", event.target.value)}
                placeholder="Design kaisa hai, kis mauke ke liye theek hai..."
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-base focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
              <p className="mt-1.5 text-xs text-gray-500">
                Grahak yahi padhkar samajhta hai. 2-3 line kaafi hai.
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5">
          <h2 className="text-base font-semibold text-gray-900">
            3. Chandi ka weight aur stock
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="product-weight"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Chandi kitne gram hai
              </label>
              <input
                id="product-weight"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0.01"
                required
                value={values.silverWeight}
                onChange={(event) => set("silverWeight", event.target.value)}
                placeholder="jaise: 25.5"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-lg font-semibold focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label
                htmlFor="product-stock"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Kitne piece hain
              </label>
              <input
                id="product-stock"
                type="number"
                inputMode="numeric"
                min="0"
                required
                value={values.stock}
                onChange={(event) => set("stock", event.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-lg font-semibold focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
              <p className="mt-1.5 text-xs text-gray-500">
                0 karne par website par &quot;Out of Stock&quot; dikhega.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-xl bg-emerald-50 p-4">
            <p className="text-sm font-medium text-emerald-900">
              Is item ka price
            </p>
            <p className="mt-1 text-3xl font-bold text-emerald-700">
              {preview ? formatPrice(preview.finalPrice) : "—"}
            </p>
            {preview ? (
              <p className="mt-2 text-xs leading-relaxed text-emerald-800">
                Chandi {values.silverWeight}g × ₹{preview.silverRatePerGram}/g ={" "}
                {formatPrice(preview.silverCost)}
                <br />
                Majoori {values.silverWeight}g × ₹{preview.labourPerGram}/g ={" "}
                {formatPrice(preview.labour)}
              </p>
            ) : (
              <p className="mt-2 text-xs text-emerald-800">
                Weight daalte hi price yahan dikh jayega.
              </p>
            )}
            <p className="mt-2 text-xs text-emerald-700">
              Chandi ka rate roz apne aap badalta hai, isliye price bhi apne aap
              badal jayega.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white">
          <button
            type="button"
            onClick={() => setShowExtras((open) => !open)}
            aria-expanded={showExtras}
            className="flex w-full items-center justify-between p-5 text-left"
          >
            <span>
              <span className="text-base font-semibold text-gray-900">
                Extra settings
              </span>
              <span className="mt-0.5 block text-sm text-gray-500">
                Zaroori nahi hai — chhod dein to bhi chalega
              </span>
            </span>
            <ChevronDown
              className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${
                showExtras ? "rotate-180" : ""
              }`}
            />
          </button>

          {showExtras && (
            <div className="space-y-5 border-t border-gray-100 p-5">
              <div className="space-y-3">
                <Toggle
                  label="Website par dikhayein"
                  hint="Band karne par item website se chhup jayega"
                  checked={values.isActive}
                  onChange={(checked) => set("isActive", checked)}
                />
                <Toggle
                  label="Home page par dikhayein"
                  hint="Khaas item, jo pehle page par aaye"
                  checked={values.featured}
                  onChange={(checked) => set("featured", checked)}
                />
                <Toggle
                  label="Bestseller ka tag lagayein"
                  hint="Jo item sabse zyada bikta hai"
                  checked={values.bestseller}
                  onChange={(checked) => set("bestseller", checked)}
                />
              </div>

              <div>
                <label
                  htmlFor="product-tags"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Search ke shabd
                </label>
                <input
                  id="product-tags"
                  type="text"
                  value={values.tags}
                  onChange={(event) => set("tags", event.target.value)}
                  placeholder="chandi, shaadi, temple"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
                <p className="mt-1.5 text-xs text-gray-500">
                  Comma lagakar likhein. Google par dhoondhne mein madad karta hai.
                </p>
              </div>

              <div>
                <label
                  htmlFor="product-meta-title"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Google par dikhne wala title
                </label>
                <input
                  id="product-meta-title"
                  type="text"
                  value={values.metaTitle}
                  onChange={(event) => set("metaTitle", event.target.value)}
                  placeholder="khaali chhod dein to naam use hoga"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              <div>
                <label
                  htmlFor="product-meta-description"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Google par dikhne wali chhoti line
                </label>
                <textarea
                  id="product-meta-description"
                  rows={2}
                  value={values.metaDescription}
                  onChange={(event) => set("metaDescription", event.target.value)}
                  placeholder="khaali chhod dein to upar ki jaankari use hogi"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
              </div>

            </div>
          )}
        </section>

        {mode === "edit" && (
          <section className="rounded-2xl border border-red-200 bg-red-50/60 p-5">
            <h2 className="text-base font-semibold text-red-800">
              Item delete karein
            </h2>
            <p className="mt-1 text-sm text-red-700/80">
              Delete karne par ye list se hat jayega. Agar pehle orders aa chuke
              hain to sirf website se chhup jayega.
            </p>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              Item hamesha ke liye hatayein
            </button>
          </section>
        )}

        {/* Pinned so the save button is reachable without scrolling to the end
            of a long form on a phone. */}
        <div className="fixed inset-x-0 bottom-0 border-t border-gray-200 bg-white/95 p-4 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center gap-3">
            <Link
              href="/admin/products"
              className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving || uploadingImages || uploadingVideo}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Save ho raha hai...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  {mode === "edit" ? "Badlaav save karein" : "Item save karein"}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-5 w-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
      />
      <span>
        <span className="block text-sm font-medium text-gray-800">{label}</span>
        <span className="block text-xs text-gray-500">{hint}</span>
      </span>
    </label>
  );
}
