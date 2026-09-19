export type CalendarEventType =
  | "EXAM"
  | "HOLIDAY"
  | "FEE"
  | "EVENT"
  | "ACADEMIC"
  | string;

export type CalendarTargetRole = "STUDENT" | "TEACHER" | "PARENT" | "ADMIN";

export interface CalendarEvent {
  id: number;
  event_type: CalendarEventType;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  target_roles: string;
  is_recurring: boolean;
  recurrence_rule?: string;
  created_by: number;
  created_at: string;
}

export interface CreateCalendarEventPayload {
  title: string;
  description: string;
  event_type: CalendarEventType;
  start_date: string;
  end_date: string;
  target_roles: string;
  is_recurring: boolean;
  recurrence_rule?: string;
}

export interface CalendarListData {
  data: CalendarEvent[];
  page: number;
  limit: number;
  total: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
