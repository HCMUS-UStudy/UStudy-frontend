import { GenderType } from "./common";
import { Course, CourseDto } from "./course";
import { GradeItem } from "./grade";
import { Room } from "./room";
import { ClassSessionItem, Session } from "./session";

export type ClassDetail = {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  grade: GradeItem;
  course: Course;
  status: string | null;
  classSessions: classSessions[];
};

export type ClassTeacher = {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  grade: GradeItem;
  course: Course;
  status: string | null;
  classSessions: classSessions[];
};

export type classSessions = {
  id: string;
  day: number;
  session: Session;
  room: Room;
};

export type ClassSchema = {
  name: string;
  courseId: string;
  gradeId: string;
  startDate: string;
  endDate: string;
  description: string;
  fee: number;
  branchId: string;
  classTimes: ClassSessionItem[];
  roomId: string;
};

export type ClassItem = {
  id: string;
  name: string;
  description: string;
  course: CourseDto;
  fee: number;
  startDate: string;
  endDate: string;
  grade: GradeItem;
};

export type ClassData = {
  content: ClassItem[];
  totalPages: number;
};

export type ClassChooseData = {
  content: ClassChooseItem[];
  totalPages: number;
};

export type ClassChooseItem = {
  id: string;
  name: string;
  description: string;
};

export type ClassUserItem = {
  id: string;
  name: string;
  description: string;
  course: {
    id: string;
    name: string;
  };
  grade: {
    id: string;
    name: string;
  };
};

export type UserClassData = {
  content: ClassUserItem[];
  totalPages: number;
  totalElements: number;
};

export type ClassScheduleItem = {
  id: string;
  date: string; // Format: YYYY-MM-DD
  classSession: {
    id: string;
    day:
      | "MONDAY"
      | "TUESDAY"
      | "WEDNESDAY"
      | "THURSDAY"
      | "FRIDAY"
      | "SATURDAY"
      | "SUNDAY";
    session: {
      id: string;
      name: string;
      startTime: string; // Format: HH:mm:ss
      endTime: string; // Format: HH:mm:ss
    };
    room: {
      id: string;
      name: string;
    };
  };
};

export type Classroom = {
  id: string;
  name: string;
  description: string;
  fee: number;
  grade: {
    id: string;
    name: string;
  };
  room: {
    id: string;
    name: string;
  };
  status: boolean;
  teacher: {
    avatar: string;
    email: string;
    genId: string;
    gender: GenderType;
    id: string;
    name: string;
  } | null;
  students: null;
  course: {
    createdAt: string;
    createdBy: {
      active: boolean;
      avatar: string;
      createdAt: string;
      email: string;
      genId: string;
      gender: GenderType;
      id: string;
      name: string;
      role: string;
    };
    description: string;
    id: string;
    name: string;
    status: boolean;
    totalGrades: number;
  };
};

export type RegisterClassData = {
  content: RegisterClassItem[];
  totalPages: number;
};

export type RegisterClassItem = {
  id: string;
  name: string;
  email: string;
  genId: string;
  gender: GenderType;
  avatar: string;
};

export type ApproveResponse = {
  failedCount: number;
  failedMembers: {
    genId: string;
    name: string;
  }[];
};
