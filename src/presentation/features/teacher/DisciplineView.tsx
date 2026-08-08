import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { disciplines, students } from "@/infrastructure/data/mock";
import { StatusBadge } from "@/presentation/components/shared";

export function DisciplineView() {
  const [type, setType] = useState("Late");
  const [student, setStudent] = useState("");

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
            Record New Incident
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">
                Student
              </label>
              <select
                value={student}
                onChange={(e) => setStudent(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Select student...</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
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
                className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground resize-none"
              />
            </div>
            <button className="w-full bg-primary text-white text-sm font-medium py-2.5 rounded-xl hover:bg-teal-700 transition-colors flex items-center justify-center gap-2">
              <AlertTriangle size={15} /> Log Incident & Notify Parent
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
            Recent Incidents
          </h3>
          <div className="space-y-3">
            {disciplines.map((d, i) => (
              <div key={i} className="p-3 rounded-xl bg-secondary/50 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-foreground text-sm">{d.student}</p>
                  <StatusBadge type={d.type} />
                </div>
                <p className="font-mono text-xs text-muted-foreground">{d.id}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{d.date}</span>
                  <span className="text-teal-600 font-medium">{d.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
