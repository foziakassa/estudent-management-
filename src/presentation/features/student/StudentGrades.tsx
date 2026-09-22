import { useEffect, useState } from "react";
import { calcLetterGrade } from "@/domain/utils/grades";
import { getStudentGrades, type ApiGrade } from "@/domain/utils/teacher-api";
import { StatusBadge, TablePagination } from "@/presentation/components/shared";

export function StudentGrades() {
  const [grades, setGrades] = useState<ApiGrade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const studentId = localStorage.getItem("student_id") || "ST/9912/11";

  useEffect(() => {
    getStudentGrades(studentId)
      .then(setGrades)
      .catch((err) => setError(err.response?.data?.message || err.message || "Failed to load grades."))
      .finally(() => setIsLoading(false));
  }, [studentId]);

  const totalPages = Math.max(1, Math.ceil(grades.length / pageSize));
  const pageGrades = grades.slice((page - 1) * pageSize, page * pageSize);

  const value = (grade: ApiGrade, keys: string[]) => {
    const record = grade as Record<string, unknown>;
    const found = keys.map((key) => record[key]).find((item) => item !== undefined && item !== null);
    return typeof found === "number" ? found : "—";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
          My Grades
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Current grades · {studentId}
        </p>
      </div>
      <div className="bg-white rounded-2xl border border-border p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Subject", "Teacher", "Quiz", "Midterm", "Final", "Average", "Letter"].map((header) => (
                  <th key={header} className="text-left py-3 px-2 text-muted-foreground font-medium text-xs uppercase tracking-wide">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageGrades.map((grade, index) => {
                const average = value(grade, ["average", "score"]);
                const letter = grade.letter_grade || grade.grade || (typeof average === "number" ? calcLetterGrade(average) : "—");
                return (
                  <tr key={index} className="border-b border-border/50 hover:bg-secondary/40 transition-colors">
                    <td className="py-3 px-2 font-medium text-foreground">{grade.subject_name || grade.subject || "—"}</td>
                    <td className="py-3 px-2 text-muted-foreground">{grade.teacher || "—"}</td>
                    <td className="py-3 px-2 text-foreground">{value(grade, ["quiz"])}</td>
                    <td className="py-3 px-2 text-foreground">{value(grade, ["midterm", "test"])}</td>
                    <td className="py-3 px-2 text-foreground">{value(grade, ["final", "final_exam"])}</td>
                    <td className="py-3 px-2 font-semibold text-foreground">{average}</td>
                    <td className="py-3 px-2">
                      <StatusBadge type={letter} />
                    </td>
                  </tr>
                );
              })}
              {!isLoading && grades.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No grades found.</td></tr>
              )}
            </tbody>
          </table>
          <TablePagination
            page={page}
            totalPages={totalPages}
            totalItems={grades.length}
            itemLabel="grades"
            onPageChange={setPage}
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
    </div>
  );
}
