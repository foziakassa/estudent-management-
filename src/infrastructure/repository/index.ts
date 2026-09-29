export { authRepository } from "./auth.repository";
export { userRepository, type ApiUser, type UserListResponse, type CreateUserPayload } from "./user.repository";
export { calendarRepository } from "./calendar.repository";
export { lostFoundRepository, type LostFoundListResult } from "./lost-found.repository";
export { disciplineRepository, type TeacherDiscipline } from "./discipline.repository";
export {
  gradeRepository,
  type ApiGrade,
  type ApiStudent,
  type TeacherStudent,
  type StudentAcademic,
} from "./grade.repository";
