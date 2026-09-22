import axiosInstance from "./axios_instanse";

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

export type TeacherDiscipline = {
  student: string;
  student_id?: string;
  id: string | number;
  type: string;
  date: string;
  status: string;
  notes?: string;
};

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

export type StudentGradeResponse = {
  grades: ApiGrade[];
  history: ApiGrade[];
};

function getPayload<T>(response: { data: unknown }): T {
  const responseData = response.data as { data?: unknown };
  return (responseData?.data ?? response.data) as T;
}

export async function getTeacherStudents(): Promise<TeacherStudent[]> {
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
}

function getDisciplineItems(payload: unknown): TeacherDiscipline[] {
  if (Array.isArray(payload)) return payload as TeacherDiscipline[];
  if (!payload || typeof payload !== "object") return [];
  const value = payload as Record<string, unknown>;
  for (const key of ["disciplines", "records", "items", "results", "data"]) {
    if (Array.isArray(value[key])) return value[key] as TeacherDiscipline[];
  }
  return [];
}

export async function getStudentDisciplines(studentId: string | number): Promise<TeacherDiscipline[]> {
  const response = await axiosInstance.get(`/disciplines/student/${encodeURIComponent(String(studentId))}`);
  return getDisciplineItems(getPayload<unknown>(response));
}

export async function updateTeacherDiscipline(
  id: string | number,
  data: { type: string; notes: string }
) {
  return axiosInstance.put(`/disciplines/${encodeURIComponent(String(id))}`, data);
}

export async function deleteTeacherDiscipline(id: string | number) {
  return axiosInstance.delete(`/disciplines/${encodeURIComponent(String(id))}`);
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

export async function getStudentGrades(studentId: string): Promise<ApiGrade[]> {
  const response = await axiosInstance.get(`/grades/student/${encodeURIComponent(studentId)}`);
  return getGradeItems(getPayload<unknown>(response));
}

export async function getStudentAcademics(studentId: string | number): Promise<StudentAcademic[]> {
  const response = await axiosInstance.get(`/academics/student/${encodeURIComponent(String(studentId))}`);
  const payload = getPayload<unknown>(response);
  return Array.isArray(payload) ? payload as StudentAcademic[] : [];
}

export async function getStudentGradeHistory(studentId: string): Promise<ApiGrade[]> {
  const response = await axiosInstance.get(`/grades/history/${encodeURIComponent(studentId)}`);
  return getGradeItems(getPayload<unknown>(response));
}

export async function getAcademicGrades(academicId: string | number): Promise<ApiGrade[]> {
  const response = await axiosInstance.get(`/grades/academic/${encodeURIComponent(String(academicId))}`);
  return getGradeItems(getPayload<unknown>(response));
}