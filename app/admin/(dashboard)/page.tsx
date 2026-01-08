import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  IndianRupee,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare,
} from "lucide-react";

// Force dynamic rendering for admin pages
export const dynamic = "force-dynamic";

async function getStats() {
  const [
    productCount,
    orderCount,
    customerCount,
    leadCount,
    messageCount,
    recentOrders,
    recentLeads,
    totalRevenue,
  ] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.customer.count(),
    prisma.lead.count(),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { customer: true },
    }),
    prisma.lead.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { total: true },
    }),
  ]);

  return {
    productCount,
    orderCount,
    customerCount,
    leadCount,
    messageCount,
    recentOrders,
    recentLeads,
    totalRevenue: totalRevenue._sum.total || 0,
  };
}

export default async function AdminDashboard() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const stats = await getStats();

  const statCards = [
    {
      label: "Total Products",
      value: stats.productCount,
      icon: Package,
      color: "blue",
      href: "/admin/products",
    },
    {
      label: "Total Orders",
      value: stats.orderCount,
      icon: ShoppingBag,
      color: "green",
      href: "/admin/orders",
    },
    {
      label: "Total Customers",
      value: stats.customerCount,
      icon: Users,
      color: "purple",
      href: "/admin/customers",
    },
    {
      label: "Active Leads",
      value: stats.leadCount,
      icon: TrendingUp,
      color: "orange",
      href: "/admin/leads",
    },
  ];

  const formatPrice = (paise: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(paise / 100);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {admin.name}!
          </h1>
          <p className="text-gray-600 mt-1">
            Here's what's happening with your store today.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/products/new"
            className="px-4 py-2 bg-powder-600 text-white rounded-lg hover:bg-powder-700 transition-colors font-medium"
          >
            Add Product
          </Link>
        </div>
      </div>

      {/* Revenue Card */}
      <div className="bg-gradient-to-br from-powder-600 to-powder-800 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-powder-100 text-sm font-medium">Total Revenue</p>
            <p className="text-4xl font-bold mt-2">
              {formatPrice(stats.totalRevenue)}
            </p>
            <p className="text-powder-200 text-sm mt-2 flex items-center gap-1">
              <ArrowUpRight className="h-4 w-4" />
              From {stats.orderCount} orders
            </p>
          </div>
          <div className="bg-white/20 rounded-2xl p-4">
            <IndianRupee className="h-10 w-10" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl p-6 border border-gray-200 hover:border-powder-300 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className="bg-powder-100 rounded-xl p-3 group-hover:bg-powder-200 transition-colors">
                <stat.icon className="h-6 w-6 text-powder-600" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Unread Messages Alert */}
      {stats.messageCount > 0 && (
        <Link
          href="/admin/messages"
          className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 hover:bg-amber-100 transition-colors"
        >
          <MessageSquare className="h-5 w-5 text-amber-600" />
          <span className="text-amber-800 font-medium">
            You have {stats.messageCount} unread message
            {stats.messageCount > 1 ? "s" : ""}
          </span>
        </Link>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Recent Orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-powder-600 hover:text-powder-700 font-medium"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.recentOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No orders yet</p>
            ) : (
              stats.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.orderNumber}
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.customer.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      {formatPrice(order.total)}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.status === "DELIVERED"
                          ? "bg-green-100 text-green-700"
                          : order.status === "SHIPPED"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "CANCELLED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Leads */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="font-semibold text-gray-900">Recent Leads</h2>
            <Link
              href="/admin/leads"
              className="text-sm text-powder-600 hover:text-powder-700 font-medium"
            >
              View all
            </Link>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.recentLeads.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No leads yet</p>
            ) : (
              stats.recentLeads.map((lead) => (
                <Link
                  key={lead.id}
                  href={`/admin/leads/${lead.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">{lead.name}</p>
                    <p className="text-sm text-gray-500">{lead.phone}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        lead.status === "NEW"
                          ? "bg-green-100 text-green-700"
                          : lead.status === "CONTACTED"
                          ? "bg-blue-100 text-blue-700"
                          : lead.status === "CONVERTED"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {lead.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{lead.source}</p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
