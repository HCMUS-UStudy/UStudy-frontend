"use client";

import React, { useEffect, useState } from "react";
import { FaDownload, FaEye, FaInfoCircle, FaUser } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/ui/components/_common/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/app/ui/components/_common/Table";
import { Button } from "@/app/ui/components/_common/Button";
import { MdCreditCard, MdHistory, MdReceipt } from "react-icons/md";
import { TbCoin } from "react-icons/tb";
import { Tabs, TabList, Tab, TabPanel } from "@/app/ui/components/_common/Tabs";
import Pagination from "@/app/ui/components/_common/Pagination";
import PaymentDetailsModal from "@/app/ui/components/user/parent/tuition/PaymentDetailsModal";
import PaymentMethodModal from "@/app/ui/components/user/parent/tuition/PaymentMethodModal";

// Tipos de datos para pagos de matrícula
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

// Componente principal
export default function ParentTuitionPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(5);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedStudent, setSelectedStudent] = useState<string | "all">("all");
  const [selectedPayment, setSelectedPayment] = useState<TuitionPayment | null>(
    null,
  );
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);

  // Datos de ejemplo - en producción, estos vendrían de una API
  const students = [
    { id: "STU001", name: "Nguyễn Văn A" },
    { id: "STU002", name: "Lê Thị B" },
  ];

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

  // Calcular totales para resumenes
  const calculateTotals = () => {
    const filteredPending = getFilteredPayments(pendingPayments);
    const filteredPaid = getFilteredPayments(paidPayments);

    const totalPending = filteredPending.reduce(
      (sum, payment) => sum + payment.amount,
      0,
    );
    const totalPaid = filteredPaid.reduce(
      (sum, payment) => sum + payment.amount,
      0,
    );
    const totalAmount = totalPending + totalPaid;

    return { totalAmount, totalPaid, totalPending };
  };

  const { totalAmount, totalPaid, totalPending } = calculateTotals();

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
    <div className="px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Học phí</h1>

      {/* Selector de estudiante */}
      <div className="mb-6">
        <label
          htmlFor="student-selector"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Chọn học sinh:
        </label>
        <select
          id="student-selector"
          className="w-full md:w-64 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-primary-dark focus:border-primary-dark"
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
        >
          <option value="all">Tất cả học sinh</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.name}
            </option>
          ))}
        </select>
      </div>

      {/* Resumen de pagos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 shadow-md border-blue-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-blue-700 font-medium">
                  Tổng học phí
                </p>
                <p className="text-2xl font-bold text-blue-800">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
              <div className="p-3 bg-blue-200 rounded-full">
                <TbCoin className="h-6 w-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 shadow-md border-green-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-green-700 font-medium">
                  Đã thanh toán
                </p>
                <p className="text-2xl font-bold text-green-800">
                  {formatCurrency(totalPaid)}
                </p>
              </div>
              <div className="p-3 bg-green-200 rounded-full">
                <MdReceipt className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-md border-yellow-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-yellow-700 font-medium">
                  Chờ thanh toán
                </p>
                <p className="text-2xl font-bold text-yellow-800">
                  {formatCurrency(totalPending)}
                </p>
              </div>
              <div className="p-3 bg-yellow-200 rounded-full">
                <MdCreditCard className="h-6 w-6 text-yellow-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 shadow-md border-purple-200">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-purple-700 font-medium">
                  Học kỳ hiện tại
                </p>
                <p className="text-2xl font-bold text-purple-800">Hè 2025</p>
              </div>
              <div className="p-3 bg-purple-200 rounded-full">
                <MdHistory className="h-6 w-6 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para ver diferentes tipos de pagos */}
      <Tabs value={activeTab} onTabChange={setActiveTab}>
        <TabList>
          <Tab value="pending" label="Chờ thanh toán" />
          <Tab value="paid" label="Đã thanh toán" />
          <Tab value="all" label="Tất cả" />
        </TabList>

        {/* Pestaña "Pendientes de pago" */}
        <TabPanel value="pending">
          {filteredPendingPayments.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mt-4">
              <Table>
                <TableHeader
                  columns={[
                    "Mã hóa đơn",
                    "Học sinh",
                    "Lớp học",
                    "Số tiền",
                    "Hạn thanh toán",
                    "Trạng thái",
                    "Thao tác",
                  ]}
                  className="bg-primary-lighter text-gray-700"
                />
                <TableBody>
                  {filteredPendingPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.invoiceNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary-lighter text-primary-dark flex items-center justify-center mr-2">
                            <FaUser className="h-4 w-4" />
                          </div>
                          <span>{payment.studentName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payment.className}</p>
                          <p className="text-sm text-gray-500">
                            {payment.semester}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-primary-darker">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {formatDate(payment.dueDate)}
                          {new Date(payment.dueDate) < new Date() && (
                            <FaInfoCircle
                              className="ml-2 text-red-500"
                              title="Quá hạn"
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}
                        >
                          {getStatusName(payment.status)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => handleViewDetails(payment)}
                            variant="outlined"
                            className="rounded-full w-8 h-8 p-0 min-w-0 flex items-center justify-center"
                          >
                            <FaEye className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handlePayNow(payment)}
                            variant="primary"
                            className="rounded-full px-3 py-1 text-sm"
                          >
                            Thanh toán
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow-md mt-4">
              <p className="text-gray-500">
                Không có khoản thanh toán nào đang chờ xử lý.
              </p>
            </div>
          )}
        </TabPanel>

        {/* Pestaña "Pagados" */}
        <TabPanel value="paid">
          {filteredPaidPayments.length > 0 ? (
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mt-4">
              <Table>
                <TableHeader
                  columns={[
                    "Mã hóa đơn",
                    "Học sinh",
                    "Lớp học",
                    "Số tiền",
                    "Ngày thanh toán",
                    "Trạng thái",
                    "Thao tác",
                  ]}
                  className="bg-primary-lighter text-gray-700"
                />
                <TableBody>
                  {filteredPaidPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.invoiceNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary-lighter text-primary-dark flex items-center justify-center mr-2">
                            <FaUser className="h-4 w-4" />
                          </div>
                          <span>{payment.studentName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{payment.className}</p>
                          <p className="text-sm text-gray-500">
                            {payment.semester}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-primary-darker">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell>
                        {payment.paidDate && formatDate(payment.paidDate)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}
                        >
                          {getStatusName(payment.status)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            onClick={() => handleViewDetails(payment)}
                            variant="outlined"
                            className="rounded-full w-8 h-8 p-0 min-w-0 flex items-center justify-center"
                          >
                            <FaEye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outlined"
                            className="rounded-full w-8 h-8 p-0 min-w-0 flex items-center justify-center"
                          >
                            <FaDownload
                              className="h-4 w-4"
                              title="Tải biên lai"
                            />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow-md mt-4">
              <p className="text-gray-500">
                Không có khoản thanh toán nào đã hoàn thành.
              </p>
            </div>
          )}

          <div className="mt-4 flex justify-center">
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

        {/* Pestaña "Todos" */}
        <TabPanel value="all">
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mt-4">
            <Table>
              <TableHeader
                columns={[
                  "Mã hóa đơn",
                  "Học sinh",
                  "Lớp học",
                  "Số tiền",
                  "Thời gian",
                  "Trạng thái",
                  "Thao tác",
                ]}
                className="bg-primary-lighter text-gray-700"
              />
              <TableBody>
                {filteredAllPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>{payment.invoiceNumber}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary-lighter text-primary-dark flex items-center justify-center mr-2">
                          <FaUser className="h-4 w-4" />
                        </div>
                        <span>{payment.studentName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{payment.className}</p>
                        <p className="text-sm text-gray-500">
                          {payment.semester}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-primary-darker">
                      {formatCurrency(payment.amount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {payment.status === "PAID" && payment.paidDate
                          ? formatDate(payment.paidDate)
                          : formatDate(payment.dueDate)}
                        {payment.status === "PENDING" &&
                          new Date(payment.dueDate) < new Date() && (
                            <FaInfoCircle
                              className="ml-2 text-red-500"
                              title="Quá hạn"
                            />
                          )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}
                      >
                        {getStatusName(payment.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => handleViewDetails(payment)}
                          variant="outlined"
                          className="rounded-full w-8 h-8 p-0 min-w-0 flex items-center justify-center"
                        >
                          <FaEye className="h-4 w-4" />
                        </Button>
                        {payment.status === "PENDING" ? (
                          <Button
                            onClick={() => handlePayNow(payment)}
                            variant="primary"
                            className="rounded-full px-3 py-1 text-sm"
                          >
                            Thanh toán
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            className="rounded-full w-8 h-8 p-0 min-w-0 flex items-center justify-center"
                          >
                            <FaDownload
                              className="h-4 w-4"
                              title="Tải biên lai"
                            />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mt-4 flex justify-center">
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
          onPayNow={(payment) => {
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
