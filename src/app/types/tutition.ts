export type TuitionPayment = {
  id: string;
  invoiceNumber: string;
  amount: number;
  status: "PENDING" | "PAID" | "OVERDUE" | "CANCELLED";
  dueDate: string;
  paidDate?: string;
  description: string;
  semester: string;
  classId: string;
  className: string;
  studentId: string;
  studentName: string;
};
