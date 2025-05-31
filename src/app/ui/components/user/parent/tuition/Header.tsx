import { Card, CardContent } from "../../../_common/Card";
import { PaymentItem } from "@/app/types";
import { TbCoin } from "react-icons/tb";
import { MdCreditCard, MdReceipt } from "react-icons/md";

interface HeaderProps {
  pendingPayments: PaymentItem[];
  paidPayments: PaymentItem[];
  formatCurrency: (amount: number) => string;
}

export default function Header({
  pendingPayments,
  paidPayments,
  formatCurrency,
}: HeaderProps) {
  const calculateTotals = () => {
    const totalPending = pendingPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0,
    );
    const totalPaid = paidPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0,
    );

    const totalAmount = totalPending + totalPaid;

    return { totalAmount, totalPaid, totalPending };
  };

  const { totalAmount, totalPaid, totalPending } = calculateTotals();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
      </div>
    </>
  );
}
