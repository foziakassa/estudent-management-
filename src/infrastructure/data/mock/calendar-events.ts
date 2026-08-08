import type { CalendarEvent } from "@/domain/types";

export const calendarEvents: CalendarEvent[] = [
  { date: "July 10", label: "Midterm Results Released", type: "academic" },
  { date: "July 15", label: "National Holiday", type: "holiday" },
  { date: "July 20", label: "Fee Payment Deadline", type: "fee" },
  { date: "July 25", label: "Sports Day", type: "event" },
  { date: "Aug 1", label: "Final Exams Begin", type: "exam" },
];
