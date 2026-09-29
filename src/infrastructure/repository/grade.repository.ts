import axiosInstance from "@/domain/utils/axios_instanse";

export type ApiGrade = {
  id?: number | string;
  academic_id?: number | string;
  subject?: string;
  subject_name?: string;
  teacher?: string;
  quiz?: number;
  assignment?: number;
  midterm?: number;
  test?: number;
  final?: number;
  final_exam?: number;
  score?: number;
  average?: number;
  grade?: string;
  letter_grade?: string;
  semester?: string;
  academic_year?: string;
  [key: string]: unknown;
};

export type ApiStudent = {
  id: number;
  user_id: string;
  full_name: string;
  grade_level?: number;
  section?: string;
};

export type TeacherStudent = {
  id: string;
  apiId: number;
  name: string;
  section: string;
  gradeLevel?: number;
};

export type StudentAcademic = {
  id: number;
  subject_name: string;
  section_name: string;
  semester: string;
  academic_year: string;
  teacher_id?: number;
  student_id: number;
  is_active: boolean;
  max_students?: number;
  created_at?: string;
};

function getPayload<T>(response: { data: unknown }): T {
  const responseData = response.data as { data?: unknown };
  return (responseData?.data ?? response.data) as T;
}

function getGradeItems(payload: unknown): ApiGrade[] {
  if (Array.isArray(payload)) return payload as ApiGrade[];
  if (!payload || typeof payload !== "object") return [];
  const value = payload as Record<string, unknown>;
  for (const key of ["grades", "history", "items", "records", "results"]) {
    if (Array.isArray(value[key])) return value[key] as ApiGrade[];
  }
  return [];
}

export const gradeRepository = {
  getStudentGrades: async (studentId: string): Promise<ApiGrade[]> => {
    const response = await axiosInstance.get(
      `/grades/student/${encodeURIComponent(studentId)}`
    );
    return getGradeItems(getPayload<unknown>(response));
  },

  getStudentAcademics: async (
    studentId: string | number
  ): Promise<StudentAcademic[]> => {
    const response = await axiosInstance.get(
      `/academics/student/${encodeURIComponent(String(studentId))}`
    );
    const payload = getPayload<unknown>(response);
    return Array.isArray(payload) ? (payload as StudentAcademic[]) : [];
  },

  getStudentGradeHistory: async (studentId: string): Promise<ApiGrade[]> => {
    const response = await axiosInstance.get(
      `/grades/history/${encodeURIComponent(studentId)}`
    );
    return getGradeItems(getPayload<unknown>(response));
  },

  getAcademicGrades: async (
    academicId: string | number
  ): Promise<ApiGrade[]> => {
    const response = await axiosInstance.get(
      `/grades/academic/${encodeURIComponent(String(academicId))}`
    );
    return getGradeItems(getPayload<unknown>(response));
  },

  getTeacherStudents: async (): Promise<TeacherStudent[]> => {
    const response = await axiosInstance.get("/users/", {
      params: { role: "STUDENT", page: 1, limit: 100 },
    });
    const payload = getPayload<{ users?: ApiStudent[] }>(response);
    return (payload.users ?? []).map((student) => ({
      id: student.user_id || String(student.id),
      apiId: student.id,
      name: student.full_name,
      section: student.section ? String(student.section) : "Unassigned",
      gradeLevel: student.grade_level,
    }));
  },
};

export default gradeRepository;
