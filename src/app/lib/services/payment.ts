import { PaymentData } from "@/app/types";
import axiosInstance from "../axios";

export type PaymentMethod = "VNPAY" | "MOMO";

export interface PaymentRequest {
  paymentId: string;
  amount: number;
  description: string;
  redirectUrl: string;
  paymentMethod: PaymentMethod;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  paymentUrl?: string; // URL to redirect for payment (VNPay, Momo)
  transactionId?: string;
}

/**
 * Creates a payment request to the VNPay gateway
 */
export const createVnPayPayment = async (
  data: PaymentRequest,
): Promise<PaymentResponse> => {
  try {
    // In a real implementation, this would call your backend
    // For now, we're simulating the API response

    // Simulate API call
    // const response = await axios.post('/api/payments/vnpay', data);
    // return response.data;

    // Simulate successful response for demo
    return {
      success: true,
      message: "Payment URL generated successfully",
      paymentUrl: `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?amount=${data.amount}&description=${encodeURIComponent(data.description)}&vnp_TxnRef=${Date.now()}_${data.paymentId}`,
      transactionId: `VNP_${Date.now()}`,
    };
  } catch (error) {
    console.error("Error creating VNPay payment:", error);
    return {
      success: false,
      message: "Failed to create payment request. Please try again later.",
    };
  }
};

/**
 * Check payment status
 */
// export const checkPaymentStatus = async (
//   transactionId: string,
// ): Promise<PaymentResponse> => {
//   try {
//     // In a real implementation, this would call your backend
//     // const response = await axios.get(`/api/payments/status/${transactionId}`);
//     // return response.data;

//     // Simulate successful response for demo
//     return {
//       success: true,
//       message: "Payment completed successfully",
//     };
//   } catch (error) {
//     console.error("Error checking payment status:", error);
//     return {
//       success: false,
//       message: "Failed to check payment status. Please contact support.",
//     };
//   }
// };

export const getPaymentByStuId = async (
  studentId: string,
  currentPage: number,
  limit: number,
  status: string,
): Promise<PaymentData> => {
  try {
    const response = await axiosInstance.get(`/payment/list/${studentId}`, {
      params: {
        page: currentPage,
        limit: limit,
        status: status,
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const createNewGrade = async (paymentId: string) => {
  const response = await axiosInstance.post(
    `/payment/submit-order/${paymentId}`,
  );
  return response.data;
};
