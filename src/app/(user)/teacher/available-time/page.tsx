"use client";
import { Button } from "@/app/ui/components/_common/Button";
import Tooltip from "@/app/ui/components/_common/Tooltip";
import { useState, useEffect } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { registAvailableTime } from "@/app/lib/services/available-time";
import { getUserDataFromCookies } from "@/app/lib/action";
import { UserData } from "@/app/types";
import { useMutation } from "@tanstack/react-query";
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
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserDataFromCookies();
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const [dayTimes, setDayTimes] = useState([
    { day: "MONDAY", startTime: "07:00", endTime: "17:00" },
  ]);

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
      userId,
      dayTimes,
    }: {
      userId: string;
      dayTimes: { day: string; startTime: string; endTime: string }[];
    }) => {
      return registAvailableTime(userId, dayTimes);
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
    const days = dayTimes.map((d) => d.day);
    const hasDuplicate = days.length !== new Set(days).size;
    if (hasDuplicate) {
      addToast.error("Không được chọn trùng ngày!");
      return;
    }
    const payload = {
      userId: userData?.genId || "",
      dayTimes,
    };
    mutation.mutate(payload);
  };

  return (
    <div
      className="flex flex-col justify-center items-center max-w-lg
        rounded-lg shadow-lg bg-white mx-auto mt-8 p-6"
    >
      <h1 className="text-xl font-bold mb-4 text-primary-dark">
        Đăng ký thời gian rảnh
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {dayTimes.map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <select
              className="border border-primary-darker rounded px-2 py-1
                focus:outline-none focus:ring-1 focus:ring-primary-darker"
              value={item.day}
              onChange={(e) => handleChange(idx, "day", e.target.value)}
            >
              {WEEK_DAYS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
            <input
              type="time"
              className="border border-primary-darker rounded px-2 py-1
                focus:outline-none focus:ring-1 focus:ring-primary-darker"
              value={item.startTime}
              onChange={(e) => handleChange(idx, "startTime", e.target.value)}
            />
            <span>-</span>
            <input
              type="time"
              className="border border-primary-darker rounded px-2 py-1
                focus:outline-none focus:ring-1 focus:ring-primary-darker"
              value={item.endTime}
              onChange={(e) => handleChange(idx, "endTime", e.target.value)}
            />
            {dayTimes.length > 1 && (
              <Tooltip text="Xóa">
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 cursor-pointer
                    disable-opacity-50"
                  onClick={() => handleRemove(idx)}
                  title="Xóa dòng này"
                >
                  <RiDeleteBinLine size={20} />
                </button>
              </Tooltip>
            )}
          </div>
        ))}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center mx-5">
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
          </div>
          <Button type="submit">Lưu</Button>
        </div>
      </form>
    </div>
  );
}
