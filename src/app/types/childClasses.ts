import {
  BaseClassInfo,
  BaseGradeInfo,
  BaseCourseInfo,
  BaseScheduleInfo,
  UserSummary,
} from "./common";

export type ChildClass = BaseClassInfo & {
  admins: Array<
    Pick<UserSummary, "id" | "genId" | "email" | "name" | "avatar">
  >;
  teacherName: string;
  scheduleInfo: BaseScheduleInfo[];
  grade: BaseGradeInfo;
  course: BaseCourseInfo & {
    createdBy: Pick<UserSummary, "id" | "genId" | "email" | "name" | "avatar">;
  };
};

export type ChildClassScore = {
  classId: string;
  className: string;
  description: string;
  course: {
    id: string;
    name: string;
  };
  grade: {
    id: string;
    name: string;
  };
  studentAverage: number;
  classAverage: number;
  percentageDifference: number;
};

export type ChildClassDetails = {
  classId: string;
  className: string;
  description: string;
  course: {
    id: string;
    name: string;
  };
  grade: {
    id: string;
    name: string;
  };
  startDate: string;
  studentAverage: number;
  classAverage: number;
  studentRank: number;
  totalStudents: number;
};

export type ChildrenOfParent = {
  id: string;
} & BaseClassInfo;
