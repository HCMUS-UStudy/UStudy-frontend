"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FaCreditCard, FaMoneyBillWave, FaQrcode } from "react-icons/fa";
import { MdPayment } from "react-icons/md";
import { Button } from "@/app/ui/components/_common/Button";
import { toast } from "react-toastify";
import {
  createVnPayPayment,
  PaymentMethod as APIPaymentMethod,
} from "@/app/lib/services/payment";
import { TuitionPayment } from "@/app/types";

interface PaymentMethodModalProps {
  payment: TuitionPayment;
  onClose: () => void;
  onPaymentComplete: () => void;
}

type PaymentMethod =
  | "BANK_TRANSFER"
  | "CREDIT_CARD"
  | "QR_CODE"
  | "VNPAY"
  | null;

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  payment,
  onClose,
  onPaymentComplete,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handleProceedToPayment = async () => {
    if (!selectedMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán");
      return;
    }

    setIsProcessing(true);

    try {
      // Handle VNPay payment
      if (selectedMethod === "VNPAY") {
        const response = await createVnPayPayment({
          paymentId: payment.id,
          amount: payment.amount,
          description: `Thanh toán hóa đơn ${payment.invoiceNumber} - ${payment.className}`,
          redirectUrl: `${window.location.origin}/student/tuition/payment-callback`,
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
          setIsProcessing(false);
          return;
        }
      }

      // Simulate an API call to process other payment methods
      // Here we would call the API to process the payment
      // await processPayment(payment.id, selectedMethod);

      // Simulate a delay to show processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Thanh toán thành công!");
      onPaymentComplete();
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error(
        "Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại sau.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    {
      id: "VNPAY",
      name: "VNPay",
      icon: <MdPayment className="w-6 h-6" />,
      description: "Thanh toán an toàn qua cổng thanh toán VNPay",
    },
    {
      id: "BANK_TRANSFER",
      name: "Chuyển khoản ngân hàng",
      icon: <FaMoneyBillWave className="w-6 h-6" />,
      description: "Chuyển khoản từ tài khoản ngân hàng của bạn",
    },
    {
      id: "CREDIT_CARD",
      name: "Thẻ tín dụng/Ghi nợ",
      icon: <FaCreditCard className="w-6 h-6" />,
      description: "Thanh toán bằng thẻ Visa, Mastercard, JCB",
    },
    {
      id: "QR_CODE",
      name: "Quét mã QR",
      icon: <FaQrcode className="w-6 h-6" />,
      description: "Sử dụng ứng dụng ngân hàng để quét mã thanh toán",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Chọn phương thức thanh toán
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <div className="mb-6">
            <div className="flex justify-between items-center p-4 bg-primary-lighter rounded-lg mb-6">
              <div>
                <p className="text-sm text-gray-600">Tổng số tiền</p>
                <p className="text-xl font-bold text-primary-darker">
                  {formatCurrency(payment.amount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Mã hóa đơn</p>
                <p className="font-medium">{payment.invoiceNumber}</p>
              </div>
            </div>

            <h3 className="text-md font-semibold mb-4">
              Chọn phương thức thanh toán
            </h3>

            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className={`border rounded-lg p-4 flex items-center cursor-pointer transition-all
                    ${
                      selectedMethod === method.id
                        ? "border-primary-dark bg-primary-lighter"
                        : "border-gray-200 hover:border-primary-dark hover:bg-gray-50"
                    }`}
                  onClick={() => setSelectedMethod(method.id as PaymentMethod)}
                >
                  <div
                    className={`p-3 rounded-full mr-4 ${selectedMethod === method.id ? "bg-primary-dark text-white" : "bg-gray-100"}`}
                  >
                    {method.icon}
                  </div>
                  <div>
                    <h4 className="font-medium">{method.name}</h4>
                    <p className="text-sm text-gray-500">
                      {method.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedMethod === "BANK_TRANSFER" && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">
                Thông tin chuyển khoản
              </h4>
              <ul className="space-y-2 text-blue-700">
                <li>
                  <span className="font-medium">Ngân hàng:</span> Ngân hàng TMCP
                  Á Châu (ACB)
                </li>
                <li>
                  <span className="font-medium">Số tài khoản:</span> 123456789
                </li>
                <li>
                  <span className="font-medium">Chủ tài khoản:</span> USTUDY
                  EDUCATION
                </li>
                <li>
                  <span className="font-medium">Nội dung:</span>{" "}
                  {payment.invoiceNumber} - Học phí
                </li>
              </ul>
              <p className="text-sm text-blue-600 mt-3">
                <strong>Lưu ý:</strong> Vui lòng chuyển đúng số tiền và ghi rõ
                nội dung chuyển khoản để việc xác nhận được thực hiện nhanh
                chóng.
              </p>
            </div>
          )}

          {selectedMethod === "QR_CODE" && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
              <h4 className="font-semibold mb-3">Quét mã QR để thanh toán</h4>
              <div className="bg-white p-4 inline-block rounded-lg mb-3">
                {/* Placeholder for QR code - in production, this would be a dynamically generated QR */}
                <div className="w-64 h-64 bg-gray-200 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500">Mã QR thanh toán</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Sử dụng ứng dụng ngân hàng hoặc ví điện tử để quét mã QR và hoàn
                tất thanh toán
              </p>
            </div>
          )}
        </div>

        {/* Footer / Actions */}
        <div className="px-6 py-4 border-t flex justify-between">
          <Button variant="basic" onClick={onClose} disabled={isProcessing}>
            Hủy
          </Button>

          <Button
            variant="primary"
            onClick={handleProceedToPayment}
            disabled={!selectedMethod || isProcessing}
            isPending={isProcessing}
          >
            {isProcessing ? "Đang xử lý..." : "Tiếp tục thanh toán"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodModal;
