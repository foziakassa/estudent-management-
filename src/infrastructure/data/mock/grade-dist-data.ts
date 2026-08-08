import type { GradeDistribution } from "@/domain/types";

export const gradeDistData: GradeDistribution[] = [
  { name: "A (90-100)", value: 24, color: "#0d9488" },
  { name: "B (80-89)", value: 38, color: "#14b8a6" },
  { name: "C (70-79)", value: 21, color: "#5eead4" },
  { name: "D (60-69)", value: 12, color: "#99f6e4" },
  { name: "F (<60)", value: 5, color: "#ccfbf1" },
];
