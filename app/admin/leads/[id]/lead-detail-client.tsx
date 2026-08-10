"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Phone,
  Mail,
  MessageSquare,
  Save,
  Loader2,
  CheckCircle,
  Target,
  Send,
} from "lucide-react";
import {
  LEAD_STATUS_OPTIONS,
  leadSourceLabel,
  leadStatusLabel,
} from "@/lib/admin-labels";

interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  source: string;
  message: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export function LeadDetailClient({ lead }: { lead: Lead }) {
  const router = useRouter();
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.notes || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      // A failed response used to be swallowed here, so a rejected save looked
      // exactly like a successful one: nothing happened and nothing was said.
      if (!res.ok) {
        throw new Error("Save nahi ho paaya. Dobara koshish karein.");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Save nahi ho paaya. Dobara koshish karein."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const whatsappMessage = `Namaste ${lead.name} ji! Saroj Moun Jewellery se baat kar rahe hain. Aapne hamari chaandi ki jewellery mein interest dikhaya tha — bataiye, kya dekhna chahenge?`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/leads" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Poori jaankari</h1>
          <p className="text-gray-500 text-sm">
            Baat karke yahan status aur note likh dein.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-charcoal-900 text-white rounded-xl font-semibold text-sm hover:bg-charcoal-800 transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Save ho raha hai…</>
          ) : saved ? (
            <><CheckCircle className="h-4 w-4" /> Save ho gaya</>
          ) : (
            <><Save className="h-4 w-4" /> Save karein</>
          )}
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Card */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-purple-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {lead.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{lead.name}</h2>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4 text-gray-400" />
                    {lead.phone}
                  </span>
                  {lead.email && (
                    <span className="flex items-center gap-1.5">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {lead.email}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <a
                href={`tel:${lead.phone}`}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-700 rounded-xl font-medium text-sm hover:bg-blue-100 transition-colors"
              >
                <Phone className="h-4 w-4" />
                Call karein
              </a>
              <a
                href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-green-50 text-green-700 rounded-xl font-medium text-sm hover:bg-green-100 transition-colors"
              >
                <Send className="h-4 w-4" />
                WhatsApp
              </a>
              {lead.email && (
                <a
                  href={`mailto:${lead.email}`}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-50 text-purple-700 rounded-xl font-medium text-sm hover:bg-purple-100 transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Email
                </a>
              )}
            </div>
          </div>

          {/* Message */}
          {lead.message && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-gray-400" />
                Unhone ye likha hai
              </h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700 text-sm leading-relaxed">{lead.message}</p>
              </div>
            </div>
          )}

          {/* Notes / Follow-up */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Target className="h-5 w-5 text-champagne-500" />
              Aapke notes
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-champagne-500/40 focus:border-champagne-400 text-sm resize-none"
              placeholder="Yahan apne liye likhein, jaise:&#10;- 15 Feb ko baat hui, necklace set pasand aaya&#10;- 20 Feb ko phir call karna hai&#10;- WhatsApp par photos bheji"
            />
            <p className="text-xs text-gray-400 mt-2">
              Ye notes sirf aapko dikhte hain, customer ko nahi.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Kahan tak baat pahunchi</h3>
            <div className="space-y-2">
              {LEAD_STATUS_OPTIONS.map((value) => {
                const option = leadStatusLabel(value);
                const selected = status === value;
                return (
                  <button
                    key={value}
                    onClick={() => setStatus(value)}
                    aria-pressed={selected}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      selected
                        ? `${option.className} ring-2 ring-current ring-offset-1`
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <div
                      className={`h-2.5 w-2.5 flex-shrink-0 rounded-full ${
                        selected ? "bg-current" : "bg-gray-300"
                      }`}
                    />
                    <span className="text-left">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Meta Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Jaankari</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="mb-1 text-xs text-gray-400">Kahan se aaye</p>
                <p className="font-medium text-gray-900">
                  {leadSourceLabel(lead.source)}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs text-gray-400">Kab aaye</p>
                <p className="font-medium text-gray-900">{formatDate(lead.createdAt)}</p>
              </div>
              <div>
                <p className="mb-1 text-xs text-gray-400">Aakhri badlaav</p>
                <p className="font-medium text-gray-900">{formatDate(lead.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
