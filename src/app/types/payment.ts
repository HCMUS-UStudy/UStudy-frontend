export type PaymentItem = {
  id: string;
  paymentDate: string;
  invoiceId: string;
  amount: number;
  student: {
    id: string;
    genId: string;
    email: string;
    name: string;
    avatar: string;
  };
  classDto: {
    id: string;
    name: string;
    course: {
      id: string;
      name: string;
    };
    grade: {
      id: string;
      name: string;
    };
  };
  status: "PENDING" | "OVERDUE" | "COMPLETED";
  expiredDate: string;
};

export type PaymentSchema = {
  paymentId: string;
};

export type PaymentData = {
  content: PaymentItem[];
  totalPages: number;
  totalElements: number;
};
