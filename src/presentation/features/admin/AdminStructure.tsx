import { BookOpen, Calendar, LayoutDashboard, Plus } from "lucide-react";
import { subjects } from "@/infrastructure/data/mock";

export function AdminStructure() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
          Academic Structure
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Subjects, Sections, Semesters & Teacher Assignments</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        {[
          { label: "Active Subjects", value: "24", icon: <BookOpen size={18} /> },
          { label: "Sections", value: "38", icon: <LayoutDashboard size={18} /> },
          { label: "Current Semester", value: "Sem 2 — 2026", icon: <Calendar size={18} /> },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl border border-border p-5 flex items-center gap-4">
            <span className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-primary">{stat.icon}</span>
            <div>
              <p className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
                {stat.value}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
            Teacher–Subject Assignments
          </h3>
          <button className="flex items-center gap-1.5 text-primary text-sm font-medium hover:underline">
            <Plus size={14} /> Assign
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Subject", "Teacher", "Teacher ID", "Section(s)", "Avg Score"].map((header) => (
                  <th key={header} className="text-left py-3 px-2 text-muted-foreground font-medium text-xs uppercase tracking-wide">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-secondary/40 transition-colors">
                  <td className="py-3 px-2 font-medium text-foreground">{subject.name}</td>
                  <td className="py-3 px-2 text-foreground">{subject.teacher}</td>
                  <td className="py-3 px-2 font-mono text-xs text-muted-foreground">{subject.id}</td>
                  <td className="py-3 px-2 text-muted-foreground">{subject.section}</td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden max-w-[80px]">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${subject.score}%` }} />
                      </div>
                      <span className="text-xs font-medium text-foreground">{subject.score}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
