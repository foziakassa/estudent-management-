import { useEffect, useState } from "react";
import { AlertTriangle, Pencil, Trash2 } from "lucide-react";
import { StatusBadge } from "@/presentation/components/shared";
import {
  deleteTeacherDiscipline,
  getStudentDisciplines,
  getTeacherStudents,
  updateTeacherDiscipline,
  type TeacherDiscipline,
  type TeacherStudent,
} from "@/domain/utils/teacher-api";

export function DisciplineView() {
  const [type, setType] = useState("Late");
  const [student, setStudent] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedId, setSelectedId] = useState<string | number | null>(null);
  const [students, setStudents] = useState<TeacherStudent[]>([]);
  const [disciplines, setDisciplines] = useState<TeacherDiscipline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getTeacherStudents()
      .then(setStudents)
      .catch((err) => setError(err.response?.data?.message || err.message || "Failed to load discipline records."))
      .finally(() => setIsLoading(false));
  }, []);

  const loadStudentDisciplines = async (studentId: string) => {
    setIsLoadingRecords(true);
    setError("");
    try {
      const selectedStudent = students.find((item) => item.apiId === Number(studentId));
      const records = await getStudentDisciplines(selectedStudent?.apiId ?? studentId);
      setDisciplines(records.map((record) => ({
        ...record,
        student: record.student || selectedStudent?.name || studentId,
        student_id: record.student_id || studentId,
      })));
    } catch (err: any) {
      setDisciplines([]);
      setError(err.response?.data?.message || err.message || "Failed to load discipline records.");
    } finally {
      setIsLoadingRecords(false);
    }
  };

  const handleStudentChange = (studentId: string) => {
    setStudent(studentId);
    setSelectedId(null);
    setNotes("");
    if (studentId) {
      loadStudentDisciplines(studentId);
    } else {
      setDisciplines([]);
    }
  };

  const handleSubmit = async () => {
    if (selectedId === null) {
      setError("Select an incident to edit.");
      return;
    }

    setIsSaving(true);
    setError("");
    try {
      await updateTeacherDiscipline(selectedId, { type, notes });
      setNotes("");
      setSelectedId(null);
      if (student) await loadStudentDisciplines(student);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to log incident.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (record: TeacherDiscipline) => {
    setSelectedId(record.id);
    setType(record.type);
    setNotes(record.notes || "");
    setStudent(String(record.student_id || students.find((item) => item.name === record.student)?.apiId || ""));
    setError("");
  };

  const handleDelete = async (record: TeacherDiscipline) => {
    setIsSaving(true);
    setError("");
    try {
      await deleteTeacherDiscipline(record.id);
      setDisciplines((current) => current.filter((item) => item.id !== record.id));
      if (selectedId === record.id) setSelectedId(null);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to delete incident.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
          Discipline Records
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Incidents are logged and parents are automatically notified
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-border p-5 space-y-4">
          <h3 className="font-semibold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
            {selectedId === null ? "Select an Incident" : "Edit Incident"}
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">
                Student
              </label>
              <select
                value={student}
                disabled={isLoading || isSaving}
                onChange={(e) => handleStudentChange(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Select student...</option>
                {students.map((s) => (
                  <option key={s.id} value={s.apiId}>
                    {s.name} — {s.section}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">
                Incident Type
              </label>
              <div className="flex gap-2 flex-wrap">
                {["Late", "Misconduct", "Cheating", "Fighting"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      type === t ? "bg-primary text-white" : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">
                Notes
              </label>
              <textarea
                rows={3}
                placeholder="Describe the incident..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground resize-none"
              />
            </div>
            <button onClick={handleSubmit} disabled={isSaving || selectedId === null} className="w-full bg-primary text-white text-sm font-medium py-2.5 rounded-xl hover:bg-teal-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
              <AlertTriangle size={15} /> {isSaving ? "Saving..." : "Update Incident"}
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
            Recent Incidents
          </h3>
          <div className="space-y-3">
            {disciplines.map((d, i) => (
              <div key={`${d.id}-${i}`} className="p-3 rounded-xl bg-secondary/50 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-foreground text-sm">{d.student}</p>
                  <div className="flex items-center gap-1">
                    <StatusBadge type={d.type} />
                    <button type="button" onClick={() => handleEdit(d)} className="p-1.5 text-muted-foreground hover:text-primary" title="Edit incident">
                      <Pencil size={14} />
                    </button>
                    <button type="button" onClick={() => handleDelete(d)} disabled={isSaving} className="p-1.5 text-muted-foreground hover:text-red-600 disabled:opacity-50" title="Delete incident">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <p className="font-mono text-xs text-muted-foreground">{d.id}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{d.date}</span>
                  <span className="text-teal-600 font-medium">{d.status}</span>
                </div>
              </div>
            ))}
            {isLoadingRecords && (
              <p className="text-sm text-muted-foreground">Loading incidents...</p>
            )}
            {!isLoading && !isLoadingRecords && !student && (
              <p className="text-sm text-muted-foreground">Select a student to view incidents.</p>
            )}
            {!isLoading && !isLoadingRecords && student && disciplines.length === 0 && (
              <p className="text-sm text-muted-foreground">No discipline records found for this student.</p>
            )}
          </div>
        </div>
      </div>
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
    </div>
  );
}
