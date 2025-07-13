"use client";
import { Button } from "@/app/ui/components/_common/Button";
import Tooltip from "@/app/ui/components/_common/Tooltip";
import { useState, useEffect } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import {
  getAvailableTime,
  registAvailableTime,
} from "@/app/lib/services/available-time";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCustomToast } from "@/app/lib/hooks/useToast";

const WEEK_DAYS = [
  { label: "Thứ 2", value: "MONDAY" },
  { label: "Thứ 3", value: "TUESDAY" },
  { label: "Thứ 4", value: "WEDNESDAY" },
  { label: "Thứ 5", value: "THURSDAY" },
  { label: "Thứ 6", value: "FRIDAY" },
  { label: "Thứ 7", value: "SATURDAY" },
  { label: "Chủ nhật", value: "SUNDAY" },
];

export default function AvailableTimePage() {
  const [dayTimes, setDayTimes] = useState([
    { day: "MONDAY", startTime: "07:00", endTime: "17:00" },
  ]);
  const [isEditing, setIsEditing] = useState(false);

  const { data, refetch } = useQuery({
    queryKey: ["available-time"],
    queryFn: async () => {
      return getAvailableTime();
    },
  });

  useEffect(() => {
    if (data && data.timeList) {
      const dayOrder = [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
        "SUNDAY",
      ];
      const sorted = [...data.timeList].sort((a, b) => {
        const dayDiff = dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day);
        if (dayDiff !== 0) return dayDiff;
        return a.startTime.localeCompare(b.startTime);
      });
      setDayTimes(sorted);
    }
  }, [data]);

  const handleChange = (idx: number, field: string, value: string) => {
    setDayTimes((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item)),
    );
  };

  const handleAdd = () => {
    setDayTimes((prev) => [
      ...prev,
      { day: "MONDAY", startTime: "07:00", endTime: "17:00" },
    ]);
  };

  const handleRemove = (idx: number) => {
    setDayTimes((prev) => prev.filter((_, i) => i !== idx));
  };

  // Sắp xếp lại các dòng theo thứ tự ngày trong tuần
  const handleSort = () => {
    const dayOrder = [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ];
    setDayTimes((prev) =>
      [...prev].sort(
        (a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day),
      ),
    );
  };

  const { addToast } = useCustomToast();
  const mutation = useMutation({
    mutationFn: async ({
      dayTimes,
    }: {
      dayTimes: { day: string; startTime: string; endTime: string }[];
    }) => {
      return registAvailableTime(dayTimes);
    },
    onSuccess: () => {
      addToast.success("Đăng ký thời gian rảnh thành công!");
    },
    onError: () => {
      addToast.error("Đăng ký thời gian rảnh thất bại!");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Check for duplicate day+time slots
    const slotKeys = dayTimes.map(
      (d) => `${d.day}-${d.startTime}-${d.endTime}`,
    );
    const hasDuplicateSlot = slotKeys.length !== new Set(slotKeys).size;
    if (hasDuplicateSlot) {
      addToast.error("Không được chọn trùng ngày và giờ!");
      return;
    }
    // Check startTime < endTime for all slots
    const hasInvalidTime = dayTimes.some(
      (item) => item.startTime >= item.endTime,
    );
    if (hasInvalidTime) {
      addToast.error("Giờ bắt đầu phải nhỏ hơn giờ kết thúc!");
      return;
    }
    const payload = {
      dayTimes,
    };
    mutation.mutate(payload, {
      onSuccess: () => {
        setIsEditing(false);
        refetch();
      },
    });
  };

  return (
    <div
      className="flex flex-col justify-center items-center max-w-lg
        rounded-lg shadow-lg bg-white mx-auto mt-6 p-6"
    >
      <h1 className="text-xl font-bold mb-1 text-primary-dark">
        Thời gian rảnh
      </h1>
      {/* Show lastModified if available */}
      {data?.lastModified && (
        <div className="text-sm text-gray-500 mb-5">
          <span>Cập nhật lần cuối: </span>
          {new Date(data.lastModified).toLocaleString("vi-VN")}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {dayTimes.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <select
              className="border border-primary-darker rounded px-2 py-[5px] mr-1 focus:outline-none focus:ring-1 focus:ring-primary-darker"
              value={item.day}
              onChange={(e) => handleChange(idx, "day", e.target.value)}
              disabled={!isEditing}
            >
              {WEEK_DAYS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
            <input
              type="time"
              className="border border-primary-darker rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-darker"
              value={item.startTime}
              onChange={(e) => handleChange(idx, "startTime", e.target.value)}
              disabled={!isEditing}
            />
            <span>-</span>
            <input
              type="time"
              className="border border-primary-darker rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary-darker"
              value={item.endTime}
              onChange={(e) => handleChange(idx, "endTime", e.target.value)}
              disabled={!isEditing}
            />
            {dayTimes.length > 1 && isEditing && (
              <Tooltip text="Xóa">
                <RiDeleteBinLine
                  className="text-red-500 hover:text-red-700 cursor-pointer"
                  size={20}
                  onClick={() => handleRemove(idx)}
                />
              </Tooltip>
            )}
          </div>
        ))}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center mx-5">
            {isEditing ? (
              <>
                <button
                  type="button"
                  className="text-primary-dark hover:text-primary-darkest"
                  onClick={handleAdd}
                >
                  + Thêm
                </button>
                <button
                  type="button"
                  className="text-primary-dark hover:text-primary-darkest"
                  onClick={handleSort}
                >
                  Sắp xếp
                </button>
              </>
            ) : null}
          </div>
        </div>
      </form>
      <div className="flex w-full mt-2 select-none">
        {isEditing ? (
          <div className="w-full flex justify-between items-center gap-3 mx-7">
            <Button
              className="w-full mt-1"
              type="button"
              onClick={() => {
                setIsEditing(false);
                setDayTimes(data?.timeList || []);
              }}
            >
              Hủy
            </Button>
            <Button className="w-full" type="submit" onClick={handleSubmit}>
              Lưu
            </Button>
          </div>
        ) : (
          <Button
            className="w-full mx-9"
            type="button"
            onClick={() => setIsEditing(true)}
          >
            Chỉnh sửa
          </Button>
        )}
      </div>
    </div>
  );
}
