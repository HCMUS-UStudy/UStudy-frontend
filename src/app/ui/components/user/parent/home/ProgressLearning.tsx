import { BsPersonWorkspace } from "react-icons/bs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../_common/Card";
import { Button } from "../../../_common/Button";

export default function ProgressLearning() {
  const childrenProgress = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      grade: "Lớp 10",
      subject: "Toán",
      attendance: "90",
      performance: "Khá",
    },
    {
      id: 2,
      name: "Nguyễn Văn A",
      grade: "Lớp 10",
      subject: "Lý",
      attendance: "55",
      performance: "Giỏi",
    },
    {
      id: 3,
      name: "Nguyễn Văn A",
      grade: "Lớp 10",
      subject: "Hóa",
      attendance: "95",
      performance: "Khá",
    },
  ];

  return (
    <Card className="lg:col-span-2 bg-white border border-primary-light shadow-md h-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <CardTitle className="flex items-center text-xl text-primary-darkest">
            <BsPersonWorkspace className="mr-2 text-primary-dark" />
            Tiến độ học tập của con
          </CardTitle>
          <CardDescription className="text-primary-dark text-sm">
            Tổng quan tình hình học tập của học sinh
          </CardDescription>
        </div>
        <Button
          variant="outlined"
          className="border-primary-dark text-primary-dark hover:bg-hover-primary text-sm"
        >
          Xem chi tiết
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 gap-4">
          {childrenProgress.map((child) => (
            <div
              key={child.id}
              className="border-primary-light bg-primary-lighter hover:bg-hover-primary p-4 rounded-xl shadow-sm transition"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-primary-darkest">
                  {child.subject}
                </span>
                <span
                  className={`text-sm font-bold ${
                    child.performance === "Giỏi"
                      ? "text-green-600"
                      : child.performance === "Khá"
                        ? "text-blue-600"
                        : "text-yellow-600"
                  }`}
                >
                  {child.performance}
                </span>
              </div>
              <div className="text-sm text-gray-500 flex items-center gap-2 justify-between">
                <span>Điểm danh</span>
                <div className="relative group w-full max-w-[180px] h-2 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-2 bg-primary-dark rounded-full transition-all duration-300"
                    style={{ width: `${child.attendance}%` }}
                  />
                  <span className="absolute left-1/2 -translate-x-1/2 -top-6 text-xs text-primary-darkest bg-white border border-primary-light rounded px-2 py-0.5 opacity-0 group-hover:opacity-100 transition">
                    {child.attendance}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
