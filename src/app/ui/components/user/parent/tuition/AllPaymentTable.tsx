import React from "react";
import { FaUser, FaEye, FaInfoCircle } from "react-icons/fa";
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
            const student = payment.student;
            const classDto = payment.classDto;
            const dueDate = payment.expiredDate || payment.paymentDate;
            const today = new Date();
            const dueDateObj = new Date(dueDate);

            // Reset time to start of day for accurate comparison
            today.setHours(0, 0, 0, 0);
            dueDateObj.setHours(0, 0, 0, 0);

            const isOverdue =
              payment.status === "PENDING" && dueDateObj < today;

            return (
              <TableRow key={payment.invoiceId}>
                <TableCell>{payment.invoiceId}</TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <FaUser className="h-4 w-4" />
                    <span>{student.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{classDto.name}</p>
                    <p className="text-sm text-gray-500">
                      {classDto.course.name} - {classDto.grade.name}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="font-medium text-primary-darker">
                  {formatCurrency(payment.amount)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-left">
                    {payment.status === "PENDING" ? (
                      <div>
                        <div className="text-sm text-gray-600">
                          Hạn thanh toán:{" "}
                          {formatDate(
                            payment.expiredDate || payment.paymentDate,
                          )}
                        </div>
                        {isOverdue && (
                          <div className="text-xs text-red-500 flex items-center mt-1">
                            <FaInfoCircle className="mr-1" />
                            Quá hạn
                          </div>
                        )}
                      </div>
                    ) : (
                      formatDate(payment.paymentDate)
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
                  <div className="flex items-left justify-left space-x-2">
                    <Button
                      onClick={() => onViewDetails(payment)}
                      variant="outlined"
                      className="rounded-full p-0 min-w-0 flex"
                    >
                      <FaEye className="size-4" />
                    </Button>
                    {payment.status === "PENDING" && !isOverdue && (
                      <Button
                        onClick={() => onPayNow?.(payment)}
                        variant="primary"
                        className="rounded-full px-3 py-1 text-sm"
                      >
                        Thanh toán
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
