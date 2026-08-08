import { AlertTriangle, BarChart3, ClipboardList, Users } from "lucide-react";
import { students } from "@/infrastructure/data/mock";
import { StatCard, StatusBadge } from "@/presentation/components/shared";

export function TeacherDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
          My Classes
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Mathematics — Sections 11-A & 11-B · Semester 2, 2026
        </p>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Total Students" value="48" icon={<Users size={18} />} />
        <StatCard label="Average Score" value="83.4" sub="This semester" icon={<BarChart3 size={18} />} trend={3} />
        <StatCard label="Graded Tests" value="3/4" sub="Final exam pending" icon={<ClipboardList size={18} />} />
        <StatCard label="Incidents" value="3" sub="This semester" icon={<AlertTriangle size={18} />} />
      </div>
      <div className="bg-white rounded-2xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
          Student Roster — Section 11-A
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Student", "ID", "Quiz", "Midterm", "Final", "Total", "Grade"].map((header) => (
                  <th key={header} className="text-left py-3 px-2 text-muted-foreground font-medium text-xs uppercase tracking-wide">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students
                .filter((student) => student.section === "11-A")
                .map((student, index) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-secondary/40 transition-colors">
                    <td className="py-3 px-2 font-medium text-foreground">{student.name}</td>
                    <td className="py-3 px-2 font-mono text-xs text-muted-foreground">{student.id}</td>
                    <td className="py-3 px-2 text-foreground">{student.quiz}</td>
                    <td className="py-3 px-2 text-foreground">{student.test}</td>
                    <td className="py-3 px-2 text-foreground">{student.final}</td>
                    <td className="py-3 px-2 font-semibold text-foreground">
                      {Math.round((student.quiz + student.test + student.final) / 3)}
                    </td>
                    <td className="py-3 px-2">
                      <StatusBadge type={student.grade} />
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
