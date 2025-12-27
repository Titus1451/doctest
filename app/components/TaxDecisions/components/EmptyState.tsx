type Props = {
  title: string;
  description: string;
  action?: React.ReactNode;
};

export function EmptyState({ title, description, action }: Props) {
  return (
    <div className="card flex flex-col items-center justify-center gap-3 p-6 text-center">
      <div className="h-12 w-12 rounded-full bg-midnight-50 text-midnight-600">
        <svg
          className="h-12 w-12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M12 6v6l3 3" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      </div>
      <div>
        <p className="text-lg font-semibold text-slate-900">{title}</p>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
      {action}
    </div>
  );
}
