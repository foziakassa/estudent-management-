import { useEffect, useState } from "react";
import { clampScore, calcAverage, calcLetterGrade } from "@/domain/utils/grades";
import { StatusBadge, TablePagination } from "@/presentation/components/shared";
import { getStudentGrades, getTeacherStudents, type TeacherStudent } from "@/domain/utils/teacher-api";
import { TeacherStudentDetail } from "./TeacherStudentDetail";

export function GradeEntryView() {
  const [students, setStudents] = useState<TeacherStudent[]>([]);
  const [activeSection, setActiveSection] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<TeacherStudent | null>(null);
  const [grades, setGrades] = useState<Record<string, { quiz: string; assignment: string; test: string; final: string }>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    getTeacherStudents()
      .then(async (loadedStudents) => {
        setStudents(loadedStudents);
        setActiveSection(loadedStudents[0]?.section ?? "");
        const loadedGrades = await Promise.all(
          loadedStudents.map(async (student) => {
            try {
              const [grade] = await getStudentGrades(String(student.apiId));
              const record = (grade ?? {}) as Record<string, unknown>;
              const score = (keys: string[]) => {
                const found = keys.map((key) => record[key]).find((value) => value !== undefined && value !== null);
                return found === undefined ? "" : String(found);
              };
              return [student.id, {
                quiz: score(["quiz"]),
                assignment: score(["assignment"]),
                test: score(["midterm", "test"]),
                final: score(["final", "final_exam"]),
              }] as const;
            } catch {
              return [student.id, { quiz: "", assignment: "", test: "", final: "" }] as const;
            }
          })
        );
        setGrades(Object.fromEntries(loadedGrades));
      })
      .catch((err) => setError(err.response?.data?.message || err.message || "Failed to load students."))
      .finally(() => setIsLoading(false));
  }, []);

  const sections = [...new Set(students.map((student) => student.section))];

  const calcTotal = (id: string) => {
    const g = grades[id] ?? { quiz: "", assignment: "", test: "", final: "" };
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
  const totalPages = Math.max(1, Math.ceil(sectionStudents.length / pageSize));
  const pageStudents = sectionStudents.slice((page - 1) * pageSize, page * pageSize);

  if (selectedStudent) {
    return <TeacherStudentDetail student={selectedStudent} onBack={() => setSelectedStudent(null)} />;
  }

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
              setPage(1);
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

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                {["Rank", "Student", "ID", "Quiz", "Assignment", "Midterm", "Final", "Average", "Grade"].map((h) => (
                  <th key={h} className="text-left py-3 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageStudents.map((s) => {
                const g = grades[s.id] ?? { quiz: "", assignment: "", test: "", final: "" };
                const total = s.total;
                const letter = calcLetterGrade(total);
                return (
                    <tr
                      key={s.id}
                      className="border-b border-border/50 transition-colors cursor-pointer hover:bg-secondary/30"
                      onClick={() => setSelectedStudent(s)}
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
                    </tr>

                );
              })}
            </tbody>
          </table>
        </div>
        <TablePagination
          page={page}
          totalPages={totalPages}
          totalItems={sectionStudents.length}
          itemLabel="students"
          onPageChange={(nextPage) => {
            setPage(nextPage);
          }}
        />
        <div className="p-4 border-t border-border flex justify-end">
          <button className="bg-primary text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-teal-700 transition-colors">
            Save Grades
          </button>
        </div>
      </div>
    </div>
  );
}
