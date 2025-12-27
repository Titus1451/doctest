import { useMemo } from "react";
import { Decision, AuditRecord } from "../types";

type Props = {
  decisions: Decision[];
  audits: AuditRecord[];
  query: string;
  onQueryChange: (value: string) => void;
  filters: {
    status: string;
    jurisdiction: string;
    taxType: string;
  };
  onFiltersChange: (filters: Props["filters"]) => void;
};

const uniqueValues = (items: string[]) =>
  Array.from(new Set(items.filter(Boolean))).sort();

export function SearchFilterBar({
  decisions,
  audits,
  query,
  onQueryChange,
  filters,
  onFiltersChange
}: Props) {
  const jurisdictions = useMemo(
    () =>
      uniqueValues([
        ...decisions.map((d) => d.jurisdiction),
        ...audits.map((a) => a.jurisdiction)
      ]),
    [decisions, audits]
  );
  const taxTypes = useMemo(
    () =>
      uniqueValues([
        ...decisions.map((d) => d.taxType),
        ...audits.map((a) => a.taxType)
      ]),
    [decisions, audits]
  );

  const statuses = ["All", "Draft", "Final", "Deprecated"];

  const handleSelectChange =
    (key: keyof Props["filters"]) =>
    (value: string): void =>
      onFiltersChange({ ...filters, [key]: value });

  return (
    <div className="card flex flex-col gap-3 p-4 md:flex-row md:items-end md:gap-6">
      <div className="flex-1">
        <label className="label">Search</label>
        <input
          className="input"
          value={query}
          placeholder="Search titles, summaries, rationales, evidence notes..."
          onChange={(e) => onQueryChange(e.target.value)}
        />
      </div>
      <div>
        <label className="label">Status</label>
        <select
          className="input"
          value={filters.status}
          onChange={(e) => handleSelectChange("status")(e.target.value)}
        >
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">Jurisdiction</label>
        <select
          className="input"
          value={filters.jurisdiction}
          onChange={(e) => handleSelectChange("jurisdiction")(e.target.value)}
        >
          <option value="">All</option>
          {jurisdictions.map((j) => (
            <option key={j}>{j}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="label">Tax type</label>
        <select
          className="input"
          value={filters.taxType}
          onChange={(e) => handleSelectChange("taxType")(e.target.value)}
        >
          <option value="">All</option>
          {taxTypes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
