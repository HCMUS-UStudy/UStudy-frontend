import React, { useState } from "react";
import { useSlider } from "../../slider";
import { FaCircle } from "react-icons/fa6";
import clsx from "clsx";
import { TimeItem } from "@/app/types/type";
import { useCreateClassContext } from "./createClassContent";

export default function FlexibleScheduleSelector() {
  const context = useSlider();
  const { setNewClass } = useCreateClassContext();
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

  const handleNextStep = () => {
    if (selectedDays.length === 0) {
      setErr("Vui lòng chọn ít nhất một ngày học");
      return;
    }
    setErr("");
    console.log(selectedDays);
    setNewClass((currentClass) => ({
      ...currentClass,
      classTimes: selectedDays,
    }));
    context.nextStep();
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-center font-medium text-lg">
        Thành lập thời khóa biểu linh hoạt
      </h1>
      <div className="grid grid-cols-3 divide-x-2 divide-slate-200 mt-4">
        <div className="col-span-2 px-10">
          <div className="flex flex-wrap gap-4">
            {Array.from(daysInWeek.entries()).map(([key, value]) => {
              const selectedTimes = selectedDays.find(
                (item) => item.day === key,
              );
              return (
                <label
                  key={key}
                  htmlFor={value}
                  className={clsx(
                    selectedDay !== null &&
                      selectedDay === key &&
                      "border-blue-400",

                    "relative overflow-hidden px-4 py-6 h-24 w-24 flex items-center justify-center shrink-0 border-2 border-slate-200 rounded has-[:disabled]:cursor-not-allowed has-[:disabled]:hover:border-slate-200 hover:border-blue-400 hover:bg-blue-100 transition-all cursor-pointer",
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
                      selectedTimes && "border-b-4 border-blue-600",
                      "absolute inset-0 flex items-center justify-center text-black transition-all text-sm peer-disabled:bg-slate-300 ",
                    )}
                  >
                    {selectedTimes ? (
                      <span className="flex flex-col items-center font-bold">
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
                      "absolute inset-0 flex flex-col items-center justify-center gap-2 transition-all text-sm",
                    )}
                  >
                    <span className="text-blue-600">Chọn giờ học</span>
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
          <div className="flex justify-between gap-5 mt-5 text-sm">
            <div className="flex gap-1.5">
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
            <span className="flex gap-0.5">
              <button
                className={clsx(
                  selectedDay === null
                    ? "bg-slate-300"
                    : "bg-blue-600 hover:bg-blue-800",
                  "text-white  px-3 py-1 text-sm rounded-l  transition-colors justify-end",
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
        <div className="flex flex-col gap-2 px-3">
          <button
            onClick={handleNextStep}
            type="button"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-800 transition-colors text-white text-sm rounded"
          >
            Tiếp theo
          </button>
          <button
            onClick={context.prevStep}
            type="button"
            className="px-6 py-3 bg-slate-400 hover:bg-slate-500 transition-colors text-white text-sm rounded"
          >
            Trở lại
          </button>
          <span className="text-sm text-red-500">{err}</span>
        </div>
      </div>
    </div>
  );
}
