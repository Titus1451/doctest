type Props = {
  onAddDecision: () => void;
  onAddAudit: () => void;
};

export function QuickActions({ onAddDecision, onAddAudit }: Props) {
  return (
    <div className="card p-4">
      <p className="text-sm font-semibold text-slate-900">
        Quick capture
      </p>
      <p className="text-xs text-slate-600">
        Add new knowledge so the team can reuse it.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button className="btn-primary" onClick={onAddDecision} type="button">
          + Decision
        </button>
        <button className="btn-secondary" onClick={onAddAudit} type="button">
          + Audit explanation
        </button>
      </div>
    </div>
  );
}
