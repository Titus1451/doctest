import { NextResponse } from "next/server";
import { db } from "@/lib/TaxDecisions/db";

export async function GET() {
  try {
    const decisions = await db.decision.findMany({
      include: {
        author: true,
        evidence: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    const headers = [
      "ID",
      "Title",
      "Summary",
      "Status",
      "Tax Type",
      "Jurisdictions",
      "Author",
      "Created Date",
      "Updated Date",
      "External Links",
    ];

    const safe = (str?: string | null) =>
      str ? `"${str.replace(/"/g, '""')}"` : "";

    const csvRows = decisions.map((decision) => {
      const jurisdictions =
        decision.jurisdictionCodes
          ?.split(",")
          .filter(Boolean)
          .join("; ") ?? "";

      const links = decision.evidence
        .filter((e) => e.fileType === "LINK")
        .map((e) => e.fileUrl)
        .join("; ");

      return [
        safe(decision.id),
        safe(decision.title),
        safe(decision.summary),
        safe(decision.status),
        safe(decision.taxType),
        safe(jurisdictions),
        safe(decision.author?.name ?? "Unknown"),
        safe(decision.createdAt.toISOString()),
        safe(decision.updatedAt.toISOString()),
        safe(links),
      ].join(",");
    });

    const csvContent = [headers.join(","), ...csvRows].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition":
          'attachment; filename="tax_decisions_export.csv"',
      },
    });
  } catch (error) {
    console.error("Export failed:", error);
    return new NextResponse("Export failed", { status: 500 });
  }
}
