export type Course = {
  id: string;
  name: string;
  description: string;
  totalGrades: number;
  status: boolean;
  createdBy: {
    id: string;
    genId: string;
    email: string;
    name: string;
    avatar: string;
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
  createdBy: {
    id: string;
    genId: string;
    email: string;
    avatar: string;
    name: string;
  };
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
