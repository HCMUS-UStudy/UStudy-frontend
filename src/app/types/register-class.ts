import {
  BaseClassInfo,
  BaseGradeInfo,
  BaseCourseInfo,
  UserSummary,
  GenderType,
  BasePaginationResponse,
} from "./common";

export type RegisterClassRequest = {
  classId: string;
};

export type RegisterClassTeacher = Pick<
  UserSummary,
  "id" | "genId" | "email" | "name"
> & {
  gender: GenderType;
};

export type PaymentInfo = {
  id: string;
  status: "PENDING";
  paymentDate: string;
  invoiceId: string;
};

export type RegisterClassResponse = {
  id: string;
  user: Pick<UserSummary, "id" | "genId" | "email" | "name" | "avatar">;
  payment: PaymentInfo;
  registerClassStatus: "WAITING" | "ACCEPTED" | null;
  aclass: BaseClassInfo & {
    grade: BaseGradeInfo;
    course: BaseCourseInfo;
    teacher: RegisterClassTeacher[];
  };
};

export type ClassToRegisterItem = {
  classDto: BaseClassInfo & {
    grade: BaseGradeInfo;
    course: BaseCourseInfo;
    teacher: RegisterClassTeacher[];
  };
  status: "WAITING" | "ACCEPTED" | null;
};

export type ClassToRegisterResponse =
  BasePaginationResponse<ClassToRegisterItem> & {
    pageNumber: number;
    pageSize: number;
    last: boolean;
  };
