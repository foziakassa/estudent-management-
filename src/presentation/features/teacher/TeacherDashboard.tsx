import { useEffect, useState } from "react";
import { AlertTriangle, BarChart3, ClipboardList, Users } from "lucide-react";
import { StatCard, TablePagination } from "@/presentation/components/shared";
import { getTeacherStudents, type TeacherStudent } from "@/domain/utils/teacher-api";

export function TeacherDashboard() {
  const [students, setStudents] = useState<TeacherStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    getTeacherStudents()
      .then(setStudents)
      .catch((err) => setError(err.response?.data?.message || err.message || "Failed to load students."))
      .finally(() => setIsLoading(false));
  }, []);

  const totalPages = Math.max(1, Math.ceil(students.length / pageSize));
  const pageStudents = students.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
          My Classes
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Student accounts returned by the school API
        </p>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Total Students" value={isLoading ? "—" : String(students.length)} icon={<Users size={18} />} />
        <StatCard label="Average Score" value="—" sub="No grades available" icon={<BarChart3 size={18} />} />
        <StatCard label="Graded Tests" value="—" sub="No grades available" icon={<ClipboardList size={18} />} />
        <StatCard label="Incidents" value="—" sub="See discipline records" icon={<AlertTriangle size={18} />} />
      </div>
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
      <div className="bg-white rounded-2xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
          Student Roster
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Student", "ID", "Section", "Grade Level"].map((header) => (
                  <th key={header} className="text-left py-3 px-2 text-muted-foreground font-medium text-xs uppercase tracking-wide">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageStudents.map((student) => (
                <tr key={student.id} className="border-b border-border/50 hover:bg-secondary/40 transition-colors">
                    <td className="py-3 px-2 font-medium text-foreground">{student.name}</td>
                    <td className="py-3 px-2 font-mono text-xs text-muted-foreground">{student.id}</td>
                    <td className="py-3 px-2 text-foreground">{student.section}</td>
                    <td className="py-3 px-2 text-foreground">{student.gradeLevel ?? "—"}</td>
                </tr>
              ))}
              {!isLoading && students.length === 0 && (
                <tr><td colSpan={4} className="py-8 text-center text-muted-foreground">No students found.</td></tr>
              )}
            </tbody>
          </table>
          <TablePagination
            page={page}
            totalPages={totalPages}
            totalItems={students.length}
            itemLabel="students"
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}
