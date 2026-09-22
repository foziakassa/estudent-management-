import { getStudentAcademics, getStudentGrades, type ApiGrade, type StudentAcademic } from "@/domain/utils/teacher-api";
import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, UserRound } from "lucide-react";
import { calcLetterGrade } from "@/domain/utils/grades";
import type { TeacherStudent } from "@/domain/utils/teacher-api";
import { StatusBadge, TablePagination } from "@/presentation/components/shared";

type TeacherStudentDetailProps = {
  student: TeacherStudent;
  onBack: () => void;
};

function gradeValue(grade: ApiGrade, keys: string[]) {
  const record = grade as Record<string, unknown>;
  const value = keys.map((key) => record[key]).find((item) => item !== undefined && item !== null);
  return typeof value === "number" ? value : "—";
}

export function TeacherStudentDetail({ student, onBack }: TeacherStudentDetailProps) {
  const [grades, setGrades] = useState<ApiGrade[]>([]);
  const [academics, setAcademics] = useState<StudentAcademic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    setIsLoading(true);
    Promise.all([getStudentGrades(String(student.apiId)), getStudentAcademics(student.apiId)])
      .then(([loadedGrades, loadedAcademics]) => {
        setGrades(loadedGrades);
        setAcademics(loadedAcademics);
      })
      .catch((err) => setError(err.response?.data?.message || err.message || "Failed to load student grades."))
      .finally(() => setIsLoading(false));
  }, [student.apiId]);

  const totalPages = Math.max(1, Math.ceil(grades.length / pageSize));
  const pageGrades = grades.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={16} /> Back to Grade Entry
      </button>

      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
          <UserRound size={26} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
            {student.name}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {student.id} · Section {student.section} · Grade {student.gradeLevel ?? "—"}
          </p>
        </div>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {academics.map((academic) => (
          <div key={academic.id} className="bg-white rounded-xl border border-border p-4">
            <p className="font-semibold text-foreground">{academic.subject_name}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {academic.section_name} · {academic.semester} · {academic.academic_year}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {academic.is_active ? "Active enrollment" : "Inactive enrollment"}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="p-5 border-b border-border flex items-center gap-2">
          <BookOpen size={18} className="text-primary" />
          <h2 className="font-semibold text-foreground">Grade Details</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                {["Subject", "Teacher", "Quiz", "Assignment", "Midterm", "Final", "Average", "Grade"].map((header) => (
                  <th key={header} className="text-left py-3 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wide whitespace-nowrap">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageGrades.map((grade, index) => {
                const average = gradeValue(grade, ["average", "score"]);
                const letter = grade.letter_grade || grade.grade || (typeof average === "number" ? calcLetterGrade(average) : "—");
                return (
                  <tr key={`${grade.id ?? "grade"}-${index}`} className="border-b border-border/50">
                    <td className="py-3 px-3 font-medium text-foreground">{grade.subject_name || grade.subject || "—"}</td>
                    <td className="py-3 px-3 text-muted-foreground">{grade.teacher || "—"}</td>
                    <td className="py-3 px-3">{gradeValue(grade, ["quiz"])}</td>
                    <td className="py-3 px-3">{gradeValue(grade, ["assignment"])}</td>
                    <td className="py-3 px-3">{gradeValue(grade, ["midterm", "test"])}</td>
                    <td className="py-3 px-3">{gradeValue(grade, ["final", "final_exam"])}</td>
                    <td className="py-3 px-3 font-bold">{average}</td>
                    <td className="py-3 px-3"><StatusBadge type={letter} /></td>
                  </tr>
                );
              })}
              {!isLoading && grades.length === 0 && (
                <tr><td colSpan={8} className="py-10 text-center text-muted-foreground">No grades found for this student.</td></tr>
              )}
              {isLoading && (
                <tr><td colSpan={8} className="py-10 text-center text-muted-foreground">Loading grades...</td></tr>
              )}
            </tbody>
          </table>
          <div className="p-4">
            <TablePagination
              page={page}
              totalPages={totalPages}
              totalItems={grades.length}
              itemLabel="grades"
              onPageChange={setPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}