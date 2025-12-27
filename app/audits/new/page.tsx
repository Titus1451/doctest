import { Header } from "@/components/layout/Header";
import { AuditForm } from "@/components/audits/AuditForm";

export default function NewAuditPage() {
  return (
    <div>
      <Header title="New Audit Explanation" />
      <div className="p-8">
        <AuditForm />
      </div>
    </div>
  );
}
