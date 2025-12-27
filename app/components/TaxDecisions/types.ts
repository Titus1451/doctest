export type EvidenceType = "file" | "link" | "note";

export type Evidence = {
  id: string;
  type: EvidenceType;
  title: string;
  url?: string;
  filename?: string;
  notes?: string;
  uploadedBy: string;
  uploadedAt: string;
};

export type Decision = {
  id: string;
  title: string;
  summary: string;
  rationale: string;
  ruleReference: string;
  jurisdiction: string;
  taxType: string;
  effectiveDate: string;
  status: "Draft" | "Active" | "Deprecated";
  tags: string[];
  relatedDecisionIds: string[];
  evidence: Evidence[];
  createdBy: string;
  updatedAt: string;
  version: number;
};

export type AuditRecord = {
  id: string;
  title: string;
  context: string;
  narrative: string;
  outcome: string;
  authority: string;
  period: string;
  status: "Draft" | "Active" | "Deprecated";
  jurisdiction: string;
  taxType: string;
  tags: string[];
  linkedDecisionIds: string[];
  evidence: Evidence[];
  createdBy: string;
  updatedAt: string;
  version: number;
};

export type UserRole = "Admin" | "Editor" | "Viewer";

export type ActivityLog = {
  id: string;
  type: "decision" | "audit" | "evidence";
  action: string;
  actor: string;
  timestamp: string;
  reference: string;
};
