import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LeadsListClient } from "./leads-list-client";

export const dynamic = "force-dynamic";

async function getLeads(status?: string, source?: string) {
  const where: any = {};
  if (status && status !== "all") where.status = status;
  if (source && source !== "all") where.source = source;

  return prisma.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
}

async function getLeadStats() {
  const [total, newCount, contacted, qualified, converted, lost] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.lead.count({ where: { status: "CONTACTED" } }),
    prisma.lead.count({ where: { status: "QUALIFIED" } }),
    prisma.lead.count({ where: { status: "CONVERTED" } }),
    prisma.lead.count({ where: { status: "LOST" } }),
  ]);
  return { total, newCount, contacted, qualified, converted, lost };
}

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: { status?: string; source?: string };
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const params = await searchParams;
  const [leads, leadStats] = await Promise.all([
    getLeads(params.status, params.source),
    getLeadStats(),
  ]);

  return (
    <LeadsListClient
      leads={leads.map((l) => ({
        ...l,
        createdAt: l.createdAt.toISOString(),
        updatedAt: l.updatedAt.toISOString(),
      }))}
      stats={leadStats}
      currentStatus={params.status || "all"}
      currentSource={params.source || "all"}
    />
  );
}
