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
import { PaymentItem } from "@/app/types";

interface AllPaymentTableProps {
  payments: PaymentItem[];
  onViewDetails: (payment: PaymentItem) => void;
  onPayNow?: (payment: PaymentItem) => void;
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
          {payments.map((payment) => {
            const student = payment.paymentPeriodDto.student;
            const enrolledClass = payment.paymentPeriodDto.enrolledClass;
            const semester = `${formatDate(payment.paymentPeriodDto.startDate)} - ${formatDate(payment.paymentPeriodDto.endDate)}`;
            const dueDate = payment.paymentDate;
            const isOverdue =
              payment.status === "PENDING" && new Date(dueDate) < new Date();

            return (
              <TableRow key={payment.invoiceId}>
                <TableCell>{payment.invoiceId}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-primary-lighter text-primary-dark flex items-center justify-center mr-2">
                      <FaUser className="h-4 w-4" />
                    </div>
                    <span>{student.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{enrolledClass.name}</p>
                    <p className="text-sm text-gray-500">{semester}</p>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-primary-darker">
                  {formatCurrency(payment.paymentPeriodDto.amount)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center">
                    {payment.status === "COMPLETED"
                      ? formatDate(payment.paymentDate)
                      : formatDate(payment.paymentDate)}
                    {isOverdue && (
                      <FaInfoCircle
                        className="ml-2 text-red-500"
                        title="Quá hạn"
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      payment.status,
                    )}`}
                  >
                    {getStatusName(payment.status)}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center space-x-2">
                    <Button onClick={() => onViewDetails(payment)}>
                      <FaEye className="size-5 text-primary hover:text-primary-darkest" />
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
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default AllPaymentTable;
