import { Header } from "@/app/components/TaxDecisions/layout/Header";
import { db } from "@/lib/TaxDecisions/db";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/TaxDecisions/ui/card";
import { EvidenceSection } from "@/app/components/TaxDecisions/evidence/EvidenceSection";
import { format } from "date-fns";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Link from "next/link";
import { Button } from "@/app/components/TaxDecisions/ui/button";
import { Pencil } from "lucide-react";
import { cn } from "@/lib";

export default async function DecisionDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions as any);
  // @ts-ignore
  const isAuthorized = session?.user?.role === 'TAX_TECH';

  const decision = await db.decision.findUnique({
    where: { id: params.id },
    include: { evidence: true }
  });

  if (!decision) {
    notFound();
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <Header title="Decision Details">
        {isAuthorized && (
          <Link href={`/dashboard/getTaxDecisions/${decision.id}/edit`}>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Pencil className="h-4 w-4" />
              Edit Decision
            </Button>
          </Link>
        )}
      </Header>
      
      <div className="max-w-5xl mx-auto p-8 space-y-8">
        {/* Top Meta Section */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-slate-900">{decision.title}</h1>
            </div>
            <p className="text-lg text-slate-500 mt-2">{decision.summary}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className={cn(
                "px-3 py-1.5 text-[10px] font-black uppercase rounded-full border tracking-widest transition-all shadow-sm",
                decision.status === "FINAL"
                  ? "bg-custom-green-light text-custom-green border-custom-green/30"
                  : decision.status === "DRAFT"
                  ? "bg-custom-orange-light text-custom-orange border-custom-orange/30"
                  : "bg-slate-50 text-slate-500 border-slate-200"
              )}
            >
              {decision.status}
            </span>
            <div className="text-[10px] font-bold text-slate-400 font-humanist uppercase tracking-tighter">
              Ref: {decision.id.slice(-8).toUpperCase()}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-sm ring-1 ring-slate-100 p-8 prose prose-slate max-w-none relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-custom-green" />
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 not-prose font-humanist flex items-center gap-2">
                Rationale & Analysis
              </h3>
              <div className="whitespace-pre-wrap text-slate-700 leading-relaxed font-Heebo">
                {decision.rationale}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm ring-1 ring-slate-100 overflow-hidden">
              <div className="h-1 bg-custom-green" />
              <CardHeader className="pb-3 border-b border-slate-50">
                <CardTitle className="text-xs font-black uppercase text-slate-400 font-humanist tracking-widest">Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Tax Type</label>
                  <p className="font-bold text-slate-900 border-l-2 border-custom-orange pl-3 ml-0.5">{decision.taxType || "N/A"}</p>
                </div>
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Jurisdiction</label>
                   <div className="flex flex-wrap gap-2 mt-2">
                      {decision.jurisdictionCodes ? (
                        decision.jurisdictionCodes.split(",").filter(Boolean).map(code => (
                          <span key={code} className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded border bg-custom-green-light/10 border-custom-green/20 text-custom-green font-humanist transition-colors">
                            {code}
                          </span>
                        ))
                      ) : (
                        <p className="font-bold text-slate-900">Global</p>
                      )}
                   </div>
                </div>
                <div>
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Audit Control</label>
                   <div className="space-y-2 mt-2">
                     <div className="flex flex-col bg-slate-50 p-2 rounded border border-slate-100">
                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-tight">Created By</span>
                        <span className="text-[11px] font-bold text-slate-700 break-all">{decision.createdBy || "Unknown"}</span>
                        <span className="text-[9px] text-slate-400 mt-0.5 font-medium">{format(decision.createdAt, "PPP")}</span>
                     </div>
                     <div className="flex flex-col bg-slate-50 p-2 rounded border border-slate-100">
                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-tight">Last Updated By</span>
                        <span className="text-[11px] font-bold text-slate-700 break-all">{decision.updatedBy || "Unknown"}</span>
                        <span className="text-[9px] text-slate-400 mt-0.5 font-medium">{format(decision.updatedAt, "PPP")}</span>
                     </div>
                   </div>
                </div>
              </CardContent>
            </Card>

            <EvidenceSection 
              decisionId={decision.id} 
              initialEvidence={decision.evidence} 
              editable={false} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
