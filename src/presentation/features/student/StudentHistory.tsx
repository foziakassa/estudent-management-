import { useEffect, useState } from "react";
import { StatusBadge } from "@/presentation/components/shared";
import { getAcademicGrades, getStudentGradeHistory, type ApiGrade } from "@/domain/utils/teacher-api";

export function StudentHistory() {
  const [history, setHistory] = useState<ApiGrade[]>([]);
  const [error, setError] = useState("");
  const studentId = localStorage.getItem("student_id") || "ST/9912/11";

  useEffect(() => {
    getStudentGradeHistory(studentId)
      .then(async (items) => {
        const academicIds = [...new Set(items.map((item) => item.academic_id).filter(Boolean).map(String))];
        const academicGrades = (await Promise.all(academicIds.map(getAcademicGrades))).flat();
        setHistory(academicGrades.length > 0 ? academicGrades : items);
      })
      .catch((err) => setError(err.response?.data?.message || err.message || "Failed to load grade history."));
  }, [studentId]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
          Grade History
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Past semesters and completed courses</p>
      </div>
      <div className="space-y-4">
        {historyData.map((item, index) => (
          <div key={index} className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
                  {item.semester || item.academic_year || "Academic record"}
                </p>
                <p className="text-xs text-muted-foreground">Grade Average: {item.average ?? item.score ?? "—"}</p>
              </div>
              <StatusBadge type={item.letter_grade || item.grade || "—"} />
            </div>
            <div className="flex flex-wrap gap-2">
              {history.filter((grade) => grade.academic_id === item.academic_id).map((grade, subjectIndex) => (
                <span key={`${grade.subject_name || grade.subject}-${subjectIndex}`} className="px-3 py-1 rounded-lg bg-secondary text-xs font-medium text-muted-foreground">
                  {grade.subject_name || grade.subject || "Subject"}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
    </div>
  );
}
