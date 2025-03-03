import React from "react";
import { useSlider } from "../../../slider";
import { useCreateClassContext } from "./createClassContent";
import { Button } from "../../../_common/Button";

export default function ClassConfirmation() {
  const context = useSlider();
  const { newClass } = useCreateClassContext();
  const daysInWeek = new Map<number, string>([
    [1, "Thứ hai"],
    [2, "Thứ ba"],
    [3, "Thứ tư"],
    [4, "Thứ năm"],
    [5, "Thứ sáu"],
    [6, "Thứ bảy"],
    [7, "Chủ nhật"],
  ]);
  return (
    <div className="flex flex-col">
      <h1 className="text-center font-medium text-lg">
        Xác nhận thông tin lớp học
      </h1>
      <div className="grid grid-cols-3 divide-x-2 divide-slate-200 mt-4">
        <div className="col-span-2 px-5 flex">
          <div className="flex-auto">
            <div className="font-bold px-3 py-1 border-b-2 border-blue-600">
              Thông tin chung
            </div>
            <div className="mt-2 px-3 flex flex-col gap-1">
              <div>
                Tên lớp: <span className="font-bold">{newClass.name}</span>
              </div>
              <div>
                Khối: <span className="font-bold"></span>
              </div>
              <div>
                Môn học: <span className="font-bold">Tự render</span>
              </div>
              <div>
                Phòng học: <span className="font-bold">Tự render</span>
              </div>
              <div>
                Chi nhánh: <span className="font-bold">fetch chi nhánh</span>
              </div>
              <div>
                Thời gian học: <span className="font-bold">3 tháng</span>
              </div>
              <div>
                Từ ngày: <span className="font-bold">02/02/2025</span>
              </div>
              <div>
                Đến ngày: <span className="font-bold">02/02/2025</span>
              </div>
              <div className="text-sm text-slate-600">
                <span className="font-bold">(*) Mô tả:</span>{" "}
                {newClass.description}
              </div>
            </div>
          </div>
          <div className="flex-auto">
            <div className="font-bold px-3 py-1 border-b-2 border-blue-600">
              Lịch học
            </div>
            <div className="mt-2 px-3 flex flex-col gap-1">
              {newClass.classTimes.map((item) => (
                <div key={item.day}>
                  {daysInWeek.get(item.day)}:{" "}
                  <span className="font-bold">{item.startTime}</span> -{" "}
                  <span className="font-bold">{item.endTime}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 px-3">
          <Button type="button" className="px-6 py-3 w-full text-sm rounded">
            Tạo lớp học mới
          </Button>
          <button
            onClick={context.prevStep}
            type="button"
            className="px-6 py-3 bg-slate-400 hover:bg-slate-500 transition-colors text-white text-sm rounded"
          >
            Trở lại
          </button>
        </div>
      </div>
    </div>
  );
}
