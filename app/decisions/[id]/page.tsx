import { Header } from "@/components/layout/Header";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // I need to create this or use a simple span
import { EvidenceSection } from "@/components/evidence/EvidenceSection";
import { format } from "date-fns";

export default async function DecisionDetailPage({ params }: { params: { id: string } }) {
  const decision = await db.decision.findUnique({
    where: { id: params.id },
    include: { evidence: true }
  });

  if (!decision) {
    notFound();
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <Header title="Decision Details" />
      
      <div className="max-w-5xl mx-auto p-8 space-y-8">
        {/* Top Meta Section */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{decision.title}</h1>
            <p className="text-lg text-slate-500 mt-2">{decision.summary}</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className="px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-700">
              {decision.status}
            </span>
            <span className="text-sm text-slate-400">
              Updated {format(decision.updatedAt, "MMM d, yyyy")}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-sm border p-8 prose prose-slate max-w-none">
              <h3 className="text-lg font-semibold text-slate-900 mb-4 not-prose">Rationale</h3>
              <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                {decision.rationale}
              </div>
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Metadata</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase">Tax Type</label>
                  <p className="font-medium">{decision.taxType || "N/A"}</p>
                </div>
                <div>
                   <label className="text-xs font-semibold text-slate-500 uppercase">Jurisdiction</label>
                   <p className="font-medium">{decision.jurisdiction || "Global"}</p>
                </div>
              </CardContent>
            </Card>

            <EvidenceSection decisionId={decision.id} initialEvidence={decision.evidence} />
          </div>
        </div>
      </div>
    </div>
  );
}
