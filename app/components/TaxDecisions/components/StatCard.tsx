type Props = {
  label: string;
  value: string | number;
  helper?: string;
};

export function StatCard({ label, value, helper }: Props) {
  return (
    <div className="card h-full p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      {helper ? <p className="text-xs text-slate-500">{helper}</p> : null}
    </div>
  );
}
