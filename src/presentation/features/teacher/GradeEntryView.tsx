import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { clampScore, calcAverage, calcLetterGrade } from "@/domain/utils/grades";
import { students } from "@/infrastructure/data/mock";
import { StatusBadge } from "@/presentation/components/shared";

export function GradeEntryView() {
  const sections = ["11-A", "11-B"];
  const [activeSection, setActiveSection] = useState("11-A");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [grades, setGrades] = useState<Record<string, { quiz: string; assignment: string; test: string; final: string }>>(
    Object.fromEntries(
      students.map((s) => [
        s.id,
        {
          quiz: String(s.quiz),
          assignment: String(s.assignment),
          test: String(s.test),
          final: String(s.final),
        },
      ])
    )
  );

  const calcTotal = (id: string) => {
    const g = grades[id];
    return calcAverage(
      clampScore(g.quiz),
      clampScore(g.assignment),
      clampScore(g.test),
      clampScore(g.final)
    );
  };

  const sectionStudents = students
    .filter((s) => s.section === activeSection)
    .map((s) => ({ ...s, total: calcTotal(s.id) }))
    .sort((a, b) => b.total - a.total)
    .map((s, i) => ({ ...s, rank: i + 1 }));

  const FIELDS = [
    { key: "quiz" as const, label: "Quiz", max: 100, color: "bg-blue-50 border-blue-200", accent: "text-blue-600" },
    { key: "assignment" as const, label: "Assignment", max: 100, color: "bg-purple-50 border-purple-200", accent: "text-purple-600" },
    { key: "test" as const, label: "Midterm", max: 100, color: "bg-amber-50 border-amber-200", accent: "text-amber-600" },
    { key: "final" as const, label: "Final Exam", max: 100, color: "bg-teal-50 border-teal-200", accent: "text-teal-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
          Grade Entry
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Mathematics — Semester 2, 2026 · Scores capped at 100
        </p>
      </div>

      {/* Section filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide mr-1">Section:</span>
        {sections.map((sec) => (
          <button
            key={sec}
            onClick={() => {
              setActiveSection(sec);
              setExpandedId(null);
            }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeSection === sec
                ? "bg-primary text-white"
                : "bg-white border border-border text-muted-foreground hover:bg-secondary"
            }`}
          >
            {sec}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">{sectionStudents.length} students</span>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                {["Rank", "Student", "ID", "Quiz", "Assignment", "Midterm", "Final", "Average", "Grade", ""].map((h) => (
                  <th key={h} className="text-left py-3 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sectionStudents.map((s) => {
                const g = grades[s.id];
                const isExpanded = expandedId === s.id;
                const total = s.total;
                const letter = calcLetterGrade(total);
                return (
                  <div key={s.id} className="contents">
                    <tr
                      className={`border-b border-border/50 transition-colors cursor-pointer ${
                        isExpanded ? "bg-secondary/50" : "hover:bg-secondary/30"
                      }`}
                      onClick={() => setExpandedId(isExpanded ? null : s.id)}
                    >
                      {/* Rank */}
                      <td className="py-3 px-3">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            s.rank === 1
                              ? "bg-amber-100 text-amber-700"
                              : s.rank === 2
                              ? "bg-gray-100 text-gray-600"
                              : s.rank === 3
                              ? "bg-orange-100 text-orange-600"
                              : "bg-secondary text-muted-foreground"
                          }`}
                        >
                          {s.rank}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-foreground whitespace-nowrap">{s.name}</td>
                      <td className="py-3 px-3 font-mono text-xs text-muted-foreground">{s.id}</td>
                      <td className="py-3 px-3 text-foreground">{clampScore(g.quiz)}</td>
                      <td className="py-3 px-3 text-foreground">{clampScore(g.assignment)}</td>
                      <td className="py-3 px-3 text-foreground">{clampScore(g.test)}</td>
                      <td className="py-3 px-3 text-foreground">{clampScore(g.final)}</td>
                      <td className="py-3 px-3 font-bold text-foreground">{total}</td>
                      <td className="py-3 px-3">
                        <StatusBadge type={letter} />
                      </td>
                      <td className="py-3 px-3">
                        <ChevronDown size={15} className={`text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {isExpanded && (
                      <tr className="border-b border-border/50 bg-secondary/20">
                        <td colSpan={10} className="px-4 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {FIELDS.map((field) => (
                              <div key={field.key} className={`rounded-xl border p-3 space-y-2 ${field.color}`}>
                                <div className="flex items-center justify-between">
                                  <span className={`text-xs font-semibold uppercase tracking-wide ${field.accent}`}>{field.label}</span>
                                  <span className="text-xs text-muted-foreground">/{field.max}</span>
                                </div>
                                <input
                                  type="number"
                                  min={0}
                                  max={field.max}
                                  value={grades[s.id][field.key]}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) =>
                                    setGrades((prev) => ({
                                      ...prev,
                                      [s.id]: { ...prev[s.id], [field.key]: e.target.value },
                                    }))
                                  }
                                  className="w-full px-3 py-2 rounded-lg bg-white border border-white/80 text-center text-lg font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                                {/* Mini bar */}
                                <div className="h-1.5 rounded-full bg-white/60 overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-current transition-all"
                                    style={{
                                      width: `${clampScore(grades[s.id][field.key])}%`,
                                      color: field.accent.replace("text-", ""),
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                              Average of all 4 components · Rank <strong className="text-foreground">#{s.rank}</strong> in {activeSection}
                            </p>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setExpandedId(null);
                              }}
                              className="text-xs text-primary font-medium hover:underline"
                            >
                              Collapse
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </div>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border flex justify-end">
          <button className="bg-primary text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-teal-700 transition-colors">
            Save Grades
          </button>
        </div>
      </div>
    </div>
  );
}
