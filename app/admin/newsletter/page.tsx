import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Mail, Download, UserMinus } from "lucide-react";

// Force dynamic rendering
export const dynamic = "force-dynamic";

async function getSubscribers() {
  return prisma.newsletter.findMany({
    where: { isSubscribed: true },
    orderBy: { createdAt: "desc" },
  });
}

async function getStats() {
  const [total, subscribed, unsubscribed] = await Promise.all([
    prisma.newsletter.count(),
    prisma.newsletter.count({ where: { isSubscribed: true } }),
    prisma.newsletter.count({ where: { isSubscribed: false } }),
  ]);

  return { total, subscribed, unsubscribed };
}

export default async function NewsletterPage() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const [subscribers, stats] = await Promise.all([
    getSubscribers(),
    getStats(),
  ]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletter</h1>
          <p className="text-gray-600 mt-1">
            Manage newsletter subscribers
          </p>
        </div>
        <a
          href="/api/admin/newsletter/export"
          className="inline-flex items-center gap-2 px-4 py-2 bg-powder-600 text-white rounded-lg hover:bg-powder-700 transition-colors font-medium"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-600">Total Subscribers</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-3xl font-bold text-green-600 mt-1">
            {stats.subscribed}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-sm text-gray-600">Unsubscribed</p>
          <p className="text-3xl font-bold text-gray-400 mt-1">
            {stats.unsubscribed}
          </p>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Email
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Subscribed On
                </th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-12 text-gray-500">
                    No subscribers yet.
                  </td>
                </tr>
              ) : (
                subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{subscriber.email}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-600">
                        {formatDate(subscriber.createdAt)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                        Active
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
