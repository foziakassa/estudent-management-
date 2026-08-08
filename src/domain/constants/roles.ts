import type { RoleConfig } from "@/domain/types";

export const ROLES: RoleConfig[] = [
  { key: "admin", label: "Administrator", color: "bg-teal-700", prefix: "AD" },
  { key: "teacher", label: "Teacher", color: "bg-teal-600", prefix: "TR" },
  { key: "student", label: "Student", color: "bg-teal-500", prefix: "ST" },
  { key: "parent", label: "Parent", color: "bg-teal-400", prefix: "PT" },
];
