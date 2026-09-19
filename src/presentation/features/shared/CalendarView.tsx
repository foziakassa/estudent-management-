import { useCallback, useEffect, useState } from "react";
import { Bell, Plus } from "lucide-react";
import type {
  CalendarEvent,
  CreateCalendarEventPayload,
} from "@/domain/Models/calendar-event.model";
import { StatusBadge } from "@/presentation/components/shared";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import poster from "@/domain/utils/posters";
import axiosInstance from "@/domain/utils/axios_instanse";

const EVENT_TYPES = ["EXAM", "HOLIDAY", "FEE", "EVENT", "ACADEMIC"] as const;
const ROLE_OPTIONS = ["STUDENT", "TEACHER", "PARENT", "ADMIN"] as const;

function formatEventDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return { month: "—", day: "—" };
  }
  return {
    month: date.toLocaleString("en-US", { month: "short" }).toUpperCase(),
    day: String(date.getUTCDate()),
  };
}

function toIsoStart(dateStr: string) {
  return `${dateStr}T00:00:00Z`;
}

function mapEventTypeLabel(type: string) {
  return type.charAt(0) + type.slice(1).toLowerCase();
}

type CalendarViewProps = {
  canManage?: boolean;
};

export function CalendarView({ canManage = false }: CalendarViewProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventType, setEventType] = useState<string>("EXAM");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [targetRoles, setTargetRoles] = useState<string[]>(["STUDENT", "TEACHER"]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceRule, setRecurrenceRule] = useState("FREQ=YEARLY");

  const fetchEvents = useCallback(async () => {
    setIsFetching(true);
    setFetchError("");
    try {
      const response = await axiosInstance.get("/calendar/", {
        params: { page: 1, limit: 50 },
      });
      const payload = response.data?.data ?? response.data;
      const list: CalendarEvent[] = payload?.data ?? payload?.events ?? [];
      setEvents(list);
    } catch (err: any) {
      console.error("Failed to fetch calendar events:", err);
      setFetchError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load calendar events."
      );
      setEvents([]);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEventType("EXAM");
    setStartDate("");
    setEndDate("");
    setTargetRoles(["STUDENT", "TEACHER"]);
    setIsRecurring(false);
    setRecurrenceRule("FREQ=YEARLY");
    setFormError("");
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const toggleRole = (role: string) => {
    setTargetRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (!title.trim()) {
      setFormError("Title is required");
      return;
    }
    if (!startDate || !endDate) {
      setFormError("Start and end dates are required");
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setFormError("End date must be on or after the start date");
      return;
    }
    if (targetRoles.length === 0) {
      setFormError("Select at least one target role");
      return;
    }

    const payload: CreateCalendarEventPayload = {
      title: title.trim(),
      description: description.trim(),
      event_type: eventType,
      start_date: toIsoStart(startDate),
      end_date: toIsoStart(endDate),
      target_roles: targetRoles.join(","),
      is_recurring: isRecurring,
      recurrence_rule: recurrenceRule.trim() || "FREQ=YEARLY",
    };

    setIsSubmitting(true);
    try {
      await poster("/calendar/", payload);
      setSuccessMessage("Calendar event created successfully");
      handleModalClose();
      await fetchEvents();
    } catch (err: any) {
      console.error("Failed to create calendar event:", err);
      setFormError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Failed to create calendar event."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
            Academic Calendar
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Upcoming events, exams & holidays</p>
        </div>
        {canManage && (
          <Button
            onClick={() => {
              setSuccessMessage("");
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-teal-700 transition-colors"
          >
            <Plus size={16} /> Add Event
          </Button>
        )}
      </div>

      {fetchError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {fetchError}
        </div>
      )}

      {successMessage && (
        <div className="bg-teal-50 border border-teal-200 text-teal-800 px-4 py-3 rounded-xl text-sm">
          {successMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div className="bg-white rounded-2xl border border-border p-4 md:p-5">
          <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
            Upcoming Events
          </h3>
          <div className="space-y-3">
            {isFetching ? (
              <p className="text-sm text-muted-foreground py-4 text-center">Loading events...</p>
            ) : events.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No calendar events yet</p>
            ) : (
              events.map((event) => {
                const { month, day } = formatEventDate(event.start_date);
                return (
                  <div
                    key={event.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-xl bg-secondary flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-[10px] text-muted-foreground font-mono">{month}</span>
                      <span
                        className="text-lg font-bold text-primary leading-none"
                        style={{ fontFamily: "Outfit, sans-serif" }}
                      >
                        {day}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{event.title}</p>
                      {event.description && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {event.description}
                        </p>
                      )}
                      <div className="mt-1 flex items-center gap-2 flex-wrap">
                        <StatusBadge type={mapEventTypeLabel(event.event_type)} />
                        <span className="text-[10px] text-muted-foreground">
                          {event.target_roles}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border p-5">
          <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
            Automated Reminders
          </h3>
          <div className="space-y-3">
            {[
              { msg: "Final Exam reminder sent to all students", time: "2 days ago", channel: "SMS + Email" },
              { msg: "Fee deadline alert sent to 892 parents", time: "4 days ago", channel: "In-App + SMS" },
              { msg: "Sports Day notice published", time: "6 days ago", channel: "In-App" },
            ].map((reminder, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50">
                <Bell size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-foreground">{reminder.msg}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {reminder.time} · {reminder.channel}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {canManage && (
        <Dialog open={isModalOpen} onOpenChange={(open) => !open && handleModalClose()}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle style={{ fontFamily: "Outfit, sans-serif" }}>Add Calendar Event</DialogTitle>
              {formError && (
                <DialogDescription className="text-red-500 text-sm">{formError}</DialogDescription>
              )}
            </DialogHeader>

            <form onSubmit={handleCreateEvent} className="space-y-4 py-2">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">
                  Title <span className="text-red-500">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Midterm Exams"
                  disabled={isSubmitting}
                  required
                  className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Midterm examinations for all students"
                  disabled={isSubmitting}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50 resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">
                  Event Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
                >
                  {EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {mapEventTypeLabel(type)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    disabled={isSubmitting}
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    disabled={isSubmitting}
                    required
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">
                  Target Roles <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {ROLE_OPTIONS.map((role) => {
                    const selected = targetRoles.includes(role);
                    return (
                      <button
                        key={role}
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => toggleRole(role)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          selected
                            ? "bg-primary text-white border-primary"
                            : "bg-secondary text-foreground border-border hover:bg-secondary/80"
                        }`}
                      >
                        {role}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="is_recurring"
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  disabled={isSubmitting}
                  className="rounded border-border"
                />
                <label htmlFor="is_recurring" className="text-sm text-foreground">
                  Recurring event
                </label>
              </div>

              {isRecurring && (
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">
                    Recurrence Rule
                  </label>
                  <Input
                    value={recurrenceRule}
                    onChange={(e) => setRecurrenceRule(e.target.value)}
                    placeholder="FREQ=YEARLY"
                    disabled={isSubmitting}
                    className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm"
                  />
                </div>
              )}

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleModalClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-sm"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-sm bg-primary text-white hover:bg-teal-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Event"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
