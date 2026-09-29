import type { Role, AuthUser, LoginApiResponse, LoginCredentials, LoginResponseData } from "../Models/auth-model";
import axiosInstance from "./axios_instanse";

export function detectRoleFromId(id: string): Role | null {
  if (!id) return null;
  const prefix = id.split("/")[0]?.toUpperCase();
  if (prefix === "AD") return "admin";
  if (prefix === "TR") return "teacher";
  if (prefix === "ST") return "student";
  if (prefix === "PT") return "parent";
  return null;
}

export function mapBackendRole(backendRole?: string): Role {
  if (!backendRole) return "student";
  const r = backendRole.trim().toUpperCase();
  if (r === "ADMIN") return "admin";
  if (r === "TEACHER") return "teacher";
  if (r === "STUDENT") return "student";
  if (r === "PARENT") return "parent";
  return "student";
}

export async function loginApi(credentials: LoginCredentials): Promise<LoginApiResponse> {
  const response = await axiosInstance.post<LoginApiResponse>("/auth/login", {
    Username: credentials.Username,
    password: credentials.password,
  });
  return response.data;
}

export function saveAuthSession(data: LoginResponseData): { role: Role; user: AuthUser } {
  const { access_token, token_type, user } = data;
  const role = mapBackendRole(user?.role) || (user?.user_id ? detectRoleFromId(user.user_id) : null) || "student";

  localStorage.setItem("access_token", access_token);
  localStorage.setItem("token", access_token);
  if (token_type) {
    localStorage.setItem("token_type", token_type);
  }
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
    if (user.user_id) {
      localStorage.setItem("student_id", user.user_id);
    }
  }
  localStorage.setItem("role", role);

  return { role, user };
}

export function clearAuthSession(): void {
  localStorage.removeItem("access_token");
  localStorage.removeItem("token");
  localStorage.removeItem("token_type");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  localStorage.removeItem("student_id");
}

export function getStoredAuth(): { token: string | null; role: Role | null; user: AuthUser | null } {
  const token = localStorage.getItem("access_token") || localStorage.getItem("token");
  const storedRole = localStorage.getItem("role") as Role | null;
  let user: AuthUser | null = null;
  try {
    const rawUser = localStorage.getItem("user");
    if (rawUser) {
      user = JSON.parse(rawUser);
    }
  } catch {
    user = null;
  }

  const role = storedRole || (user?.role ? mapBackendRole(user.role) : null);
  return { token, role, user };
}

