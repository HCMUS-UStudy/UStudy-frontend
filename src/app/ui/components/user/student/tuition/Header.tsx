import { FaFileInvoiceDollar } from "react-icons/fa6";
import { Card, CardContent } from "../../../_common/Card";
import { Button } from "../../../_common/Button";
import { FaCalendarAlt, FaHistory } from "react-icons/fa";
import { TuitionPayment } from "@/app/types";

interface HeaderProps {
  pendingPayments: TuitionPayment[];
  paidPayments: TuitionPayment[];
  handlePayNow: (payment: TuitionPayment) => void;
}

export default function Header({
  pendingPayments,
  paidPayments,
  handlePayNow,
}: HeaderProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN").format(date);
  };

  const totalPendingAmount = pendingPayments.reduce(
    (sum, payment) => sum + payment.amount,
    0,
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-primary-lighter to-primary-light border-none shadow-md">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                Tổng học phí chờ thanh toán
              </p>
              <p className="text-2xl font-bold text-primary-darker">
                {formatCurrency(totalPendingAmount)}
              </p>
            </div>
            <div className="p-3 bg-white bg-opacity-30 rounded-full">
              <FaFileInvoiceDollar className="h-6 w-6 text-primary-darkest" />
            </div>
          </div>
          <div className="mt-4">
            <Button
              variant="primary"
              className="w-full"
              onClick={() =>
                pendingPayments.length > 0 && handlePayNow(pendingPayments[0])
              }
              disabled={pendingPayments.length === 0}
            >
              Thanh toán ngay
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md border-primary-light">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600 mb-1">Kỳ học hiện tại</p>
              <p className="text-xl font-bold text-gray-800">
                Học kỳ 1 năm học 2025-2026
              </p>
            </div>
            <div className="p-3 bg-primary-lighter rounded-full">
              <FaCalendarAlt className="h-6 w-6 text-primary-dark" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Thời gian: 04/2025 - 08/2025
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md border-primary-light">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600 mb-1">Lịch sử thanh toán</p>
              <p className="text-xl font-bold text-gray-800">
                {paidPayments.length} giao dịch
              </p>
            </div>
            <div className="p-3 bg-primary-lighter rounded-full">
              <FaHistory className="h-6 w-6 text-primary-dark" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Cập nhật lần cuối: {formatDate(new Date().toISOString())}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
