import React from "react";
import { useSlider } from "../../slider";

export default function CourseSelector() {
  const context = useSlider();
  return (
    <div className="flex flex-col">
      <h1 className="text-center font-medium text-lg">Chọn môn học</h1>
      <div className="grid grid-cols-3 divide-x-2 divide-slate-200 mt-4">
        <div className="col-span-2 flex flex-wrap gap-4 px-10">
          <div
            onClick={context.nextStep}
            className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all"
          >
            Toán
          </div>
          <div
            onClick={context.nextStep}
            className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all"
          >
            Lý
          </div>
          <div
            onClick={context.nextStep}
            className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all"
          >
            Hóa
          </div>
          <div
            onClick={context.nextStep}
            className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all"
          >
            Sinh
          </div>
          <div
            onClick={context.nextStep}
            className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all"
          >
            Anh
          </div>
          <div
            onClick={context.nextStep}
            className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all"
          >
            Văn
          </div>
          <div
            onClick={context.nextStep}
            className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all"
          >
            Sử
          </div>
          <div
            onClick={context.nextStep}
            className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all"
          >
            Địa
          </div>
          <div
            onClick={context.nextStep}
            className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all"
          >
            GDCD
          </div>
        </div>
        <div className="flex flex-col gap-2 px-3">
          <button
            onClick={context.nextStep}
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
        </div>
      </div>
    </div>
  );
}
