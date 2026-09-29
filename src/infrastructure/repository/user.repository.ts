import axiosInstance from "@/domain/utils/axios_instanse";
import { ApiUser, CreateUserPayload, UserListResponse } from "@/domain/Models/user-model";

export const userRepository = {
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    role?: string;
    count?: boolean;
    [key: string]: unknown;
  }): Promise<UserListResponse> => {
    const response = await axiosInstance.get("/users/", { params });
    const payload = response.data?.data ?? response.data;
    const users: ApiUser[] = payload?.users ?? (Array.isArray(payload) ? payload : []);
    const total = payload?.total ?? users.length;
    const page = payload?.page ?? params?.page ?? 1;
    const limit = payload?.limit ?? params?.limit ?? 10;
    return { users, total, page, limit };
  },

  getUserById: async (id: string | number): Promise<ApiUser> => {
    const response = await axiosInstance.get(`/users/${id}`);
    const payload = response.data?.data ?? response.data?.user ?? response.data;
    return payload;
  },

  createUser: async (payload: CreateUserPayload): Promise<any> => {
    const response = await axiosInstance.post("/users/", payload);
    return response.data;
  },

  updateUser: async (id: string | number, payload: Record<string, unknown>): Promise<any> => {
    const response = await axiosInstance.put(`/users/${id}`, payload);
    return response.data;
  },

  deleteUser: async (id: string | number): Promise<any> => {
    const response = await axiosInstance.delete(`/users/${id}`);
    return response.data;
  },

  getRoleTotal: async (role: string): Promise<number> => {
    const response = await axiosInstance.get("/users/", {
      params: { role, page: 1, limit: 1, count: true },
    });
    const payload = response.data?.data ?? response.data;
    return payload?.total ?? 0;
  },
};

export default userRepository;
