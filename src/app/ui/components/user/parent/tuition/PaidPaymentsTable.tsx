// components/PaidPaymentsTable.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../_common/Table";
import { Button } from "../../../_common/Button";
import { FaUser, FaEye } from "react-icons/fa";
import { PaymentItem } from "@/app/types";

interface PaidPaymentsTableProps {
  data: PaymentItem[];
  onViewDetails: (payment: PaymentItem) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string | Date) => string;
  getStatusName: (status: string) => string;
  getStatusColor: (status: string) => string;
}

const PaidPaymentsTable: React.FC<PaidPaymentsTableProps> = ({
  data,
  onViewDetails,
  formatCurrency,
  formatDate,
  getStatusName,
  getStatusColor,
}) => {
  return (
    <>
      {data.length > 0 ? (
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
              {data.map((payment) => (
                <TableRow key={payment.invoiceId}>
                  <TableCell>{payment.invoiceId}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <FaUser className="h-4 w-4" />
                      <span>{payment.student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{payment.classDto.name}</p>
                      <p className="text-sm text-gray-500">
                        {payment.classDto.course.name} -{" "}
                        {payment.classDto.grade.name}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-primary-darker">
                    {formatCurrency(payment.amount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-left">
                      {payment.paymentDate && formatDate(payment.paymentDate)}
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
                    <div className="flex items-left justify-left space-x-2">
                      <Button
                        onClick={() => onViewDetails(payment)}
                        variant="outlined"
                        className="rounded-full p-0 min-w-0 flex"
                      >
                        <FaEye className="size-4" />
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
    </>
  );
};

export default PaidPaymentsTable;
