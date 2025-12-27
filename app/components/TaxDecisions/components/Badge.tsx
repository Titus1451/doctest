type Props = {
  label: string;
  tone?: "gray" | "green" | "amber" | "blue";
};

const toneClasses: Record<Required<Props>["tone"], string> = {
  gray: "bg-slate-100 text-slate-800",
  green: "bg-emerald-100 text-emerald-800",
  amber: "bg-amber-100 text-amber-800",
  blue: "bg-blue-100 text-blue-800"
};

export function Badge({ label, tone = "gray" }: Props) {
  return (
    <span className={`chip ${toneClasses[tone]} border border-white`}>
      {label}
    </span>
  );
}
