import { useState } from "react";
import { Package, Plus } from "lucide-react";
import { lostFound } from "@/infrastructure/data/mock";
import { StatusBadge } from "@/presentation/components/shared";

export function LostFoundView() {
  const [tab, setTab] = useState<"all" | "found" | "lost">("all");
  const filtered = lostFound.filter((item) => tab === "all" || item.status === tab);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
          Lost & Found
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Report and search for lost or found items</p>
      </div>
      <div className="flex gap-2">
        {(["all", "found", "lost"] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setTab(filter)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize ${tab === filter ? "bg-primary text-white" : "bg-white border border-border text-muted-foreground hover:bg-secondary"}`}
          >
            {filter}
          </button>
        ))}
        <button className="ml-auto flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-teal-700 transition-colors">
          <Plus size={15} /> Report Item
        </button>
      </div>
      <div className="space-y-3">
        {filtered.map((item, index) => (
          <div key={index} className="bg-white rounded-2xl border border-border p-5 flex items-start gap-4">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.status === "found" ? "bg-teal-100" : "bg-red-100"}`}
            >
              <Package size={18} className={item.status === "found" ? "text-teal-600" : "text-red-500"} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
                  {item.item}
                </p>
                <StatusBadge type={item.status} />
              </div>
              <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
              <p className="text-xs text-muted-foreground mt-1.5">
                Reported by {item.reportedBy} · {item.date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
