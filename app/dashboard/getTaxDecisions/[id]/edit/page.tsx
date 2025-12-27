import { db } from "@/lib/TaxDecisions/db";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { EvidenceSection } from "@/app/components/TaxDecisions/evidence/EvidenceSection";
import { Header } from "@/app/components/TaxDecisions/layout/Header";
import { EditDecisionForm } from "@/app/components/TaxDecisions/decisions/EditDecisionForm";

export default async function EditDecisionPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions as any);
  // @ts-ignore
  if (session?.user?.role !== "TAX_TECH") {
    redirect(`/dashboard/getTaxDecisions/${params.id}`);
  }

  const decision = await db.decision.findUnique({
    where: { id: params.id },
    include: { evidence: true }
  });

  if (!decision) {
    notFound();
  }

  return (
    <div>
      <Header title={`Edit Decision: ${decision.title}`} />
      <div className="max-w-5xl mx-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <EditDecisionForm decision={decision} />
        </div>
        <div className="space-y-6">
           <EvidenceSection decisionId={decision.id} initialEvidence={decision.evidence} editable={true} />
        </div>
      </div>
    </div>
  );
}
