import {
  LayoutDashboard,
  Users,
  BookOpen,
  Calendar,
  Bell,
  ClipboardList,
  AlertTriangle,
  MessageSquare,
  Award,
  Clock,
  FileText,
  Package,
} from "lucide-react";
import type { Role, NavItem } from "@/domain/types";

export const NAV_BY_ROLE: Record<Role, NavItem[]> = {
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
