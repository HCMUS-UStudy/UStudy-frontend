import { Card, CardContent } from "../../../_common/Card";
import { Button } from "../../../_common/Button";
import { MdOutlineNotificationsActive } from "react-icons/md";

export default function Notifications() {
  const notifications = [
    {
      id: 1,
      title: "Thông báo học phí tháng 5",
      date: "20/04/2025",
      content:
        "Kính gửi quý phụ huynh, trung tâm thông báo học phí tháng 5 sẽ được thu từ ngày 25/04 đến 05/05.",
    },
    {
      id: 2,
      title: "Lịch nghỉ lễ 30/4 - 1/5",
      date: "15/04/2025",
      content:
        "Trung tâm thông báo lịch nghỉ lễ 30/4 - 1/5 như sau: Các lớp sẽ nghỉ từ ngày 30/4 đến hết ngày 03/5.",
    },
    {
      id: 3,
      title: "Thông báo kiểm tra định kỳ",
      date: "10/04/2025",
      content:
        "Các em học sinh sẽ có bài kiểm tra định kỳ vào ngày 15/05, đề nghị phụ huynh nhắc nhở các em ôn tập.",
    },
  ];
  return (
    <Card className="bg-white border border-primary-light shadow-md h-full">
      <div className="flex items-center justify-between px-6 pt-6">
        <div className="flex items-center text-primary-darkest text-xl font-semibold">
          <MdOutlineNotificationsActive className="mr-2 text-highlight-text" />
          Thông báo
        </div>
        <Button
          variant="outlined"
          className="border-primary-dark text-primary-dark hover:bg-hover-primary px-3 py-1 text-sm"
        >
          Xem tất cả
        </Button>
      </div>
      <CardContent className="space-y-3 pt-4">
        {notifications.slice(0, 2).map((noti) => (
          <div
            key={noti.id}
            className="text-sm border border-primary-light bg-primary-lighter p-3 rounded-lg hover:bg-hover-primary transition"
          >
            <div className="font-medium text-primary-darkest mb-1">
              {noti.title}
            </div>
            <div className="text-xs text-gray-500 mb-1">Ngày: {noti.date}</div>
            <p className="line-clamp-2 text-gray-700">{noti.content}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
