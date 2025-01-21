import React from "react";
import { useSlider } from "../../slider";

export default function FlexibleScheduleSelector() {
  const context = useSlider();
  return (
    <div className="flex flex-col">
      <h1 className="text-center font-medium text-lg">
        Thành lập thời khóa biểu linh hoạt
      </h1>
      <div className="grid grid-cols-3 divide-x-2 divide-slate-200 mt-4">
        <div className="col-span-2 px-10"></div>
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
