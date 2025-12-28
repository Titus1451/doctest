import { Header } from "@/app/components/TaxDecisions/layout/Header";
import { DecisionForm } from "@/app/components/TaxDecisions/decisions/DecisionForm";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { notFound } from "next/navigation";
export default async function NewDecisionPage() {
  const session = await getServerSession(authOptions as any);
  // @ts-ignore
  const isAuthorized = session?.user?.role === 'TAX_TECH';
  if (!isAuthorized) {
    notFound();
  }
  return (
    <div>
      <Header title="New Decision" />
      <div className="p-8">
        <DecisionForm />
      </div>
    </div>
  );
}
