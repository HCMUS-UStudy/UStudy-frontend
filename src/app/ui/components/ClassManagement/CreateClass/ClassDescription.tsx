import React, { useState } from "react";
import { useSlider } from "../../slider";
import { useCreateClassContext } from "./createClassContent";

export default function ClassDescription() {
  const context = useSlider();
  const [description, setDescription] = useState<string>("");
  const [name, setName] = useState<string>("");
  const { setNewClass } = useCreateClassContext();
  const [err, setErr] = useState<string>("");
  const handleNextStep = () => {
    if (name === "") {
      setErr("Vui lòng nhập tên lớp");
      return;
    }
    setNewClass((currentClass) => ({
      ...currentClass,
      name,
      description,
    }));
    setErr("");
    context.nextStep();
  };
  return (
    <div className="flex flex-col">
      <h1 className="text-center font-medium text-lg">Mô tả về lớp học</h1>
      <div className="grid grid-cols-3 divide-x-2 divide-slate-200 mt-4">
        <div className="col-span-2 px-10">
          <div className="flex items-center gap-5 max-h-8 w-full">
            <label
              htmlFor="class-duration"
              className="after:content-['*'] after:text-red-500"
            >
              Tên lớp học:{" "}
            </label>
            <input
              id="class-duration"
              type="text"
              className="px-2 py-1 outline-none border-2 border-slate-200 rounded flex-1"
              placeholder="Nhập tên lớp học..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <textarea
            name="classDescription"
            id="classDescription"
            placeholder="Nhập mô tả về lớp học..."
            className="border-2 mt-3 border-slate-200 p-2.5 w-full outline-none rounded max-h-[200px] h-[200px] overflow-y-auto"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
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
