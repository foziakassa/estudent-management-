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
import poster from "@/domain/utils/posters";

export function AdminUsers() {
  const [users, setUsers] = useState(initialUserAccounts);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state for adding user
  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState(""); // New state for phone
  const [role, setRole] = useState("STUDENT");
  const [grade, setGrade] = useState<number | "">("");

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Grade options for Ethiopian high schools (1-12)
  const gradeOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const filtered = users.filter(
    (user) => user.name.toLowerCase().includes(search.toLowerCase()) || user.id.includes(search)
  );

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate required fields
    if (!full_name.trim()) {
      setError("Full name is required");
      return;
    }

    // Validate based on role
    if (role === "STUDENT") {
      // Student requires email
      if (!email.trim()) {
        setError("Email is required for students");
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address");
        return;
      }

      // Student requires grade
      if (!grade) {
        setError("Grade is required for students");
        return;
      }

      // Validate grade range
      if (grade && (grade < 1 || grade > 12)) {
        setError("Grade must be between 1 and 12");
        return;
      }
    } else {
      // For Teacher, Parent, Admin - require at least email or phone
      if (!email.trim() && !phone_number.trim()) {
        setError("Either email or phone number is required");
        return;
      }

      // Validate email if provided
      if (email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setError("Please enter a valid email address");
          return;
        }
      }

      // Validate phone if provided
      if (phone_number.trim()) {
        // Ethiopian phone number format: 09XXXXXXXX or 07XXXXXXXX
        const phoneRegex = /^(09|07)\d{8}$/;
        if (!phoneRegex.test(phone_number.trim())) {
          setError("Please enter a valid Ethiopian phone number (e.g., 0912345678)");
          return;
        }
      }
    }

    setIsLoading(true);

    try {
      // Prepare payload with correct field names for backend
      const payload: any = {
        full_name: full_name.trim(),
        Role: role, // STUDENT, TEACHER, PARENT, ADMIN
      };

      // Add email if provided
      if (email.trim()) {
        payload.Email = email.trim();
      }

      // Add phone number if provided (for non-student roles)
      if (phone_number.trim()) {
        payload.phone = phone_number.trim();
      }

      // Add grade as number only for students
      if (role === "STUDENT" && grade) {
        payload.Grade = Number(grade);
      }

      console.log("Sending payload:", JSON.stringify(payload, null, 2));

      // Make API call using poster
      const response = await poster("/users/", payload);

      console.log("Response:", response);

      // Map response to frontend format
      const responseData = response.data || response;
      const newUser = {
        id: responseData?.Id || responseData?.id || `temp-${Date.now()}`,
        name: responseData?.FullName || responseData?.full_name || responseData?.name || full_name,
        email: responseData?.Email || responseData?.email || responseData?.email || email || "-",
        phone: responseData?.PhoneNumber || responseData?.phone_number || responseData?.phone || phone_number || "-",
        role: responseData?.Role || responseData?.role || responseData?.role || role.toLowerCase(),
        status: responseData?.Status || responseData?.status || "Active",
        grade: responseData?.Grade || responseData?.grade || grade,
      };

      setUsers([newUser, ...users]);

      // Reset form and close modal
      setFullName("");
      setEmail("");
      setPhoneNumber("");
      setRole("STUDENT");
      setGrade("");
      setIsModalOpen(false);

      // Optional: Show success notification
      console.log("User created successfully:", newUser);

    } catch (err: any) {
      console.error("Failed to create user:", err);

      // Extract error message from response
      const errorMsg = err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "Failed to create user. Please try again.";

      setError(errorMsg);

    } finally {
      setIsLoading(false);
    }
  };

  // Reset form when modal closes
  const handleModalClose = () => {
    setIsModalOpen(false);
    setError("");
    setFullName("");
    setEmail("");
    setPhoneNumber("");
    setRole("STUDENT");
    setGrade("");
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
                {["User ID", "Name", "Role", "Email", "Phone", "Grade", "Status", ""].map((header) => (
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
                  <td className="py-3 px-2 text-muted-foreground">{user.email || "-"}</td>
                  <td className="py-3 px-2 text-muted-foreground">{user.phone || "-"}</td>
                  <td className="py-3 px-2 text-muted-foreground">
                    {user.grade ? `Grade ${user.grade}` : "-"}
                  </td>
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
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                required
                value={full_name}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Abebe Bikila"
                disabled={isLoading}
                className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
              />
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  // Reset fields when role changes
                  if (e.target.value === "STUDENT") {
                    setPhoneNumber("");
                    setGrade("");
                  } else {
                    setGrade("");
                  }
                }}
                disabled={isLoading}
                className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
              >
                <option value="STUDENT">Student (ST)</option>
                <option value="TEACHER">Teacher (TR)</option>
                <option value="PARENT">Parent (PT)</option>
                <option value="ADMIN">Admin (AD)</option>
              </select>
            </div>

            {/* Email field - required for students, optional for others */}
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">
                Email Address {role === "STUDENT" && <span className="text-red-500">*</span>}
                {role !== "STUDENT" && <span className="text-gray-400 text-xs"> (Optional)</span>}
              </label>
              <Input
                type="email"
                required={role === "STUDENT"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === "STUDENT" ? "e.g. abebe@school.et" : "e.g. abebe@school.et (optional)"}
                disabled={isLoading}
                className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
              />
            </div>

            {/* Phone field - only for non-student roles */}
            {role !== "STUDENT" && (
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">
                  Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
                </label>
                <Input
                  type="tel"
                  value={phone_number}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. 0912345678"
                  disabled={isLoading}
                  className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
                />
              </div>
            )}

            {/* Grade field - only show for students */}
            {role === "STUDENT" && (
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">
                  Grade <span className="text-red-500">*</span>
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value))}
                  required={role === "STUDENT"}
                  disabled={isLoading}
                  className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
                >
                  <option value="">Select Grade</option>
                  {gradeOptions.map((g) => (
                    <option key={g} value={g}>
                      Grade {g}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleModalClose}
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