"use client";
import { Card, CardContent } from "../../../_common/Card";
import { Button } from "../../../_common/Button";

export default function Events() {
  const upcomingEvents = [
    {
      id: 1,
      title: "Kiểm tra 45 phút môn Toán",
      date: "25/04/2025",
      time: "17:30 - 19:00",
    },
    {
      id: 2,
      title: "Họp phụ huynh học kỳ 2",
      date: "28/04/2025",
      time: "19:30 - 21:00",
    },
    {
      id: 3,
      title: "Bài kiểm tra cuối kỳ môn Lý",
      date: "10/05/2025",
      time: "17:30 - 19:00",
    },
  ];
  return (
    <Card className="bg-white border border-primary-light shadow-md h-full">
      <div className="flex items-center justify-between px-6 pt-6">
        <div className="text-primary-darkest text-xl font-semibold flex items-center">
          📅 Sự kiện
        </div>
        <Button
          variant="outlined"
          className="border-primary-dark text-primary-dark hover:bg-hover-primary px-3 py-1 text-sm"
        >
          Xem tất cả
        </Button>
      </div>
      <CardContent className="space-y-3 pt-4">
        {upcomingEvents.slice(0, 2).map((event) => (
          <div
            key={event.id}
            className="text-sm border border-primary-light bg-primary-lighter p-3 rounded-lg hover:bg-hover-primary transition"
          >
            <div className="font-medium text-primary-darkest mb-1">
              {event.title}
            </div>
            <div className="flex justify-between text-xs text-gray-600">
              <span>Ngày: {event.date}</span>
              <span>Giờ: {event.time}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
