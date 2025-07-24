"use client";

import React, { useState } from "react";
import { Tabs, TabList, Tab, TabPanel } from "@/app/ui/components/_common/Tabs";
import Pagination from "@/app/ui/components/_common/Pagination";
import PaymentDetailsModal from "@/app/ui/components/user/parent/tuition/PaymentDetailsModal";
import PaymentMethodModal from "@/app/ui/components/user/parent/tuition/PaymentMethodModal";
import Header from "@/app/ui/components/user/parent/tuition/Header";
import PendingPaymentsTable from "@/app/ui/components/user/parent/tuition/PendingPaymentsTable";
import PaidPaymentsTable from "@/app/ui/components/user/parent/tuition/PaidPaymentsTable";
import AllPaymentTable from "@/app/ui/components/user/parent/tuition/AllPaymentTable";
import { PaymentItem } from "@/app/types";
import { getPaymentByStuId } from "@/app/lib/services/payment";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { RootState, useAppSelector } from "@/app/store/store";
import PaymentLoadingSkeleton from "./PaymentLoadingSkeleton";

export default function ParentTuition() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages] = useState(5);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<PaymentItem | null>(
    null,
  );
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);

  const statusParam = activeTab === "all" ? "" : activeTab.toUpperCase();
  const selectedChild = useAppSelector(
    (state: RootState) => state.children.selectedChild,
  );
  const {
    data: paymentData,
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["payments", activeTab, selectedChild?.id, currentPage - 1],
    queryFn: () =>
      getPaymentByStuId(selectedChild?.id, currentPage - 1, 5, statusParam),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  const payments = paymentData?.content || [];

  const pendingPayments = payments.filter((p) => p.status !== "COMPLETED");
  const completedPayments = payments.filter((p) => p.status === "COMPLETED");
  const filteredAllPayments = [...pendingPayments, ...completedPayments];

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
      case "COMPLETED":
        return "text-green-600 bg-green-100";
      case "PENDING":
        return "text-yellow-600 bg-yellow-100";
      case "OVERDUE":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600";
    }
  };

  // Traducir el estado de pago al vietnamita
  const getStatusName = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "Đã thanh toán";
      case "PENDING":
        return "Chờ thanh toán";
      case "OVERDUE":
        return "Quá hạn";
      default:
        return status;
    }
  };

  // Mostrar detalles de un pago específico
  const handleViewDetails = (payment: PaymentItem) => {
    setSelectedPayment(payment);
    setShowPaymentDetails(true);
  };

  // Iniciar el proceso de pago
  const handlePayNow = (payment: PaymentItem) => {
    setSelectedPayment(payment);
    setShowPaymentMethod(true);
  };

  if (error) {
    return <div>{error.message}</div>;
  }

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse flex items-center justify-between bg-gray-100 p-4 rounded shadow"
          >
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/6"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {isFetching ? (
        <PaymentLoadingSkeleton />
      ) : (
        <>
          <div className="px-2">
            <Header
              pendingPayments={pendingPayments}
              paidPayments={completedPayments}
              formatCurrency={formatCurrency}
            />

            <Tabs value={activeTab} onTabChange={setActiveTab}>
              <TabList>
                <Tab value="all" label="Tất cả" />
                <Tab value="pending" label="Chờ thanh toán" />
                <Tab value="completed" label="Đã thanh toán" />
              </TabList>

              <TabPanel value="pending">
                <PendingPaymentsTable
                  filteredPendingPayments={pendingPayments}
                  formatCurrency={formatCurrency}
                  formatDate={formatDate}
                  getStatusName={getStatusName}
                  getStatusColor={getStatusColor}
                  handleViewDetails={handleViewDetails}
                  handlePayNow={handlePayNow}
                />
              </TabPanel>

              <TabPanel value="completed">
                <PaidPaymentsTable
                  data={completedPayments}
                  onViewDetails={handleViewDetails}
                  formatCurrency={formatCurrency}
                  formatDate={formatDate}
                  getStatusName={getStatusName}
                  getStatusColor={getStatusColor}
                />
              </TabPanel>

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
              </TabPanel>

              <div className="mt-4 flex justify-end">
                <Pagination
                  currentPage={currentPage}
                  totalPages={paymentData?.totalPages || 1}
                  handlePageClick={(page) => setCurrentPage(page)}
                  handlePreviousPage={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  handleNextPage={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                />
              </div>
            </Tabs>
          </div>

          {/* Modals ngoài Tabs */}
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

          {showPaymentMethod && selectedPayment && (
            <PaymentMethodModal
              payment={selectedPayment}
              onClose={() => setShowPaymentMethod(false)}
              onPaymentComplete={() => {
                setShowPaymentMethod(false);
              }}
            />
          )}
        </>
      )}
    </>
  );
}
