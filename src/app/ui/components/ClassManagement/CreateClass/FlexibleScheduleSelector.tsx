import React, { useState } from "react";
import { FaCircle } from "react-icons/fa6";
import clsx from "clsx";
import { TimeItem } from "@/app/types/type";

export default function FlexibleScheduleSelector() {
  const daysInWeek = new Map<number, string>([
    [1, "Thứ hai"],
    [2, "Thứ ba"],
    [3, "Thứ tư"],
    [4, "Thứ năm"],
    [5, "Thứ sáu"],
    [6, "Thứ bảy"],
    [7, "Chủ nhật"],
  ]);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedDays, setSelectedDays] = useState<TimeItem[]>([]);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [err, setErr] = useState<string>("");
  const handleCheckbox = (day: number) => {
    setSelectedDay(selectedDay === null ? day : null);
    setStartTime("");
    setEndTime("");
    setErr("");
  };
  const handleAddBtn = () => {
    if (startTime === "" || endTime === "") {
      setErr("Vui lòng chọn đầy đủ giờ học");
      return;
    }
    if (startTime >= endTime) {
      setErr("Giờ bắt đầu phải sớm hơn giờ kết thúc");
      return;
    }
    if (selectedDay === null) {
      setErr("Vui lòng chọn thứ trước khi chọn giờ"); // ko xảy ra
      return;
    }
    setErr("");
    setSelectedDays((days) => {
      const existingDay = days.findIndex((item) => item.day === selectedDay);
      if (existingDay !== -1) {
        const updatedDays = [...days];
        updatedDays[existingDay] = {
          ...updatedDays[existingDay],
          startTime: startTime,
          endTime: endTime,
        };
        return updatedDays;
      } else {
        console.log(startTime);
        console.log(endTime);
        return [
          ...days,
          {
            day: selectedDay,
            startTime: startTime,
            endTime: endTime,
          },
        ];
      }
    });
    setSelectedDay(null);
  };

  const handleDeleteDay = () => {
    if (selectedDay !== null) {
      setSelectedDays((days) =>
        days.filter((item) => item.day !== selectedDay),
      );
      setSelectedDay(null);
    }
  };

  // const handleNextStep = () => {
  //   if (selectedDays.length === 0) {
  //     setErr("Vui lòng chọn ít nhất một ngày học");
  //     return;
  //   }
  //   setErr("");
  //   console.log(selectedDays);
  //   // setNewClass((currentClass) => ({
  //   //   ...currentClass,
  //   //   classTimes: selectedDays,
  //   // }));
  //   // context.nextStep();
  // };

  return (
    <div className="flex flex-col">
      <h1 className="font-bold">Thành lập thời khóa biểu linh hoạt</h1>
      <div className="mt-2 w-2/3">
        <div className="flex flex-wrap gap-4">
          {Array.from(daysInWeek.entries()).map(([key, value]) => {
            const selectedTimes = selectedDays.find((item) => item.day === key);
            return (
              <label
                key={key}
                htmlFor={value}
                className={clsx(
                  selectedDay !== null &&
                    selectedDay === key &&
                    "border-blue-400",

                  "relative overflow-hidden px-4 py-6 h-20 w-20 flex items-center justify-center shrink-0 border-2 border-slate-200 rounded has-[:disabled]:cursor-not-allowed has-[:disabled]:hover:border-slate-200 hover:border-primary-darkest hover:text-primary-darkest hover:bg-primary transition-all cursor-pointer",
                )}
              >
                <input
                  type="checkbox"
                  className="hidden peer"
                  id={value}
                  onChange={() => handleCheckbox(key)}
                  disabled={key !== selectedDay && selectedDay !== null}
                />
                <span
                  className={clsx(
                    selectedDay === null || selectedDay !== key
                      ? "translate-y-0"
                      : "translate-y-full",
                    selectedTimes && "border-b-4 border-primary-darkest",
                    "absolute inset-0 flex items-center justify-center text-black transition-all text-sm peer-disabled:bg-slate-300 ",
                  )}
                >
                  {selectedTimes ? (
                    <span className="flex flex-col items-center font-bold text-xs text-center">
                      <span>{value}</span>{" "}
                      <span>
                        {selectedTimes.startTime} - {selectedTimes.endTime}
                      </span>
                    </span>
                  ) : (
                    <span>{value}</span>
                  )}
                </span>
                <span
                  className={clsx(
                    selectedDay === null || selectedDay !== key
                      ? "-translate-y-full"
                      : "translate-y-0",
                    "absolute inset-0 flex flex-col items-center justify-center gap-2 transition-all text-sm border border-primary-darkest",
                  )}
                >
                  <span className="text-primary-darkest">Chọn giờ</span>
                  <div className="flex gap-1">
                    <FaCircle className="size-2  animate-color-change-1" />
                    <FaCircle className="size-2  animate-color-change-2" />
                    <FaCircle className="size-2  animate-color-change-3" />
                  </div>
                </span>
              </label>
            );
          })}
        </div>
        <div className="flex gap-5 mt-5">
          <div className="flex gap-5">
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
                className="border-2 w-fit border-slate-200 px-2 py-1 rounded outline-none cursor-pointer focus:border-blue-600"
                // ref={startTimeRef}
                disabled={selectedDay === null}
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
                className="border-2 w-fit border-slate-200 px-2 py-1 rounded outline-none cursor-pointer focus:border-blue-600"
                // ref={endTimeRef}
                disabled={selectedDay === null}
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
          </div>
          <span className="flex flex-1 gap-1">
            <button
              type="button"
              className={clsx(
                selectedDay === null
                  ? "bg-slate-300"
                  : "bg-primary hover:bg-hover-primary",
                "text-black  px-4 py-2 text-sm rounded-l  transition-colors justify-end",
              )}
              disabled={selectedDay === null}
              onClick={handleAddBtn}
            >
              Thêm
            </button>
            <button
              className={clsx(
                selectedDay === null
                  ? "bg-slate-300 text-white border-transparent"
                  : "bg-white hover:bg-red-200  border-red-500 text-red-500",
                "border-2  px-3 py-1 text-sm rounded-r transition-colors justify-end",
              )}
              disabled={selectedDay === null}
              onClick={handleDeleteDay}
            >
              Xóa
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}
