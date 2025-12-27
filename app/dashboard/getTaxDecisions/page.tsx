import Link from "next/link";
import { Header } from "@/app/components/TaxDecisions/layout/Header";
import { Button } from "@/app/components/TaxDecisions/ui/button";
import { Plus } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/app/components/TaxDecisions/ui/card";
import { db } from "@/lib/TaxDecisions/db";
import { DecisionsFilter } from "@/app/components/TaxDecisions/decisions/DecisionsFilter";
import { cn } from "@/lib";

import ExportCsvButton from "./ExportCsvButton"; // 👈 NEW

async function getDecisions(jurisdiction?: string, query?: string) {
  const where: any = {};

  if (jurisdiction && jurisdiction !== "ALL") {
    where.jurisdictionCodes = { contains: jurisdiction };
  }

  if (query) {
    where.OR = [
      { title: { contains: query } },
      { summary: { contains: query } },
    ];
  }

  return db.decision.findMany({
    where,
    orderBy: { updatedAt: "desc" },
  });
}

export default async function DecisionsPage({
  searchParams,
}: {
  searchParams: { jurisdiction?: string; query?: string };
}) {
  const decisions = await getDecisions(
    searchParams.jurisdiction,
    searchParams.query
  );

  return (
    <div>
      <Header title="Decisions">
        <div className="flex gap-2">
          {/* ✅ Client component, same position */}
          <ExportCsvButton />

          <Link href="/dashboard/getTaxDecisions/new">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Decision
            </Button>
          </Link>
        </div>
      </Header>

      <div className="p-8 space-y-6">
        {/* ⬇️ UI structure unchanged */}
        <div className="flex items-center justify-between">
          <DecisionsFilter />
        </div>

        <div className="grid gap-4">
          {decisions.length === 0 ? (
            <div className="p-12 text-center border rounded-lg bg-white border-dashed">
              <p className="text-slate-500">
                No decisions found matching your criteria.
              </p>
            </div>
          ) : (
            decisions.map((decision) => (
              <Link
                href={`/dashboard/getTaxDecisions/${decision.id}`}
                key={decision.id}
              >
                <Card className="hover:border-indigo-200 transition-colors cursor-pointer group h-full">
                  <CardHeader className="py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <CardTitle className="text-lg group-hover:text-indigo-600">
                          {decision.title}
                        </CardTitle>

                        <p className="text-sm text-slate-500 line-clamp-2">
                          {decision.summary}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-2">
                          {decision.jurisdictionCodes
                            ?.split(",")
                            .filter(Boolean)
                            .map((code) => (
                              <span
                                key={code}
                                className="px-1.5 py-0.5 text-[10px] font-bold uppercase rounded-md bg-slate-100 border"
                              >
                                {code}
                              </span>
                            ))}
                        </div>
                      </div>

                      <span
                        className={cn(
                          "px-2 py-1 text-xs font-semibold rounded-full",
                          decision.status === "FINAL"
                            ? "bg-green-100 text-green-700"
                            : decision.status === "DRAFT"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-slate-100 text-slate-600"
                        )}
                      >
                        {decision.status}
                      </span>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
