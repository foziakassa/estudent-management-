import axiosInstance from "@/domain/utils/axios_instanse";


import { TeacherDiscipline } from "@/domain/Models/discipline-model";
function getDisciplineItems(payload: unknown): TeacherDiscipline[] {
  if (Array.isArray(payload)) return payload as TeacherDiscipline[];
  if (!payload || typeof payload !== "object") return [];
  const value = payload as Record<string, unknown>;
  for (const key of ["disciplines", "records", "items", "results", "data"]) {
    if (Array.isArray(value[key])) return value[key] as TeacherDiscipline[];
  }
  return [];
}

export const disciplineRepository = {
  getStudentDisciplines: async (
    studentId: string | number
  ): Promise<TeacherDiscipline[]> => {
    const response = await axiosInstance.get(
      `/disciplines/student/${encodeURIComponent(String(studentId))}`
    );
    const payload = response.data?.data ?? response.data;
    return getDisciplineItems(payload);
  },

  createDiscipline: async (data: Record<string, unknown>): Promise<any> => {
    const response = await axiosInstance.post("/disciplines/", data);
    return response.data;
  },

  updateDiscipline: async (
    id: string | number,
    data: { type: string; notes: string }
  ): Promise<any> => {
    const response = await axiosInstance.put(
      `/disciplines/${encodeURIComponent(String(id))}`,
      data
    );
    return response.data;
  },

  deleteDiscipline: async (id: string | number): Promise<any> => {
    const response = await axiosInstance.delete(
      `/disciplines/${encodeURIComponent(String(id))}`
    );
    return response.data;
  },
};

export default disciplineRepository;
