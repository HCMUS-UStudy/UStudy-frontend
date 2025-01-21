import React from "react";
import { useSlider } from "../../slider";

export default function GradeSelector() {
  const context = useSlider();
  return (
    <div className="flex flex-col mb-3">
      <h1 className="text-center font-medium text-lg">Chọn khối cho lớp học</h1>
      <div className="flex flex-wrap max-w-[60%] mx-auto w-full gap-3 mt-4">
        <div
          onClick={context.nextStep}
          className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all"
        >
          Khối 1
        </div>
        <div
          onClick={context.nextStep}
          className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all"
        >
          Khối 2
        </div>
        <div
          onClick={context.nextStep}
          className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all"
        >
          Khối 3
        </div>
        <div
          onClick={context.nextStep}
          className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all"
        >
          Khối 4
        </div>
        <div
          onClick={context.nextStep}
          className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all"
        >
          Khối 5
        </div>
        <div
          onClick={context.nextStep}
          className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all"
        >
          Khối 6
        </div>
        <div
          onClick={context.nextStep}
          className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all"
        >
          Khối 7
        </div>
        <div
          onClick={context.nextStep}
          className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all"
        >
          Khối 8
        </div>
        <div
          onClick={context.nextStep}
          className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all"
        >
          Khối 9
        </div>
        <div
          onClick={context.nextStep}
          className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all"
        >
          Khối 10
        </div>
        <div
          onClick={context.nextStep}
          className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all"
        >
          Khối 11
        </div>
        <div
          onClick={context.nextStep}
          className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all"
        >
          Khối 12
        </div>
        <div
          onClick={context.nextStep}
          className="px-4 py-6 shrink-0 grow-0 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all"
        >
          IELTS
        </div>
      </div>
    </div>
  );
}
