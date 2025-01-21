import React, { useState } from "react";
import { useSlider } from "../../slider";
import { useCreateClassContext } from "./createClassContent";
import { TimeItem } from "@/app/types/type";
import { FaCheck } from "react-icons/fa6";

export default function FixedScheduleSelector() {
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
  const [selectedDays, setSelectedDays] = useState<TimeItem[]>([]);
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
  const [err, setErr] = useState<string>("");
  const handleNextStep = () => {
    // console.log('here');
    const startTime = document.getElementById("startTime") as HTMLInputElement;
    const endTime = document.getElementById("endTime") as HTMLInputElement;
    console.log(startTime.value || "");
    console.log(endTime.value || "");
    if (
      startTime.value === "" ||
      endTime.value === "" ||
      selectedDays.length === 0
    ) {
      setErr("Vui lòng chọn đầy đủ ngày và giờ học");
      return;
    }
    if (startTime.value >= endTime.value) {
      setErr("Giờ bắt đầu phải sớm hơn giờ kết thúc");
      return;
    }
    setErr("");

    const updatedDays = selectedDays.map((day) => {
      return {
        ...day,
        startTime: startTime.value,
        endTime: endTime.value,
      };
    });
    console.log(updatedDays);
    setNewClass((currentClass) => ({
      ...currentClass,
      classTimes: updatedDays,
    }));
    context.nextStep();
  };
  return (
    <div className="flex flex-col">
      <h1 className="text-center font-medium text-lg">
        Thành lập thời khóa biểu cố định
      </h1>
      <div className="grid grid-cols-3 divide-x-2 divide-slate-200 mt-4">
        <div className="col-span-2 px-10">
          <div className="flex flex-wrap gap-4">
            {Array.from(daysInWeek.entries()).map(([key, value]) => (
              <label
                key={key}
                htmlFor={value}
                className="relative px-4 py-6 h-24 w-24 flex items-center justify-center shrink-0 border-2 border-slate-200 rounded has-[:checked]:border-blue-400 hover:border-blue-400 hover:bg-blue-100 hover:text-blue-600 transition-all cursor-pointer"
              >
                <input
                  type="checkbox"
                  className="hidden peer"
                  id={value}
                  onChange={() => handleCheckbox(key)}
                />
                <span className="text-black peer-checked:text-blue-600 transition-all text-sm">
                  {value}
                </span>
                <FaCheck className="size-20 absolute text-blue-600 opacity-0 peer-checked:opacity-10 transition-all" />
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
              />
            </div>
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
