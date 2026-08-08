import { Award, BookOpen, Calendar, Users } from "lucide-react";
import { subjects } from "@/infrastructure/data/mock";
import { StatCard } from "@/presentation/components/shared";

export function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
          My Dashboard
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Grade 11-A · Semester 2, Academic Year 2025/26
        </p>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Enrolled Subjects" value="5" icon={<BookOpen size={18} />} />
        <StatCard label="Overall Average" value="87.2" sub="Grade: A" icon={<Award size={18} />} trend={5} />
        <StatCard label="Section" value="11-A" icon={<Users size={18} />} />
        <StatCard label="Semester" value="Sem 2" sub="Ongoing" icon={<Calendar size={18} />} />
      </div>
      <div className="bg-white rounded-2xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
          Current Semester Grades
        </h3>
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
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${subject.score}%` }} />
                </div>
              </div>
              <span className="text-sm font-bold text-foreground w-8 text-right">{subject.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
