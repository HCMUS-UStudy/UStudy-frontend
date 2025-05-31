export type PaymentItem = {
  id: string;
  amount: number;
  student: {
    id: string;
    name: string;
    genId: string;
  };
  enrolledClass: {
    id: string;
    name: string;
    course: {
      id: string;
      name: string;
    };
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
