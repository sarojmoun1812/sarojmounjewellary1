"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  IndianRupee,
  ArrowUpRight,
  MessageSquare,
  Crown,
  Sparkles,
  Mail,
  Eye,
  Phone,
  Plus,
  ExternalLink,
  Gem,
  Activity,
  Target,
  UserPlus,
} from "lucide-react";

interface DashboardClientProps {
  admin: { name: string; role: string };
  stats: {
    productCount: number;
    orderCount: number;
    customerCount: number;
    leadCount: number;
    newLeads: number;
    messageCount: number;
    recentOrders: any[];
    recentLeads: any[];
    totalRevenue: number;
    newsletterCount: number;
    silverRate: number;
    categoryBreakdown: { category: string; count: number }[];
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const formatPrice = (paise: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    DELIVERED: "bg-emerald-100 text-emerald-700",
    SHIPPED: "bg-blue-100 text-blue-700",
    PROCESSING: "bg-amber-100 text-amber-700",
    CONFIRMED: "bg-purple-100 text-purple-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    CANCELLED: "bg-red-100 text-red-700",
    NEW: "bg-emerald-100 text-emerald-700",
    CONTACTED: "bg-sky-100 text-sky-700",
    QUALIFIED: "bg-violet-100 text-violet-700",
    CONVERTED: "bg-teal-100 text-teal-700",
    LOST: "bg-gray-100 text-gray-700",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
};

export function DashboardClient({ admin, stats }: DashboardClientProps) {
  const statCards = [
    {
      label: "Total Revenue",
      value: formatPrice(stats.totalRevenue),
      icon: IndianRupee,
      gradient: "from-amber-500 to-orange-600",
      shadow: "shadow-amber-500/20",
      href: "/admin/orders",
      subtitle: `From ${stats.orderCount} orders`,
    },
    {
      label: "Products",
      value: stats.productCount,
      icon: Package,
      gradient: "from-blue-500 to-indigo-600",
      shadow: "shadow-blue-500/20",
      href: "/admin/products",
      subtitle: `${stats.categoryBreakdown.length} categories`,
    },
    {
      label: "Customers",
      value: stats.customerCount,
      icon: Users,
      gradient: "from-emerald-500 to-teal-600",
      shadow: "shadow-emerald-500/20",
      href: "/admin/customers",
      subtitle: `${stats.newsletterCount} subscribers`,
    },
    {
      label: "Active Leads",
      value: stats.leadCount,
      icon: Target,
      gradient: "from-rose-500 to-pink-600",
      shadow: "shadow-rose-500/20",
      href: "/admin/leads",
      subtitle: `${stats.newLeads} new leads`,
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 max-w-[1400px] mx-auto"
    >
      {/* Welcome Banner */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900 p-8 md:p-10"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-full translate-y-1/2 -translate-x-1/4" />
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-amber-400 rounded-full animate-ping" />
        <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3 mb-3"
            >
              <div className="p-2 bg-amber-500/20 rounded-xl">
                <Crown className="h-6 w-6 text-amber-400" />
              </div>
              <span className="text-amber-400/80 text-sm font-medium tracking-wider uppercase">
                Admin Dashboard
              </span>
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome back, <span className="bg-gradient-to-r from-amber-300 to-rose-300 bg-clip-text text-transparent">{admin.name}</span>
            </h1>
            <p className="text-white/50 text-sm md:text-base">
              Here&apos;s your jewellery business at a glance. Silver rate today: <span className="text-amber-400 font-semibold">₹{stats.silverRate.toFixed(2)}/g</span>
            </p>
          </div>

          <div className="flex gap-3">
            <Link
              href="/admin/products/new"
              className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-amber-500/25 transition-all hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Link>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-2 px-5 py-3 bg-white/10 text-white rounded-xl font-medium text-sm hover:bg-white/20 transition-all backdrop-blur-sm"
            >
              <Eye className="h-4 w-4" />
              View Store
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, index) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <Link
              href={stat.href}
              className="group block relative overflow-hidden bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg ${stat.shadow}`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <ArrowUpRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
              </div>
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-1">{stat.subtitle}</p>

              {/* Hover gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-[0.02] transition-opacity duration-300`} />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Alerts Row */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
        {stats.messageCount > 0 && (
          <Link
            href="/admin/messages"
            className="flex-1 flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50 rounded-2xl px-5 py-4 hover:shadow-md transition-all group"
          >
            <div className="p-2 bg-amber-100 rounded-xl group-hover:scale-110 transition-transform">
              <MessageSquare className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="font-semibold text-amber-800 text-sm">
                {stats.messageCount} unread message{stats.messageCount > 1 ? "s" : ""}
              </p>
              <p className="text-xs text-amber-600/70">Click to view and reply</p>
            </div>
          </Link>
        )}
        {stats.newLeads > 0 && (
          <Link
            href="/admin/leads?status=NEW"
            className="flex-1 flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/50 rounded-2xl px-5 py-4 hover:shadow-md transition-all group"
          >
            <div className="p-2 bg-emerald-100 rounded-xl group-hover:scale-110 transition-transform">
              <UserPlus className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-emerald-800 text-sm">
                {stats.newLeads} new lead{stats.newLeads > 1 ? "s" : ""} to follow up
              </p>
              <p className="text-xs text-emerald-600/70">Open CRM to manage</p>
            </div>
          </Link>
        )}
      </motion.div>

      {/* Category Breakdown + Silver Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Categories */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Gem className="h-5 w-5 text-purple-500" />
            Product Categories
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {stats.categoryBreakdown.length === 0 ? (
              <p className="col-span-full text-gray-400 text-sm py-6 text-center">No products yet. Add your first product!</p>
            ) : (
              stats.categoryBreakdown.map((cat, i) => (
                <motion.div
                  key={cat.category}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all group cursor-pointer"
                >
                  <p className="text-2xl font-bold text-gray-900">{cat.count}</p>
                  <p className="text-xs text-gray-500 mt-0.5 capitalize">{cat.category}</p>
                  <div className="absolute top-2 right-2 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Sparkles className="h-8 w-8 text-amber-500" />
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* Silver Rate + Quick Stats */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="h-5 w-5 text-amber-400" />
              <span className="text-sm font-medium text-white/70">Live Silver Rate</span>
            </div>
            <p className="text-3xl font-bold">
              <span className="text-amber-400">₹{stats.silverRate.toFixed(2)}</span>
              <span className="text-lg text-white/40 ml-1">/gram</span>
            </p>
            <p className="text-xs text-white/40 mt-2">Updated via MetalPriceAPI</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h4 className="text-sm font-semibold text-gray-500 mb-4">Quick Stats</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Newsletter</span>
                <span className="font-bold text-gray-900">{stats.newsletterCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Messages</span>
                <span className="font-bold text-gray-900">{stats.messageCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Leads</span>
                <span className="font-bold text-gray-900">{stats.leadCount}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-amber-500" />
              Recent Orders
            </h3>
            <Link href="/admin/orders" className="text-xs text-amber-600 hover:text-amber-700 font-medium flex items-center gap-1">
              View all <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.recentOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No orders yet</p>
                <p className="text-gray-300 text-xs mt-1">Orders will appear here once customers start buying</p>
              </div>
            ) : (
              stats.recentOrders.map((order: any) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center text-amber-700 font-bold text-xs">
                      {order.customer.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{order.orderNumber}</p>
                      <p className="text-xs text-gray-400">{order.customer.name} &middot; {formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900 text-sm">{formatPrice(order.total)}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </motion.div>

        {/* Recent Leads / CRM */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Target className="h-5 w-5 text-rose-500" />
              CRM - Recent Leads
            </h3>
            <Link href="/admin/leads" className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1">
              Open CRM <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.recentLeads.length === 0 ? (
              <div className="text-center py-12">
                <Target className="h-10 w-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No leads yet</p>
                <p className="text-gray-300 text-xs mt-1">Leads from popups, WhatsApp, and forms appear here</p>
              </div>
            ) : (
              stats.recentLeads.map((lead: any) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-rose-100 rounded-lg flex items-center justify-center text-rose-700 font-bold text-xs">
                      {lead.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{lead.name}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {lead.phone}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {lead.source.replace(/_/g, " ")}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
