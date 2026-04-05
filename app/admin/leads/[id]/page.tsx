import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { LeadDetailClient } from "./lead-detail-client";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");

  const lead = await prisma.lead.findUnique({
    where: { id: params.id },
  });

  if (!lead) notFound();

  return (
    <LeadDetailClient
      lead={{
        ...lead,
        createdAt: lead.createdAt.toISOString(),
        updatedAt: lead.updatedAt.toISOString(),
      }}
    />
  );
}
