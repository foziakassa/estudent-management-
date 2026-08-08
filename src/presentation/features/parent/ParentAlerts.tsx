import { Bell, Mail } from "lucide-react";

export function ParentAlerts() {
  const alertsData = [
    {
      title: "School Fee Due — July 20",
      body: "2,400 ETB outstanding for Sara Tesfaye (Grade 11-A). Pay via bank transfer.",
      channel: "SMS + Email",
      time: "2 days ago",
      urgent: true,
    },
    {
      title: "Exam Schedule Published",
      body: "Final examinations begin August 1. Download the schedule from the calendar.",
      channel: "In-App",
      time: "4 days ago",
      urgent: false,
    },
    {
      title: "Discipline Notice — Naol Tesfaye",
      body: "Naol was recorded late on July 3. Please discuss punctuality at home.",
      channel: "SMS + Email",
      time: "6 days ago",
      urgent: true,
    },
    {
      title: "Parent-Teacher Conference — July 28",
      body: "Please attend the scheduled conference for Grade 11-A on July 28 at 9 AM.",
      channel: "In-App + SMS",
      time: "8 days ago",
      urgent: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
          Alerts & Notifications
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          SMS, Email & In-App alerts for all linked students
        </p>
      </div>
      <div className="space-y-3">
        {alertsData.map((alert, index) => (
          <div
            key={index}
            className={`bg-white rounded-2xl border p-5 flex gap-4 ${
              alert.urgent ? "border-amber-200" : "border-border"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                alert.urgent ? "bg-amber-100" : "bg-secondary"
              }`}
            >
              <Bell size={18} className={alert.urgent ? "text-amber-600" : "text-primary"} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <p className="font-semibold text-foreground text-sm">{alert.title}</p>
                <span className="text-xs text-muted-foreground flex-shrink-0">{alert.time}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{alert.body}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-xs text-teal-600 font-medium flex items-center gap-1">
                  <Mail size={11} /> {alert.channel}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
