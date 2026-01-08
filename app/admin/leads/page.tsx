import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";

// Force dynamic rendering
export const dynamic = "force-dynamic";
import Link from "next/link";
import { Phone, Mail, Search, MessageSquare } from "lucide-react";

async function getLeads(status?: string, source?: string) {
  const where: any = {};

  if (status && status !== "all") {
    where.status = status;
  }

  if (source && source !== "all") {
    where.source = source;
  }

  return prisma.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: { status?: string; source?: string };
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const params = await searchParams;
  const leads = await getLeads(params.status, params.source);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const statuses = [
    { value: "all", label: "All Leads" },
    { value: "NEW", label: "New" },
    { value: "CONTACTED", label: "Contacted" },
    { value: "QUALIFIED", label: "Qualified" },
    { value: "CONVERTED", label: "Converted" },
    { value: "LOST", label: "Lost" },
  ];

  const sources = [
    { value: "all", label: "All Sources" },
    { value: "CONTACT_FORM", label: "Contact Form" },
    { value: "PRODUCT_INQUIRY", label: "Product Inquiry" },
    { value: "WHATSAPP", label: "WhatsApp" },
    { value: "PHONE", label: "Phone" },
    { value: "NEWSLETTER", label: "Newsletter" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "NEW":
        return "bg-green-100 text-green-700";
      case "CONTACTED":
        return "bg-blue-100 text-blue-700";
      case "QUALIFIED":
        return "bg-purple-100 text-purple-700";
      case "CONVERTED":
        return "bg-cyan-100 text-cyan-700";
      case "LOST":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <p className="text-gray-600 mt-1">
          Manage your leads and inquiries ({leads.length} leads)
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <form className="flex flex-col md:flex-row gap-4">
          <select
            name="status"
            defaultValue={params.status || "all"}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-powder-500"
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <select
            name="source"
            defaultValue={params.source || "all"}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-powder-500"
          >
            {sources.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Leads List */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {leads.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No leads found.
            </div>
          ) : (
            leads.map((lead) => (
              <Link
                key={lead.id}
                href={`/admin/leads/${lead.id}`}
                className="block p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className="font-medium text-gray-900">{lead.name}</p>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(
                          lead.status
                        )}`}
                      >
                        {lead.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {lead.phone}
                      </span>
                      {lead.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {lead.email}
                        </span>
                      )}
                    </div>
                    {lead.message && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-1">
                        <MessageSquare className="h-3 w-3 inline mr-1" />
                        {lead.message}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                      {lead.source.replace("_", " ")}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(lead.createdAt)}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
