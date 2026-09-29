import {
  gradeRepository,
  disciplineRepository,
  type ApiGrade,
  type ApiStudent,
  type TeacherStudent,
  type StudentAcademic,
  type TeacherDiscipline,
} from "@/infrastructure/repository";

export type {
  ApiGrade,
  ApiStudent,
  TeacherStudent,
  StudentAcademic,
  TeacherDiscipline,
};

export type StudentGradeResponse = {
  grades: ApiGrade[];
  history: ApiGrade[];
};

export const getTeacherStudents = gradeRepository.getTeacherStudents;
export const getStudentDisciplines = disciplineRepository.getStudentDisciplines;
export const updateTeacherDiscipline = disciplineRepository.updateDiscipline;
export const deleteTeacherDiscipline = disciplineRepository.deleteDiscipline;
export const getStudentGrades = gradeRepository.getStudentGrades;
export const getStudentAcademics = gradeRepository.getStudentAcademics;
export const getStudentGradeHistory = gradeRepository.getStudentGradeHistory;
export const getAcademicGrades = gradeRepository.getAcademicGrades;