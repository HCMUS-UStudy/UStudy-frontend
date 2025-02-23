import { CreateClassInputs } from "@/app/(admin)/clerk/classes/create/page";
import React from "react";
import { useFormContext } from "react-hook-form";

export default function ClassDescription() {
  const { register } = useFormContext<CreateClassInputs>();
  return (
    <div className="flex flex-col">
      <h1 className="font-bold">Mô tả về lớp học</h1>
      <div className="">
        <textarea
          id="classDescription"
          placeholder="Nhập mô tả về lớp học..."
          className="border-2 mt-3 border-slate-200 p-2.5 w-full outline-none rounded max-h-[200px] h-[200px] overflow-y-auto"
          {...register("description")}
        ></textarea>
      </div>
    </div>
  );
}
