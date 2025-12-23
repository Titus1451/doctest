import { AuditRecord, Decision } from "../types";
import { Badge } from "./Badge";
import { EvidenceList } from "./EvidenceList";

type Props = {
  type: "decision" | "audit";
  record: Decision | AuditRecord;
  related?: string[];
};

export function RecordCard({ type, record, related = [] }: Props) {
  const isDecision = type === "decision";

  const meta = [
    { label: "Jurisdiction", value: record.jurisdiction },
    { label: "Tax type", value: record.taxType },
    {
      label: isDecision ? "Effective date" : "Period",
      value: "effectiveDate" in record ? record.effectiveDate : record.period
    },
    { label: "Status", value: record.status }
  ];

  const tags = "tags" in record ? record.tags : [];
  const evidence = "evidence" in record ? record.evidence : [];

  return (
    <div className="card p-5">
      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              {isDecision ? "Decision" : "Audit"}
            </p>
            <Badge
              label={record.status}
              tone={
                record.status === "Final"
                  ? "green"
                  : record.status === "Draft"
                    ? "blue"
                    : "amber"
              }
            />
            <span className="text-xs text-slate-500">
              v{"version" in record ? record.version : 1}
            </span>
          </div>
          <h3 className="mt-1 text-xl font-semibold text-slate-900">
            {record.title}
          </h3>
          {"summary" in record ? (
            <p className="mt-1 text-sm text-slate-700">{record.summary}</p>
          ) : (
            <p className="mt-1 text-sm text-slate-700">
              {"context" in record ? record.context : ""}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} label={tag} />
          ))}
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {meta.map((item) => (
          <div key={item.label}>
            <dt className="text-xs uppercase tracking-wide text-slate-500">
              {item.label}
            </dt>
            <dd className="text-sm font-medium text-slate-900">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      {isDecision ? (
        <div className="mt-4 space-y-3">
          <div>
            <p className="label">Rationale</p>
            <p className="text-sm text-slate-800">
              {(record as Decision).rationale}
            </p>
          </div>
          <div>
            <p className="label">Rule reference</p>
            <p className="text-sm text-slate-800">
              {(record as Decision).ruleReference}
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <div>
            <p className="label">Narrative</p>
            <p className="text-sm text-slate-800">
              {(record as AuditRecord).narrative}
            </p>
          </div>
          <div>
            <p className="label">Outcome</p>
            <p className="text-sm text-slate-800">
              {(record as AuditRecord).outcome}
            </p>
          </div>
        </div>
      )}

      {related.length ? (
        <div className="mt-4">
          <p className="label">Linked records</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {related.map((id) => (
              <Badge key={id} label={id} tone="blue" />
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-4">
        <p className="label">Evidence</p>
        <EvidenceList items={evidence} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-500">
        <span>Owner: {record.createdBy}</span>
        <span>Updated: {new Date(record.updatedAt).toLocaleString()}</span>
      </div>
    </div>
  );
}
