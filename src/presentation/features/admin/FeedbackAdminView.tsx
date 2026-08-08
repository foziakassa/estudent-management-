import { Star } from "lucide-react";
import { feedbackList } from "@/infrastructure/data/mock";

export function FeedbackAdminView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
          Anonymous Feedback
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Student feedback on teachers and courses — admin only
        </p>
      </div>
      <div className="space-y-4">
        {feedbackList.map((item, index) => (
          <div key={index} className="bg-white rounded-2xl border border-border p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <p className="font-semibold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
                  {item.course}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.teacher} · {item.date}
                </p>
              </div>
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    className={star <= item.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
                  />
                ))}
              </div>
            </div>
            <p className="mt-3 text-sm text-foreground bg-secondary/60 rounded-xl px-4 py-3 italic">
              "{item.comment}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
