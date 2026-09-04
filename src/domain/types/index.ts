export type Role = "admin" | "teacher" | "student" | "parent";

export type NavItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
};

export type DemoUser = {
  id: string;
  name: string;
  email: string;
};

export type Student = {
  id: string;
  name: string;
  section: string;
  quiz: number;
  assignment: number;
  test: number;
  final: number;
  grade: string;
};

export type Subject = {
  name: string;
  teacher: string;
  id: string;
  section: string;
  score: number;
};

export type Announcement = {
  title: string;
  date: string;
  type: string;
  urgent: boolean;
};

export type CalendarEvent = {
  date: string;
  label: string;
  type: string;
};

export type LostFoundItem = {
  item: string;
  reportedBy: string;
  date: string;
  status: "found" | "lost";
  description: string;
};

export type UserAccount = {
  phone?: string;
  id: string;
  name: string;
  role: string;
  email?: string;
  status: string;
  grade?: string;
};

export type Feedback = {
  course: string;
  teacher: string;
  rating: number;
  comment: string;
  date: string;
};

export type DisciplineRecord = {
  student: string;
  id: string;
  type: string;
  date: string;
  status: string;
};

export type Child = {
  name: string;
  id: string;
  grade: string;
  avg: number;
};

export type PerformancePoint = {
  month: string;
  score: number;
};

export type GradeDistribution = {
  name: string;
  value: number;
  color: string;
};

export type RoleConfig = {
  key: Role;
  label: string;
  color: string;
  prefix: string;
};
