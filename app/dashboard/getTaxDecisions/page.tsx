import Link from "next/link";
import { Header } from "@/app/components/TaxDecisions/layout/Header";
import { Button } from "@/app/components/TaxDecisions/ui/button";
import { Plus } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/app/components/TaxDecisions/ui/card";
import { db } from "@/lib/TaxDecisions/db";
import { DecisionsFilter } from "@/app/components/TaxDecisions/decisions/DecisionsFilter";
import { cn } from "@/lib";

import ExportCsvButton from "./ExportCsvButton"; // 👈 NEW

import { JURISDICTIONS } from "@/lib/TaxDecisions/constants";

async function getDecisions(params: { jurisdiction?: string; query?: string; status?: string; taxType?: string }) {
  const { jurisdiction, query, status, taxType } = params;
  const where: any = {};

  // 1. Categorical Filters (Top-level for performance)
  if (jurisdiction && jurisdiction !== "ALL") {
    where.jurisdictionCodes = { contains: jurisdiction };
  }

  if (status && status !== "ALL") {
    where.status = status;
  }

  if (taxType && taxType !== "ALL") {
    where.taxType = taxType;
  }

  // 2. Smart Keyword Search
  if (query) {
    const matchingJurisdictionCodes = JURISDICTIONS
      .filter(j => j.name.toLowerCase().includes(query.toLowerCase()) || j.code.toLowerCase().includes(query.toLowerCase()))
      .map(j => j.code);

    where.OR = [
      { title: { contains: query, mode: 'insensitive' } },
      { summary: { contains: query, mode: 'insensitive' } },
      { taxType: { contains: query, mode: 'insensitive' } },
      { createdBy: { contains: query, mode: 'insensitive' } },
      { updatedBy: { contains: query, mode: 'insensitive' } },
      { jurisdictionCodes: { contains: query, mode: 'insensitive' } },
      {
        evidence: {
          some: {
            OR: [
              { fileName: { contains: query, mode: 'insensitive' } },
              { fileUrl: { contains: query, mode: 'insensitive' } },
              { notes: { contains: query, mode: 'insensitive' } },
            ]
          }
        }
      }
    ];

    if (matchingJurisdictionCodes.length > 0) {
      matchingJurisdictionCodes.forEach(code => {
        where.OR.push({ jurisdictionCodes: { contains: code, mode: 'insensitive' } });
      });
    }
  }

  return db.decision.findMany({
    where,
    orderBy: { updatedAt: "desc" },
  });
}

export default async function DecisionsPage({
  searchParams,
}: {
  searchParams: { jurisdiction?: string; query?: string; status?: string; taxType?: string };
}) {
  const decisions = await getDecisions(searchParams);

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
                <Card className="hover:border-custom-green transition-all duration-300 cursor-pointer group h-full hover:shadow-lg hover:-translate-y-1 bg-white border-slate-200">
                  <CardHeader className="py-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <CardTitle className="text-xl font-bold group-hover:text-custom-green transition-colors font-humanist uppercase tracking-tight">
                          {decision.title}
                        </CardTitle>
 
                        <p className="text-sm text-slate-500 line-clamp-2 italic font-medium">
                          {decision.summary}
                        </p>
 
                        <div className="flex flex-wrap gap-2 mt-3">
                          {decision.jurisdictionCodes
                            ?.split(",")
                            .filter(Boolean)
                            .map((code) => (
                              <span
                                key={code}
                                className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded border bg-slate-50 text-slate-700 border-slate-200 group-hover:border-custom-green-light group-hover:bg-custom-green-light/10 transition-colors"
                              >
                                {code}
                              </span>
                            ))}
                        </div>
                      </div>
 
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span
                          className={cn(
                            "px-3 py-1 text-[10px] font-black uppercase rounded-full border tracking-widest whitespace-nowrap",
                            decision.status === "FINAL"
                              ? "bg-custom-green-light text-custom-green border-custom-green/30"
                              : decision.status === "DRAFT"
                              ? "bg-custom-orange-light text-custom-orange border-custom-orange/30"
                              : "bg-slate-50 text-slate-500 border-slate-200"
                          )}
                        >
                          {decision.status}
                        </span>
                        {decision.taxType && (
                          <span className="text-[9px] font-black uppercase text-slate-400 font-humanist tracking-wider bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-custom-orange" />
                            {decision.taxType}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <div className="px-6 pb-4">
                     <div className="flex gap-4 text-xs text-slate-400">
                        <span>Created by: {decision.createdBy || "Unknown"}</span>
                        <span>Updated by: {decision.updatedBy || "Unknown"}</span>
                     </div>
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
