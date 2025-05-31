import { PaymentItem } from "@/app/types";
import { FaUser, FaInfoCircle, FaEye } from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../../_common/Table";
import { Button } from "../../../_common/Button";
import Tooltip from "../../../_common/Tooltip";

interface Props {
  filteredPendingPayments: PaymentItem[];
  formatCurrency: (amount: number) => string;
  formatDate: (date: string | Date) => string;
  getStatusName: (status: string) => string;
  getStatusColor: (status: string) => string;
  handleViewDetails: (payment: PaymentItem) => void;
  handlePayNow: (payment: PaymentItem) => void;
}

export default function PendingPaymentsTable({
  filteredPendingPayments,
  formatCurrency,
  formatDate,
  getStatusName,
  getStatusColor,
  handleViewDetails,
  handlePayNow,
}: Props) {
  if (filteredPendingPayments.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-lg shadow-md mt-4">
        <p className="text-gray-500">
          Không có khoản thanh toán nào đang chờ xử lý.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 mt-4">
      <Table>
        <TableHeader
          columns={[
            "Thời gian học", // Đổi từ "Mã hóa đơn"
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
            <TableRow key={payment.invoiceId}>
              <TableCell>
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-primary-lighter text-primary-dark flex items-center justify-center mr-2">
                    <FaUser className="h-4 w-4" />
                  </div>
                  <span>{payment.student.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{payment.enrolledClass.name}</p>
                  <p className="text-sm text-gray-500">
                    {payment.enrolledClass.course.name}
                  </p>
                </div>
              </TableCell>
              <TableCell className="font-medium text-primary-darker">
                {formatCurrency(payment.amount)}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center">
                  {formatDate(payment.paymentDate)}
                  {new Date(payment.paymentDate) < new Date() && (
                    <Tooltip text="Quá hạn">
                      <FaInfoCircle className="ml-2 text-red-500" />
                    </Tooltip>
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
                  <Tooltip text="Xem chi tiết">
                    <Button
                      variant="outlined"
                      onClick={() => handleViewDetails(payment)}
                    >
                      <FaEye className="size-4" />
                    </Button>
                  </Tooltip>

                  <Button
                    onClick={() => handlePayNow(payment)}
                    variant="primary"
                    className=""
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
  );
}
