import { PaymentData } from "@/app/types";
import axiosInstance from "../axios";

export type PaymentMethod = "VNPAY" | "MOMO";

export interface PaymentRequest {
  paymentId: string;
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
    const response = await axiosInstance.post("/payment/create-vnpay", data);
    if (response.data.success) {
      return {
        success: true,
        message: "Payment request created successfully",
        paymentUrl: response.data.paymentUrl,
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Failed to create payment request",
      };
    }
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
  studentId: string | undefined,
  currentPage: number,
  limit: number,
  status: string,
): Promise<PaymentData> => {
  try {
    // Tạo endpoint dựa trên studentId có hay không
    // const endpoint = studentId ? `/payment/list/${studentId}` : `/payment/list`;
    const response = await axiosInstance.get("/payment/list", {
      params: {
        studentId: studentId ?? "",
        page: currentPage,
        limit: limit,
        status: status,
      },
    });

    return response.data.data;
  } catch (error) {
    console.log(error);
    return {
      content: [],
      totalElements: 0,
      totalPages: 0,
    };
  }
};

export const submitOrderPayment = async (
  paymentId: string,
): Promise<string> => {
  try {
    const response = await axiosInstance.post(
      `/payment/submit-order/${paymentId}`,
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
