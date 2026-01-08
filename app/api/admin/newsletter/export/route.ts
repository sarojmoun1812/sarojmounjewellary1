import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";

// GET /api/admin/newsletter/export - Export subscribers as CSV
export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscribers = await prisma.newsletter.findMany({
      where: { isSubscribed: true },
      orderBy: { createdAt: "desc" },
    });

    // Generate CSV
    const headers = ["Email", "Subscribed Date"];
    const rows = subscribers.map((s) => [
      s.email,
      new Date(s.createdAt).toISOString().split("T")[0],
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="newsletter-subscribers-${
          new Date().toISOString().split("T")[0]
        }.csv"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Failed to export subscribers" },
      { status: 500 }
    );
  }
}
