import { TrendingUp } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  sub?: string;
  icon: React.ReactNode;
  trend?: number;
};

export function StatCard({ label, value, sub, icon, trend }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-border p-4 md:p-5 flex flex-col gap-2 md:gap-3">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs md:text-sm font-medium leading-tight">{label}</span>
        <span className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-secondary flex items-center justify-center text-primary flex-shrink-0">
          {icon}
        </span>
      </div>
      <div>
        <span className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
          {value}
        </span>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? "text-teal-600" : "text-red-500"}`}>
          <TrendingUp size={12} />
          {trend >= 0 ? "+" : ""}
          {trend}% from last semester
        </div>
      )}
    </div>
  );
}
