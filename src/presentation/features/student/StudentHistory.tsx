import { StatusBadge } from "@/presentation/components/shared";

export function StudentHistory() {
  const historyData = [
    {
      sem: "Semester 1 — 2025/26",
      avg: "84.6",
      grade: "B",
      subjects: ["Mathematics", "Physics", "Chemistry", "English", "History"],
    },
    {
      sem: "Semester 2 — 2024/25",
      avg: "79.2",
      grade: "C",
      subjects: ["Mathematics", "Biology", "Civics", "English", "Amharic"],
    },
  ];

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
                  {item.sem}
                </p>
                <p className="text-xs text-muted-foreground">Grade Average: {item.avg}</p>
              </div>
              <StatusBadge type={item.grade} />
            </div>
            <div className="flex flex-wrap gap-2">
              {item.subjects.map((s) => (
                <span key={s} className="px-3 py-1 rounded-lg bg-secondary text-xs font-medium text-muted-foreground">
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
