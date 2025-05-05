// "use client";

// import React, { useEffect, useState } from "react";
// import { Tabs, TabList, Tab, TabPanel } from "@/app/ui/components/_common/Tabs";
// import PaymentDetailsModal from "@/app/ui/components/user/parent/tuition/PaymentDetailsModal";
// import PaymentMethodModal from "@/app/ui/components/user/parent/tuition/PaymentMethodModal";
// import Header from "@/app/ui/components/user/student/tuition/Header";
// import PendingPaymentsList from "@/app/ui/components/user/student/tuition/PendingPaymentsList";
// import PaidPaymentsList from "@/app/ui/components/user/student/tuition/PaidPaymentsList";
// import AllPaymentsList from "@/app/ui/components/user/student/tuition/AllPaymentsList";
// import { TuitionPayment, UserData } from "@/app/types";
// import { getPaymentByStuId } from "@/app/lib/services/payment";
// import { keepPreviousData, useQuery } from "@tanstack/react-query";
// import { getUserDataFromCookies } from "@/app/lib/action";

// export default function StudentTuition() {
//   const [activeTab, setActiveTab] = useState<string>("pending");
//   const [selectedPayment, setSelectedPayment] = useState<TuitionPayment | null>(
//     null,
//   );
//   const [showPaymentMethod, setShowPaymentMethod] = useState<boolean>(false);
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const [userData, setUserData] = useState<UserData | null>(null);
//   useEffect(() => {
//     const getUserInfo = async () => {
//       const res = await getUserDataFromCookies();
//       setUserData(res);
//     };
//     getUserInfo();
//   }, []);
//   const {
//     data: paymentData,
//     error,
//     isLoading,
//     isFetching,
//   } = useQuery({
//     queryKey: ["payments", activeTab, userData., currentPage - 1],
//     queryFn: () =>
//       getPaymentByStuId(selectedChild, currentPage - 1, 1, statusParam),
//     placeholderData: keepPreviousData,
//   });
//   const pendingPayments: TuitionPayment[] = [
//     {
//       id: "1",
//       invoiceNumber: "INV-2025-001",
//       amount: 3500000,
//       status: "PENDING",
//       dueDate: "2025-04-25",
//       description: "Học phí học kỳ 1 năm học 2025-2026",
//       semester: "Học kỳ 1 năm học 2025-2026",
//       classId: "CLS001",
//       className: "Lớp Toán 11A",
//       studentId: "ST001",
//       studentName: "Nguyễn Văn A",
//     },
//     {
//       id: "2",
//       invoiceNumber: "INV-2025-002",
//       amount: 2800000,
//       status: "PENDING",
//       dueDate: "2025-05-10",
//       description: "Học phí khóa học Tiếng Anh nâng cao",
//       semester: "Học kỳ 1 năm học 2025-2026",
//       classId: "CLS002",
//       className: "Lớp Tiếng Anh nâng cao",
//       studentId: "ST001",
//       studentName: "Nguyễn Văn A",
//     },
//   ];

//   const paidPayments: TuitionPayment[] = [
//     {
//       id: "3",
//       invoiceNumber: "INV-2024-023",
//       amount: 3200000,
//       status: "PAID",
//       dueDate: "2024-12-20",
//       paidDate: "2024-12-15",
//       description: "Học phí học kỳ 2 năm học 2024-2025",
//       semester: "Học kỳ 2 năm học 2024-2025",
//       classId: "CLS003",
//       className: "Lớp Toán 10A",
//       studentId: "ST001",
//       studentName: "Nguyễn Văn A",
//     },
//     {
//       id: "4",
//       invoiceNumber: "INV-2024-015",
//       amount: 2500000,
//       status: "PAID",
//       dueDate: "2024-08-15",
//       paidDate: "2024-08-12",
//       description: "Học phí học kỳ 1 năm học 2024-2025",
//       semester: "Học kỳ 1 năm học 2024-2025",
//       classId: "CLS004",
//       className: "Lớp Lý 10A",
//       studentId: "ST001",
//       studentName: "Nguyễn Văn A",
//     },
//   ];

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("vi-VN", {
//       style: "currency",
//       currency: "VND",
//     }).format(amount);
//   };

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString);
//     return new Intl.DateTimeFormat("vi-VN").format(date);
//   };

//   const getStatusColor = (status: string) => {
//     switch (status) {
//       case "PAID":
//         return "text-green-600 bg-green-100";
//       case "PENDING":
//         return "text-yellow-600 bg-yellow-100";
//       case "OVERDUE":
//         return "text-red-600 bg-red-100";
//       case "CANCELLED":
//         return "text-gray-600 bg-gray-100";
//       default:
//         return "text-gray-600";
//     }
//   };

//   const getStatusName = (status: string) => {
//     switch (status) {
//       case "PAID":
//         return "Đã thanh toán";
//       case "PENDING":
//         return "Chờ thanh toán";
//       case "OVERDUE":
//         return "Quá hạn";
//       case "CANCELLED":
//         return "Đã hủy";
//       default:
//         return status;
//     }
//   };

//   const handleOpenDetails = (payment: TuitionPayment) => {
//     setSelectedPayment(payment);
//   };

//   const handleCloseDetails = () => {
//     setSelectedPayment(null);
//   };

//   const handlePayNow = (payment: TuitionPayment) => {
//     setSelectedPayment(payment);
//     setShowPaymentMethod(true);
//   };

//   const handleClosePaymentMethod = () => {
//     setShowPaymentMethod(false);
//   };

//   const handlePaymentComplete = () => {
//     setShowPaymentMethod(false);
//     setSelectedPayment(null);
//   };

//   return (
//     <div className="px-2">
//       <Header
//         pendingPayments={pendingPayments}
//         paidPayments={paidPayments}
//         handlePayNow={handlePayNow}
//       />
//       <Tabs value={activeTab} onTabChange={setActiveTab}>
//         <TabList className="mb-6">
//           <Tab label="Chờ thanh toán" value="pending" />
//           <Tab label="Đã thanh toán" value="paid" />
//           <Tab label="Tất cả" value="all" />
//         </TabList>

//         <TabPanel value="pending">
//           <PendingPaymentsList
//             pendingPayments={pendingPayments}
//             formatCurrency={formatCurrency}
//             formatDate={formatDate}
//             getStatusColor={getStatusColor}
//             getStatusName={getStatusName}
//             handleOpenDetails={handleOpenDetails}
//             handlePayNow={handlePayNow}
//           />
//         </TabPanel>

//         <TabPanel value="paid">
//           <PaidPaymentsList
//             paidPayments={paidPayments}
//             formatCurrency={formatCurrency}
//             formatDate={formatDate}
//             getStatusColor={getStatusColor}
//             getStatusName={getStatusName}
//             handleOpenDetails={handleOpenDetails}
//           />
//         </TabPanel>

//         <TabPanel value="all">
//           <AllPaymentsList
//             payments={[...pendingPayments, ...paidPayments]}
//             formatCurrency={formatCurrency}
//             formatDate={formatDate}
//             getStatusColor={getStatusColor}
//             getStatusName={getStatusName}
//             handleOpenDetails={handleOpenDetails}
//             handlePayNow={handlePayNow}
//           />
//         </TabPanel>
//       </Tabs>

//       {selectedPayment && !showPaymentMethod && (
//         <PaymentDetailsModal
//           payment={selectedPayment}
//           onClose={handleCloseDetails}
//           onPayNow={handlePayNow}
//         />
//       )}

//       {selectedPayment && showPaymentMethod && (
//         <PaymentMethodModal
//           payment={selectedPayment}
//           onClose={handleClosePaymentMethod}
//           onPaymentComplete={handlePaymentComplete}
//         />
//       )}
//     </div>
//   );
// }
