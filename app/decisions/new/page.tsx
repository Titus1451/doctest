import { Header } from "@/components/layout/Header";
import { DecisionForm } from "@/components/decisions/DecisionForm";
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
