import { useState } from "react";
import { Shield, Star } from "lucide-react";
import { subjects } from "@/infrastructure/data/mock";

export function StudentFeedback() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
          Submit Feedback
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          All feedback is anonymous — submitted to Admin only
        </p>
      </div>
      {submitted ? (
        <div className="bg-teal-50 border border-teal-200 rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-3">
            <Shield size={24} className="text-teal-600" />
          </div>
          <p className="font-semibold text-teal-800 text-lg" style={{ fontFamily: "Outfit, sans-serif" }}>
            Feedback Submitted
          </p>
          <p className="text-teal-600 text-sm mt-1">Your response has been recorded anonymously.</p>
          <button
            onClick={() => {
              setSubmitted(false);
              setRating(0);
            }}
            className="mt-4 text-sm text-teal-600 hover:underline"
          >
            Submit another
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">
              Subject
            </label>
            <select className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
              {subjects.map((s) => (
                <option key={s.name}>
                  {s.name} — {s.teacher}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-2">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={28}
                    className={
                      star <= (hover || rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"
                    }
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">
              Feedback
            </label>
            <textarea
              rows={4}
              placeholder="Share your thoughts on this course or teacher..."
              className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground resize-none"
            />
          </div>
          <button
            onClick={() => setSubmitted(true)}
            className="bg-primary text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-teal-700 transition-colors"
          >
            Submit Anonymously
          </button>
        </div>
      )}
    </div>
  );
}
