"use client";

import { useState, useEffect } from "react";

// Note: This is a client component, dynamic rendering handled by API calls
import { useRouter } from "next/navigation";
import { Save, Loader2, Lock, Upload } from "lucide-react";

interface Settings {
  siteName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  upiId: string;
  upiPayeeName: string;
  upiQrUrl: string;
  email: string;
  address: string;
  gst: string;
  gstRate: string;
  gstInclusive: boolean;
  labourPerGram: string;
  silverRatePremiumPercent: string;
  shippingCharge: string;
  freeShippingMin: string;
  socialFacebook: string;
  socialInstagram: string;
  socialTwitter: string;
  socialYoutube: string;
  metaTitle: string;
  metaDescription: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [passwordFields, setPasswordFields] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [storedSilverRate, setStoredSilverRate] = useState<number | null>(null);
  const [manualSilverRate, setManualSilverRate] = useState("");
  const [isUpdatingSilverRate, setIsUpdatingSilverRate] = useState(false);
  const [silverRateMessage, setSilverRateMessage] = useState("");

  const [settings, setSettings] = useState<Settings>({
    siteName: "Saroj Moun Jewellery",
    tagline: "",
    phone: "",
    whatsapp: "",
    upiId: "sarojmoun1812-1@okicici",
    upiPayeeName: "Saroj Moun",
    upiQrUrl: "/upi-qr.png",
    email: "",
    address: "",
    gst: "",
    gstRate: "0",
    gstInclusive: false,
    labourPerGram: "130",
    silverRatePremiumPercent: "28",
    shippingCharge: "0",
    freeShippingMin: "",
    socialFacebook: "",
    socialInstagram: "",
    socialTwitter: "",
    socialYoutube: "",
    metaTitle: "",
    metaDescription: "",
  });
  const [isUploadingQr, setIsUploadingQr] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          setSettings({
            siteName: data.settings.siteName || "Saroj Moun Jewellery",
            tagline: data.settings.tagline || "",
            phone: data.settings.phone || "",
            whatsapp: data.settings.whatsapp || "",
            upiId: data.settings.upiId || "sarojmoun1812-1@okicici",
            upiPayeeName: data.settings.upiPayeeName || "Saroj Moun",
            upiQrUrl: data.settings.upiQrUrl || "/upi-qr.png",
            email: data.settings.email || "",
            address: data.settings.address || "",
            gst: data.settings.gst || "",
            gstRate:
              data.settings.gstRate !== undefined && data.settings.gstRate !== null
                ? String(data.settings.gstRate)
                : "0",
            gstInclusive: Boolean(data.settings.gstInclusive),
            labourPerGram:
              data.settings.labourPerGram != null
                ? String(data.settings.labourPerGram)
                : "130",
            silverRatePremiumPercent:
              data.settings.silverRatePremiumPercent != null
                ? String(data.settings.silverRatePremiumPercent)
                : "28",
            shippingCharge: data.settings.shippingCharge
              ? (data.settings.shippingCharge / 100).toString()
              : "0",
            freeShippingMin: data.settings.freeShippingMin
              ? (data.settings.freeShippingMin / 100).toString()
              : "",
            socialFacebook: data.settings.socialFacebook || "",
            socialInstagram: data.settings.socialInstagram || "",
            socialTwitter: data.settings.socialTwitter || "",
            socialYoutube: data.settings.socialYoutube || "",
            metaTitle: data.settings.metaTitle || "",
            metaDescription: data.settings.metaDescription || "",
          });
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));

    fetch("/api/silver-rate")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.ratePerGram === "number") {
          setStoredSilverRate(data.ratePerGram);
          setManualSilverRate(String(Math.round(data.ratePerGram)));
        }
      })
      .catch(() => {});
  }, []);

  const handleUpdateSilverRate = async () => {
    setSilverRateMessage("");
    const rate = parseFloat(manualSilverRate);
    if (!Number.isFinite(rate) || rate < 50 || rate > 5000) {
      setSilverRateMessage("₹50 se ₹5000 ke beech sahi rate daalein.");
      return;
    }

    setIsUpdatingSilverRate(true);
    try {
      const res = await fetch("/api/silver-rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ratePerGram: rate }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Rate update nahi hua.");

      setStoredSilverRate(rate);
      setSilverRateMessage(
        `Chandi ka rate ₹${rate}/gram set ho gaya — saare prices ab isi par hain.`
      );
      router.refresh();
    } catch (err) {
      setSilverRateMessage(
        err instanceof Error ? err.message : "Rate update nahi hua."
      );
    } finally {
      setIsUpdatingSilverRate(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...settings,
          gstRate: parseFloat(settings.gstRate || "0") || 0,
          labourPerGram: parseFloat(settings.labourPerGram || "130") || 130,
          silverRatePremiumPercent:
            parseFloat(settings.silverRatePremiumPercent || "28") || 0,
          shippingCharge: Math.round(parseFloat(settings.shippingCharge || "0") * 100),
          freeShippingMin: settings.freeShippingMin
            ? Math.round(parseFloat(settings.freeShippingMin) * 100)
            : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save settings");
      }

      setSuccess("Settings saved successfully!");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordFields.newPassword.length < 12) {
      setPasswordError("Naya password kam se kam 12 letters ka rakhein.");
      return;
    }
    if (passwordFields.newPassword !== passwordFields.confirmPassword) {
      setPasswordError("Dono naye password ek jaise nahi hain.");
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordFields.currentPassword,
          newPassword: passwordFields.newPassword,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Password nahi badla.");
      }

      setPasswordSuccess("Password badal gaya. Baaki sab jagah se logout ho gaya.");
      setPasswordFields({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setPasswordError(
        err instanceof Error ? err.message : "Password nahi badla."
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleUploadQr = async (file: File | null) => {
    if (!file) return;
    setIsUploadingQr(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "QR upload nahi hua.");
      if (!data.url) throw new Error("Upload URL nahi mili.");
      setSettings((prev) => ({ ...prev, upiQrUrl: data.url }));
      setSuccess("UPI QR upload ho gaya. Settings save karna mat bhoolna.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "QR upload nahi hua.");
    } finally {
      setIsUploadingQr(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-champagne-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
        <p className="text-gray-600 mt-1">
          Configure your store settings and preferences
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-600 px-4 py-3 rounded-lg mb-6">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Pricing sits first because these two numbers set every price in the
            shop, and they are the only settings likely to need changing. */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Price kaise banta hai
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Har item ka price = chandi ka weight × (chandi ka rate + majoori).
            Rate roz API se aata hai, lekin Jind ke asli bhaav ke liye neeche
            manually bhi set kar sakte hain.
          </p>

          <div className="mt-5 rounded-xl border border-emerald-300/60 bg-white/80 p-4">
            <p className="text-sm font-medium text-gray-900">
              Aaj ka chaandi bhaav (₹/gram)
            </p>
            {storedSilverRate != null && (
              <p className="mt-1 text-xs text-gray-500">
                Abhi website par:{" "}
                <span className="font-semibold text-emerald-700">
                  ₹{storedSilverRate.toFixed(2)}/gram
                </span>
              </p>
            )}
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <input
                  id="manual-silver-rate"
                  type="number"
                  inputMode="decimal"
                  step="0.5"
                  min="50"
                  max="5000"
                  value={manualSilverRate}
                  onChange={(e) => setManualSilverRate(e.target.value)}
                  placeholder="Jaise 250"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="mt-1.5 text-xs text-gray-500">
                  Jind / Haryana mein jo rate aap khareedte hain wahi daalein
                  (abhi zyada tar sheher ~₹245–250/g).
                </p>
              </div>
              <button
                type="button"
                onClick={handleUpdateSilverRate}
                disabled={isUpdatingSilverRate}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {isUpdatingSilverRate ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Ho raha hai…
                  </>
                ) : (
                  "Rate update karein"
                )}
              </button>
            </div>
            {silverRateMessage && (
              <p
                className={`mt-3 text-sm ${
                  silverRateMessage.includes("set ho gaya")
                    ? "text-emerald-700"
                    : "text-red-600"
                }`}
              >
                {silverRateMessage}
              </p>
            )}
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="labour-per-gram"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Majoori + commission (₹ per gram)
              </label>
              <input
                id="labour-per-gram"
                type="number"
                inputMode="decimal"
                step="1"
                min="1"
                value={settings.labourPerGram}
                onChange={(e) =>
                  setSettings({ ...settings, labourPerGram: e.target.value })
                }
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="mt-1.5 text-xs text-gray-500">
                Abhi ₹{settings.labourPerGram || "130"}/gram lag raha hai. Ye
                badalne par saare item ka price badal jayega.
              </p>
            </div>

            <div>
              <label
                htmlFor="silver-premium"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Bazaar rate se kitna upar (%)
              </label>
              <input
                id="silver-premium"
                type="number"
                inputMode="decimal"
                step="0.5"
                min="0"
                max="200"
                value={settings.silverRatePremiumPercent}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    silverRatePremiumPercent: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <p className="mt-1.5 text-xs text-gray-500">
                Sirf tab jab auto-rate galat lage. International spot (~₹195/g)
                par duty + margin lag kar India mein ~₹245–250/g banta hai — 28%
                iske kareeb rehta hai. Upar wale manual rate ko prefer karein.
              </p>
            </div>
          </div>
        </div>

        {/* General Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">General</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Site Name
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) =>
                  setSettings({ ...settings, siteName: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) =>
                  setSettings({ ...settings, tagline: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GST Number
              </label>
              <input
                type="text"
                value={settings.gst}
                onChange={(e) =>
                  setSettings({ ...settings, gst: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-500"
                placeholder="06ABCDE1234F1Z5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GST Rate (%)
              </label>
              <input
                type="number"
                min="0"
                max="28"
                step="0.5"
                value={settings.gstRate}
                onChange={(e) =>
                  setSettings({ ...settings, gstRate: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Leave this at 0. GST may only be charged once you are registered
                and have a GSTIN — until then it must not appear on any order.
                After registering, silver jewellery is 3% (HSN 7113).
              </p>
            </div>
            <div className="md:col-span-2">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={settings.gstInclusive}
                  onChange={(e) =>
                    setSettings({ ...settings, gstInclusive: e.target.checked })
                  }
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-champagne-600 focus:ring-champagne-500"
                />
                <span className="text-sm text-gray-700">
                  <span className="font-medium">
                    Product prices already include GST
                  </span>
                  <span className="mt-1 block text-xs text-gray-500">
                    Leave this unticked if your prices are silver cost + making +
                    profit, which is the pre-tax figure. GST is then shown as a
                    separate line at checkout. Tick it only if you have already
                    built the tax into your prices, otherwise you will be charging
                    it twice.
                  </span>
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Contact Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                value={settings.phone}
                onChange={(e) =>
                  setSettings({ ...settings, phone: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-500"
                placeholder="+91 XXXXXXXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp Number
              </label>
              <input
                type="tel"
                value={settings.whatsapp}
                onChange={(e) =>
                  setSettings({ ...settings, whatsapp: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-500"
                placeholder="91XXXXXXXXXX"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) =>
                  setSettings({ ...settings, email: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                rows={2}
                value={settings.address}
                onChange={(e) =>
                  setSettings({ ...settings, address: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-500"
              />
            </div>
          </div>
        </div>

        {/* UPI payment */}
        <div className="rounded-xl border border-sky-200 bg-sky-50/40 p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            UPI payment (checkout QR)
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Customer order ke baad yeh QR / UPI ID se paisa bhejega. GPay se jo
            QR hai wahi yahan rakhein.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                UPI ID
              </label>
              <input
                type="text"
                value={settings.upiId}
                onChange={(e) =>
                  setSettings({ ...settings, upiId: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-500"
                placeholder="name@okicici"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payee name (QR pe dikhega)
              </label>
              <input
                type="text"
                value={settings.upiPayeeName}
                onChange={(e) =>
                  setSettings({ ...settings, upiPayeeName: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-500"
                placeholder="Saroj Moun"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                QR image
              </label>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                {settings.upiQrUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={settings.upiQrUrl}
                    alt="UPI QR preview"
                    className="h-40 w-40 rounded-lg border border-gray-200 bg-white object-contain p-2"
                  />
                ) : null}
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    value={settings.upiQrUrl}
                    onChange={(e) =>
                      setSettings({ ...settings, upiQrUrl: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-500"
                    placeholder="/upi-qr.png ya Cloudinary URL"
                  />
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                    {isUploadingQr ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                    {isUploadingQr ? "Upload ho raha hai…" : "Naya QR upload"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={isUploadingQr}
                      onChange={(e) =>
                        handleUploadQr(e.target.files?.[0] ?? null)
                      }
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Shipping Charge (₹)
              </label>
              <input
                type="number"
                step="0.01"
                value={settings.shippingCharge}
                onChange={(e) =>
                  setSettings({ ...settings, shippingCharge: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Free Shipping Above (₹)
              </label>
              <input
                type="number"
                step="0.01"
                value={settings.freeShippingMin}
                onChange={(e) =>
                  setSettings({ ...settings, freeShippingMin: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-500"
                placeholder="Leave empty for no free shipping"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Social Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook URL
              </label>
              <input
                type="url"
                value={settings.socialFacebook}
                onChange={(e) =>
                  setSettings({ ...settings, socialFacebook: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                value={settings.socialInstagram}
                onChange={(e) =>
                  setSettings({ ...settings, socialInstagram: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twitter URL
              </label>
              <input
                type="url"
                value={settings.socialTwitter}
                onChange={(e) =>
                  setSettings({ ...settings, socialTwitter: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                YouTube URL
              </label>
              <input
                type="url"
                value={settings.socialYoutube}
                onChange={(e) =>
                  setSettings({ ...settings, socialYoutube: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-500"
              />
            </div>
          </div>
        </div>

        {/* SEO Settings */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Meta Title
              </label>
              <input
                type="text"
                value={settings.metaTitle}
                onChange={(e) =>
                  setSettings({ ...settings, metaTitle: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Meta Description
              </label>
              <textarea
                rows={3}
                value={settings.metaDescription}
                onChange={(e) =>
                  setSettings({ ...settings, metaDescription: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-500"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2 bg-charcoal-900 text-white rounded-lg hover:bg-charcoal-800 transition-colors font-medium disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </form>

      {/* Password — a separate form because it posts to a different endpoint and
          must never be swept up in the settings save. */}
      <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-gray-500" />
          <h2 className="text-lg font-semibold text-gray-900">
            Password badlein
          </h2>
        </div>
        <p className="mt-1 text-sm text-gray-600">
          Login ka password yahan badlein. Naya password kam se kam 12 letters ka
          ho. Badalne par baaki sab devices se logout ho jayega.
        </p>

        {passwordError && (
          <div className="mt-4 bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
            {passwordError}
          </div>
        )}
        {passwordSuccess && (
          <div className="mt-4 bg-green-50 text-green-600 px-4 py-3 rounded-lg text-sm">
            {passwordSuccess}
          </div>
        )}

        <form onSubmit={handleChangePassword} className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="current-password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Abhi ka password
            </label>
            <input
              id="current-password"
              type="password"
              autoComplete="current-password"
              value={passwordFields.currentPassword}
              onChange={(e) =>
                setPasswordFields({
                  ...passwordFields,
                  currentPassword: e.target.value,
                })
              }
              required
              className="w-full max-w-md px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-500"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md md:max-w-2xl">
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Naya password
              </label>
              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                value={passwordFields.newPassword}
                onChange={(e) =>
                  setPasswordFields({
                    ...passwordFields,
                    newPassword: e.target.value,
                  })
                }
                required
                minLength={12}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-500"
              />
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Naya password dobara
              </label>
              <input
                id="confirm-password"
                type="password"
                autoComplete="new-password"
                value={passwordFields.confirmPassword}
                onChange={(e) =>
                  setPasswordFields({
                    ...passwordFields,
                    confirmPassword: e.target.value,
                  })
                }
                required
                minLength={12}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-champagne-500"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isChangingPassword}
              className="inline-flex items-center gap-2 px-6 py-2 bg-charcoal-900 text-white rounded-lg hover:bg-charcoal-800 transition-colors font-medium disabled:opacity-50"
            >
              {isChangingPassword ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Badal raha hai...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  Password badlein
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
