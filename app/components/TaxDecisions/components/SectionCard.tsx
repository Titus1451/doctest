import { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
};

export function SectionCard({ title, description, action, children }: Props) {
  return (
    <section className="card p-6">
      <header className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="section-title">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-slate-600">{description}</p>
          ) : null}
        </div>
        {action}
      </header>
      <div>{children}</div>
    </section>
  );
}
