import React from "react";
import { Input } from "../../_common/text-field/Input";
import { useFormContext } from "react-hook-form";
import { CreateClassInputs } from "@/app/(admin)/clerk/classes/create/page";

export default function NameSelector() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateClassInputs>();
  return (
    <div>
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="font-bold">
          Vui lòng nhập tên lớp học:
        </label>
        <div className="flex-1">
          <Input
            className="w-full"
            id="name"
            placeholder="9LC01..."
            {...register("name")}
          />
          <div className="mt-2 text-error">{errors.name?.message}</div>
        </div>
      </div>
    </div>
  );
}
