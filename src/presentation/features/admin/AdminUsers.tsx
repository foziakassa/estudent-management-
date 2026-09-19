import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Plus, Search } from "lucide-react";
import type { UserAccount } from "@/domain/types";
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

const PAGE_LIMIT = 10;

type ApiUser = {
  id: number;
  role: string;
  user_id: string;
  full_name: string;
  email?: string;
  phone?: string;
  grade_level?: number;
  reg_year?: number;
  status: string;
};

function mapRole(role: string) {
  const roles: Record<string, string> = {
    STUDENT: "Student",
    TEACHER: "Teacher",
    PARENT: "Parent",
    ADMIN: "Admin",
  };
  return roles[role?.toUpperCase()] || role;
}

function mapStatus(status: string) {
  const statuses: Record<string, string> = {
    ACTIVE: "Active",
    INACTIVE: "Inactive",
  };
  return statuses[status?.toUpperCase()] || status;
}

function mapApiUser(user: ApiUser): UserAccount {
  return {
    id: user.user_id,
    name: user.full_name,
    email: user.email || "-",
    phone: user.phone || "-",
    role: mapRole(user.role),
    status: mapStatus(user.status),
    grade: user.grade_level != null ? String(user.grade_level) : undefined,
  };
}

export function AdminUsers() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const [full_name, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [grade, setGrade] = useState<number | "">("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successInfo, setSuccessInfo] = useState<{ userId: string; password: string } | null>(null);

  const gradeOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

  const fetchUsers = useCallback(async (pageNum: number) => {
    setIsFetching(true);
    setFetchError("");
    try {
      const response = await axiosInstance.get("/users/", {
        params: { page: pageNum, limit: PAGE_LIMIT },
      });
      const payload = response.data?.data ?? response.data;
      const apiUsers: ApiUser[] = payload?.users ?? [];
      setUsers(apiUsers.map(mapApiUser));
      setTotal(payload?.total ?? apiUsers.length);
      setPage(payload?.page ?? pageNum);
    } catch (err: any) {
      console.error("Failed to fetch users:", err);
      setFetchError(
        err.response?.data?.message ||
          err.message ||
          "Failed to load users. Please try again."
      );
      setUsers([]);
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(page);
  }, [page, fetchUsers]);

  const filtered = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessInfo(null);

    if (!full_name.trim()) {
      setError("Full name is required");
      return;
    }

    if (role === "STUDENT") {
      if (!email.trim()) {
        setError("Email is required for students");
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Please enter a valid email address");
        return;
      }

      if (!grade) {
        setError("Grade is required for students");
        return;
      }

      if (grade && (grade < 1 || grade > 12)) {
        setError("Grade must be between 1 and 12");
        return;
      }
    } else {
      if (!email.trim() && !phone_number.trim()) {
        setError("Either email or phone number is required");
        return;
      }

      if (email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setError("Please enter a valid email address");
          return;
        }
      }

      if (phone_number.trim()) {
        const phoneRegex = /^(09|07)\d{8}$/;
        if (!phoneRegex.test(phone_number.trim())) {
          setError("Please enter a valid Ethiopian phone number (e.g., 0912345678)");
          return;
        }
      }
    }

    setIsLoading(true);

    try {
      const payload: Record<string, unknown> = {
        full_name: full_name.trim(),
        Role: role,
      };

      if (email.trim()) {
        payload.Email = email.trim();
      }

      if (phone_number.trim()) {
        payload.phone = phone_number.trim();
      }

      if (role === "STUDENT" && grade) {
        payload.Grade = Number(grade);
      }

      const response = await poster("/users/", payload);
      const responseData = response.data ?? response;
      const createdUser = responseData.user ?? responseData;
      const createdUserId =
        responseData.user_id || createdUser.user_id || createdUser.id;
      const generatedPassword = responseData.password || "";

      setSuccessInfo({
        userId: createdUserId,
        password: generatedPassword,
      });

      setFullName("");
      setEmail("");
      setPhoneNumber("");
      setRole("STUDENT");
      setGrade("");
      setIsModalOpen(false);

      const nextTotal = total + 1;
      const lastPage = Math.max(1, Math.ceil(nextTotal / PAGE_LIMIT));
      if (page === lastPage) {
        await fetchUsers(lastPage);
      } else {
        setPage(lastPage);
      }
    } catch (err: any) {
      console.error("Failed to create user:", err);
      const errorMsg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "Failed to create user. Please try again.";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

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
          onClick={() => {
            setSuccessInfo(null);
            setIsModalOpen(true);
          }}
          className="bg-primary text-white text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-teal-700 transition-colors"
        >
          <Plus size={16} /> Add User
        </Button>
      </div>

      {fetchError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {fetchError}
        </div>
      )}

      {error && !isModalOpen && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {successInfo && (
        <div className="bg-teal-50 border border-teal-200 text-teal-800 px-4 py-3 rounded-xl text-sm space-y-1">
          <p className="font-medium">User created successfully</p>
          <p>
            User ID: <span className="font-mono">{successInfo.userId}</span>
          </p>
          {successInfo.password && (
            <p>
              Temporary password:{" "}
              <span className="font-mono font-semibold">{successInfo.password}</span>
            </p>
          )}
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
                  <th
                    key={header}
                    className="text-left py-3 px-2 text-muted-foreground font-medium text-xs uppercase tracking-wide"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isFetching ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground">
                    Loading users...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground">
                    No users found
                  </td>
                </tr>
              ) : (
                filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-border/50 hover:bg-secondary/40 transition-colors"
                  >
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
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between gap-3 flex-wrap pt-2">
          <p className="text-xs text-muted-foreground">
            Showing page {page} of {totalPages} · {total} total users
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={page <= 1 || isFetching}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-xl px-3 py-2 text-sm"
            >
              <ChevronLeft size={16} />
              Previous
            </Button>
            <span className="text-sm font-medium text-foreground min-w-[4rem] text-center">
              {page} / {totalPages}
            </span>
            <Button
              type="button"
              variant="outline"
              disabled={page >= totalPages || isFetching}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-xl px-3 py-2 text-sm"
            >
              Next
              <ChevronRight size={16} />
            </Button>
          </div>
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
          ].map((rule) => (
            <div key={rule.prefix} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/60">
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

      <Dialog open={isModalOpen} onOpenChange={(open) => !open && handleModalClose()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "Outfit, sans-serif" }}>Add New User</DialogTitle>
            {error && (
              <DialogDescription className="text-red-500 text-sm">{error}</DialogDescription>
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
                placeholder={
                  role === "STUDENT"
                    ? "e.g. abebe@school.et"
                    : "e.g. abebe@school.et (optional)"
                }
                disabled={isLoading}
                className="w-full px-3 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:opacity-50"
              />
            </div>

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
