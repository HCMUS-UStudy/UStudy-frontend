import React, { useEffect, useState } from "react";
import { TimeItem } from "@/app/types/type";
import { FaCheck } from "react-icons/fa6";

export default function FixedScheduleSelector() {
  const daysInWeek = new Map<number, string>([
    [1, "Thứ hai"],
    [2, "Thứ ba"],
    [3, "Thứ tư"],
    [4, "Thứ năm"],
    [5, "Thứ sáu"],
    [6, "Thứ bảy"],
    [7, "Chủ nhật"],
  ]);
  const [selectedDays, setSelectedDays] = useState<TimeItem[]>([]);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [err, setErr] = useState<string>("");
  const handleCheckbox = (key: number) => {
    setSelectedDays((days) => {
      const isSelected = days.some((item) => item.day === key);
      if (isSelected) {
        return days.filter((item) => item.day !== key);
      } else {
        return [
          ...days,
          {
            day: key,
            startTime: "",
            endTime: "",
          },
        ];
      }
    });
  };
  useEffect(() => {
    if (selectedDays.length === 0 || startTime === "" || endTime === "") {
      return;
    }
    if (startTime >= endTime) {
      setErr("Giờ bắt đầu phải sớm hơn giờ kết thúc");
      return;
    }
    setErr("");
    const updatedDays = selectedDays.map((day) => {
      return {
        ...day,
        startTime: startTime,
        endTime: endTime,
      };
    });
    console.log(updatedDays);
  }, [selectedDays, startTime, endTime]);
  return (
    <div className="flex flex-col">
      <h1 className="font-bold">Thành lập thời khóa biểu cố định</h1>
      <div className="mt-2">
        <div className="flex flex-wrap gap-4">
          {Array.from(daysInWeek.entries()).map(([key, value]) => (
            <label
              key={key}
              htmlFor={value}
              className="relative py-6 shrink-0 grow-0 has-[:checked]:border-primary-darker flex items-center justify-center h-20 w-20 border-2 border-slate-200
               text-md rounded hover:border-primary-darkest hover:text-primary-darkest hover:bg-primary cursor-pointer transition-all"
            >
              <input
                type="checkbox"
                className="hidden peer"
                id={value}
                onChange={() => handleCheckbox(key)}
              />
              <span className="peer-checked:text-primary-darkest text-black text-sm peer-checked:font-bold transition-all">
                {value}
              </span>
              <FaCheck className="size-16 absolute text-primary-darkest opacity-0 peer-checked:opacity-10 transition-all" />
            </label>
          ))}
        </div>
        <div className="flex gap-5 mt-5">
          <div className="flex gap-2 items-center">
            <label
              htmlFor="startTime"
              className="after:content-['*'] after:text-red-500"
            >
              Giờ bắt đầu:{" "}
            </label>
            <input
              type="time"
              id="startTime"
              className="border-2 w-fit border-slate-200 px-2 py-1 rounded outline-none cursor-pointer"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </div>
          <div className="flex gap-2 items-center">
            <label
              htmlFor="endTime"
              className="after:content-['*'] after:text-red-500"
            >
              Giờ kết thúc:{" "}
            </label>
            <input
              type="time"
              id="endTime"
              className="border-2 w-fit border-slate-200 px-2 py-1 rounded outline-none cursor-pointer"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </div>
        </div>
        <div className="text-error mt-2">{err}</div>
      </div>
    </div>
  );
}
