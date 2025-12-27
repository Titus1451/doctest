"use client";

import { FormEvent, useMemo, useState } from "react";
import { Decision, Evidence } from "../types";
import { Badge } from "./Badge";
import { EvidenceList } from "./EvidenceList";

type Props = {
  onCreate: (decision: Decision) => void;
};

const defaultDecision: Omit<
  Decision,
  "id" | "createdBy" | "updatedAt" | "version" | "evidence" | "relatedDecisionIds"
> = {
  title: "",
  summary: "",
  rationale: "",
  ruleReference: "",
  jurisdiction: "",
  taxType: "VAT",
  effectiveDate: new Date().toISOString().slice(0, 10),
  status: "Draft",
  tags: []
};

export function CreateDecisionForm({ onCreate }: Props) {
  const [form, setForm] = useState(defaultDecision);
  const [tagInput, setTagInput] = useState("");
  const [evidence, setEvidence] = useState<Evidence[]>([]);

  const canSubmit = useMemo(
    () => form.title.trim().length > 3 && form.summary.trim().length > 8,
    [form.title, form.summary]
  );

  const addTag = () => {
    if (!tagInput.trim()) return;
    setForm((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
    setTagInput("");
  };

  const addEvidence = (data: Partial<Evidence>) => {
    const newEvidence: Evidence = {
      id: `ev-${Date.now()}`,
      title: data.title || "Untitled evidence",
      type: data.type || "note",
      url: data.url,
      filename: data.filename,
      notes: data.notes,
      uploadedAt: new Date().toISOString(),
      uploadedBy: "You"
    };
    setEvidence((prev) => [...prev, newEvidence]);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    const decision: Decision = {
      ...form,
      id: `dec-${Date.now()}`,
      createdBy: "You",
      updatedAt: new Date().toISOString(),
      version: 1,
      relatedDecisionIds: [],
      evidence
    };
    onCreate(decision);
    setForm(defaultDecision);
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
            placeholder="e.g., Nevada Ice Taxability"
            required
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
      <div className="grid gap-3 md:grid-cols-2">
        <div className="space-y-1">
          <label className="label">Jurisdiction</label>
          <input
            className="input"
            value={form.jurisdiction}
            onChange={(e) => setForm({ ...form, jurisdiction: e.target.value })}
            placeholder="e.g., EU, US, UK"
          />
        </div>
        <div className="space-y-1">
          <label className="label">Effective date</label>
          <input
            type="date"
            className="input"
            value={form.effectiveDate}
            onChange={(e) => setForm({ ...form, effectiveDate: e.target.value })}
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="label">Summary</label>
        <textarea
          className="input h-20 resize-none"
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          placeholder="Brief description of the decision"
        />
      </div>
      <div className="space-y-1">
        <label className="label">Rationale</label>
        <textarea
          className="input h-24 resize-none"
          value={form.rationale}
          onChange={(e) => setForm({ ...form, rationale: e.target.value })}
          placeholder="Detailed rationale, citations, and reasoning"
        />
      </div>
      <div className="space-y-1">
        <label className="label">Rule reference</label>
        <input
          className="input"
          value={form.ruleReference}
          onChange={(e) => setForm({ ...form, ruleReference: e.target.value })}
          placeholder="e.g., Wayfair 2018, VAT Article 14a"
        />
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
              onClick={() =>
                addEvidence({ title: "Link", type: "link", url: "https://" })
              }
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
                  filename: "evidence.pdf"
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
                  notes: "Context or annotation"
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
          Save decision
        </button>
      </div>
    </form>
  );
}
