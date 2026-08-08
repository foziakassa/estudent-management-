import { BookOpen } from "lucide-react";
import type { Subject } from "@/domain/types";

type SubjectPerformanceListProps = {
  subjects: Subject[];
  title?: string;
};

export function SubjectPerformanceList({ subjects, title }: SubjectPerformanceListProps) {
  return (
    <div className="bg-white rounded-2xl border border-border p-5">
      {title && (
        <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
          {title}
        </h3>
      )}
      <div className="space-y-3">
        {subjects.map((subject, index) => (
          <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary flex-shrink-0">
              <BookOpen size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm">{subject.name}</p>
              <p className="text-xs text-muted-foreground">
                {subject.teacher} · {subject.id}
              </p>
            </div>
            <div className="flex-1 max-w-[120px]">
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${subject.score}%` }}
                />
              </div>
            </div>
            <span className="text-sm font-bold text-foreground w-8 text-right">{subject.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
