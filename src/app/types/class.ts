import {
  GenderType,
  UserSummary,
  BaseClassInfo,
  BaseGradeInfo,
  BaseCourseInfo,
  BasePaginationResponse,
} from "./common";
import { Course, CourseDto, CourseInfo } from "./course";
import { GradeItem } from "./grade";
import { Room } from "./room";
import { ClassSessionItem, DaysInWeek, Session } from "./session";

export type ClassDetail = BaseClassInfo & {
  grade: GradeItem;
  course: Course;
  fee: number;
  status: string | null;
  classSessions: classSessions[];
};

export type ClassTeacher = BaseClassInfo & {
  grade: GradeItem;
  course: Course;
  status: string | null;
  classSessions: classSessions[];
};

export type classSessions = {
  id: string;
  day: DaysInWeek;
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

// export type ClassItem = {
//   id: string;
//   name: string;
//   description: string;
//   course: CourseDto;
//   fee: number;
//   startDate: string;
//   endDate: string;
//   grade: GradeItem;
// };

export type ClassItem = Pick<
  BaseClassInfo,
  "id" | "name" | "startDate" | "endDate"
> & {
  fee: number;
  course: CourseDto;
  grade: GradeItem;
};

export type ClassData = BasePaginationResponse<ClassItem>;

export type ClassChooseData = BasePaginationResponse<ClassChooseItem>;

export type ClassChooseItem = Pick<
  BaseClassInfo,
  "id" | "name" | "description"
>;

export type ClassUserItem = Pick<
  BaseClassInfo,
  "id" | "name" | "description"
> & {
  course: BaseCourseInfo;
  grade: BaseGradeInfo;
};

export type UserClassData = BasePaginationResponse<ClassUserItem>;

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
  isPassed: boolean;
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
  teacher: (UserSummary & { gender: GenderType }) | null;
  students: null;
  course: {
    createdAt: string;
    createdBy: UserSummary & {
      active: boolean;
      createdAt: string;
      gender: GenderType;
      role: string;
    };
    description: string;
    id: string;
    name: string;
    status: boolean;
    totalGrades: number;
  };
};

export type RegisterClassData = BasePaginationResponse<RegisterClassItem>;

export type RegisterClassItem = UserSummary & {
  gender: GenderType;
};

export type ApproveResponse = {
  failedCount: number;
  failedMembers: {
    genId: string;
    name: string;
  }[];
};

export type ClassRegisterResponseItem = BaseClassInfo & {
  grade: GradeItem;
  course: CourseInfo;
  teacher: (UserSummary & { gender: GenderType })[];
};

export type ClassRegisterResponse =
  BasePaginationResponse<ClassRegisterResponseItem>;

export type ClassUpdateData = {
  name: string;
  description: string;
  courseId: string;
  gradeId: string;
  fee: number;
  startDate: string;
  endDate: string;
};
