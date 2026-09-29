import axiosInstance from "@/domain/utils/axios_instanse";
import type {
  LostFoundItem,
  CreateLostFoundPayload,
  ApiResponse,
} from "@/domain/Models";

export type LostFoundListResult = {
  items: LostFoundItem[];
  total: number;
  page: number;
  limit: number;
};

export const lostFoundRepository = {
  getItems: async (params?: {
    page?: number;
    limit?: number;
    item_type?: string;
  }): Promise<LostFoundListResult> => {
    const response = await axiosInstance.get("/lost-found/", { params });
    const payload = response.data?.data ?? response.data;
    const items: LostFoundItem[] =
      payload?.data ?? (Array.isArray(payload) ? payload : []);
    const total = payload?.total ?? items.length;
    const page = payload?.page ?? params?.page ?? 1;
    const limit = payload?.limit ?? params?.limit ?? 10;
    return { items, total, page, limit };
  },

  createItem: async (
    payload: CreateLostFoundPayload
  ): Promise<ApiResponse<LostFoundItem>> => {
    const response = await axiosInstance.post("/lost-found/", payload);
    return response.data;
  },

  updateItemStatus: async (id: number | string, status: string): Promise<any> => {
    const response = await axiosInstance.put(`/lost-found/${id}`, { status });
    return response.data;
  },

  deleteItem: async (id: number | string): Promise<any> => {
    const response = await axiosInstance.delete(`/lost-found/${id}`);
    return response.data;
  },
};

export default lostFoundRepository;
