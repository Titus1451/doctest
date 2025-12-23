import { AuditRecord, Decision, Evidence, EvidenceType } from "../types";

const now = new Date().toISOString();

const evidenceFactory = (
  id: string,
  title: string,
  type: EvidenceType,
  extras: Partial<Evidence> = {}
): Evidence => ({
  id,
  title,
  type,
  uploadedAt: now,
  uploadedBy: "Priya Shah",
  ...extras
});

export const decisions: Decision[] = [
  {
    id: "dec-001",
    title: "EU VAT marketplace facilitation",
    summary:
      "Marketplace is deemed supplier for VAT on third-party sales over €10k threshold.",
    rationale:
      "Aligned with EU VAT e-commerce package 2021; ensured platform collects and remits VAT to avoid seller non-compliance.",
    ruleReference: "EU VAT 2021/Commerce Package, Article 14a",
    jurisdiction: "EU",
    taxType: "VAT",
    effectiveDate: "2023-01-01",
    status: "Final",
    tags: ["VAT", "Marketplace", "EU"],
    relatedDecisionIds: [],
    evidence: [
      evidenceFactory("ev-001", "Commission guidance note", "link", {
        url: "https://taxation-customs.ec.europa.eu"
      }),
      evidenceFactory("ev-002", "Internal memo.pdf", "file", {
        filename: "vat-marketplace-memo.pdf"
      })
    ],
    createdBy: "Priya Shah",
    updatedAt: now,
    version: 3
  },
  {
    id: "dec-002",
    title: "US sales tax nexus - remote sellers",
    summary:
      "Economic nexus triggered above $100k sales or 200 transactions per state.",
    rationale:
      "Based on Wayfair ruling and state-level thresholds; adopted conservative unified trigger for consistency.",
    ruleReference: "Wayfair 2018; State statutes",
    jurisdiction: "US",
    taxType: "Sales Tax",
    effectiveDate: "2022-04-01",
    status: "Final",
    tags: ["Sales Tax", "Nexus", "US"],
    relatedDecisionIds: ["dec-003"],
    evidence: [
      evidenceFactory("ev-003", "Wayfair opinion excerpt", "link", {
        url: "https://www.supremecourt.gov"
      })
    ],
    createdBy: "Samir Patel",
    updatedAt: now,
    version: 2
  },
  {
    id: "dec-003",
    title: "Digital services tax handling",
    summary: "Treat DST as operating expense, not netted against VAT outputs.",
    rationale:
      "Jurisdictions treat DST as income-based levy; not creditable against VAT.",
    ruleReference: "Local DST statutes",
    jurisdiction: "UK",
    taxType: "DST",
    effectiveDate: "2021-09-15",
    status: "Draft",
    tags: ["DST", "UK", "Policy"],
    relatedDecisionIds: [],
    evidence: [],
    createdBy: "Alex Romero",
    updatedAt: now,
    version: 1
  }
];

export const audits: AuditRecord[] = [
  {
    id: "aud-001",
    title: "FR VAT audit 2024 Q2",
    context: "DGFiP inquiry on marketplace deemed supplier obligations.",
    narrative:
      "Provided transaction mapping by seller, verified VAT collected on EU shipments, shared reconciliation extracts.",
    outcome: "Accepted with minor comments",
    authority: "DGFiP",
    period: "2024 Q2",
    status: "Final",
    jurisdiction: "France",
    taxType: "VAT",
    tags: ["Audit", "VAT", "France"],
    linkedDecisionIds: ["dec-001"],
    evidence: [
      evidenceFactory("ev-010", "Reconciliation extract.xlsx", "file", {
        filename: "fr-vat-recon.xlsx"
      }),
      evidenceFactory("ev-011", "DGFiP reply letter", "note", {
        notes: "Letter acknowledged marketplace position; no additional tax."
      })
    ],
    createdBy: "Lea Dubois",
    updatedAt: now,
    version: 2
  }
];
