import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardClient } from "./dashboard-client";

export const dynamic = "force-dynamic";

async function getStats() {
  const [
    productCount,
    orderCount,
    customerCount,
    leadCount,
    newLeads,
    messageCount,
    recentOrders,
    recentLeads,
    paidRevenue,
    pipelineValue,
    pendingOrders,
    newsletterCount,
    silverRate,
    categoryBreakdown,
  ] = await Promise.all([
    prisma.product.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.customer.count(),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.order.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { customer: true },
    }),
    prisma.lead.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.aggregate({
      where: { paymentStatus: "PAID" },
      _sum: { total: true },
    }),
    // WhatsApp orders stay PENDING until she marks PAID — pipeline value is
    // what actually reflects business happening on the site.
    prisma.order.aggregate({
      where: { status: { not: "CANCELLED" } },
      _sum: { total: true },
    }),
    prisma.order.count({
      where: { status: "PENDING" },
    }),
    prisma.newsletter.count({ where: { isSubscribed: true } }),
    prisma.silverRate.findFirst({ orderBy: { updatedAt: "desc" } }),
    prisma.product.groupBy({
      by: ["category"],
      where: { isActive: true },
      _count: { id: true },
    }),
  ]);

  const rateUpdatedAt = silverRate?.updatedAt ?? null;
  const isStale =
    !rateUpdatedAt ||
    Date.now() - rateUpdatedAt.getTime() > 48 * 60 * 60 * 1000;

  return {
    productCount,
    orderCount,
    customerCount,
    leadCount,
    newLeads,
    messageCount,
    recentOrders: recentOrders.map((o) => ({
      ...o,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
      customer: { ...o.customer, createdAt: o.customer.createdAt.toISOString() },
    })),
    recentLeads: recentLeads.map((l) => ({
      ...l,
      createdAt: l.createdAt.toISOString(),
      updatedAt: l.updatedAt.toISOString(),
    })),
    totalRevenue: pipelineValue._sum.total || 0,
    paidRevenue: paidRevenue._sum.total || 0,
    pendingOrders,
    newsletterCount,
    silverRate: silverRate?.ratePerGram || 95,
    silverRateUpdatedAt: rateUpdatedAt?.toISOString() ?? null,
    silverRateStale: isStale,
    categoryBreakdown: categoryBreakdown.map((c) => ({
      category: c.category,
      count: c._count.id,
    })),
  };
}

export default async function AdminDashboard() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const stats = await getStats();

  return <DashboardClient admin={admin} stats={stats} />;
}
