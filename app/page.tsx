 "use client";

import { useMemo, useState } from "react";
import { ActivityLog, AuditRecord, Decision } from "./types";
import { decisions as seedDecisions, audits as seedAudits } from "./data/mockData";
import { StatCard } from "./components/StatCard";
import { SearchFilterBar } from "./components/SearchFilterBar";
import { RecordCard } from "./components/RecordCard";
import { SectionCard } from "./components/SectionCard";
import { CreateDecisionForm } from "./components/CreateDecisionForm";
import { CreateAuditForm } from "./components/CreateAuditForm";
import { QuickActions } from "./components/QuickActions";
import { ActivityLog as ActivityLogList } from "./components/ActivityLog";
import { EmptyState } from "./components/EmptyState";

export default function Page() {
  const [decisionList, setDecisionList] = useState<Decision[]>(seedDecisions);
  const [auditList, setAuditList] = useState<AuditRecord[]>(seedAudits);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    status: "All",
    jurisdiction: "",
    taxType: ""
  });

  const addActivity = (entry: Omit<ActivityLog, "id" | "timestamp">) => {
    setActivity((prev) => [
      {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString(),
        ...entry
      },
      ...prev
    ]);
  };

  const handleDecisionCreate = (decision: Decision) => {
    setDecisionList((prev) => [decision, ...prev]);
    addActivity({
      action: "Created decision",
      actor: decision.createdBy,
      reference: decision.title,
      type: "decision"
    });
  };

  const handleAuditCreate = (audit: AuditRecord) => {
    setAuditList((prev) => [audit, ...prev]);
    addActivity({
      action: "Logged audit explanation",
      actor: audit.createdBy,
      reference: audit.title,
      type: "audit"
    });
  };

  const filterRecords = <T extends { title: string; summary?: string; rationale?: string; narrative?: string; jurisdiction: string; taxType: string; status: string; evidence: { notes?: string; title: string }[] }>(
    records: T[]
  ) => {
    const normalizedQuery = query.toLowerCase();
    return records.filter((record) => {
      const matchesQuery =
        !query ||
        record.title.toLowerCase().includes(normalizedQuery) ||
        (record.summary && record.summary.toLowerCase().includes(normalizedQuery)) ||
        (record.rationale && record.rationale.toLowerCase().includes(normalizedQuery)) ||
        (record.narrative && record.narrative.toLowerCase().includes(normalizedQuery)) ||
        record.evidence.some(
          (e) =>
            e.title.toLowerCase().includes(normalizedQuery) ||
            (e.notes && e.notes.toLowerCase().includes(normalizedQuery))
        );

      const matchesStatus =
        filters.status === "All" || record.status === filters.status;
      const matchesJurisdiction =
        !filters.jurisdiction || record.jurisdiction === filters.jurisdiction;
      const matchesTaxType = !filters.taxType || record.taxType === filters.taxType;
      return matchesQuery && matchesStatus && matchesJurisdiction && matchesTaxType;
    });
  };

  const filteredDecisions = useMemo(
    () => filterRecords(decisionList),
    [decisionList, query, filters]
  );

  const filteredAudits = useMemo(
    () => filterRecords(auditList),
    [auditList, query, filters]
  );

  const stats = [
    { label: "Total decisions", value: decisionList.length },
    { label: "Total audits", value: auditList.length },
    {
      label: "Evidence items",
      value:
        decisionList.reduce((acc, d) => acc + d.evidence.length, 0) +
        auditList.reduce((acc, a) => acc + a.evidence.length, 0)
    }
  ];

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-4 pb-10 md:p-8">
      <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-midnight-600">
            Tax team document store
          </p>
          <h1 className="text-3xl font-bold text-slate-900">
            Decisions, audits, and supporting evidence
          </h1>
          <p className="text-sm text-slate-600">
            Capture rationale, attach evidence, and keep audits defensible.
          </p>
        </div>
        <QuickActions
          onAddDecision={() => {
            const anchor = document.getElementById("decision-form");
            anchor?.scrollIntoView({ behavior: "smooth" });
          }}
          onAddAudit={() => {
            const anchor = document.getElementById("audit-form");
            anchor?.scrollIntoView({ behavior: "smooth" });
          }}
        />
      </header>

      <div className="grid gap-3 md:grid-cols-3">
        {stats.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>

      <SearchFilterBar
        decisions={decisionList}
        audits={auditList}
        query={query}
        onQueryChange={setQuery}
        filters={filters}
        onFiltersChange={setFilters}
      />

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          {filteredDecisions.length ? (
            filteredDecisions.map((decision) => (
              <RecordCard
                key={decision.id}
                type="decision"
                record={decision}
                related={decision.relatedDecisionIds}
              />
            ))
          ) : (
            <EmptyState
              title="No decisions yet"
              description="Add your first decision to capture rationale and evidence."
              action={
                <button
                  className="btn-primary"
                  onClick={() =>
                    document.getElementById("decision-form")?.scrollIntoView({
                      behavior: "smooth"
                    })
                  }
                >
                  Add decision
                </button>
              }
            />
          )}
          {filteredAudits.length ? (
            filteredAudits.map((audit) => (
              <RecordCard
                key={audit.id}
                type="audit"
                record={audit}
                related={audit.linkedDecisionIds}
              />
            ))
          ) : (
            <EmptyState
              title="No audit explanations yet"
              description="Log audit narratives, what was shared, and outcomes."
              action={
                <button
                  className="btn-secondary"
                  onClick={() =>
                    document.getElementById("audit-form")?.scrollIntoView({
                      behavior: "smooth"
                    })
                  }
                >
                  Add audit explanation
                </button>
              }
            />
          )}
        </div>

        <div className="space-y-4">
          <SectionCard
            title="Add a decision"
            description="Capture rule, rationale, and evidence so future filings stay consistent."
            action={<span id="decision-form" />}
          >
            <CreateDecisionForm onCreate={handleDecisionCreate} />
          </SectionCard>

          <SectionCard
            title="Add an audit explanation"
            description="Document what you shared with authorities and the outcome."
            action={<span id="audit-form" />}
          >
            <CreateAuditForm onCreate={handleAuditCreate} />
          </SectionCard>

          <SectionCard title="Recent activity" description="Audit log of key updates.">
            <ActivityLogList items={activity} />
          </SectionCard>
        </div>
      </div>
    </main>
  );
}
