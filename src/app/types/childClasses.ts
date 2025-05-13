import {
  BaseClassInfo,
  BaseGradeInfo,
  BaseCourseInfo,
  BaseScheduleInfo,
  UserSummary,
} from "./common";

export type ChildClass = BaseClassInfo & {
  teacherName: string;
  scheduleInfo: BaseScheduleInfo[];
  grade: BaseGradeInfo;
  course: BaseCourseInfo & {
    createdBy: Pick<UserSummary, "id" | "genId" | "email" | "name" | "avatar">;
  };
};
