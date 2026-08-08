import { FileText, GraduationCap } from "lucide-react";
import { deriveSubjectScores } from "@/domain/utils/grades";
import { subjects } from "@/infrastructure/data/mock";
import { StatusBadge } from "@/presentation/components/shared";

export function ParentReport() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
            Report Card
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Sara Tesfaye · Grade 11-A · Semester 2, 2026</p>
        </div>
        <button className="flex items-center gap-2 border border-border text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-secondary transition-colors">
          <FileText size={15} /> Download PDF
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="bg-primary px-6 py-4 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center">
            <GraduationCap size={26} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg" style={{ fontFamily: "Outfit, sans-serif" }}>
              Ethio Academy
            </p>
            <p className="text-teal-100 text-sm">Official Semester Report Card · 2025/26</p>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 text-sm">
            {[
              ["Student", "Sara Tesfaye"],
              ["ID", "ST/9912/11"],
              ["Section", "11-A"],
              ["Semester Average", "87.2 (A)"],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">{label}</p>
                <p className="font-semibold text-foreground">{value}</p>
              </div>
            ))}
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Subject", "Teacher", "Quiz", "Midterm", "Final", "Avg", "Grade"].map((header) => (
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
                  <tr key={index} className="border-b border-border/50">
                    <td className="py-3 px-2 font-medium text-foreground">{subject.name}</td>
                    <td className="py-3 px-2 text-muted-foreground text-xs">{subject.teacher}</td>
                    <td className="py-3 px-2">{quiz}</td>
                    <td className="py-3 px-2">{test}</td>
                    <td className="py-3 px-2">{final}</td>
                    <td className="py-3 px-2 font-bold">{avg}</td>
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
