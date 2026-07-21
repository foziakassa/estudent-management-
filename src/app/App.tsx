import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  Bell,
  LogOut,
  ChevronRight,
  GraduationCap,
  ClipboardList,
  AlertTriangle,
  MessageSquare,
  Search,
  Plus,
  Eye,
  TrendingUp,
  Award,
  Clock,
  FileText,
  Shield,
  UserCheck,
  Package,
  ChevronDown,
  BarChart3,
  Mail,
  Lock,
  Star,
  Menu,
  X,
} from "lucide-react";
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

type Role = "admin" | "teacher" | "student" | "parent";

const ROLES: { key: Role; label: string; color: string; prefix: string }[] = [
  { key: "admin", label: "Administrator", color: "bg-teal-700", prefix: "AD" },
  { key: "teacher", label: "Teacher", color: "bg-teal-600", prefix: "TR" },
  { key: "student", label: "Student", color: "bg-teal-500", prefix: "ST" },
  { key: "parent", label: "Parent", color: "bg-teal-400", prefix: "PT" },
];

const DEMO_USERS = {
  admin: { id: "AD/4821/26", name: "Mekdes Haile", email: "mekdes@school.et" },
  teacher: { id: "TR/3347/26", name: "Dawit Bekele", email: "dawit@school.et" },
  student: { id: "ST/9912/11", name: "Sara Tesfaye", email: "sara@school.et" },
  parent: { id: "PT/6634/26", name: "Almaz Girma", email: "almaz@school.et" },
};

const performanceData = [
  { month: "Sep", score: 72 },
  { month: "Oct", score: 78 },
  { month: "Nov", score: 74 },
  { month: "Dec", score: 82 },
  { month: "Jan", score: 85 },
  { month: "Feb", score: 88 },
  { month: "Mar", score: 91 },
];

const gradeDistData = [
  { name: "A (90-100)", value: 24, color: "#0d9488" },
  { name: "B (80-89)", value: 38, color: "#14b8a6" },
  { name: "C (70-79)", value: 21, color: "#5eead4" },
  { name: "D (60-69)", value: 12, color: "#99f6e4" },
  { name: "F (<60)", value: 5, color: "#ccfbf1" },
];

const students = [
  { id: "ST/1102/11", name: "Abebe Kebede", section: "11-A", quiz: 88, assignment: 84, test: 76, final: 82, grade: "B" },
  { id: "ST/2341/11", name: "Tigist Alemu", section: "11-A", quiz: 95, assignment: 92, test: 90, final: 93, grade: "A" },
  { id: "ST/3567/11", name: "Yonas Tadesse", section: "11-A", quiz: 70, assignment: 68, test: 65, final: 68, grade: "C" },
  { id: "ST/7731/11", name: "Liya Bekele", section: "11-A", quiz: 79, assignment: 75, test: 80, final: 77, grade: "B" },
  { id: "ST/8820/11", name: "Dawit Negash", section: "11-A", quiz: 60, assignment: 62, test: 58, final: 61, grade: "D" },
  { id: "ST/4892/11", name: "Hana Mulugeta", section: "11-B", quiz: 82, assignment: 80, test: 79, final: 80, grade: "B" },
  { id: "ST/5123/11", name: "Biruk Hailu", section: "11-B", quiz: 55, assignment: 58, test: 60, final: 58, grade: "D" },
  { id: "ST/6784/11", name: "Meron Girma", section: "11-B", quiz: 97, assignment: 95, test: 95, final: 96, grade: "A" },
  { id: "ST/9001/11", name: "Selam Tadesse", section: "11-B", quiz: 74, assignment: 78, test: 72, final: 75, grade: "C" },
  { id: "ST/9345/11", name: "Natnael Worku", section: "11-B", quiz: 88, assignment: 85, test: 86, final: 87, grade: "B" },
];

const disciplines = [
  { student: "Yonas Tadesse", id: "ST/3567/11", type: "Late", date: "2026-07-01", status: "Notified" },
  { student: "Biruk Hailu", id: "ST/5123/11", type: "Misconduct", date: "2026-07-03", status: "Notified" },
  { student: "Abebe Kebede", id: "ST/1102/11", type: "Late", date: "2026-07-05", status: "Notified" },
];

const subjects = [
  { name: "Mathematics", teacher: "Dawit Bekele", id: "TR/3347/26", section: "11-A/B", score: 82 },
  { name: "Physics", teacher: "Selamawit Hailu", id: "TR/2210/26", section: "11-A/B", score: 78 },
  { name: "Chemistry", teacher: "Kebede Worku", id: "TR/1198/26", section: "11-A", score: 85 },
  { name: "Biology", teacher: "Tigist Bekele", id: "TR/4456/26", section: "11-B", score: 90 },
  { name: "English", teacher: "Almaz Desta", id: "TR/5531/26", section: "11-A/B", score: 74 },
];

const announcements = [
  { title: "Final Exam Schedule Published", date: "2026-07-08", type: "exam", urgent: true },
  { title: "School Fee Deadline — July 20", date: "2026-07-05", type: "fee", urgent: true },
  { title: "Sports Day — July 25", date: "2026-07-03", type: "event", urgent: false },
  { title: "Parent-Teacher Conference", date: "2026-07-01", type: "event", urgent: false },
];

const calendarEvents = [
  { date: "July 10", label: "Midterm Results Released", type: "academic" },
  { date: "July 15", label: "National Holiday", type: "holiday" },
  { date: "July 20", label: "Fee Payment Deadline", type: "fee" },
  { date: "July 25", label: "Sports Day", type: "event" },
  { date: "Aug 1", label: "Final Exams Begin", type: "exam" },
];

const lostFound = [
  { item: "Blue Backpack", reportedBy: "Hana M.", date: "2026-07-06", status: "found", description: "Nike, blue, found near library" },
  { item: "Scientific Calculator", reportedBy: "Biruk H.", date: "2026-07-05", status: "lost", description: "Casio fx-991, lost after math class" },
  { item: "Eyeglasses (black frame)", reportedBy: "Staff", date: "2026-07-04", status: "found", description: "Found in cafeteria" },
];

const userAccounts = [
  { id: "TR/3347/26", name: "Dawit Bekele", role: "Teacher", email: "dawit@school.et", status: "Active" },
  { id: "ST/9912/11", name: "Sara Tesfaye", role: "Student", email: "sara@school.et", status: "Active" },
  { id: "PT/6634/26", name: "Almaz Girma", role: "Parent", email: "almaz@school.et", status: "Active" },
  { id: "ST/1102/11", name: "Abebe Kebede", role: "Student", email: "abebe@school.et", status: "Active" },
  { id: "TR/2210/26", name: "Selamawit Hailu", role: "Teacher", email: "selamawit@school.et", status: "Inactive" },
];

const feedbackList = [
  { course: "Mathematics", teacher: "Dawit Bekele", rating: 4, comment: "Explains concepts clearly, could use more examples.", date: "2026-07-05" },
  { course: "English", teacher: "Almaz Desta", rating: 3, comment: "Good teaching but assignments are too frequent.", date: "2026-07-03" },
  { course: "Physics", teacher: "Selamawit Hailu", rating: 5, comment: "Excellent lab sessions, very engaging.", date: "2026-07-01" },
];

const TEAL_CHART = ["#0d9488", "#14b8a6", "#5eead4", "#0f766e", "#99f6e4"];

type NavItem = { key: string; label: string; icon: React.ReactNode };

const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  admin: [
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { key: "users", label: "User Accounts", icon: <Users size={18} /> },
    { key: "structure", label: "Structure", icon: <BookOpen size={18} /> },
    { key: "calendar", label: "Calendar", icon: <Calendar size={18} /> },
    { key: "lostfound", label: "Lost & Found", icon: <Package size={18} /> },
    { key: "feedback", label: "Feedback", icon: <MessageSquare size={18} /> },
  ],
  teacher: [
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { key: "grades", label: "Grade Entry", icon: <ClipboardList size={18} /> },
    { key: "discipline", label: "Discipline", icon: <AlertTriangle size={18} /> },
    { key: "calendar", label: "Calendar", icon: <Calendar size={18} /> },
  ],
  student: [
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { key: "grades", label: "My Grades", icon: <Award size={18} /> },
    { key: "history", label: "Grade History", icon: <Clock size={18} /> },
    { key: "feedback", label: "Submit Feedback", icon: <MessageSquare size={18} /> },
    { key: "lostfound", label: "Lost & Found", icon: <Package size={18} /> },
  ],
  parent: [
    { key: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { key: "report", label: "Report Card", icon: <FileText size={18} /> },
    { key: "schedule", label: "Schedule", icon: <Calendar size={18} /> },
    { key: "alerts", label: "Alerts", icon: <Bell size={18} /> },
  ],
};

function Badge({ type }: { type: string }) {
  const map: Record<string, string> = {
    exam: "bg-amber-100 text-amber-700",
    fee: "bg-red-100 text-red-600",
    event: "bg-teal-100 text-teal-700",
    holiday: "bg-blue-100 text-blue-700",
    academic: "bg-purple-100 text-purple-700",
    A: "bg-teal-100 text-teal-700",
    B: "bg-blue-100 text-blue-700",
    C: "bg-amber-100 text-amber-700",
    D: "bg-orange-100 text-orange-700",
    F: "bg-red-100 text-red-600",
    found: "bg-teal-100 text-teal-700",
    lost: "bg-red-100 text-red-600",
    Late: "bg-amber-100 text-amber-700",
    Misconduct: "bg-red-100 text-red-600",
    Cheating: "bg-red-200 text-red-700",
    Fighting: "bg-red-300 text-red-800",
    Active: "bg-teal-100 text-teal-700",
    Inactive: "bg-gray-100 text-gray-500",
    Teacher: "bg-blue-100 text-blue-700",
    Student: "bg-teal-100 text-teal-700",
    Parent: "bg-purple-100 text-purple-700",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${map[type] || "bg-gray-100 text-gray-600"}`}>
      {type}
    </span>
  );
}

function StatCard({ label, value, sub, icon, trend }: { label: string; value: string; sub?: string; icon: React.ReactNode; trend?: number }) {
  return (
    <div className="bg-white rounded-2xl border border-border p-4 md:p-5 flex flex-col gap-2 md:gap-3">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs md:text-sm font-medium leading-tight">{label}</span>
        <span className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-secondary flex items-center justify-center text-primary flex-shrink-0">{icon}</span>
      </div>
      <div>
        <span className="text-2xl md:text-3xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>{value}</span>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-medium ${trend >= 0 ? "text-teal-600" : "text-red-500"}`}>
          <TrendingUp size={12} />
          {trend >= 0 ? "+" : ""}{trend}% from last semester
        </div>
      )}
    </div>
  );
}

// ── ADMIN VIEWS ─────────────────────────────────────────────────────────────

function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>System Overview</h1>
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
          <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>School-Wide Performance Trend</h3>
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
          <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>Grade Distribution</h3>
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
            {gradeDistData.map((d, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                <span>{d.name}</span>
                <span className="ml-auto font-medium text-foreground">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>Recent Announcements</h3>
        <div className="space-y-3">
          {announcements.map((a, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <Bell size={14} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.date}</p>
              </div>
              <Badge type={a.type} />
              {a.urgent && <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminUsers() {
  const [search, setSearch] = useState("");
  const filtered = userAccounts.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) || u.id.includes(search)
  );
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>User Accounts</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage Teachers, Students & Parents</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-teal-700 transition-colors">
          <Plus size={16} /> Add User
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-border p-5 space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or ID..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-secondary text-sm text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-muted-foreground font-medium text-xs uppercase tracking-wide">User ID</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium text-xs uppercase tracking-wide">Name</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium text-xs uppercase tracking-wide">Role</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium text-xs uppercase tracking-wide">Email</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium text-xs uppercase tracking-wide">Status</th>
                <th className="py-3 px-2" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-secondary/40 transition-colors">
                  <td className="py-3 px-2 font-mono text-xs text-muted-foreground">{u.id}</td>
                  <td className="py-3 px-2 font-medium text-foreground">{u.name}</td>
                  <td className="py-3 px-2"><Badge type={u.role} /></td>
                  <td className="py-3 px-2 text-muted-foreground">{u.email}</td>
                  <td className="py-3 px-2"><Badge type={u.status} /></td>
                  <td className="py-3 px-2">
                    <button className="text-primary hover:text-teal-700 transition-colors"><Eye size={15} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>ID Generation Logic</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { prefix: "ST", role: "Student", ex: "ST/9912/11", note: "YY = Grade Level" },
            { prefix: "TR", role: "Teacher", ex: "TR/3347/26", note: "YY = Registration Year" },
            { prefix: "PT", role: "Parent", ex: "PT/6634/26", note: "YY = Registration Year" },
            { prefix: "AD", role: "Admin", ex: "AD/4821/26", note: "YY = Registration Year" },
          ].map((r, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/60">
              <span className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-bold" style={{ fontFamily: "DM Mono, monospace" }}>{r.prefix}</span>
              <div>
                <p className="text-sm font-medium text-foreground">{r.role}</p>
                <p className="text-xs text-muted-foreground font-mono">{r.ex} — {r.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminStructure() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>Academic Structure</h1>
        <p className="text-muted-foreground text-sm mt-1">Subjects, Sections, Semesters & Teacher Assignments</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        {[
          { label: "Active Subjects", value: "24", icon: <BookOpen size={18} /> },
          { label: "Sections", value: "38", icon: <LayoutDashboard size={18} /> },
          { label: "Current Semester", value: "Sem 2 — 2026", icon: <Calendar size={18} /> },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-border p-5 flex items-center gap-4">
            <span className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-primary">{s.icon}</span>
            <div>
              <p className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-border p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>Teacher–Subject Assignments</h3>
          <button className="flex items-center gap-1.5 text-primary text-sm font-medium hover:underline"><Plus size={14} /> Assign</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Subject", "Teacher", "Teacher ID", "Section(s)", "Avg Score"].map(h => (
                  <th key={h} className="text-left py-3 px-2 text-muted-foreground font-medium text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subjects.map((s, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-secondary/40 transition-colors">
                  <td className="py-3 px-2 font-medium text-foreground">{s.name}</td>
                  <td className="py-3 px-2 text-foreground">{s.teacher}</td>
                  <td className="py-3 px-2 font-mono text-xs text-muted-foreground">{s.id}</td>
                  <td className="py-3 px-2 text-muted-foreground">{s.section}</td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden max-w-[80px]">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${s.score}%` }} />
                      </div>
                      <span className="text-xs font-medium text-foreground">{s.score}</span>
                    </div>
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

function CalendarView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>Academic Calendar</h1>
          <p className="text-muted-foreground text-sm mt-1">Upcoming events, exams & holidays</p>
        </div>
        <button 
        onClick={() => {
        //  router.push("/add-event");
        }}
        className="flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-teal-700 transition-colors">
          <Plus size={16} /> Add Event
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div className="bg-white rounded-2xl border border-border p-4 md:p-5">
          <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>Upcoming Events</h3>
          <div className="space-y-3">
            {calendarEvents.map((e, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-secondary flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-[10px] text-muted-foreground font-mono">{e.date.split(" ")[0].toUpperCase()}</span>
                  <span className="text-lg font-bold text-primary leading-none" style={{ fontFamily: "Outfit, sans-serif" }}>{e.date.split(" ")[1]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{e.label}</p>
                  <Badge type={e.type} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>Automated Reminders</h3>
          <div className="space-y-3">
            {[
              { msg: "Final Exam reminder sent to all students", time: "2 days ago", channel: "SMS + Email" },
              { msg: "Fee deadline alert sent to 892 parents", time: "4 days ago", channel: "In-App + SMS" },
              { msg: "Sports Day notice published", time: "6 days ago", channel: "In-App" },
            ].map((r, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50">
                <Bell size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-foreground">{r.msg}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{r.time} · {r.channel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function LostFoundView() {
  const [tab, setTab] = useState<"all" | "found" | "lost">("all");
  const filtered = lostFound.filter(i => tab === "all" || i.status === tab);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>Lost & Found</h1>
        <p className="text-muted-foreground text-sm mt-1">Report and search for lost or found items</p>
      </div>
      <div className="flex gap-2">
        {(["all", "found", "lost"] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${tab === t ? "bg-primary text-white" : "bg-white border border-border text-muted-foreground hover:bg-secondary"}`}
          >
            {t}
          </button>
        ))}
        <button className="ml-auto flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-teal-700 transition-colors">
          <Plus size={15} /> Report Item
        </button>
      </div>
      <div className="space-y-3">
        {filtered.map((item, i) => (
          <div key={i} className="bg-white rounded-2xl border border-border p-5 flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.status === "found" ? "bg-teal-100" : "bg-red-100"}`}>
              <Package size={18} className={item.status === "found" ? "text-teal-600" : "text-red-500"} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>{item.item}</p>
                <Badge type={item.status} />
              </div>
              <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
              <p className="text-xs text-muted-foreground mt-1.5">Reported by {item.reportedBy} · {item.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeedbackAdminView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>Anonymous Feedback</h1>
        <p className="text-muted-foreground text-sm mt-1">Student feedback on teachers and courses — admin only</p>
      </div>
      <div className="space-y-4">
        {feedbackList.map((f, i) => (
          <div key={i} className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="font-semibold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>{f.course}</p>
                <p className="text-sm text-muted-foreground">{f.teacher} · {f.date}</p>
              </div>
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} size={14} className={s <= f.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                ))}
              </div>
            </div>
            <p className="mt-3 text-sm text-foreground bg-secondary/60 rounded-xl px-4 py-3 italic">"{f.comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── TEACHER VIEWS ────────────────────────────────────────────────────────────

function TeacherDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>My Classes</h1>
        <p className="text-muted-foreground text-sm mt-1">Mathematics — Sections 11-A & 11-B · Semester 2, 2026</p>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Total Students" value="48" icon={<Users size={18} />} />
        <StatCard label="Average Score" value="83.4" sub="This semester" icon={<BarChart3 size={18} />} trend={3} />
        <StatCard label="Graded Tests" value="3/4" sub="Final exam pending" icon={<ClipboardList size={18} />} />
        <StatCard label="Incidents" value="3" sub="This semester" icon={<AlertTriangle size={18} />} />
      </div>
      <div className="bg-white rounded-2xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>Student Roster — Section 11-A</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Student", "ID", "Quiz", "Midterm", "Final", "Total", "Grade"].map(h => (
                  <th key={h} className="text-left py-3 px-2 text-muted-foreground font-medium text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.filter(s => s.section === "11-A").map((s, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-secondary/40 transition-colors">
                  <td className="py-3 px-2 font-medium text-foreground">{s.name}</td>
                  <td className="py-3 px-2 font-mono text-xs text-muted-foreground">{s.id}</td>
                  <td className="py-3 px-2 text-foreground">{s.quiz}</td>
                  <td className="py-3 px-2 text-foreground">{s.test}</td>
                  <td className="py-3 px-2 text-foreground">{s.final}</td>
                  <td className="py-3 px-2 font-semibold text-foreground">{Math.round((s.quiz + s.test + s.final) / 3)}</td>
                  <td className="py-3 px-2"><Badge type={s.grade} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function GradeEntryView() {
  const sections = ["11-A", "11-B"];
  const [activeSection, setActiveSection] = useState("11-A");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [grades, setGrades] = useState<Record<string, { quiz: string; assignment: string; test: string; final: string }>>(
    Object.fromEntries(students.map(s => [s.id, {
      quiz: String(s.quiz),
      assignment: String(s.assignment),
      test: String(s.test),
      final: String(s.final),
    }]))
  );

  const clamp = (v: string) => Math.min(100, Math.max(0, parseInt(v) || 0));
  const calcTotal = (id: string) => {
    const g = grades[id];
    return Math.round((clamp(g.quiz) + clamp(g.assignment) + clamp(g.test) + clamp(g.final)) / 4);
  };
  const calcGrade = (total: number) => {
    if (total >= 90) return "A";
    if (total >= 80) return "B";
    if (total >= 70) return "C";
    if (total >= 60) return "D";
    return "F";
  };

  const sectionStudents = students
    .filter(s => s.section === activeSection)
    .map(s => ({ ...s, total: calcTotal(s.id) }))
    .sort((a, b) => b.total - a.total)
    .map((s, i) => ({ ...s, rank: i + 1 }));

  const FIELDS = [
    { key: "quiz" as const, label: "Quiz", max: 100, color: "bg-blue-50 border-blue-200", accent: "text-blue-600" },
    { key: "assignment" as const, label: "Assignment", max: 100, color: "bg-purple-50 border-purple-200", accent: "text-purple-600" },
    { key: "test" as const, label: "Midterm", max: 100, color: "bg-amber-50 border-amber-200", accent: "text-amber-600" },
    { key: "final" as const, label: "Final Exam", max: 100, color: "bg-teal-50 border-teal-200", accent: "text-teal-600" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>Grade Entry</h1>
        <p className="text-muted-foreground text-sm mt-1">Mathematics — Semester 2, 2026 · Scores capped at 100</p>
      </div>

      {/* Section filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide mr-1">Section:</span>
        {sections.map(sec => (
          <button
            key={sec}
            onClick={() => { setActiveSection(sec); setExpandedId(null); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeSection === sec ? "bg-primary text-white" : "bg-white border border-border text-muted-foreground hover:bg-secondary"}`}
          >
            {sec}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">{sectionStudents.length} students</span>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                {["Rank", "Student", "ID", "Quiz", "Assignment", "Midterm", "Final", "Average", "Grade", ""].map(h => (
                  <th key={h} className="text-left py-3 px-3 text-muted-foreground font-medium text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sectionStudents.map((s) => {
                const g = grades[s.id];
                const isExpanded = expandedId === s.id;
                const total = s.total;
                const letter = calcGrade(total);
                return (
                  <>
                    <tr
                      key={s.id}
                      className={`border-b border-border/50 transition-colors cursor-pointer ${isExpanded ? "bg-secondary/50" : "hover:bg-secondary/30"}`}
                      onClick={() => setExpandedId(isExpanded ? null : s.id)}
                    >
                      {/* Rank */}
                      <td className="py-3 px-3">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${s.rank === 1 ? "bg-amber-100 text-amber-700" : s.rank === 2 ? "bg-gray-100 text-gray-600" : s.rank === 3 ? "bg-orange-100 text-orange-600" : "bg-secondary text-muted-foreground"}`}>
                          {s.rank}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-medium text-foreground whitespace-nowrap">{s.name}</td>
                      <td className="py-3 px-3 font-mono text-xs text-muted-foreground">{s.id}</td>
                      <td className="py-3 px-3 text-foreground">{clamp(g.quiz)}</td>
                      <td className="py-3 px-3 text-foreground">{clamp(g.assignment)}</td>
                      <td className="py-3 px-3 text-foreground">{clamp(g.test)}</td>
                      <td className="py-3 px-3 text-foreground">{clamp(g.final)}</td>
                      <td className="py-3 px-3 font-bold text-foreground">{total}</td>
                      <td className="py-3 px-3"><Badge type={letter} /></td>
                      <td className="py-3 px-3">
                        <ChevronDown size={15} className={`text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </td>
                    </tr>

                    {/* Expanded detail row */}
                    {isExpanded && (
                      <tr key={`${s.id}-detail`} className="border-b border-border/50 bg-secondary/20">
                        <td colSpan={10} className="px-4 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {FIELDS.map(field => (
                              <div key={field.key} className={`rounded-xl border p-3 space-y-2 ${field.color}`}>
                                <div className="flex items-center justify-between">
                                  <span className={`text-xs font-semibold uppercase tracking-wide ${field.accent}`}>{field.label}</span>
                                  <span className="text-xs text-muted-foreground">/{field.max}</span>
                                </div>
                                <input
                                  type="number"
                                  min={0}
                                  max={field.max}
                                  value={grades[s.id][field.key]}
                                  onClick={e => e.stopPropagation()}
                                  onChange={e => setGrades(prev => ({ ...prev, [s.id]: { ...prev[s.id], [field.key]: e.target.value } }))}
                                  className="w-full px-3 py-2 rounded-lg bg-white border border-white/80 text-center text-lg font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                                />
                                {/* Mini bar */}
                                <div className="h-1.5 rounded-full bg-white/60 overflow-hidden">
                                  <div className="h-full rounded-full bg-current transition-all" style={{ width: `${clamp(grades[s.id][field.key])}%`, color: field.accent.replace("text-", "") }} />
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">Average of all 4 components · Rank <strong className="text-foreground">#{s.rank}</strong> in {activeSection}</p>
                            <button
                              onClick={e => { e.stopPropagation(); setExpandedId(null); }}
                              className="text-xs text-primary font-medium hover:underline"
                            >
                              Collapse
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border flex justify-end">
          <button className="bg-primary text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-teal-700 transition-colors">
            Save Grades
          </button>
        </div>
      </div>
    </div>
  );
}

function DisciplineView() {
  const [type, setType] = useState("Late");
  const [student, setStudent] = useState("");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>Discipline Records</h1>
        <p className="text-muted-foreground text-sm mt-1">Incidents are logged and parents are automatically notified</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-border p-5 space-y-4">
          <h3 className="font-semibold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>Record New Incident</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">Student</label>
              <select
                value={student}
                onChange={e => setStudent(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Select student...</option>
                {students.map(s => <option key={s.id} value={s.id}>{s.name} — {s.section}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">Incident Type</label>
              <div className="flex gap-2 flex-wrap">
                {["Late", "Misconduct", "Cheating", "Fighting"].map(t => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${type === t ? "bg-primary text-white" : "bg-secondary text-muted-foreground hover:bg-secondary/80"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">Notes</label>
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
          <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>Recent Incidents</h3>
          <div className="space-y-3">
            {disciplines.map((d, i) => (
              <div key={i} className="p-3 rounded-xl bg-secondary/50 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-foreground text-sm">{d.student}</p>
                  <Badge type={d.type} />
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

// ── STUDENT VIEWS ────────────────────────────────────────────────────────────

function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>My Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Grade 11-A · Semester 2, Academic Year 2025/26</p>
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Enrolled Subjects" value="5" icon={<BookOpen size={18} />} />
        <StatCard label="Overall Average" value="87.2" sub="Grade: A" icon={<Award size={18} />} trend={5} />
        <StatCard label="Section" value="11-A" icon={<Users size={18} />} />
        <StatCard label="Semester" value="Sem 2" sub="Ongoing" icon={<Calendar size={18} />} />
      </div>
      <div className="bg-white rounded-2xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>Current Semester Grades</h3>
        <div className="space-y-3">
          {subjects.map((s, i) => (
            <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-primary flex-shrink-0">
                <BookOpen size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm">{s.name}</p>
                <p className="text-xs text-muted-foreground">{s.teacher} · {s.id}</p>
              </div>
              <div className="flex-1 max-w-[120px]">
                <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${s.score}%` }} />
                </div>
              </div>
              <span className="text-sm font-bold text-foreground w-8 text-right">{s.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudentGrades() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>My Grades</h1>
        <p className="text-muted-foreground text-sm mt-1">Semester 2 — 2026 · Sara Tesfaye · ST/9912/11</p>
      </div>
      <div className="bg-white rounded-2xl border border-border p-5">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Subject", "Teacher", "Quiz", "Midterm", "Final", "Average", "Letter"].map(h => (
                  <th key={h} className="text-left py-3 px-2 text-muted-foreground font-medium text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subjects.map((s, i) => {
                const q = Math.round(s.score * 0.95), t = Math.round(s.score * 0.97), f = s.score;
                const avg = Math.round((q + t + f) / 3);
                const letter = avg >= 90 ? "A" : avg >= 80 ? "B" : avg >= 70 ? "C" : avg >= 60 ? "D" : "F";
                return (
                  <tr key={i} className="border-b border-border/50 hover:bg-secondary/40 transition-colors">
                    <td className="py-3 px-2 font-medium text-foreground">{s.name}</td>
                    <td className="py-3 px-2 text-muted-foreground">{s.teacher}</td>
                    <td className="py-3 px-2 text-foreground">{q}</td>
                    <td className="py-3 px-2 text-foreground">{t}</td>
                    <td className="py-3 px-2 text-foreground">{f}</td>
                    <td className="py-3 px-2 font-semibold text-foreground">{avg}</td>
                    <td className="py-3 px-2"><Badge type={letter} /></td>
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

function StudentHistory() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>Grade History</h1>
        <p className="text-muted-foreground text-sm mt-1">Past semesters and completed courses</p>
      </div>
      <div className="space-y-4">
        {[
          { sem: "Semester 1 — 2025/26", avg: "84.6", grade: "B", subjects: ["Mathematics", "Physics", "Chemistry", "English", "History"] },
          { sem: "Semester 2 — 2024/25", avg: "79.2", grade: "C", subjects: ["Mathematics", "Biology", "Civics", "English", "Amharic"] },
        ].map((h, i) => (
          <div key={i} className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>{h.sem}</p>
                <p className="text-xs text-muted-foreground">Grade Average: {h.avg}</p>
              </div>
              <Badge type={h.grade} />
            </div>
            <div className="flex flex-wrap gap-2">
              {h.subjects.map(s => (
                <span key={s} className="px-3 py-1 rounded-lg bg-secondary text-xs font-medium text-muted-foreground">{s}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StudentFeedback() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>Submit Feedback</h1>
        <p className="text-muted-foreground text-sm mt-1">All feedback is anonymous — submitted to Admin only</p>
      </div>
      {submitted ? (
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-3">
            <Shield size={24} className="text-teal-600" />
          </div>
          <p className="font-semibold text-teal-800 text-lg" style={{ fontFamily: "Outfit, sans-serif" }}>Feedback Submitted</p>
          <p className="text-teal-600 text-sm mt-1">Your response has been recorded anonymously.</p>
          <button onClick={() => { setSubmitted(false); setRating(0); }} className="mt-4 text-sm text-teal-600 hover:underline">Submit another</button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">Subject</label>
            <select className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
              {subjects.map(s => <option key={s.name}>{s.name} — {s.teacher}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-2">Rating</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map(s => (
                <button
                  key={s}
                  onClick={() => setRating(s)}
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star size={28} className={s <= (hover || rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">Feedback</label>
            <textarea
              rows={4}
              placeholder="Share your thoughts on this course or teacher..."
              className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground resize-none"
            />
          </div>
          <button
            onClick={() => setSubmitted(true)}
            className="bg-primary text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-teal-700 transition-colors"
          >
            Submit Anonymously
          </button>
        </div>
      )}
    </div>
  );
}

// ── PARENT VIEWS ─────────────────────────────────────────────────────────────

const children = [
  { name: "Sara Tesfaye", id: "ST/9912/11", grade: "11-A", avg: 87.2 },
  { name: "Naol Tesfaye", id: "ST/2204/09", grade: "9-B", avg: 74.5 },
];

function ParentDashboard() {
  const [selected, setSelected] = useState(0);
  const child = children[selected];
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>Parent Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Almaz Girma · PT/6634/26</p>
      </div>
      <div className="flex gap-2 flex-wrap">
        {children.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setSelected(i)}
            className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${selected === i ? "bg-primary text-white" : "bg-white border border-border text-muted-foreground hover:bg-secondary"}`}
          >
            <GraduationCap size={15} />
            {c.name}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 md:gap-4">
        <StatCard label="Student" value={child.grade} sub={child.id} icon={<GraduationCap size={18} />} />
        <StatCard label="Average" value={String(child.avg)} sub="Current semester" icon={<TrendingUp size={18} />} />
        <StatCard label="Subjects" value="5" icon={<BookOpen size={18} />} />
        <StatCard label="Fee Status" value="Pending" sub="Due July 20" icon={<Bell size={18} />} />
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
        <Bell size={18} className="text-amber-600 flex-shrink-0" />
        <div>
          <p className="font-medium text-amber-800 text-sm">School Fee Deadline — July 20, 2026</p>
          <p className="text-amber-600 text-xs">2,400 ETB outstanding. Pay via bank transfer or school cashier.</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>{child.name} — Subject Performance</h3>
        <div className="space-y-3">
          {subjects.map((s, i) => (
            <div key={i} className="flex items-center gap-4">
              <p className="text-sm text-foreground w-36 flex-shrink-0 truncate">{s.name}</p>
              <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${s.score}%` }} />
              </div>
              <span className="text-sm font-semibold text-foreground w-8 text-right">{s.score}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ParentReport() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>Report Card</h1>
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
            <p className="text-white font-bold text-lg" style={{ fontFamily: "Outfit, sans-serif" }}>Ethio Academy</p>
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
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">{k}</p>
                <p className="font-semibold text-foreground">{v}</p>
              </div>
            ))}
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Subject", "Teacher", "Quiz", "Midterm", "Final", "Avg", "Grade"].map(h => (
                  <th key={h} className="text-left py-3 px-2 text-muted-foreground font-medium text-xs uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subjects.map((s, i) => {
                const q = Math.round(s.score * 0.95), t = Math.round(s.score * 0.97), f = s.score;
                const avg = Math.round((q + t + f) / 3);
                const letter = avg >= 90 ? "A" : avg >= 80 ? "B" : avg >= 70 ? "C" : avg >= 60 ? "D" : "F";
                return (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-3 px-2 font-medium text-foreground">{s.name}</td>
                    <td className="py-3 px-2 text-muted-foreground text-xs">{s.teacher}</td>
                    <td className="py-3 px-2">{q}</td>
                    <td className="py-3 px-2">{t}</td>
                    <td className="py-3 px-2">{f}</td>
                    <td className="py-3 px-2 font-bold">{avg}</td>
                    <td className="py-3 px-2"><Badge type={letter} /></td>
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

function ParentAlerts() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>Alerts & Notifications</h1>
        <p className="text-muted-foreground text-sm mt-1">SMS, Email & In-App alerts for all linked students</p>
      </div>
      <div className="space-y-3">
        {[
          { title: "School Fee Due — July 20", body: "2,400 ETB outstanding for Sara Tesfaye (Grade 11-A). Pay via bank transfer.", channel: "SMS + Email", time: "2 days ago", urgent: true },
          { title: "Exam Schedule Published", body: "Final examinations begin August 1. Download the schedule from the calendar.", channel: "In-App", time: "4 days ago", urgent: false },
          { title: "Discipline Notice — Naol Tesfaye", body: "Naol was recorded late on July 3. Please discuss punctuality at home.", channel: "SMS + Email", time: "6 days ago", urgent: true },
          { title: "Parent-Teacher Conference — July 28", body: "Please attend the scheduled conference for Grade 11-A on July 28 at 9 AM.", channel: "In-App + SMS", time: "8 days ago", urgent: false },
        ].map((a, i) => (
          <div key={i} className={`bg-white rounded-2xl border p-5 flex gap-4 ${a.urgent ? "border-amber-200" : "border-border"}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${a.urgent ? "bg-amber-100" : "bg-secondary"}`}>
              <Bell size={18} className={a.urgent ? "text-amber-600" : "text-primary"} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <p className="font-semibold text-foreground text-sm">{a.title}</p>
                <span className="text-xs text-muted-foreground flex-shrink-0">{a.time}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{a.body}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-teal-600 font-medium flex items-center gap-1">
                  <Mail size={11} /> {a.channel}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── SHARED NAV + LOGIN ───────────────────────────────────────────────────────

function detectRoleFromId(id: string): Role | null {
  const prefix = id.split("/")[0]?.toUpperCase();
  if (prefix === "AD") return "admin";
  if (prefix === "TR") return "teacher";
  if (prefix === "ST") return "student";
  if (prefix === "PT") return "parent";
  return null;
}

function LoginScreen({ onLogin }: { onLogin: (role: Role) => void }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const detectedRole = detectRoleFromId(userId);

  const handleLogin = () => {
    if (!detectedRole) {
      setError("Invalid User ID. Format: AD/XXXX/YY, TR/XXXX/YY, ST/XXXX/YY, PT/XXXX/YY");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }
    setError("");
    onLogin(detectedRole);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow shadow-teal-100">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>Ethio Academy</h1>
        </div>
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-5">
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">User ID</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={userId}
                onChange={e => { setUserId(e.target.value); setError(""); }}
                placeholder="e.g. ST/9912/11"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-secondary border border-border text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
              />
              {detectedRole && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md capitalize">
                  {detectedRole}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">Your role is detected automatically from your ID prefix</p>
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                placeholder="Enter your password"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
              />
              <button onClick={() => setShowPass(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                <Eye size={15} />
              </button>
            </div>
          </div>
          {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-teal-700 transition-colors text-sm"
          >
            Sign In
          </button>
          <div className="border-t border-border pt-4 space-y-1.5">
            <p className="text-xs text-muted-foreground font-medium">Demo credentials:</p>
            {ROLES.map(r => (
              <button
                key={r.key}
                onClick={() => { setUserId(DEMO_USERS[r.key].id); setPassword("demo1234"); setError(""); }}
                className="w-full text-left text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 py-0.5"
              >
                <span className="font-mono text-primary">{DEMO_USERS[r.key].id}</span>
                <span>— {r.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SidebarInner({ role, active, setActive, onLogout, collapsed, setCollapsed, onClose }: {
  role: Role; active: string; setActive: (k: string) => void; onLogout: () => void;
  collapsed: boolean; setCollapsed: (v: boolean) => void; onClose?: () => void;
}) {
  const user = DEMO_USERS[role];
  const nav = NAV_BY_ROLE[role];
  return (
    <div className="flex flex-col h-full" style={{ background: "#0a4f49" }}>
      <div className={`flex items-center gap-3 p-4 border-b border-white/10 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
          <GraduationCap size={18} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="font-bold text-white text-sm leading-tight" style={{ fontFamily: "Outfit, sans-serif" }}>Ethio Academy</p>
            <p className="text-xs text-teal-200 truncate font-mono">{user.id}</p>
          </div>
        )}
        {onClose && (
          <button onClick={onClose} className="text-teal-200 hover:text-white ml-auto">
            <X size={18} />
          </button>
        )}
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {nav.map(item => (
          <button
            key={item.key}
            onClick={() => { setActive(item.key); onClose?.(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${collapsed ? "justify-center" : ""} ${active === item.key ? "text-white" : "text-teal-100 hover:text-white"}`}
            style={active === item.key ? { background: "#0d9488" } : undefined}
            onMouseEnter={e => { if (active !== item.key) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)"; }}
            onMouseLeave={e => { if (active !== item.key) (e.currentTarget as HTMLButtonElement).style.background = ""; }}
          >
            {item.icon}
            {!collapsed && item.label}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-white/10 space-y-1">
        {!collapsed && (
          <div className="px-3 py-2 rounded-xl bg-white/10 mb-2">
            <p className="text-xs font-semibold text-white truncate">{user.name}</p>
            <p className="text-xs text-teal-200 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`hidden md:flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-teal-100 hover:text-white transition-colors ${collapsed ? "justify-center" : ""}`}
        >
          <ChevronRight size={16} className={`transition-transform ${collapsed ? "" : "rotate-180"}`} />
          {!collapsed && "Collapse"}
        </button>
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-teal-100 hover:text-white hover:bg-white/10 transition-colors ${collapsed ? "justify-center" : ""}`}
        >
          <LogOut size={16} />
          {!collapsed && "Sign Out"}
        </button>
      </div>
    </div>
  );
}

function Sidebar({ role, active, setActive, onLogout, collapsed, setCollapsed, mobileOpen, setMobileOpen }: {
  role: Role; active: string; setActive: (k: string) => void; onLogout: () => void;
  collapsed: boolean; setCollapsed: (v: boolean) => void; mobileOpen: boolean; setMobileOpen: (v: boolean) => void;
}) {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`hidden md:flex flex-col h-full transition-all duration-300 flex-shrink-0 ${collapsed ? "w-16" : "w-60"}`}>
        <SidebarInner role={role} active={active} setActive={setActive} onLogout={onLogout} collapsed={collapsed} setCollapsed={setCollapsed} />
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 z-50 shadow-2xl">
            <SidebarInner role={role} active={active} setActive={setActive} onLogout={onLogout} collapsed={false} setCollapsed={() => {}} onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}
    </>
  );
}

function renderView(role: Role, active: string) {
  if (role === "admin") {
    if (active === "dashboard") return <AdminDashboard />;
    if (active === "users") return <AdminUsers />;
    if (active === "structure") return <AdminStructure />;
    if (active === "calendar") return <CalendarView />;
    if (active === "lostfound") return <LostFoundView />;
    if (active === "feedback") return <FeedbackAdminView />;
  }
  if (role === "teacher") {
    if (active === "dashboard") return <TeacherDashboard />;
    if (active === "grades") return <GradeEntryView />;
    if (active === "discipline") return <DisciplineView />;
    if (active === "calendar") return <CalendarView />;
  }
  if (role === "student") {
    if (active === "dashboard") return <StudentDashboard />;
    if (active === "grades") return <StudentGrades />;
    if (active === "history") return <StudentHistory />;
    if (active === "feedback") return <StudentFeedback />;
    if (active === "lostfound") return <LostFoundView />;
  }
  if (role === "parent") {
    if (active === "dashboard") return <ParentDashboard />;
    if (active === "report") return <ParentReport />;
    if (active === "schedule") return <CalendarView />;
    if (active === "alerts") return <ParentAlerts />;
  }
  return null;
}

export default function App() {
  const [role, setRole] = useState<Role | null>(null);
  const [active, setActive] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!role) {
    return <LoginScreen onLogin={r => { setRole(r); setActive("dashboard"); }} />;
  }

  const nav = NAV_BY_ROLE[role];
  const activeLabel = nav.find(n => n.key === active)?.label ?? "";

  return (
    <div className="flex h-screen bg-background overflow-hidden" style={{ fontFamily: "DM Sans, sans-serif" }}>
      <Sidebar
        role={role}
        active={active}
        setActive={setActive}
        onLogout={() => setRole(null)}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-white flex-shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "#0a4f49" }}>
              <GraduationCap size={14} className="text-white" />
            </div>
            <span className="font-semibold text-foreground text-sm truncate" style={{ fontFamily: "Outfit, sans-serif" }}>{activeLabel}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">{DEMO_USERS[role].name.charAt(0)}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
            {renderView(role, active)}
          </div>
        </main>
      </div>
    </div>
  );
}
