import { Evidence } from "../types";
import { Badge } from "./Badge";

type Props = {
  items: Evidence[];
};

const typeTone: Record<Evidence["type"], "blue" | "green" | "gray"> = {
  link: "blue",
  file: "green",
  note: "gray"
};

export function EvidenceList({ items }: Props) {
  if (!items.length) {
    return (
      <p className="text-sm text-slate-500">No evidence attached yet.</p>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((evidence) => (
        <div
          key={evidence.id}
          className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-slate-900">{evidence.title}</p>
              <Badge label={evidence.type.toUpperCase()} tone={typeTone[evidence.type]} />
            </div>
            {evidence.url ? (
              <a
                href={evidence.url}
                className="text-sm text-midnight-600 underline"
                target="_blank"
                rel="noreferrer"
              >
                {evidence.url}
              </a>
            ) : null}
            {evidence.filename ? (
              <p className="text-sm text-slate-600">{evidence.filename}</p>
            ) : null}
            {evidence.notes ? (
              <p className="text-sm text-slate-600">{evidence.notes}</p>
            ) : null}
            <p className="text-xs text-slate-500">
              Uploaded by {evidence.uploadedBy} on{" "}
              {new Date(evidence.uploadedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
