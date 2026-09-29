import axiosInstance from "@/domain/utils/axios_instanse";
import type { LoginApiResponse, LoginCredentials } from "@/domain/Models";

export const authRepository = {
  login: async (credentials: LoginCredentials): Promise<LoginApiResponse> => {
    const response = await axiosInstance.post<LoginApiResponse>("/auth/login", {
      Username: credentials.Username,
      password: credentials.password,
    });
    return response.data;
  },
};

export default authRepository;
