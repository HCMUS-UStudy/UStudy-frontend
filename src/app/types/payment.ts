export type PaymentItem = {
  id: string;
  paymentPeriodDto: {
    id: string;
    enrolledClass: {
      id: string;
      name: string;
      description: string;
      startDate: string;
      endDate: string;
      grade: {
        id: string;
        name: string;
      };
      course: {
        id: string;
        name: string;
        createdBy: {
          id: string;
          genId: string;
          email: string;
          name: string;
          avatar: string;
        };
      };
    };
    student: {
      id: string;
      genId: string;
      email: string;
      name: string;
      avatar: string;
    };
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
