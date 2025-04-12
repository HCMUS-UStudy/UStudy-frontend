import { HiOutlineDocumentText } from "react-icons/hi";
import { Button } from "../../../_common/Button";
import { MdPayment } from "react-icons/md";
import { TuitionPayment } from "@/app/types";

interface AllPaymentsListProps {
  payments: TuitionPayment[];
  formatCurrency: (amount: number) => string;
  formatDate: (date: string) => string;
  getStatusColor: (status: string) => string;
  getStatusName: (status: string) => string;
  handleOpenDetails: (payment: TuitionPayment) => void;
  handlePayNow: (payment: TuitionPayment) => void;
}

export default function AllPaymentsList({
  payments,
  formatCurrency,
  formatDate,
  getStatusColor,
  getStatusName,
  handleOpenDetails,
  handlePayNow,
}: AllPaymentsListProps) {
  if (payments.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-gray-500 text-lg">Không có dữ liệu học phí.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {payments.map((payment) => (
        <div
          key={payment.id}
          className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
            <div>
              <h3 className="font-medium text-gray-900">{payment.className}</h3>
              <p className="text-sm text-gray-500">{payment.invoiceNumber}</p>
            </div>
            <div className="mt-2 sm:mt-0">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  payment.status,
                )}`}
              >
                {getStatusName(payment.status)}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <p className="text-lg font-bold text-highlight-text">
                {formatCurrency(payment.amount)}
              </p>
              <p className="text-sm text-gray-500">
                {payment.status === "PAID"
                  ? `Đã thanh toán: ${payment.paidDate && formatDate(payment.paidDate)}`
                  : `Hạn thanh toán: ${formatDate(payment.dueDate)}`}
              </p>
            </div>

            <div className="flex space-x-2 mt-3 sm:mt-0">
              <Button
                variant="outlined"
                onClick={() => handleOpenDetails(payment)}
                className="text-sm px-3 py-2 flex items-center gap-1 text-gray-600 hover:bg-gray-100 rounded-md transition"
              >
                <HiOutlineDocumentText className="text-lg" />
                <span>Chi tiết</span>
              </Button>

              {payment.status === "PENDING" && (
                <Button
                  variant="primary"
                  onClick={() => handlePayNow(payment)}
                  className="text-sm px-3 py-2 flex items-center gap-1 text-white bg-primary hover:bg-primary-dark rounded-md transition"
                >
                  <MdPayment className="text-lg" />
                  <span>Thanh toán</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
