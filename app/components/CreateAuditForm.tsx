"use client";

import { FormEvent, useMemo, useState } from "react";
import { AuditRecord, Evidence } from "../types";
import { Badge } from "./Badge";
import { EvidenceList } from "./EvidenceList";

type Props = {
  onCreate: (audit: AuditRecord) => void;
};

const defaultAudit: Omit<
  AuditRecord,
  "id" | "createdBy" | "updatedAt" | "version" | "evidence" | "linkedDecisionIds"
> = {
  title: "",
  context: "",
  narrative: "",
  outcome: "",
  authority: "",
  period: "",
  status: "Draft",
  jurisdiction: "",
  taxType: "VAT",
  tags: []
};

export function CreateAuditForm({ onCreate }: Props) {
  const [form, setForm] = useState(defaultAudit);
  const [tagInput, setTagInput] = useState("");
  const [evidence, setEvidence] = useState<Evidence[]>([]);

  const canSubmit = useMemo(
    () => form.title.trim().length > 3 && form.context.trim().length > 5,
    [form.title, form.context]
  );

  const addTag = () => {
    if (!tagInput.trim()) return;
    setForm((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
    setTagInput("");
  };

  const addEvidence = (data: Partial<Evidence>) => {
    const item: Evidence = {
      id: `ev-${Date.now()}`,
      title: data.title || "Evidence",
      type: data.type || "note",
      url: data.url,
      filename: data.filename,
      notes: data.notes,
      uploadedAt: new Date().toISOString(),
      uploadedBy: "You"
    };
    setEvidence((prev) => [...prev, item]);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const audit: AuditRecord = {
      ...form,
      id: `aud-${Date.now()}`,
      createdBy: "You",
      updatedAt: new Date().toISOString(),
      version: 1,
      evidence,
      linkedDecisionIds: []
    };
    onCreate(audit);
    setForm(defaultAudit);
    setTagInput("");
    setEvidence([]);
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <label className="label">Title</label>
          <input
            className="input"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g., FR VAT audit response"
            required
          />
        </div>
        <div className="space-y-1">
          <label className="label">Authority / Period</label>
          <input
            className="input"
            value={form.period}
            onChange={(e) => setForm({ ...form, period: e.target.value })}
            placeholder="DGFiP · 2024 Q2"
          />
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <label className="label">Jurisdiction</label>
          <input
            className="input"
            value={form.jurisdiction}
            onChange={(e) => setForm({ ...form, jurisdiction: e.target.value })}
            placeholder="France"
          />
        </div>
        <div className="space-y-1">
          <label className="label">Tax type</label>
          <select
            className="input"
            value={form.taxType}
            onChange={(e) => setForm({ ...form, taxType: e.target.value })}
          >
            <option>VAT</option>
            <option>Sales Tax</option>
            <option>DST</option>
            <option>Corporate Income</option>
            <option>Payroll</option>
          </select>
        </div>
      </div>
      <div className="space-y-1">
        <label className="label">Audit context</label>
        <textarea
          className="input h-16 resize-none"
          value={form.context}
          onChange={(e) => setForm({ ...form, context: e.target.value })}
          placeholder="Authority request, scope, reference numbers"
        />
      </div>
      <div className="space-y-1">
        <label className="label">Explanation / Narrative</label>
        <textarea
          className="input h-24 resize-none"
          value={form.narrative}
          onChange={(e) => setForm({ ...form, narrative: e.target.value })}
          placeholder="What we explained and why it was defensible"
        />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <label className="label">Outcome</label>
          <input
            className="input"
            value={form.outcome}
            onChange={(e) => setForm({ ...form, outcome: e.target.value })}
            placeholder="Accepted, settled, pending..."
          />
        </div>
        <div className="space-y-1">
          <label className="label">Status</label>
          <select
            className="input"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as AuditRecord['status'] })}
          >
            <option>Draft</option>
            <option>Final</option>
            <option>Deprecated</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="label">Tags</label>
        <div className="flex gap-2">
          <input
            className="input"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add tag"
          />
          <button type="button" className="btn-secondary" onClick={addTag}>
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.tags.map((tag) => (
            <Badge key={tag} label={tag} />
          ))}
        </div>
      </div>

      <div className="space-y-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
        <div className="flex items-center justify-between">
          <p className="label">Evidence</p>
          <div className="flex gap-2">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => addEvidence({ title: "Link", type: "link", url: "https://" })}
            >
              Add link
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() =>
                addEvidence({
                  title: "Upload placeholder",
                  type: "file",
                  filename: "audit-evidence.pdf"
                })
              }
            >
              Add file
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() =>
                addEvidence({
                  title: "Note",
                  type: "note",
                  notes: "Finding or authority response"
                })
              }
            >
              Add note
            </button>
          </div>
        </div>
        <EvidenceList items={evidence} />
      </div>

      <div className="flex justify-end">
        <button type="submit" className="btn-primary" disabled={!canSubmit}>
          Save audit explanation
        </button>
      </div>
    </form>
  );
}
