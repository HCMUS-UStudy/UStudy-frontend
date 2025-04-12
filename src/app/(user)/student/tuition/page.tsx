"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/app/ui/components/_common/Card";
import { FaCalendarAlt, FaFileInvoiceDollar, FaHistory } from "react-icons/fa";
import { Tabs, TabList, Tab, TabPanel } from "@/app/ui/components/_common/Tabs";
import { Button } from "@/app/ui/components/_common/Button";
import PaymentDetailsModal from "@/app/ui/components/user/student/tuition/PaymentDetailsModal";
import PaymentMethodModal from "@/app/ui/components/user/student/tuition/PaymentMethodModal";

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

export default function StudentTuitionPage() {
  const [activeTab, setActiveTab] = useState<string>("pending");
  const [selectedPayment, setSelectedPayment] = useState<TuitionPayment | null>(
    null,
  );
  const [showPaymentMethod, setShowPaymentMethod] = useState<boolean>(false);

  // Example data (in a real app, this data would come from an API)
  const pendingPayments: TuitionPayment[] = [
    {
      id: "1",
      invoiceNumber: "INV-2025-001",
      amount: 3500000,
      status: "PENDING",
      dueDate: "2025-04-25",
      description: "Học phí học kỳ 1 năm học 2025-2026",
      semester: "Học kỳ 1 năm học 2025-2026",
      classId: "CLS001",
      className: "Lớp Toán 11A",
      studentId: "ST001",
      studentName: "Nguyễn Văn A",
    },
    {
      id: "2",
      invoiceNumber: "INV-2025-002",
      amount: 2800000,
      status: "PENDING",
      dueDate: "2025-05-10",
      description: "Học phí khóa học Tiếng Anh nâng cao",
      semester: "Học kỳ 1 năm học 2025-2026",
      classId: "CLS002",
      className: "Lớp Tiếng Anh nâng cao",
      studentId: "ST001",
      studentName: "Nguyễn Văn A",
    },
  ];

  const paidPayments: TuitionPayment[] = [
    {
      id: "3",
      invoiceNumber: "INV-2024-023",
      amount: 3200000,
      status: "PAID",
      dueDate: "2024-12-20",
      paidDate: "2024-12-15",
      description: "Học phí học kỳ 2 năm học 2024-2025",
      semester: "Học kỳ 2 năm học 2024-2025",
      classId: "CLS003",
      className: "Lớp Toán 10A",
      studentId: "ST001",
      studentName: "Nguyễn Văn A",
    },
    {
      id: "4",
      invoiceNumber: "INV-2024-015",
      amount: 2500000,
      status: "PAID",
      dueDate: "2024-08-15",
      paidDate: "2024-08-12",
      description: "Học phí học kỳ 1 năm học 2024-2025",
      semester: "Học kỳ 1 năm học 2024-2025",
      classId: "CLS004",
      className: "Lớp Lý 10A",
      studentId: "ST001",
      studentName: "Nguyễn Văn A",
    },
  ];

  // Format currency (VND)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN").format(date);
  };

  // Get status color
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

  // Translate status to Vietnamese
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

  // Open payment details modal
  const handleOpenDetails = (payment: TuitionPayment) => {
    setSelectedPayment(payment);
  };

  // Close payment details modal
  const handleCloseDetails = () => {
    setSelectedPayment(null);
  };

  // Start payment process
  const handlePayNow = (payment: TuitionPayment) => {
    setSelectedPayment(payment);
    setShowPaymentMethod(true);
  };

  // Close payment method modal
  const handleClosePaymentMethod = () => {
    setShowPaymentMethod(false);
  };

  // Complete payment process
  const handlePaymentComplete = () => {
    // In a real app, we would update the payment status here
    setShowPaymentMethod(false);
    setSelectedPayment(null);
    // And reload the data
  };

  // Calculate total pending amount
  const totalPendingAmount = pendingPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Học phí</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-primary-lighter to-primary-light border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  Tổng học phí chờ thanh toán
                </p>
                <p className="text-2xl font-bold text-primary-darker">
                  {formatCurrency(totalPendingAmount)}
                </p>
              </div>
              <div className="p-3 bg-white bg-opacity-30 rounded-full">
                <FaFileInvoiceDollar className="h-6 w-6 text-primary-darkest" />
              </div>
            </div>
            <div className="mt-4">
              <Button
                variant="primary"
                className="w-full"
                onClick={() =>
                  pendingPayments.length > 0 && handlePayNow(pendingPayments[0])
                }
                disabled={pendingPayments.length === 0}
              >
                Thanh toán ngay
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-primary-light">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 mb-1">Kỳ học hiện tại</p>
                <p className="text-xl font-bold text-gray-800">
                  Học kỳ 1 năm học 2025-2026
                </p>
              </div>
              <div className="p-3 bg-primary-lighter rounded-full">
                <FaCalendarAlt className="h-6 w-6 text-primary-dark" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Thời gian: 04/2025 - 08/2025
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md border-primary-light">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-600 mb-1">Lịch sử thanh toán</p>
                <p className="text-xl font-bold text-gray-800">
                  {paidPayments.length} giao dịch
                </p>
              </div>
              <div className="p-3 bg-primary-lighter rounded-full">
                <FaHistory className="h-6 w-6 text-primary-dark" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">
                Cập nhật lần cuối: {formatDate(new Date().toISOString())}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for pending and paid invoices */}
      <Tabs value={activeTab} onTabChange={setActiveTab}>
        <TabList className="mb-6">
          <Tab label="Chờ thanh toán" value="pending" />
          <Tab label="Đã thanh toán" value="paid" />
          <Tab label="Tất cả" value="all" />
        </TabList>

        <TabPanel value="pending">
          {pendingPayments.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {pendingPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {payment.className}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {payment.invoiceNumber}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}
                      >
                        {getStatusName(payment.status)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <p className="text-lg font-bold text-primary-darker">
                        {formatCurrency(payment.amount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Hạn thanh toán: {formatDate(payment.dueDate)}
                      </p>
                    </div>

                    <div className="flex space-x-2 mt-3 sm:mt-0">
                      <Button
                        variant="outline"
                        onClick={() => handleOpenDetails(payment)}
                        className="text-sm px-3"
                      >
                        Chi tiết
                      </Button>

                      <Button
                        variant="primary"
                        onClick={() => handlePayNow(payment)}
                        className="text-sm px-3"
                      >
                        Thanh toán
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">
                Không có học phí chờ thanh toán.
              </p>
            </div>
          )}
        </TabPanel>

        <TabPanel value="paid">
          {paidPayments.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {paidPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {payment.className}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {payment.invoiceNumber}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}
                      >
                        {getStatusName(payment.status)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <p className="text-lg font-bold text-primary-darker">
                        {formatCurrency(payment.amount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Đã thanh toán:{" "}
                        {payment.paidDate && formatDate(payment.paidDate)}
                      </p>
                    </div>

                    <div className="flex space-x-2 mt-3 sm:mt-0">
                      <Button
                        variant="outline"
                        onClick={() => handleOpenDetails(payment)}
                        className="text-sm px-3"
                      >
                        Chi tiết
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">
                Bạn chưa có lịch sử thanh toán nào.
              </p>
            </div>
          )}
        </TabPanel>

        <TabPanel value="all">
          {[...pendingPayments, ...paidPayments].length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {[...pendingPayments, ...paidPayments].map((payment) => (
                <div
                  key={payment.id}
                  className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {payment.className}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {payment.invoiceNumber}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}
                      >
                        {getStatusName(payment.status)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <p className="text-lg font-bold text-primary-darker">
                        {formatCurrency(payment.amount)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {payment.status === "PAID"
                          ? `Đã thanh toán: ${payment.paidDate && formatDate(payment.paidDate)}`
                          : `Hạn thanh toán: ${formatDate(payment.dueDate)}`}
                      </p>
                    </div>

                    <div className="flex space-x-2 mt-3 sm:mt-0">
                      <Button
                        variant="outline"
                        onClick={() => handleOpenDetails(payment)}
                        className="text-sm px-3"
                      >
                        Chi tiết
                      </Button>

                      {payment.status === "PENDING" && (
                        <Button
                          variant="primary"
                          onClick={() => handlePayNow(payment)}
                          className="text-sm px-3"
                        >
                          Thanh toán
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-lg">Không có dữ liệu học phí.</p>
            </div>
          )}
        </TabPanel>
      </Tabs>

      {/* Modals */}
      {selectedPayment && !showPaymentMethod && (
        <PaymentDetailsModal
          payment={selectedPayment}
          onClose={handleCloseDetails}
          onPayNow={handlePayNow}
        />
      )}

      {selectedPayment && showPaymentMethod && (
        <PaymentMethodModal
          payment={selectedPayment}
          onClose={handleClosePaymentMethod}
          onPaymentComplete={handlePaymentComplete}
        />
      )}
    </div>
  );
}
