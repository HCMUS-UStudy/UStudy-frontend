import React, { ChangeEvent, useEffect, useState } from "react";
import { useSlider } from "../../slider";
import { useCreateClassContext } from "./createClassContent";

type DurationType = "week" | "month" | "year";

export default function DurationSelector() {
  const context = useSlider();
  const { isFixedSchedule, setFixedSchedule, setNewClass } =
    useCreateClassContext();
  const [duration, setDuration] = useState<string>("");
  const [unit, setUnit] = useState<DurationType>("week");
  const [err, setErr] = useState<string>("");
  const handleInputDuration = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[1-9]\d*$/.test(value)) {
      setDuration(`${parseInt(value)}`);
      return;
    }
    if (value === "") {
      setDuration("");
      return;
    }
  };
  const handleUnitChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUnit(e.target.value as DurationType);
  };
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  useEffect(() => {
    if (isNaN(parseInt(duration)) || startDate === "") {
      return;
    }
    const startDateObj = new Date(startDate);
    console.log(startDateObj);
    const endDateObj = new Date(startDateObj);
    switch (unit) {
      case "week":
        endDateObj.setDate(startDateObj.getDate() + parseInt(duration) * 7);
        break;
      case "month":
        endDateObj.setMonth(startDateObj.getMonth() + parseInt(duration));
        break;
      case "year":
        endDateObj.setFullYear(startDateObj.getFullYear() + parseInt(duration));
        break;
      default:
        break;
    }
    setEndDate(endDateObj.toISOString().split("T")[0]);
  }, [startDate, unit, duration]);
  const handleNextStep = () => {
    if (duration === "" || startDate === "") {
      setErr("Vui lòng chọn đầy đủ thông tin");
      return;
    }
    setErr("");
    setNewClass((currentClass) => ({
      ...currentClass,
      startDate: startDate,
      endDate: endDate,
    }));
    context.nextStep();
  };
  return (
    <div className="flex flex-col">
      <h1 className="text-center font-medium text-lg">
        Chọn thời gian học cho lớp
      </h1>
      <div className="grid grid-cols-3 divide-x-2 divide-slate-200 mt-4">
        <div className="col-span-2 px-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-5 max-h-8 w-full">
              <label
                htmlFor="class-duration"
                className="after:content-['*'] after:text-red-500"
              >
                Thời gian học:{" "}
              </label>
              <input
                id="class-duration"
                type="text"
                className="px-2 py-1 outline-none border-2 border-slate-200 rounded flex-1"
                placeholder="VD: 1, 2, 3"
                value={duration}
                onChange={handleInputDuration}
              />
            </div>
            <div className="flex items-center gap-4">
              <h1 className="after:content-['*'] after:text-red-500">
                Đơn vị thời gian:{"  "}
              </h1>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="week"
                  className="cursor-pointer h-8 w-8 bg-slate-100 border-2 border-slate-200 rounded-full flex justify-center items-center relative"
                >
                  <input
                    type="radio"
                    id="week"
                    name="duration-unit"
                    className="hidden peer"
                    value={"week"}
                    checked={unit === "week"}
                    onChange={handleUnitChange}
                  />
                  <div className="w-full h-full absolute bg-transparent border-blue-300 border-0 peer-checked:border-2 transition-colors rounded-full"></div>
                  <div className="w-4 h-4 bg-blue-600 scale-0  peer-checked:scale-100 transition-transform rounded-full"></div>
                </label>
                <span>Tuần</span>
              </div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="month"
                  className="cursor-pointer h-8 w-8 bg-slate-100 border-2 border-slate-200 rounded-full flex justify-center items-center relative"
                >
                  <input
                    type="radio"
                    id="month"
                    name="duration-unit"
                    className="hidden peer"
                    value={"month"}
                    checked={unit === "month"}
                    onChange={handleUnitChange}
                  />
                  <div className="w-full h-full absolute bg-transparent border-blue-300 border-0 peer-checked:border-2 transition-colors rounded-full"></div>
                  <div className="w-4 h-4 bg-blue-600 scale-0  peer-checked:scale-100 transition-transform rounded-full"></div>
                </label>
                <span>Tháng</span>
              </div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="year"
                  className="cursor-pointer h-8 w-8 bg-slate-100 border-2 border-slate-200 rounded-full flex justify-center items-center relative"
                >
                  <input
                    type="radio"
                    id="year"
                    name="duration-unit"
                    className="hidden peer"
                    value={"year"}
                    checked={unit === "year"}
                    onChange={handleUnitChange}
                  />
                  <div className="w-full h-full absolute bg-transparent border-blue-300 border-0 peer-checked:border-2 transition-colors rounded-full"></div>
                  <div className="w-4 h-4 bg-blue-600 scale-0  peer-checked:scale-100 transition-transform rounded-full"></div>
                </label>
                <span>Năm</span>
              </div>
            </div>
            <div className="flex justify-between">
              <div className="flex gap-2 items-center">
                <label
                  htmlFor="startDate"
                  className="after:content-['*'] after:text-red-500"
                >
                  Bắt đầu từ:{" "}
                </label>
                <input
                  type="date"
                  id="startDate"
                  min={new Date().toISOString().split("T")[0]}
                  className="border-2 border-slate-200 px-2 py-1 rounded outline-none cursor-pointer"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="flex gap-2 items-center">
                <label
                  htmlFor="endDate"
                  className="after:content-['*'] after:text-red-500"
                >
                  Kết thúc vào:{" "}
                </label>
                <input
                  disabled
                  type="date"
                  id="endDate"
                  className="border-2 border-slate-200 px-2 py-1 rounded outline-none cursor-pointer"
                  value={endDate}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <h1 className="after:content-['*'] after:text-red-500">
                Loại thời khóa biểu:{"  "}
              </h1>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="fixedSchedule"
                  className="cursor-pointer h-8 w-8 bg-slate-100 border-2 border-slate-200 rounded-full flex justify-center items-center relative"
                >
                  <input
                    type="radio"
                    id="fixedSchedule"
                    name="schedule-type"
                    className="hidden peer"
                    value={"fixedSchedule"}
                    checked={isFixedSchedule === true}
                    onChange={() => setFixedSchedule(true)}
                  />
                  <div className="w-full h-full absolute bg-transparent border-blue-300 border-0 peer-checked:border-2 transition-colors rounded-full"></div>
                  <div className="w-4 h-4 bg-blue-600 scale-0  peer-checked:scale-100 transition-transform rounded-full"></div>
                </label>
                <span>Cố định</span>
              </div>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="flexSchedule"
                  className="cursor-pointer h-8 w-8 bg-slate-100 border-2 border-slate-200 rounded-full flex justify-center items-center relative"
                >
                  <input
                    type="radio"
                    id="flexSchedule"
                    name="schedule-type"
                    className="hidden peer"
                    value={"flexSchedule"}
                    checked={isFixedSchedule === false}
                    onChange={() => setFixedSchedule(false)}
                  />
                  <div className="w-full h-full absolute bg-transparent border-blue-300 border-0 peer-checked:border-2 transition-colors rounded-full"></div>
                  <div className="w-4 h-4 bg-blue-600 scale-0  peer-checked:scale-100 transition-transform rounded-full"></div>
                </label>
                <span>Linh hoạt</span>
              </div>
            </div>
            <div className="text-xs text-slate-500 flex flex-col gap-1">
              <span className="font-bold">Chú thích</span>
              <div>
                - Thời khóa biểu <span className="font-bold">cố định</span>: Các
                ngày trong tuần đều có cùng một/nhiều khung giờ học
              </div>
              <div>
                - Thời khóa biểu <span className="font-bold">linh hoạt</span>:
                Các ngày khác nhau trong tuần có thể có các khung giờ học khác
                nhau
              </div>
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
