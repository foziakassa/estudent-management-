const STATUS_STYLES: Record<string, string> = {
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

type StatusBadgeProps = {
  type: string;
};

export function StatusBadge({ type }: StatusBadgeProps) {
  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[type] || "bg-gray-100 text-gray-600"}`}
    >
      {type}
    </span>
  );
}
