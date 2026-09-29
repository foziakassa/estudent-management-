import React, { useState } from "react";
import { GraduationCap, Eye, EyeOff, Lock, Loader2, AlertCircle } from "lucide-react";
import type { Role, AuthUser } from "@/domain/Models/auth-model";
import { ROLES } from "@/domain/constants/roles";
import { detectRoleFromId, loginApi, saveAuthSession } from "@/domain/utils/auth";

type LoginScreenProps = {
  onLogin: (role: Role, user?: AuthUser) => void;
};

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const detectedRole = detectRoleFromId(userId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId.trim()) {
      setError("Please enter your User ID / Username.");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const response = await loginApi({
        Username: userId.trim(),
        password: password,
      });

      if (response && response.data?.access_token) {
        const { role, user } = saveAuthSession(response.data);
        onLogin(role, user);
      } else {
        setError(response?.message || "Login succeeded but no access token was returned.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      const serverMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Failed to sign in. Please verify your credentials or check if the server is running.";
      setError(serverMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4 shadow shadow-teal-100">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground" style={{ fontFamily: "Outfit, sans-serif" }}>
            Ethio Academy
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Student & School Management Portal</p>
        </div>

        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">
                User ID / Username
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => {
                    setUserId(e.target.value);
                    if (error) setError("");
                  }}
                  disabled={isLoading}
                  placeholder="e.g. AD/4406/26 or ST/9912/11"
                  className="w-full pl-9 pr-24 py-2.5 rounded-xl bg-secondary border border-border text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground disabled:opacity-50"
                  autoComplete="username"
                  autoFocus
                />
                {detectedRole && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md capitalize">
                    {detectedRole}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1.5">
                Enter your system ID (e.g. AD/XXXX/YY, TR/XXXX/YY, ST/XXXX/YY)
              </p>
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  disabled={isLoading}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground disabled:opacity-50"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                  aria-label={showPass ? "Hide password" : "Show password"}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-100 p-3 rounded-xl">
                <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-teal-700 active:bg-teal-800 transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>


        </div>
      </div>
    </div>
  );
}

