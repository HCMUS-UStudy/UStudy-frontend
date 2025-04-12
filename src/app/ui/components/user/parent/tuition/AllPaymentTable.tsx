import React from "react";
import { FaUser, FaEye, FaDownload, FaInfoCircle } from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../_common/Table";
import { Button } from "../../../_common/Button";
import { TuitionPayment } from "@/app/types";

interface AllPaymentTableProps {
  payments: TuitionPayment[];
  onViewDetails: (payment: TuitionPayment) => void;
  onPayNow?: (payment: TuitionPayment) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string | Date) => string;
  getStatusName: (status: string) => string;
  getStatusColor: (status: string) => string;
}

const AllPaymentTable: React.FC<AllPaymentTableProps> = ({
  payments,
  onViewDetails,
  onPayNow,
  formatCurrency,
  formatDate,
  getStatusName,
  getStatusColor,
}) => {
  return (
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
          {payments.map((payment) => (
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
                  <p className="text-sm text-gray-500">{payment.semester}</p>
                </div>
              </TableCell>
              <TableCell className="font-medium text-primary-darker">
                {formatCurrency(payment.amount)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  {payment.status === "PAID" && payment.paidDate
                    ? formatDate(payment.paidDate)
                    : formatDate(payment.dueDate)}
                  {payment.status === "PENDING" &&
                    new Date(payment.dueDate!) < new Date() && (
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
                <div className="flex items-center justify-center space-x-2">
                  <Button
                    onClick={() => onViewDetails(payment)}
                    variant="outlined"
                    className="rounded-full w-8 h-8 p-0 min-w-0 flex items-center justify-center"
                  >
                    <FaEye className="h-4 w-4" />
                  </Button>
                  {payment.status === "PENDING" ? (
                    <Button
                      onClick={() => onPayNow?.(payment)}
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
                      <FaDownload className="h-4 w-4" title="Tải biên lai" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AllPaymentTable;
