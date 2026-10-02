import { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: string;
  icon: LucideIcon;
  note?: string;
};

export default function DashboardCard({
  title,
  value,
  icon: Icon,
  note = "Ready to manage",
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
          <Icon size={22} />
        </div>

        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
          Active
        </span>
      </div>

      <p className="text-sm font-semibold text-slate-500">{title}</p>

      <h2 className="mt-2 text-4xl font-black text-slate-950">{value}</h2>

      <p className="mt-4 text-sm text-slate-500">{note}</p>
    </div>
  );
}