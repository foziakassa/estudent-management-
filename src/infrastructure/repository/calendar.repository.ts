import axiosInstance from "@/domain/utils/axios_instanse";
import type {
  CalendarEvent,
  CreateCalendarEventPayload,
  ApiResponse,
} from "@/domain/Models";

export const calendarRepository = {
  getEvents: async (params?: { page?: number; limit?: number }): Promise<CalendarEvent[]> => {
    const response = await axiosInstance.get("/calendar/", {
      params: { page: 1, limit: 50, ...params },
    });
    const payload = response.data?.data ?? response.data;
    const list: CalendarEvent[] =
      payload?.data ?? payload?.events ?? (Array.isArray(payload) ? payload : []);
    return list;
  },

  createEvent: async (
    payload: CreateCalendarEventPayload
  ): Promise<ApiResponse<CalendarEvent>> => {
    const response = await axiosInstance.post("/calendar/", payload);
    return response.data;
  },

  updateEvent: async (
    id: number | string,
    payload: Partial<CreateCalendarEventPayload>
  ): Promise<any> => {
    const response = await axiosInstance.put(`/calendar/${id}`, payload);
    return response.data;
  },

  deleteEvent: async (id: number | string): Promise<any> => {
    const response = await axiosInstance.delete(`/calendar/${id}`);
    return response.data;
  },
};

export default calendarRepository;
