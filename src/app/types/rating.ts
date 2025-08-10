import { RoleItem } from "./role";

// src/app/types/rating.ts
export interface CreateRatingRequest {
  classId: string;
  rating: number;
  comment?: string;
  teacherRatings: TeacherRatingRequest[];
}

export interface TeacherRatingRequest {
  teacherId: string;
  rating: number;
  comment?: string;
}

// ================== Responses ==================
export interface ApiResponse<T> {
  message: string;
  status?: string;
  statusCode?: string;
  data: T;
}

// 1. list-teachers
export interface TeacherRatingOverview {
  rating: number;
  numRatings: number;
  teacher: {
    id: string;
    genId: string;
    email: string;
    name: string;
    avatar: string;
    role: RoleItem;
  };
}

export interface PaginatedResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// 2. list-teachers/details
export interface TeacherRatingDetail {
  id: string;
  rating: number;
  comment: string;
  ratedBy: {
    id: string;
    genId: string;
    email: string;
    name: string;
    avatar: string;
    role: RoleItem;
  };
  createdAt: string;
}

// 3. list-course-grades
export interface CourseGradeRatingOverview {
  rating: number;
  numRatings: number;
  course: {
    id: string;
    name: string;
  };
  grade: {
    id: string;
    name: string;
  };
}

// 4. list-course-grades/details
export interface CourseGradeRatingDetail {
  id: string;
  rating: number;
  comment: string;
  ratedBy: {
    id: string;
    genId: string;
    email: string;
    name: string;
    avatar: string;
    role: RoleItem;
  };
  createdAt: string;
}
