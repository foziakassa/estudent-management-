import { useState } from "react";
import type { Role } from "@/domain/types";
import { Sidebar, AppHeader } from "@/presentation/components/layout";
import { NAV_BY_ROLE } from "@/presentation/config/navigation";

import { LoginScreen } from "@/presentation/features/auth";
import { AdminDashboard, AdminUsers, AdminStructure, FeedbackAdminView } from "@/presentation/features/admin";
import { TeacherDashboard, GradeEntryView, DisciplineView } from "@/presentation/features/teacher";
import { StudentDashboard, StudentGrades, StudentHistory, StudentFeedback } from "@/presentation/features/student";
import { ParentDashboard, ParentReport, ParentAlerts } from "@/presentation/features/parent";
import { CalendarView, LostFoundView } from "@/presentation/features/shared";

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
    return (
      <LoginScreen
        onLogin={(selectedRole) => {
          setRole(selectedRole);
          setActive("dashboard");
        }}
      />
    );
  }

  const nav = NAV_BY_ROLE[role];
  const activeLabel = nav.find((n) => n.key === active)?.label ?? "";

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setRole(null);
  };

  return (
    <div
      className="flex h-screen bg-background overflow-hidden"
      style={{ fontFamily: "DM Sans, sans-serif" }}
    >
      <Sidebar
        role={role}
        active={active}
        setActive={setActive}
        onLogout={handleLogout}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AppHeader
          role={role}
          activeLabel={activeLabel}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
          onMenuOpen={() => setMobileOpen(true)}
          onLogout={handleLogout}
        />
       
        <main className="flex-1 overflow-y-auto">
          <div className="w-full px-4 md:px-6 py-4 md:py-5">
            {renderView(role, active)}
          </div>
        </main>
      </div>
    </div>
  );
}