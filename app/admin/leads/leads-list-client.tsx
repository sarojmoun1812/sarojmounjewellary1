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
import {
  LEAD_SOURCE_OPTIONS,
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

interface LeadStats {
  total: number;
  newCount: number;
  contacted: number;
  qualified: number;
  converted: number;
  lost: number;
}

const statusGradients: Record<string, string> = {
  NEW: "from-emerald-500 to-green-600",
  CONTACTED: "from-sky-500 to-blue-600",
  QUALIFIED: "from-violet-500 to-purple-600",
  CONVERTED: "from-teal-500 to-emerald-600",
  LOST: "from-red-500 to-rose-600",
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

  // Short labels here: these are tiles in a row, so the fuller sentences from
  // leadStatusLabel would wrap badly. The badges on each row use those.
  const pipelineCards = [
    { key: "all", label: "Saare", value: stats.total, icon: Users, gradient: "from-gray-500 to-slate-600" },
    { key: "NEW", label: "Naye", value: stats.newCount, icon: Zap, gradient: statusGradients.NEW },
    { key: "CONTACTED", label: "Baat ho gayi", value: stats.contacted, icon: Phone, gradient: statusGradients.CONTACTED },
    { key: "QUALIFIED", label: "Interested", value: stats.qualified, icon: Target, gradient: statusGradients.QUALIFIED },
    { key: "CONVERTED", label: "Order kiya", value: stats.converted, icon: CheckCircle, gradient: statusGradients.CONVERTED },
    { key: "LOST", label: "Nahi bani", value: stats.lost, icon: XCircle, gradient: statusGradients.LOST },
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
            <TrendingUp className="h-7 w-7 text-champagne-500" />
            Poochh-taachh
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Jinhone website par apna number diya hai — unse baat karke order
            banaiye.
          </p>
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
              placeholder="Naam, phone ya email se dhoondhein"
              className="bg-transparent text-sm outline-none w-full placeholder:text-gray-400"
            />
          </div>
          <form className="flex flex-wrap gap-3" method="GET">
            <select
              name="status"
              aria-label="Status se filter karein"
              defaultValue={currentStatus}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-champagne-500/40"
            >
              <option value="all">Saare status</option>
              {LEAD_STATUS_OPTIONS.map((key) => (
                <option key={key} value={key}>
                  {leadStatusLabel(key).label}
                </option>
              ))}
            </select>
            <select
              name="source"
              aria-label="Kahan se aaya, uske hisaab se filter karein"
              defaultValue={currentSource}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-champagne-500/40"
            >
              {/* These options are the values the site actually records. The
                  list previously offered PHONE, EXIT_POPUP and CALLBACK, none
                  of which anything writes, so those filters always came back
                  empty. */}
              <option value="all">Kahin se bhi</option>
              {LEAD_SOURCE_OPTIONS.map((key) => (
                <option key={key} value={key}>
                  {leadSourceLabel(key)}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Dhoondhein
            </button>
          </form>
        </div>
      </motion.div>

      {/* Leads Table */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-16">
            <Target className="h-12 w-12 text-gray-200 mx-auto mb-4" />
            <p className="font-medium text-gray-500">Koi naam nahi mila</p>
            <p className="mt-1 text-sm text-gray-400">
              Website par jo bhi apna number dega, wo yahan apne aap dikhega.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredLeads.map((lead, i) => {
              const status = leadStatusLabel(lead.status);
              const gradient = statusGradients[lead.status] ?? statusGradients.NEW;
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
                      <div className={`w-10 h-10 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                        {lead.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-medium text-gray-900 text-sm">{lead.name}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${status.className}`}>
                            {status.label}
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
                          {leadSourceLabel(lead.source)}
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
