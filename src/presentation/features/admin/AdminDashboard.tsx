import { Bell, GraduationCap, BookOpen, UserCheck, Users } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { announcements, gradeDistData, performanceData } from "@/infrastructure/data/mock";
import { StatCard, StatusBadge } from "@/presentation/components/shared";

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
          System Overview
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Ethio Academy — Academic Year 2025/26</p>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Total Students" value="1,248" sub="Across 6 grade levels" icon={<GraduationCap size={18} />} trend={5} />
        <StatCard label="Teachers" value="64" sub="32 subjects covered" icon={<UserCheck size={18} />} trend={2} />
        <StatCard label="Active Sections" value="38" sub="2 semesters running" icon={<BookOpen size={18} />} />
        <StatCard label="Parent Accounts" value="892" sub="Multi-student bindings" icon={<Users size={18} />} trend={8} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-4">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-4 md:p-5">
          <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
            School-Wide Performance Trend
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(13,148,136,0.1)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#5a8a87" }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 12, fill: "#5a8a87" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid rgba(13,148,136,0.2)", borderRadius: 12, fontSize: 13 }} />
              <Area type="monotone" dataKey="score" stroke="#0d9488" strokeWidth={2.5} fill="url(#tealGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-2xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
            Grade Distribution
          </h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={gradeDistData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={3} dataKey="value">
                {gradeDistData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 10 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-3 space-y-1.5">
            {gradeDistData.map((entry, index) => (
              <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: entry.color }} />
                <span>{entry.name}</span>
                <span className="ml-auto font-medium text-foreground">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
          Recent Announcements
        </h3>
        <div className="space-y-3">
          {announcements.map((announcement, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Bell size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{announcement.title}</p>
                <p className="text-xs text-muted-foreground">{announcement.date}</p>
              </div>
              <StatusBadge type={announcement.type} />
              {announcement.urgent && <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
