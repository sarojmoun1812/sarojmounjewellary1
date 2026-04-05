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
  Clock,
  Save,
  Loader2,
  CheckCircle,
  User,
  Target,
  Send,
  ExternalLink,
} from "lucide-react";

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

const statuses = [
  { value: "NEW", label: "New Lead", color: "bg-emerald-100 text-emerald-700 ring-emerald-500" },
  { value: "CONTACTED", label: "Contacted", color: "bg-sky-100 text-sky-700 ring-sky-500" },
  { value: "QUALIFIED", label: "Qualified", color: "bg-violet-100 text-violet-700 ring-violet-500" },
  { value: "CONVERTED", label: "Converted", color: "bg-teal-100 text-teal-700 ring-teal-500" },
  { value: "LOST", label: "Lost", color: "bg-red-100 text-red-700 ring-red-500" },
];

export function LeadDetailClient({ lead }: { lead: Lead }) {
  const router = useRouter();
  const [status, setStatus] = useState(lead.status);
  const [notes, setNotes] = useState(lead.notes || "");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to update lead:", error);
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

  const whatsappMessage = `Hi ${lead.name}! This is Saroj Moun Jewellery. Thank you for your interest in our silver jewellery collection. How can we help you today?`;

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
          <h1 className="text-2xl font-bold text-gray-900">Lead Detail</h1>
          <p className="text-gray-500 text-sm">Manage and follow up with this lead</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-50"
        >
          {isSaving ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
          ) : saved ? (
            <><CheckCircle className="h-4 w-4" /> Saved!</>
          ) : (
            <><Save className="h-4 w-4" /> Save Changes</>
          )}
        </button>
      </div>

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
                Call Now
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
                Message from Lead
              </h3>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700 text-sm leading-relaxed">{lead.message}</p>
              </div>
            </div>
          )}

          {/* Notes / Follow-up */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Target className="h-5 w-5 text-amber-500" />
              CRM Notes &amp; Follow-up
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-400 text-sm resize-none"
              placeholder="Add notes about this lead... e.g.&#10;- Called on 15 Feb, interested in necklace set&#10;- Follow up on 20 Feb with pricing&#10;- Sent WhatsApp catalogue"
            />
            <p className="text-xs text-gray-400 mt-2">These notes are only visible to admins</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Lead Status</h3>
            <div className="space-y-2">
              {statuses.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setStatus(s.value)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    status === s.value
                      ? `${s.color} ring-2 ring-offset-1`
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    status === s.value ? "bg-current" : "bg-gray-300"
                  }`} />
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Meta Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Details</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Source</p>
                <p className="font-medium text-gray-900">{lead.source.replace(/_/g, " ")}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Created</p>
                <p className="font-medium text-gray-900">{formatDate(lead.createdAt)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Last Updated</p>
                <p className="font-medium text-gray-900">{formatDate(lead.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
