import type { UserAccount } from "@/domain/types";

export const userAccounts: UserAccount[] = [
  { id: "TR/3347/26", name: "Dawit Bekele", role: "Teacher", email: "dawit@school.et", status: "Active" },
  { id: "ST/9912/11", name: "Sara Tesfaye", role: "Student", email: "sara@school.et", status: "Active" },
  { id: "PT/6634/26", name: "Almaz Girma", role: "Parent", email: "almaz@school.et", status: "Active" },
  { id: "ST/1102/11", name: "Abebe Kebede", role: "Student", email: "abebe@school.et", status: "Active" },
  { id: "TR/2210/26", name: "Selamawit Hailu", role: "Teacher", email: "selamawit@school.et", status: "Inactive" },
];
