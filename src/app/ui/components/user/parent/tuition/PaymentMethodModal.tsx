"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/app/ui/components/_common/Button";
import { FaCheck, FaCreditCard, FaQrcode, FaWallet } from "react-icons/fa";
import { BsBank2 } from "react-icons/bs";
import { MdPayment } from "react-icons/md";
import {
  createVnPayPayment,
  PaymentMethod as APIPaymentMethod,
} from "@/app/lib/services/payment";
import { toast } from "react-toastify";

interface TuitionPayment {
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
}

interface PaymentMethodModalProps {
  payment: TuitionPayment;
  onClose: () => void;
  onPaymentComplete: () => void;
}

type PaymentMethod =
  | "bank_transfer"
  | "credit_card"
  | "qr_code"
  | "momo"
  | "vnpay"
  | "";

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  payment,
  onClose,
  onPaymentComplete,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Format currency (VND)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Handle ESC key press to close modal
  const handleEscKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  // Add event listener for ESC key
  useEffect(() => {
    document.addEventListener("keydown", handleEscKeyPress);

    // Clean up event listener
    return () => {
      document.removeEventListener("keydown", handleEscKeyPress);
    };
  }, [handleEscKeyPress]);

  // Payment method options
  const paymentMethods = [
    {
      id: "vnpay",
      name: "VNPay",
      description: "Thanh toán an toàn qua cổng thanh toán VNPay",
      icon: <MdPayment className="h-6 w-6" />,
    },
    {
      id: "bank_transfer",
      name: "Chuyển khoản ngân hàng",
      description: "Chuyển khoản trực tiếp từ tài khoản ngân hàng của bạn",
      icon: <BsBank2 className="h-6 w-6" />,
    },
    {
      id: "credit_card",
      name: "Thẻ tín dụng / Ghi nợ",
      description: "Thanh toán an toàn bằng thẻ Visa, MasterCard, JCB",
      icon: <FaCreditCard className="h-6 w-6" />,
    },
    {
      id: "qr_code",
      name: "Quét mã QR",
      description: "Quét mã QR bằng ứng dụng ngân hàng của bạn",
      icon: <FaQrcode className="h-6 w-6" />,
    },
    {
      id: "momo",
      name: "Ví MoMo",
      description: "Thanh toán nhanh chóng qua ví điện tử MoMo",
      icon: <FaWallet className="h-6 w-6" />,
    },
  ];

  // Handle payment process
  const handlePay = async () => {
    if (!selectedMethod) return;

    setIsLoading(true);

    try {
      if (selectedMethod === "vnpay") {
        // Call VNPay service
        const response = await createVnPayPayment({
          paymentId: payment.id,
          amount: payment.amount,
          description: `Thanh toán hóa đơn ${payment.invoiceNumber} - ${payment.className}`,
          redirectUrl: `${window.location.origin}/parent/tuition/payment-callback`,
          paymentMethod: "VNPAY" as APIPaymentMethod,
        });

        if (response.success && response.paymentUrl) {
          // Redirect to VNPay payment portal
          window.location.href = response.paymentUrl;
          return;
        } else {
          toast.error(
            response.message || "Không thể kết nối tới cổng thanh toán VNPay",
          );
          setIsLoading(false);
          return;
        }
      }

      // For other payment methods, simulate a delay
      setTimeout(() => {
        setIsLoading(false);
        setShowConfirmation(true);
      }, 2000);
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        "Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại.",
      );
      setIsLoading(false);
    }
  };

  // Complete payment process
  const handleFinish = () => {
    onPaymentComplete();
  };

  if (showConfirmation) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheck className="text-green-600 text-2xl" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Thanh toán thành công!
            </h2>
            <p className="text-gray-600 mb-6">
              Thanh toán cho học phí{" "}
              <span className="font-medium">{payment.invoiceNumber}</span> đã
              được xử lý thành công.
            </p>
            <Button variant="primary" onClick={handleFinish} className="w-full">
              Hoàn tất
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Phương thức thanh toán
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-6 bg-primary-lighter p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Thanh toán cho hóa đơn</p>
              <p className="font-medium">{payment.invoiceNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tổng số tiền</p>
              <p className="text-xl font-bold text-primary-darker">
                {formatCurrency(payment.amount)}
              </p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">
              Chọn phương thức thanh toán
            </h3>

            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedMethod === method.id
                      ? "border-primary-dark bg-primary-lighter"
                      : "border-gray-200 hover:border-primary-dark"
                  }`}
                  onClick={() => setSelectedMethod(method.id as PaymentMethod)}
                >
                  <div className="flex items-center">
                    <div
                      className={`p-3 rounded-full mr-4 ${
                        selectedMethod === method.id
                          ? "bg-primary-dark text-white"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{method.name}</h4>
                      <p className="text-sm text-gray-500">
                        {method.description}
                      </p>
                    </div>
                    {selectedMethod === method.id && (
                      <div className="h-6 w-6 bg-primary-dark rounded-full flex items-center justify-center">
                        <FaCheck className="text-white text-sm" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedMethod === "bank_transfer" && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h4 className="font-medium mb-2">Thông tin chuyển khoản</h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-600">Ngân hàng:</span> VietcomBank
                </p>
                <p>
                  <span className="text-gray-600">Số tài khoản:</span>{" "}
                  1234567890
                </p>
                <p>
                  <span className="text-gray-600">Chủ tài khoản:</span> CÔNG TY
                  TNHH USTUDY
                </p>
                <p>
                  <span className="text-gray-600">Nội dung chuyển khoản:</span>{" "}
                  {payment.invoiceNumber}
                </p>
              </div>
            </div>
          )}

          {selectedMethod === "qr_code" && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6 text-center">
              <h4 className="font-medium mb-2">Quét mã QR để thanh toán</h4>
              <div className="w-48 h-48 mx-auto bg-white p-2 border rounded-lg">
                {/* Aquí iría una imagen real del código QR */}
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <FaQrcode className="text-gray-400 text-6xl" />
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Mở ứng dụng ngân hàng và quét mã để thanh toán
              </p>
            </div>
          )}
        </div>

        {/* Footer / Actions */}
        <div className="px-6 py-4 border-t flex justify-end gap-3">
          <Button
            variant="basic"
            onClick={onClose}
            disabled={isLoading}
            className="px-4"
          >
            Hủy
          </Button>

          <Button
            variant="primary"
            onClick={handlePay}
            disabled={!selectedMethod || isLoading}
            className="px-4 min-w-[120px]"
            isPending={isLoading}
          >
            {isLoading ? "Đang xử lý..." : "Thanh toán"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodModal;
