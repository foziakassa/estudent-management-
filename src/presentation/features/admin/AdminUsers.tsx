import { useState } from "react";
import { Eye, Plus, Search } from "lucide-react";
import { userAccounts } from "@/infrastructure/data/mock";
import { StatusBadge } from "@/presentation/components/shared";

export function AdminUsers() {
  const [search, setSearch] = useState("");
  const filtered = userAccounts.filter(
    (user) => user.name.toLowerCase().includes(search.toLowerCase()) || user.id.includes(search)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
            User Accounts
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Manage Teachers, Students & Parents</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-teal-700 transition-colors">
          <Plus size={16} /> Add User
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-border p-5 space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or ID..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-secondary text-sm text-foreground border border-border focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["User ID", "Name", "Role", "Email", "Status", ""].map((header) => (
                  <th key={header} className="text-left py-3 px-2 text-muted-foreground font-medium text-xs uppercase tracking-wide">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((user, index) => (
                <tr key={index} className="border-b border-border/50 hover:bg-secondary/40 transition-colors">
                  <td className="py-3 px-2 font-mono text-xs text-muted-foreground">{user.id}</td>
                  <td className="py-3 px-2 font-medium text-foreground">{user.name}</td>
                  <td className="py-3 px-2">
                    <StatusBadge type={user.role} />
                  </td>
                  <td className="py-3 px-2 text-muted-foreground">{user.email}</td>
                  <td className="py-3 px-2">
                    <StatusBadge type={user.status} />
                  </td>
                  <td className="py-3 px-2">
                    <button className="text-primary hover:text-teal-700 transition-colors">
                      <Eye size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-border p-5">
        <h3 className="font-semibold text-foreground mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
          ID Generation Logic
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { prefix: "ST", role: "Student", ex: "ST/9912/11", note: "YY = Grade Level" },
            { prefix: "TR", role: "Teacher", ex: "TR/3347/26", note: "YY = Registration Year" },
            { prefix: "PT", role: "Parent", ex: "PT/6634/26", note: "YY = Registration Year" },
            { prefix: "AD", role: "Admin", ex: "AD/4821/26", note: "YY = Registration Year" },
          ].map((rule, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/60">
              <span
                className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white text-xs font-bold"
                style={{ fontFamily: "DM Mono, monospace" }}
              >
                {rule.prefix}
              </span>
              <div>
                <p className="text-sm font-medium text-foreground">{rule.role}</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {rule.ex} — {rule.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
