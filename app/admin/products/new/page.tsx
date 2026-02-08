"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSilverRate } from "@/lib/use-silver-rate";
import { calculateProductPrice, formatPrice } from "@/lib/pricing";
import Image from "next/image";
import {
  ArrowLeft,
  Upload,
  X,
  Plus,
  Save,
  Loader2,
  ImagePlus,
} from "lucide-react";
import Link from "next/link";

const categories = [
  "Necklaces",
  "Earrings",
  "Rings",
  "Bracelets",
  "Bangles",
  "Anklets",
  "Pendants",
  "Chains",
  "Temple Jewellery",
  "Oxidized",
  "Sets",
];

export default function NewProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [videos, setVideos] = useState<string[]>([]);
  const [uploadingVideos, setUploadingVideos] = useState(false);
  // Silver rate for live price preview
  const { silverRate } = useSilverRate();

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    silverWeight: "",
    makingCharges: "",
    profitPerGram: "100",
    fixedPrice: "",
    category: "",
    stock: "0",
    material: "925 Silver",
    featured: false,
    bestseller: false,
    isActive: true,
    metaTitle: "",
    metaDescription: "",
    tags: "",
  });

  // Live price preview
  const [pricePreview, setPricePreview] = useState<string>("");

  useEffect(() => {
    const weight = parseFloat(formData.silverWeight);
    const making = Math.round(parseFloat(formData.makingCharges) * 100) || 0;
    const profit = parseFloat(formData.profitPerGram) || 100;
    if (!isNaN(weight) && silverRate) {
      const breakdown = calculateProductPrice({
        silverWeight: weight,
        makingCharges: making,
        profitPerGram: profit,
        fixedPrice: formData.fixedPrice ? Math.round(parseFloat(formData.fixedPrice) * 100) : undefined,
      }, silverRate);
      setPricePreview(formatPrice(breakdown.finalPrice));
    } else {
      setPricePreview("");
    }
  }, [formData.silverWeight, formData.makingCharges, formData.profitPerGram, formData.fixedPrice, silverRate]);
  // Video upload handler
  const handleVideoUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploadingVideos(true);
    setError("");
    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        return data.url;
      });
      const uploadedUrls = await Promise.all(uploadPromises);
      setVideos([...videos, ...uploadedUrls]);
    } catch (err) {
      setError("Failed to upload videos");
    } finally {
      setUploadingVideos(false);
    }
  };

  const removeVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    silverWeight: "",
    makingCharges: "",
    profitPerGram: "100",
    fixedPrice: "",
    category: "",
    stock: "0",
    material: "925 Silver",
    featured: false,
    bestseller: false,
    isActive: true,
    metaTitle: "",
    metaDescription: "",
    tags: "",
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      slug: generateSlug(name),
    });
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    setError("");

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error("Upload failed");
        }

        const data = await res.json();
        return data.url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages([...images, ...uploadedUrls]);
    } catch (err) {
      setError("Failed to upload images");
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          images,
          silverWeight: parseFloat(formData.silverWeight),
          makingCharges: Math.round(parseFloat(formData.makingCharges) * 100),
          profitPerGram: parseFloat(formData.profitPerGram),
          fixedPrice: formData.fixedPrice
            ? Math.round(parseFloat(formData.fixedPrice) * 100)
            : null,
          stock: parseInt(formData.stock),
          tags: formData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          videos,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create product");
      }

      router.push("/admin/products");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/products"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-1">
            Create a new product in your catalog
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-powder-500"
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Slug *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-powder-500"
                placeholder="product-url-slug"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-powder-500"
                placeholder="Describe your product..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-powder-500"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Material
              </label>
              <input
                type="text"
                value={formData.material}
                onChange={(e) =>
                  setFormData({ ...formData, material: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-powder-500"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Pricing & Weight
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Silver Weight (grams) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.silverWeight}
                onChange={(e) =>
                  setFormData({ ...formData, silverWeight: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-powder-500"
                placeholder="e.g., 25.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Making Charges (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.makingCharges}
                onChange={(e) =>
                  setFormData({ ...formData, makingCharges: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-powder-500"
                placeholder="e.g., 500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profit Per Gram (₹)
              </label>
              <input
                type="number"
                step="1"
                value={formData.profitPerGram}
                onChange={(e) =>
                  setFormData({ ...formData, profitPerGram: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-powder-500"
                placeholder="e.g., 100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fixed Price (₹) - Optional
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.fixedPrice}
                onChange={(e) =>
                  setFormData({ ...formData, fixedPrice: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-powder-500"
                placeholder="Override dynamic pricing"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock *
              </label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-powder-500"
              />
            </div>
          </div>
          {/* Live Price Preview */}
          <div className="mt-4">
            <span className="text-sm text-gray-700 font-medium">Live Price Preview: </span>
            <span className="text-lg font-bold text-powder-600">{pricePreview || "-"}</span>
          </div>
        </div>
        {/* Videos */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Product Videos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {videos.map((url, index) => (
              <div key={index} className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden group">
                <video src={url} controls className="object-cover w-full h-full" />
                <button
                  type="button"
                  onClick={() => removeVideo(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            <label
              className={`aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-powder-500 transition-colors ${uploadingVideos ? "opacity-50 pointer-events-none" : ""}`}
            >
              <input
                type="file"
                className="hidden"
                accept="video/*"
                multiple
                onChange={(e) => handleVideoUpload(e.target.files)}
              />
              {uploadingVideos ? (
                <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
              ) : (
                <>
                  <Play className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-500 mt-2">Add Video</span>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Product Images
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((url, index) => (
              <div
                key={index}
                className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group"
              >
                <Image
                  src={url}
                  alt={`Product ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
                    Main
                  </span>
                )}
              </div>
            ))}
            <label
              className={`aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-powder-500 transition-colors ${
                uploadingImages ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e.target.files)}
              />
              {uploadingImages ? (
                <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
              ) : (
                <>
                  <ImagePlus className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-500 mt-2">Add Image</span>
                </>
              )}
            </label>
          </div>
        </div>

        {/* Flags */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Visibility & Flags
          </h2>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="w-5 h-5 rounded border-gray-300 text-powder-600 focus:ring-powder-500"
              />
              <span className="text-sm text-gray-700">Active (Visible)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) =>
                  setFormData({ ...formData, featured: e.target.checked })
                }
                className="w-5 h-5 rounded border-gray-300 text-powder-600 focus:ring-powder-500"
              />
              <span className="text-sm text-gray-700">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.bestseller}
                onChange={(e) =>
                  setFormData({ ...formData, bestseller: e.target.checked })
                }
                className="w-5 h-5 rounded border-gray-300 text-powder-600 focus:ring-powder-500"
              />
              <span className="text-sm text-gray-700">Bestseller</span>
            </label>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Title
              </label>
              <input
                type="text"
                value={formData.metaTitle}
                onChange={(e) =>
                  setFormData({ ...formData, metaTitle: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-powder-500"
                placeholder="SEO title for search engines"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description
              </label>
              <textarea
                rows={2}
                value={formData.metaDescription}
                onChange={(e) =>
                  setFormData({ ...formData, metaDescription: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-powder-500"
                placeholder="SEO description for search engines"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) =>
                  setFormData({ ...formData, tags: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-powder-500"
                placeholder="silver, ethnic, traditional"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link
            href="/admin/products"
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-2 bg-powder-600 text-white rounded-lg hover:bg-powder-700 transition-colors font-medium disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Create Product
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
