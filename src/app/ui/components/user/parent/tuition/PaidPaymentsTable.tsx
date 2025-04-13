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
import { FaUser, FaEye, FaDownload } from "react-icons/fa";
import Pagination from "../../../_common/Pagination";
import { TuitionPayment } from "@/app/types";

interface PaidPaymentsTableProps {
  data: TuitionPayment[];
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onViewDetails: (payment: TuitionPayment) => void;
  formatCurrency: (amount: number) => string;
  formatDate: (date: string | Date) => string;
  getStatusName: (status: string) => string;
  getStatusColor: (status: string) => string;
}

const PaidPaymentsTable: React.FC<PaidPaymentsTableProps> = ({
  data,
  currentPage,
  totalPages,
  onPageChange,
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
                "Ngày thanh toán",
                "Trạng thái",
                "Thao tác",
              ]}
              className="bg-primary-lighter text-gray-700"
            />
            <TableBody>
              {data.map((payment) => (
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
                    <div className="flex items-center justify-center space-x-2">
                      <Button
                        onClick={() => onViewDetails(payment)}
                        variant="outlined"
                        className="rounded-full w-8 h-8 p-0 min-w-0 flex items-center justify-center"
                      >
                        <FaEye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outlined"
                        className="rounded-full w-8 h-8 p-0 min-w-0 flex items-center justify-center"
                      >
                        <FaDownload className="h-4 w-4" title="Tải biên lai" />
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

      <div className="mt-4 flex justify-end">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          handlePageClick={(page) => onPageChange(page)}
          handlePreviousPage={() => onPageChange(Math.max(currentPage - 1, 1))}
          handleNextPage={() =>
            onPageChange(Math.min(currentPage + 1, totalPages))
          }
        />
      </div>
    </>
  );
};

export default PaidPaymentsTable;
