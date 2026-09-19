import React, { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronRight,
  Copy,
  Edit3,
  Globe,
  GraduationCap,
  Mail,
  Phone,
  RefreshCw,
  Save,
  Search,
  Shield,
  Trash2,
  User,
  UserCheck,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { StatusBadge, WarningDialog } from "@/presentation/components/shared";
import axiosInstance from "@/domain/utils/axios_instanse";
import putter from "@/domain/utils/putter";
import deleter from "@/domain/utils/deleter";

interface UserDetailViewProps {
  userId: string | number;
  onBack: () => void;
  onUserUpdated?: () => void;
}

export type RawApiUser = {
  id?: number | string;
  user_id?: string;
  full_name?: string;
  name?: string;
  email?: string;
  Email?: string;
  phone?: string;
  phone_number?: string;
  role?: string;
  Role?: string;
  status?: string;
  Status?: string;
  grade_level?: number | string;
  Grade?: number | string;
  grade?: number | string;
  reg_year?: number;
  regYear?: number;
  created_at?: string;
  updated_at?: string;
};

const GRADE_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

function normalizeRole(role?: string): string {
  if (!role) return "STUDENT";
  const upper = role.toUpperCase();
  if (upper.includes("STUDENT") || upper === "ST") return "STUDENT";
  if (upper.includes("TEACHER") || upper === "TR") return "TEACHER";
  if (upper.includes("PARENT") || upper === "PT") return "PARENT";
  if (upper.includes("ADMIN") || upper === "AD") return "ADMIN";
  return upper;
}

function normalizeStatus(status?: string): string {
  if (!status) return "ACTIVE";
  const upper = status.toUpperCase();
  if (upper === "INACTIVE") return "INACTIVE";
  return "ACTIVE";
}

function getInitials(name: string): string {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function UserDetailView({ userId, onBack, onUserUpdated }: UserDetailViewProps) {
  const [currentId, setCurrentId] = useState<string | number>(userId);
  const [lookupIdInput, setLookupIdInput] = useState<string>(String(userId));

  const [rawUser, setRawUser] = useState<RawApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [fetchError, setFetchError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(true);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [grade, setGrade] = useState<number | "">("");
  const [status, setStatus] = useState("ACTIVE");
  const [regYear, setRegYear] = useState<number | "">("");


  const fetchUserDetails = useCallback(async (idToFetch: string | number) => {
    setIsLoading(true);
    setFetchError(null);
    setSaveError(null);
    setSaveSuccess(null);

    try {
      const response = await axiosInstance.get(`/users/${idToFetch}`);
      const payload = response.data?.data ?? response.data?.user ?? response.data;

      const user: RawApiUser = payload;
      setRawUser(user);

      // Populate form fields
      const extractedName = user.full_name || user.name || "";
      const extractedEmail = user.email || user.Email || "";
      const extractedPhone = user.phone || user.phone_number || "";
      const extractedRole = normalizeRole(user.role || user.Role);
      const extractedStatus = normalizeStatus(user.status || user.Status);
      const extractedGrade = user.grade_level ?? user.Grade ?? user.grade ?? "";
      const extractedRegYear = user.reg_year ?? user.regYear ?? "";

      setFullName(extractedName);
      setEmail(extractedEmail);
      setPhone(extractedPhone);
      setRole(extractedRole);
      setStatus(extractedStatus);
      setGrade(extractedGrade !== "" ? Number(extractedGrade) : "");
      setRegYear(extractedRegYear !== "" ? Number(extractedRegYear) : "");
    } catch (err: any) {
      console.error(`Failed to fetch user with id ${idToFetch}:`, err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        `Failed to fetch user details for ID: ${idToFetch}`;
      setFetchError(msg);
      setRawUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserDetails(currentId);
  }, [currentId, fetchUserDetails]);

  const handleCopyId = (idStr: string) => {
    navigator.clipboard.writeText(idStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDirectLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (lookupIdInput.trim()) {
      setCurrentId(lookupIdInput.trim());
    }
  };

  const validateForm = () => {
    if (!fullName.trim()) {
      setSaveError("Full Name is required.");
      return false;
    }

    if (role === "STUDENT") {
      if (!email.trim()) {
        setSaveError("Email is required for students.");
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        setSaveError("Please enter a valid email address.");
        return false;
      }
      if (!grade) {
        setSaveError("Grade level is required for students.");
        return false;
      }
      if (Number(grade) < 1 || Number(grade) > 12) {
        setSaveError("Grade level must be between 1 and 12.");
        return false;
      }
    } else {
      if (!email.trim() && !phone.trim()) {
        setSaveError("Either email or phone number is required.");
        return false;
      }
      if (email.trim()) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email.trim())) {
          setSaveError("Please enter a valid email address.");
          return false;
        }
      }
      if (phone.trim()) {
        const phoneRegex = /^(09|07)\d{8}$/;
        if (!phoneRegex.test(phone.trim())) {
          setSaveError("Please enter a valid Ethiopian phone number (e.g. 0912345678).");
          return false;
        }
      }
    }

    return true;
  };

  // Submit update: PUT /users/{id}
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(null);

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      // Build PUT payload
      const targetId = rawUser?.id ?? currentId;
      const payload: Record<string, unknown> = {
        full_name: fullName.trim(),
        role: role,
        Role: role,
        status: status,
        Status: status,
      };

      if (email.trim()) {
        payload.email = email.trim();
        payload.Email = email.trim();
      }

      if (phone.trim()) {
        payload.phone = phone.trim();
      }

      if (role === "STUDENT" && grade) {
        payload.grade_level = Number(grade);
        payload.Grade = Number(grade);
      }

      if (regYear) {
        payload.reg_year = Number(regYear);
      }

      // Execute PUT request to /users/{id}
      await putter(`/users/${targetId}`, payload);

      setSaveSuccess(`User #${targetId} updated successfully!`);

      // Update local state with latest values
      if (rawUser) {
        setRawUser({
          ...rawUser,
          full_name: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          role: role,
          status: status,
          grade_level: role === "STUDENT" ? Number(grade) : undefined,
          reg_year: regYear ? Number(regYear) : undefined,
        });
      }

      // Trigger parent callback to refresh table
      if (onUserUpdated) {
        onUserUpdated();
      }
    } catch (err: any) {
      console.error("Failed to update user:", err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "Failed to update user. Please check your inputs and try again.";
      setSaveError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const targetId = rawUser?.id ?? currentId;
      await deleter(`/users/${targetId}`);

      setIsDeleteDialogOpen(false);
      setSaveSuccess(`User #${targetId} deleted successfully.`);

      if (onUserUpdated) {
        onUserUpdated();
      }

      // Navigate back to user list after short confirmation
      setTimeout(() => {
        onBack();
      }, 800);
    } catch (err: any) {
      console.error("Failed to delete user:", err);
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detail ||
        err.message ||
        "Failed to delete user. Please try again.";
      setDeleteError(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReset = () => {
    if (!rawUser) return;
    setSaveError(null);
    setSaveSuccess(null);
    setDeleteError(null);
    setFullName(rawUser.full_name || rawUser.name || "");
    setEmail(rawUser.email || rawUser.Email || "");
    setPhone(rawUser.phone || rawUser.phone_number || "");
    setRole(normalizeRole(rawUser.role || rawUser.Role));
    setStatus(normalizeStatus(rawUser.status || rawUser.Status));
    const rawGrade = rawUser.grade_level ?? rawUser.Grade ?? rawUser.grade ?? "";
    setGrade(rawGrade !== "" ? Number(rawGrade) : "");
    const rawRegYear = rawUser.reg_year ?? rawUser.regYear ?? "";
    setRegYear(rawRegYear !== "" ? Number(rawRegYear) : "");
  };

  const displayUserId = rawUser?.user_id || (rawUser?.id ? String(rawUser.id) : String(currentId));
  const numericId = rawUser?.id ?? (typeof currentId === "number" || !isNaN(Number(currentId)) ? Number(currentId) : undefined);

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Breadcrumb & Navigation Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-foreground hover:text-primary font-medium transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} />
            User Accounts
          </button>
          <ChevronRight size={14} className="text-muted-foreground/60" />
          <span className="text-foreground font-semibold">
            {isLoading ? "Loading..." : fullName || `User #${displayUserId}`}
          </span>
        </div>

        {/* Quick ID Lookup Bar */}
        <form onSubmit={handleDirectLookup} className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={lookupIdInput}
              onChange={(e) => setLookupIdInput(e.target.value)}
              placeholder="Load User ID (e.g. 1, 3)..."
              className="h-8 pl-8 pr-3 text-xs w-48 rounded-lg bg-secondary/80 border-border"
            />
          </div>
          <Button type="submit" size="sm" variant="outline" className="h-8 text-xs px-2.5 rounded-lg">
            Fetch
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => fetchUserDetails(currentId)}
            className="h-8 w-8 p-0 rounded-lg text-muted-foreground hover:text-foreground"
            title="Reload from API"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          </Button>
        </form>
      </div>

      {/* Global Alerts */}
      {fetchError && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-300 p-4 rounded-2xl flex items-start gap-3 shadow-sm">
          <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-sm">
            <h4 className="font-semibold mb-1">Failed to fetch user data</h4>
            <p>{fetchError}</p>
            <div className="mt-3 flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => fetchUserDetails(currentId)}
                className="h-7 text-xs bg-white dark:bg-slate-900 border-red-300 text-red-700 hover:bg-red-50"
              >
                Retry API Request
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={onBack}
                className="h-7 text-xs text-red-700 hover:bg-red-50"
              >
                Back to Users List
              </Button>
            </div>
          </div>
        </div>
      )}

      {saveSuccess && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 p-4 rounded-2xl flex items-center justify-between gap-3 shadow-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
            <span className="text-sm font-medium">{saveSuccess}</span>
          </div>
          <button
            onClick={() => setSaveSuccess(null)}
            className="text-emerald-600 hover:text-emerald-800 p-1 rounded-lg"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {saveError && (
        <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-300 p-4 rounded-2xl flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="text-red-600 shrink-0" />
            <span className="text-sm font-medium">{saveError}</span>
          </div>
          <button
            onClick={() => setSaveError(null)}
            className="text-red-600 hover:text-red-800 p-1 rounded-lg"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="bg-white rounded-2xl border border-border p-8 text-center space-y-4">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary animate-pulse">
            <RefreshCw size={28} className="animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">Loading User Details</h3>

        </div>
      )}

      {!isLoading && rawUser && (
        <>
          {/* User Profile Header Banner */}
          <div className="bg-white rounded-3xl border border-border p-6 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 right-0 left-0 h-24 bg-gradient-to-r from-teal-500/15 via-emerald-500/10 to-teal-500/5" />

            <div className="relative pt-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                {/* Initials Avatar */}
                <div
                  className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 text-white font-bold text-2xl flex items-center justify-center shadow-lg border-4 border-white shrink-0"
                  style={{ fontFamily: "Outfit, sans-serif" }}
                >
                  {getInitials(fullName)}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1
                      className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight"
                      style={{ fontFamily: "Outfit, sans-serif" }}
                    >
                      {fullName || "Unnamed User"}
                    </h1>
                    <StatusBadge type={role} />
                    <StatusBadge type={status} />
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    <button
                      onClick={() => handleCopyId(displayUserId)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/80 hover:bg-secondary font-mono text-foreground font-medium transition-colors"
                      title="Click to copy User ID"
                    >
                      <span>ID: {displayUserId}</span>
                      {copied ? (
                        <Check size={13} className="text-emerald-600" />
                      ) : (
                        <Copy size={13} className="text-muted-foreground" />
                      )}
                    </button>

                    {numericId !== undefined && (
                      <span className="font-mono text-muted-foreground">
                        DB ID: <span className="font-semibold text-foreground">#{numericId}</span>
                      </span>
                    )}

                    {grade && role === "STUDENT" && (
                      <span className="inline-flex items-center gap-1 text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg font-medium">
                        <GraduationCap size={13} />
                        Grade {grade}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="rounded-xl px-3.5 py-2 text-sm font-medium text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={15} />
                  Delete User
                </Button>
                <Button
                  type="button"
                  variant={isEditing ? "default" : "outline"}
                  onClick={() => setIsEditing(!isEditing)}
                  className="rounded-xl px-4 py-2 text-sm font-medium flex items-center gap-2 cursor-pointer"
                >
                  <Edit3 size={15} />
                  {isEditing ? "Editing Mode" : "Edit Details"}
                </Button>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-border/60">
              <div className="p-3 rounded-xl bg-secondary/40 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Shield size={13} className="text-primary" />
                  Role
                </div>
                <p className="text-sm font-semibold text-foreground">{role}</p>
              </div>

              <div className="p-3 rounded-xl bg-secondary/40 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <UserCheck size={13} className="text-emerald-600" />
                  Status
                </div>
                <p className="text-sm font-semibold text-foreground">{status}</p>
              </div>

              <div className="p-3 rounded-xl bg-secondary/40 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Mail size={13} className="text-sky-600" />
                  Email
                </div>
                <p className="text-sm font-semibold text-foreground truncate" title={email || "None"}>
                  {email || "—"}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-secondary/40 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Phone size={13} className="text-amber-600" />
                  Phone
                </div>
                <p className="text-sm font-semibold text-foreground">{phone || "—"}</p>
              </div>
            </div>
          </div>

          {/* Editable Form Card */}
          <div className="bg-white rounded-3xl border border-border p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
                  Editable User Information
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Update personal details, academic role, and access status.
                </p>
              </div>

            </div>

            <form onSubmit={handleUpdateUser} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <User size={14} className="text-muted-foreground" />
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Abebe Bikila"
                    disabled={isSaving || !isEditing}
                    className="h-11 px-3.5 rounded-xl bg-secondary/60 border-border text-sm font-medium focus:ring-2 focus:ring-primary/20 disabled:opacity-75"
                  />
                  <p className="text-[11px] text-muted-foreground">User's registered full name</p>
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <Mail size={14} className="text-muted-foreground" />
                    Email Address {role === "STUDENT" && <span className="text-red-500">*</span>}
                    {role !== "STUDENT" && <span className="text-gray-400 font-normal lowercase">(optional)</span>}
                  </label>
                  <Input
                    type="email"
                    required={role === "STUDENT"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. user@school.et"
                    disabled={isSaving || !isEditing}
                    className="h-11 px-3.5 rounded-xl bg-secondary/60 border-border text-sm font-medium focus:ring-2 focus:ring-primary/20 disabled:opacity-75"
                  />
                  <p className="text-[11px] text-muted-foreground">Used for login and system notifications</p>
                </div>

                {/* Phone Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <Phone size={14} className="text-muted-foreground" />
                    Phone Number
                    {role !== "STUDENT" && !email.trim() && <span className="text-red-500">*</span>}
                  </label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0912345678"
                    disabled={isSaving || !isEditing}
                    className="h-11 px-3.5 rounded-xl bg-secondary/60 border-border text-sm font-medium focus:ring-2 focus:ring-primary/20 disabled:opacity-75"
                  />
                  <p className="text-[11px] text-muted-foreground">Ethiopian mobile format (09... or 07...)</p>
                </div>

                {/* Role */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <Shield size={14} className="text-muted-foreground" />
                    User Role <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                      if (e.target.value !== "STUDENT") {
                        setGrade("");
                      }
                    }}
                    disabled={isSaving || !isEditing}
                    className="w-full h-11 px-3.5 rounded-xl bg-secondary/60 border border-border text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-75 cursor-pointer"
                  >
                    <option value="STUDENT">Student (ST)</option>
                    <option value="TEACHER">Teacher (TR)</option>
                    <option value="PARENT">Parent (PT)</option>
                    <option value="ADMIN">Admin (AD)</option>
                  </select>
                  <p className="text-[11px] text-muted-foreground">Defines system permissions and access</p>
                </div>

                {/* Grade Level (if Student) */}
                {role === "STUDENT" && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground uppercase tracking-wide flex items-center gap-1.5">
                      <GraduationCap size={14} className="text-muted-foreground" />
                      Grade Level <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(Number(e.target.value))}
                      required={role === "STUDENT"}
                      disabled={isSaving || !isEditing}
                      className="w-full h-11 px-3.5 rounded-xl bg-secondary/60 border border-border text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-75 cursor-pointer"
                    >
                      <option value="">Select Grade</option>
                      {GRADE_OPTIONS.map((g) => (
                        <option key={g} value={g}>
                          Grade {g}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-muted-foreground">Assigned academic grade level (1-12)</p>
                  </div>
                )}

                {/* Account Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground uppercase tracking-wide flex items-center gap-1.5">
                    <UserCheck size={14} className="text-muted-foreground" />
                    Account Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    disabled={isSaving || !isEditing}
                    className="w-full h-11 px-3.5 rounded-xl bg-secondary/60 border border-border text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-75 cursor-pointer"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                  <p className="text-[11px] text-muted-foreground">Active accounts can authenticate into the portal</p>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-border flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="rounded-xl px-4 py-2.5 text-sm font-medium border-border hover:bg-secondary"
                >
                  <ArrowLeft size={16} /> Back to Users List
                </Button>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleReset}
                    disabled={isSaving || !isEditing}
                    className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                  >
                    Reset Changes
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSaving || !isEditing}
                    className="bg-primary hover:bg-teal-700 text-white font-medium px-6 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-primary/20 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </div>


          <WarningDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            title="Delete User Account?"
            description={
              <div className="space-y-3">
                <p className="text-foreground">
                  Are you sure you want to delete{" "}
                  <strong className="text-foreground">{fullName || `User #${displayUserId}`}</strong> (User ID:{" "}
                  <span className="font-mono font-semibold text-primary">{displayUserId}</span>)?
                </p>
                <div className="text-xs text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 p-3 rounded-xl border border-rose-200 dark:border-rose-900/50 leading-relaxed font-medium">
                  ⚠️ This action is permanent and cannot be undone. It will remove the user's login access and associated school profile.
                </div>
                {deleteError && (
                  <div className="text-xs text-red-700 bg-red-100 p-2.5 rounded-xl font-medium">
                    {deleteError}
                  </div>
                )}
              </div>
            }
            confirmText="Yes, Delete User"
            cancelText="Cancel"
            variant="danger"
            isLoading={isDeleting}
            onConfirm={handleDeleteUser}
          />
        </>
      )}
    </div>
  );
}
