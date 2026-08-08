import type { Announcement } from "@/domain/types";

export const announcements: Announcement[] = [
  { title: "Final Exam Schedule Published", date: "2026-07-08", type: "exam", urgent: true },
  { title: "School Fee Deadline — July 20", date: "2026-07-05", type: "fee", urgent: true },
  { title: "Sports Day — July 25", date: "2026-07-03", type: "event", urgent: false },
  { title: "Parent-Teacher Conference", date: "2026-07-01", type: "event", urgent: false },
];
