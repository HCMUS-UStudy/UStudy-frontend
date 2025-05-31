export type PaymentItem = {
  id: string;
  amount: number;
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
