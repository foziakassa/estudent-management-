import { useState } from "react";
import { Eye, Plus, Search } from "lucide-react";
import { userAccounts as initialUserAccounts } from "@/infrastructure/data/mock";
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
import poster from "@/domain/utils/posters"; // Import poster

export function AdminUsers() {
  const [users, setUsers] = useState(initialUserAccounts);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for adding user
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Student");

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const filtered = users.filter(
    (user) => user.name.toLowerCase().includes(search.toLowerCase()) || user.id.includes(search)
  );

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate required fields
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // Generate User ID (optional - backend can also generate)
      const prefixMap: Record<string, string> = {
        Student: "ST",
        Teacher: "TR",
        Parent: "PT",
        Admin: "AD",
      };
      const prefix = prefixMap[role] || "ST";
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      const newId = `${prefix}/${randomNum}/26`;

      // Prepare payload for API
      const payload = {
        id: newId,
        name: name.trim(),
        email: email.trim(),
        role: role,
        status: "Active",
        // Add any additional fields required by your backend
        // For Student: grade, section
        // For Teacher: subject, section
      };

      // Make API call using poster
      const response = await poster("/users", payload);

      // Update users list with response data
      // This ensures we have the exact data the server stored
      const newUser = response.data || response;
      setUsers([newUser, ...users]);

      // Reset form and close modal
      setName("");
      setEmail("");
      setRole("Student");
      setIsModalOpen(false);

      // Optional: Show success notification
      console.log("User created successfully:", newUser);

    } catch (err: any) {
      console.error("Failed to create user:", err);

      // Extract error message from response
      const errorMsg = err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Failed to create user. Please try again.";

      setError(errorMsg);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
            User Accounts
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Manage Teachers, Students & Parents</p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-teal-700 transition-colors"
        >
          <Plus size={16} /> Add User
        </Button>
      </div>

      {/* Error Toast/Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-border p-5 space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
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

      {/* Add User Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "Outfit, sans-serif" }}>Add New User</DialogTitle>
            {error && (
              <DialogDescription className="text-red-500 text-sm">
                {error}
              </DialogDescription>
            )}
          </DialogHeader>

          <form onSubmit={handleAddUser} className="space-y-4 py-2">
            <div>
              <label className="text-xs text-black uppercase tracking-wide font-medium block mb-1.5">
                Full Name
              </label>
              <Input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Abebe Bikila"
                disabled={isLoading}
                className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">
                Email Address
              </label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. abebe@school.et"
                disabled={isLoading}
                className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={isLoading}
                className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
              >
                <option value="Student">Student (ST)</option>
                <option value="Teacher">Teacher (TR)</option>
                <option value="Parent">Parent (PT)</option>
                <option value="Admin">Admin (AD)</option>
              </select>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsModalOpen(false);
                  setError("");
                }}
                disabled={isLoading}
                className="px-4 py-2 rounded-xl text-sm font-medium border border-border hover:bg-secondary transition-colors"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-primary text-white hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Creating..." : "Create Account"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}