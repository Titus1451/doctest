import { ActivityLog as ActivityLogType } from "../types";

type Props = {
  items: ActivityLogType[];
};

export function ActivityLog({ items }: Props) {
  if (!items.length) {
    return <p className="text-sm text-slate-500">No recent activity yet.</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-start justify-between rounded-xl border border-slate-100 bg-white px-4 py-3"
        >
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {item.action}
            </p>
            <p className="text-xs text-slate-600">
              {item.type.toUpperCase()} • {item.reference}
            </p>
          </div>
          <div className="text-right text-xs text-slate-500">
            <p>{item.actor}</p>
            <p>{new Date(item.timestamp).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
