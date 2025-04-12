"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabList, Tab, TabPanel } from "@/app/ui/components/_common/Tabs";
import Pagination from "@/app/ui/components/_common/Pagination";
import PaymentDetailsModal from "@/app/ui/components/user/parent/tuition/PaymentDetailsModal";
import PaymentMethodModal from "@/app/ui/components/user/parent/tuition/PaymentMethodModal";
import { TuitionPayment } from "@/app/types";
import Header from "@/app/ui/components/user/parent/tuition/Header";
import PendingPaymentsTable from "@/app/ui/components/user/parent/tuition/PendingPaymentsTable";
import PaidPaymentsTable from "@/app/ui/components/user/parent/tuition/PaidPaymentsTable";
import AllPaymentTable from "@/app/ui/components/user/parent/tuition/AllPaymentTable";

export default function ParentTuitionPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(5);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedStudent] = useState<string | "all">("all");
  const [selectedPayment, setSelectedPayment] = useState<TuitionPayment | null>(
    null,
  );
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);

  const pendingPayments: TuitionPayment[] = [
    {
      id: "1",
      invoiceNumber: "INV-20250412-001",
      amount: 2500000,
      status: "PENDING",
      dueDate: "2025-04-30",
      description: "Học phí học kỳ Hè 2025",
      semester: "Hè 2025",
      classId: "CLS001",
      className: "Toán nâng cao - Lớp 10",
      studentId: "STU001",
      studentName: "Nguyễn Văn A",
    },
    {
      id: "2",
      invoiceNumber: "INV-20250412-002",
      amount: 1800000,
      status: "PENDING",
      dueDate: "2025-04-25",
      description: "Học phí học kỳ Hè 2025",
      semester: "Hè 2025",
      classId: "CLS002",
      className: "Tiếng Anh giao tiếp - Lớp 10",
      studentId: "STU001",
      studentName: "Nguyễn Văn A",
    },
    {
      id: "3",
      invoiceNumber: "INV-20250412-003",
      amount: 2200000,
      status: "PENDING",
      dueDate: "2025-04-28",
      description: "Học phí học kỳ Hè 2025",
      semester: "Hè 2025",
      classId: "CLS003",
      className: "Vật lý cơ bản - Lớp 8",
      studentId: "STU002",
      studentName: "Lê Thị B",
    },
  ];

  const paidPayments: TuitionPayment[] = [
    {
      id: "4",
      invoiceNumber: "INV-20250201-001",
      amount: 2500000,
      status: "PAID",
      dueDate: "2025-02-15",
      paidDate: "2025-02-10",
      description: "Học phí học kỳ Xuân 2025",
      semester: "Xuân 2025",
      classId: "CLS001",
      className: "Toán nâng cao - Lớp 10",
      studentId: "STU001",
      studentName: "Nguyễn Văn A",
    },
    {
      id: "5",
      invoiceNumber: "INV-20250201-002",
      amount: 1800000,
      status: "PAID",
      dueDate: "2025-02-15",
      paidDate: "2025-02-12",
      description: "Học phí học kỳ Xuân 2025",
      semester: "Xuân 2025",
      classId: "CLS002",
      className: "Tiếng Anh giao tiếp - Lớp 10",
      studentId: "STU001",
      studentName: "Nguyễn Văn A",
    },
    {
      id: "6",
      invoiceNumber: "INV-20250201-003",
      amount: 2200000,
      status: "PAID",
      dueDate: "2025-02-15",
      paidDate: "2025-02-08",
      description: "Học phí học kỳ Xuân 2025",
      semester: "Xuân 2025",
      classId: "CLS003",
      className: "Vật lý cơ bản - Lớp 8",
      studentId: "STU002",
      studentName: "Lê Thị B",
    },
  ];

  // Función para obtener los datos de pago
  useEffect(() => {
    // Aquí iría la lógica para obtener los datos reales desde el API
    // Por ejemplo: fetchPayments(currentPage, activeTab, selectedStudent)
  }, [currentPage, activeTab, selectedStudent]);

  // Función para obtener pagos filtrados por estudiante
  const getFilteredPayments = (payments: TuitionPayment[]) => {
    if (selectedStudent === "all") {
      return payments;
    }
    return payments.filter((payment) => payment.studentId === selectedStudent);
  };

  // Formatear la moneda (VND)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Formatear la fecha
  const formatDate = (date: string | Date): string => {
    const parsedDate = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("vi-VN").format(parsedDate);
  };

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

  // Mostrar detalles de un pago específico
  const handleViewDetails = (payment: TuitionPayment) => {
    setSelectedPayment(payment);
    setShowPaymentDetails(true);
  };

  // Iniciar el proceso de pago
  const handlePayNow = (payment: TuitionPayment) => {
    setSelectedPayment(payment);
    setShowPaymentMethod(true);
  };

  // Obtener las facturas pendientes filtradas
  const filteredPendingPayments = getFilteredPayments(pendingPayments);

  // Obtener las facturas pagadas filtradas
  const filteredPaidPayments = getFilteredPayments(paidPayments);

  // Todas las facturas filtradas
  const filteredAllPayments = [
    ...filteredPendingPayments,
    ...filteredPaidPayments,
  ];

  return (
    <div className="px-2">
      <Header
        pendingPayments={pendingPayments}
        paidPayments={paidPayments}
        getFilteredPayments={getFilteredPayments}
        formatCurrency={formatCurrency}
      />

      {/* Tabs para ver diferentes tipos de pagos */}
      <Tabs value={activeTab} onTabChange={setActiveTab}>
        <TabList>
          <Tab value="pending" label="Chờ thanh toán" />
          <Tab value="paid" label="Đã thanh toán" />
          <Tab value="all" label="Tất cả" />
        </TabList>

        {/* Pestaña "Pendientes de pago" */}
        <TabPanel value="pending">
          <PendingPaymentsTable
            filteredPendingPayments={filteredPendingPayments}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            getStatusName={getStatusName}
            getStatusColor={getStatusColor}
            handleViewDetails={handleViewDetails}
            handlePayNow={handlePayNow}
          />
        </TabPanel>

        {/* Pestaña "Pagados" */}
        <TabPanel value="paid">
          <PaidPaymentsTable
            data={filteredPaidPayments}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            onViewDetails={handleViewDetails}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            getStatusName={getStatusName}
            getStatusColor={getStatusColor}
          />
        </TabPanel>

        {/* Pestaña "Todos" */}
        <TabPanel value="all">
          <AllPaymentTable
            payments={filteredAllPayments}
            onViewDetails={handleViewDetails}
            onPayNow={handlePayNow}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
            getStatusName={getStatusName}
            getStatusColor={getStatusColor}
          />

          <div className="mt-4 flex justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              handlePageClick={(page) => setCurrentPage(page)}
              handlePreviousPage={() =>
                setCurrentPage((prev) => Math.max(prev - 1, 1))
              }
              handleNextPage={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
            />
          </div>
        </TabPanel>
      </Tabs>

      {/* Modal para ver detalles del pago */}
      {showPaymentDetails && selectedPayment && (
        <PaymentDetailsModal
          payment={selectedPayment}
          onClose={() => setShowPaymentDetails(false)}
          onPayNow={() => {
            setShowPaymentDetails(false);
            setShowPaymentMethod(true);
          }}
        />
      )}

      {/* Modal para seleccionar método de pago */}
      {showPaymentMethod && selectedPayment && (
        <PaymentMethodModal
          payment={selectedPayment}
          onClose={() => setShowPaymentMethod(false)}
          onPaymentComplete={() => {
            setShowPaymentMethod(false);
            // Aquí se actualizarían los datos después del pago
          }}
        />
      )}
    </div>
  );
}
