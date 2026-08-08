import { useState } from "react";
import { Bell, BookOpen, GraduationCap, TrendingUp } from "lucide-react";
import { children, subjects } from "@/infrastructure/data/mock";
import { StatCard } from "@/presentation/components/shared";

export function ParentDashboard() {
  const [selected, setSelected] = useState(0);
  const child = children[selected];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
          Parent Dashboard
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Almaz Girma · PT/6634/26</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {children.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setSelected(i)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
              selected === i
                ? "bg-primary text-white"
                : "bg-white border border-border text-muted-foreground hover:bg-secondary"
            }`}
          >
            <GraduationCap size={15} />
            {c.name}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Student" value={child.grade} sub={child.id} icon={<GraduationCap size={18} />} />
        <StatCard label="Average" value={String(child.avg)} sub="Current semester" icon={<TrendingUp size={18} />} />
        <StatCard label="Subjects" value="5" icon={<BookOpen size={18} />} />
        <StatCard label="Fee Status" value="Pending" sub="Due July 20" icon={<Bell size={18} />} />
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
        <Bell size={18} className="text-amber-600 flex-shrink-0" />
        <div>
          <p className="font-medium text-amber-800 text-sm">School Fee Deadline — July 20, 2026</p>
          <p className="text-amber-600 text-xs">2,400 ETB outstanding. Pay via bank transfer or school cashier.</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
          {child.name} — Subject Performance
        </h3>
        <div className="space-y-3">
          {subjects.map((subject, index) => (
            <div key={index} className="flex items-center gap-4">
              <p className="text-sm text-foreground w-36 flex-shrink-0 truncate">{subject.name}</p>
              <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${subject.score}%` }} />
              </div>
              <span className="text-sm font-semibold text-foreground w-8 text-right">{subject.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
