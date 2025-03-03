import React from "react";

export default function ScheduleTypeSelector({
  isFixedSchedule,
  setFixedSchedule,
}: {
  isFixedSchedule: boolean;
  setFixedSchedule: (value: boolean) => void;
}) {
  return (
    <div>
      <div className="flex items-center gap-4">
        <h1 className="font-bold after:content-['*'] after:text-red-500">
          Loại thời khóa biểu:{"  "}
        </h1>
        <div className="flex items-center gap-2">
          <label
            htmlFor="fixedSchedule"
            className="cursor-pointer h-8 w-8 bg-background border-2 border-slate-200 rounded-full flex justify-center items-center relative"
          >
            <input
              type="radio"
              id="fixedSchedule"
              name="schedule-type"
              className="hidden peer"
              checked={isFixedSchedule === true}
              onClick={() => setFixedSchedule(true)}
            />
            <div className="w-full h-full absolute bg-transparent border-primary-dark border-0 peer-checked:border-2 transition-colors rounded-full"></div>
            <div className="w-4 h-4 bg-primary-darkest scale-0  peer-checked:scale-100 transition-transform rounded-full"></div>
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
              checked={isFixedSchedule === false}
              onClick={() => setFixedSchedule(false)}
            />
            <div className="w-full h-full absolute bg-transparent border-primary-dark border-0 peer-checked:border-2 transition-colors rounded-full"></div>
            <div className="w-4 h-4 bg-primary-darkest scale-0  peer-checked:scale-100 transition-transform rounded-full"></div>
          </label>
          <span>Linh hoạt</span>
        </div>
      </div>
      <div className="text-sm text-slate-500 flex flex-col gap-1">
        <span className="font-bold">Chú thích</span>
        <div>
          - Thời khóa biểu <span className="font-bold">cố định</span>: Các ngày
          trong tuần đều có cùng một/nhiều khung giờ học
        </div>
        <div>
          - Thời khóa biểu <span className="font-bold">linh hoạt</span>: Các
          ngày khác nhau trong tuần có thể có các khung giờ học khác nhau
        </div>
      </div>
    </div>
  );
}
