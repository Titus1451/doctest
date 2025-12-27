import { Header } from "@/app/components/TaxDecisions/layout/Header";
import { DecisionForm } from "@/app/components/TaxDecisions/decisions/DecisionForm";
export default async function NewDecisionPage() {
  return (
    <div>
      <Header title="New Decision" />
      <div className="p-8">
        <DecisionForm />
      </div>
    </div>
  );
}
