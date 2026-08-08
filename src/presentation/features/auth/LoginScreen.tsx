import { useState } from "react";
import { GraduationCap, Eye, Lock } from "lucide-react";
import type { Role } from "@/domain/types";
import { ROLES } from "@/domain/constants/roles";
import { detectRoleFromId } from "@/domain/utils/auth";
import { DEMO_USERS } from "@/infrastructure/data/mock";

type LoginScreenProps = {
  onLogin: (role: Role) => void;
};

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const detectedRole = detectRoleFromId(userId);

  const handleLogin = () => {
    if (!detectedRole) {
      setError("Invalid User ID. Format: AD/XXXX/YY, TR/XXXX/YY, ST/XXXX/YY, PT/XXXX/YY");
      return;
    }
    if (!password) {
      setError("Please enter your password.");
      return;
    }
    setError("");
    onLogin(detectedRole);
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
        </div>
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm space-y-5">
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wide font-medium block mb-1.5">
              User ID
            </label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value);
                  setError("");
                }}
                placeholder="e.g. ST/9912/11"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-secondary border border-border text-sm font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
              />
              {detectedRole && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md capitalize">
                  {detectedRole}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Your role is detected automatically from your ID prefix
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
                  setError("");
                }}
                placeholder="Enter your password"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
              />
              <button
                onClick={() => setShowPass((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Eye size={15} />
              </button>
            </div>
          </div>
          {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <button
            onClick={handleLogin}
            className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-teal-700 transition-colors text-sm"
          >
            Sign In
          </button>
          <div className="border-t border-border pt-4 space-y-1.5">
            <p className="text-xs text-muted-foreground font-medium">Demo credentials:</p>
            {ROLES.map((role) => (
              <button
                key={role.key}
                onClick={() => {
                  setUserId(DEMO_USERS[role.key].id);
                  setPassword("demo1234");
                  setError("");
                }}
                className="w-full text-left text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 py-0.5"
              >
                <span className="font-mono text-primary">{DEMO_USERS[role.key].id}</span>
                <span>— {role.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
