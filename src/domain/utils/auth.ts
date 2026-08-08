import type { Role } from "@/domain/types";

export function detectRoleFromId(id: string): Role | null {
  const prefix = id.split("/")[0]?.toUpperCase();
  if (prefix === "AD") return "admin";
  if (prefix === "TR") return "teacher";
  if (prefix === "ST") return "student";
  if (prefix === "PT") return "parent";
  return null;
}
