"use client";

import React, { useEffect, useCallback } from "react";
import {
  FaCheckCircle,
  FaRegCalendarAlt,
  FaSchool,
  FaUser,
} from "react-icons/fa";
import { Button } from "@/app/ui/components/_common/Button";
import { MdCreditCard } from "react-icons/md";

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

interface PaymentDetailsModalProps {
  payment: TuitionPayment;
  onClose: () => void;
  onPayNow: (payment: TuitionPayment) => void;
}

const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({
  payment,
  onClose,
  onPayNow,
}) => {
  // Formatear la moneda (VND)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Formatear la fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN").format(date);
  };

  // Manejar la tecla ESC para cerrar el modal
  const handleEscKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  // Agregar listener para la tecla ESC
  useEffect(() => {
    document.addEventListener("keydown", handleEscKeyPress);

    // Limpiar el listener
    return () => {
      document.removeEventListener("keydown", handleEscKeyPress);
    };
  }, [handleEscKeyPress]);

  // Obtener el color según el estado del pago
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "text-green-600 bg-green-100";
      case "PENDING":
        return "text-yellow-600 bg-yellow-100";
      case "OVERDUE":
        return "text-red-600 bg-red-100";
      case "CANCELLED":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600";
    }
  };

  // Traducir el estado de pago al vietnamita
  const getStatusName = (status: string) => {
    switch (status) {
      case "PAID":
        return "Đã thanh toán";
      case "PENDING":
        return "Chờ thanh toán";
      case "OVERDUE":
        return "Quá hạn";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Chi tiết học phí</h2>
        </div>

        {/* Content */}
        <div className="px-6 py-4">
          <div className="border-b pb-4 mb-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Mã hóa đơn</span>
              <span className="font-medium">{payment.invoiceNumber}</span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Trạng thái</span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}
              >
                {getStatusName(payment.status)}
              </span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500">Số tiền</span>
              <span className="text-xl font-bold text-primary-darker">
                {formatCurrency(payment.amount)}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Thông tin chi tiết</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <div className="min-w-[30px] mr-4 mt-1">
                  <FaUser className="text-primary-darker" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Học sinh</p>
                  <p className="font-medium">{payment.studentName}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="min-w-[30px] mr-4 mt-1">
                  <FaSchool className="text-primary-darker" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Lớp học</p>
                  <p className="font-medium">{payment.className}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="min-w-[30px] mr-4 mt-1">
                  <MdCreditCard className="text-primary-darker" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Kỳ học</p>
                  <p className="font-medium">{payment.semester}</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="min-w-[30px] mr-4 mt-1">
                  <FaRegCalendarAlt className="text-primary-darker" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {payment.status === "PAID"
                      ? "Ngày thanh toán"
                      : "Hạn thanh toán"}
                  </p>
                  <p className="font-medium">
                    {payment.status === "PAID" && payment.paidDate
                      ? formatDate(payment.paidDate)
                      : formatDate(payment.dueDate)}
                  </p>
                </div>
              </div>

              {payment.status === "PAID" && (
                <div className="flex items-start md:col-span-2">
                  <div className="min-w-[30px] mr-4 mt-1">
                    <FaCheckCircle className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Đã thanh toán vào</p>
                    <p className="font-medium">
                      {payment.paidDate && formatDate(payment.paidDate)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-md font-semibold mb-2">Mô tả</h3>
            <p className="text-gray-700">{payment.description}</p>
          </div>
        </div>

        {/* Footer / Actions */}
        <div className="px-6 py-4 border-t flex justify-end gap-3">
          <Button variant="basic" onClick={onClose} className="px-4">
            Đóng
          </Button>

          {payment.status === "PENDING" && (
            <Button
              variant="primary"
              onClick={() => onPayNow(payment)}
              className="px-4"
            >
              Thanh toán ngay
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsModal;
