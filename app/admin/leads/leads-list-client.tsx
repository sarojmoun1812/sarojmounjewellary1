"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MessageSquare,
  Target,
  UserPlus,
  Users,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Zap,
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

interface LeadStats {
  total: number;
  newCount: number;
  contacted: number;
  qualified: number;
  converted: number;
  lost: number;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; gradient: string }> = {
  NEW: { label: "New", color: "text-emerald-700", bg: "bg-emerald-100", gradient: "from-emerald-500 to-green-600" },
  CONTACTED: { label: "Contacted", color: "text-sky-700", bg: "bg-sky-100", gradient: "from-sky-500 to-blue-600" },
  QUALIFIED: { label: "Qualified", color: "text-violet-700", bg: "bg-violet-100", gradient: "from-violet-500 to-purple-600" },
  CONVERTED: { label: "Converted", color: "text-teal-700", bg: "bg-teal-100", gradient: "from-teal-500 to-emerald-600" },
  LOST: { label: "Lost", color: "text-red-700", bg: "bg-red-100", gradient: "from-red-500 to-rose-600" },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export function LeadsListClient({
  leads,
  stats,
  currentStatus,
  currentSource,
}: {
  leads: Lead[];
  stats: LeadStats;
  currentStatus: string;
  currentSource: string;
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLeads = leads.filter(
    (l) =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.includes(searchQuery) ||
      (l.email && l.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));

  const pipelineCards = [
    { key: "all", label: "All Leads", value: stats.total, icon: Users, gradient: "from-gray-500 to-slate-600" },
    { key: "NEW", label: "New", value: stats.newCount, icon: Zap, gradient: "from-emerald-500 to-green-600" },
    { key: "CONTACTED", label: "Contacted", value: stats.contacted, icon: Phone, gradient: "from-sky-500 to-blue-600" },
    { key: "QUALIFIED", label: "Qualified", value: stats.qualified, icon: Target, gradient: "from-violet-500 to-purple-600" },
    { key: "CONVERTED", label: "Converted", value: stats.converted, icon: CheckCircle, gradient: "from-teal-500 to-emerald-600" },
    { key: "LOST", label: "Lost", value: stats.lost, icon: XCircle, gradient: "from-red-500 to-rose-600" },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-[1400px] mx-auto"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-7 w-7 text-rose-500" />
            CRM / Lead Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">Track, manage, and convert your leads into customers</p>
        </div>
      </motion.div>

      {/* Pipeline Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {pipelineCards.map((card) => (
          <button
            key={card.key}
            onClick={() => router.push(`/admin/leads?status=${card.key}`)}
            className={`group relative overflow-hidden rounded-2xl p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-lg ${
              currentStatus === card.key
                ? "bg-gradient-to-br text-white shadow-lg " + card.gradient
                : "bg-white border border-gray-100 hover:border-gray-200"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <card.icon className={`h-4 w-4 ${currentStatus === card.key ? "text-white/80" : "text-gray-400"}`} />
              <span className={`text-xs font-medium ${currentStatus === card.key ? "text-white/80" : "text-gray-500"}`}>
                {card.label}
              </span>
            </div>
            <p className={`text-2xl font-bold ${currentStatus === card.key ? "text-white" : "text-gray-900"}`}>
              {card.value}
            </p>
          </button>
        ))}
      </motion.div>

      {/* Search & Filter */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5">
            <Search className="h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, phone, or email..."
              className="bg-transparent text-sm outline-none w-full placeholder:text-gray-400"
            />
          </div>
          <form className="flex gap-3" method="GET">
            <select
              name="status"
              defaultValue={currentStatus}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            >
              <option value="all">All Statuses</option>
              {Object.entries(statusConfig).map(([key, val]) => (
                <option key={key} value={key}>{val.label}</option>
              ))}
            </select>
            <select
              name="source"
              defaultValue={currentSource}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40"
            >
              <option value="all">All Sources</option>
              <option value="CONTACT_FORM">Contact Form</option>
              <option value="PRODUCT_INQUIRY">Product Inquiry</option>
              <option value="WHATSAPP">WhatsApp</option>
              <option value="PHONE">Phone</option>
              <option value="NEWSLETTER">Newsletter</option>
              <option value="EXIT_POPUP">Exit Popup</option>
              <option value="CALLBACK">Callback</option>
            </select>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </form>
        </div>
      </motion.div>

      {/* Leads Table */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-16">
            <Target className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-medium">No leads found</p>
            <p className="text-gray-300 text-sm mt-1">Leads from your website will appear here automatically</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredLeads.map((lead, i) => {
              const config = statusConfig[lead.status] || statusConfig.NEW;
              return (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="group flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`w-10 h-10 bg-gradient-to-br ${config.gradient} rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-gray-900 text-sm">{lead.name}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${config.bg} ${config.color}`}>
                            {config.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />{lead.phone}
                          </span>
                          {lead.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />{lead.email}
                            </span>
                          )}
                        </div>
                        {lead.message && (
                          <p className="text-xs text-gray-400 mt-1 line-clamp-1 max-w-md">
                            <MessageSquare className="h-3 w-3 inline mr-1" />
                            {lead.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 ml-4">
                      <div className="text-right hidden sm:block">
                        <span className="text-[10px] px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                          {lead.source.replace(/_/g, " ")}
                        </span>
                        <p className="text-[10px] text-gray-400 mt-1">{formatDate(lead.createdAt)}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
