import { UserSummary } from "./common";

export type Course = {
  id: string;
  name: string;
  description: string;
  totalGrades: number;
  status: boolean;
  createdBy: UserSummary & {
    role: string;
    gender: string;
    createdAt: string;
    active: boolean;
  };
  createdAt: string;
};

export type CourseDto = {
  id: string;
  name: string;
  createdBy: UserSummary;
};

export type CourseItem = {
  totalGrades: number;
  detailedCourseDto: CourseDto;
};

export type CourseSchema = {
  name: string;
  description: string;
};

export type CourseData = {
  content: CourseItem[];
  totalPages: number;
  totalElements: number;
};

export type CourseInfo = {
  id: string;
  name: string;
};
