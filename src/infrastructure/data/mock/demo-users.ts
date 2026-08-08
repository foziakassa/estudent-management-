import type { Role, DemoUser } from "@/domain/types";

export const DEMO_USERS: Record<Role, DemoUser> = {
  admin: { id: "AD/4821/26", name: "Mekdes Haile", email: "mekdes@school.et" },
  teacher: { id: "TR/3347/26", name: "Dawit Bekele", email: "dawit@school.et" },
  student: { id: "ST/9912/11", name: "Sara Tesfaye", email: "sara@school.et" },
  parent: { id: "PT/6634/26", name: "Almaz Girma", email: "almaz@school.et" },
};
