import { deriveSubjectScores } from "@/domain/utils/grades";
import { subjects } from "@/infrastructure/data/mock";
import { StatusBadge } from "@/presentation/components/shared";

export function StudentGrades() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
          My Grades
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Semester 2 — 2026 · Sara Tesfaye · ST/9912/11
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
              {subjects.map((subject, index) => {
                const { quiz, test, final, avg, letter } = deriveSubjectScores(subject.score);
                return (
                  <tr key={index} className="border-b border-border/50 hover:bg-secondary/40 transition-colors">
                    <td className="py-3 px-2 font-medium text-foreground">{subject.name}</td>
                    <td className="py-3 px-2 text-muted-foreground">{subject.teacher}</td>
                    <td className="py-3 px-2 text-foreground">{quiz}</td>
                    <td className="py-3 px-2 text-foreground">{test}</td>
                    <td className="py-3 px-2 text-foreground">{final}</td>
                    <td className="py-3 px-2 font-semibold text-foreground">{avg}</td>
                    <td className="py-3 px-2">
                      <StatusBadge type={letter} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
