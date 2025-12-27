import { Header } from "@/components/layout/Header";
import { DecisionForm } from "@/components/decisions/DecisionForm";
import { db } from "@/lib/db";

export default async function NewDecisionPage() {
  const jurisdictions = await db.jurisdiction.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div>
      <Header title="New Decision" />
      <div className="p-8">
        <DecisionForm jurisdictions={jurisdictions} />
      </div>
    </div>
  );
}
