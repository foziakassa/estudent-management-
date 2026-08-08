import { Bell, Plus } from "lucide-react";
import { calendarEvents } from "@/infrastructure/data/mock";
import { StatusBadge } from "@/presentation/components/shared";

export function CalendarView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
            Academic Calendar
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Upcoming events, exams & holidays</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-teal-700 transition-colors">
          <Plus size={16} /> Add Event
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        <div className="bg-white rounded-2xl border border-border p-4 md:p-5">
          <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
            Upcoming Events
          </h3>
          <div className="space-y-3">
            {calendarEvents.map((event, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-secondary flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {event.date.split(" ")[0].toUpperCase()}
                  </span>
                  <span
                    className="text-lg font-bold text-primary leading-none"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    {event.date.split(" ")[1]}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{event.label}</p>
                  <StatusBadge type={event.type} />
                </div>
              </div>
            ))}
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
    </div>
  );
}
