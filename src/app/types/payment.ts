import { UserSummary, BaseClassInfo, BaseGradeInfo } from "./common";
import { CourseDto } from "./course";

export type PaymentItem = {
  id: string;
  paymentPeriodDto: {
    id: string;
    enrolledClass: BaseClassInfo & {
      grade: BaseGradeInfo;
      course: CourseDto;
    };
    student: UserSummary;
    startDate: string;
    endDate: string;
    amount: number;
  };
  status: "PENDING" | "OVERDUE" | "COMPLETED";
  paymentDate: string;
  invoiceId: string;
};

export type PaymentSchema = {
  paymentId: string;
};

export type PaymentData = {
  content: PaymentItem[];
  totalPages: number;
  totalElements: number;
};
