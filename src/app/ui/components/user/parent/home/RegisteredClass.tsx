"use client";
import { BsJournalBookmarkFill } from "react-icons/bs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../_common/Card";
import { Button } from "../../../_common/Button";

export default function RegisteredClass() {
  const registeredClasses = [
    {
      id: 1,
      name: "Toán nâng cao lớp 6",
      schedule: "Thứ 2 & Thứ 5, 17:00 - 18:30",
    },
    { id: 2, name: "Ngữ văn sáng tạo lớp 6", schedule: "Thứ 4, 19:00 - 20:30" },
    {
      id: 3,
      name: "Tiếng Anh giao tiếp lớp 6",
      schedule: "Thứ 7, 9:00 - 10:30",
    },
  ];
  return (
    <Card className="lg:col-span-2 bg-white border border-primary-light shadow-md h-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <CardTitle className="flex items-center text-xl text-primary-darkest">
            <BsJournalBookmarkFill className="mr-2 text-primary-dark" />
            Các lớp đã đăng ký
          </CardTitle>
          <CardDescription className="text-primary-dark text-sm">
            Danh sách các lớp học mà con bạn đã tham gia
          </CardDescription>
        </div>
        <Button
          variant="outlined"
          className="border-primary-dark text-primary-dark hover:bg-hover-primary text-sm"
        >
          Xem tất cả lớp
        </Button>
      </CardHeader>

      <CardContent className="grid sm:grid-cols-2 gap-4">
        {registeredClasses.map((cls) => (
          <div
            key={cls.id}
            className="border border-primary-light bg-primary-lighter p-4 rounded-xl hover:bg-hover-primary transition"
          >
            <div className="font-semibold text-primary-darkest mb-1">
              {cls.name}
            </div>
            <div className="text-sm text-gray-600">{cls.schedule}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
