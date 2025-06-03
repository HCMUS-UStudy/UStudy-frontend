import React from "react";
import { Input } from "../../../_common/text-field/Input";
import { useFormContext } from "react-hook-form";
import { CreateClassInputs } from "./CreateClass";

export default function NameSelector() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateClassInputs>();
  return (
    <div>
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="font-bold text-sm md:text-base">
          Vui lòng nhập tên lớp học
        </label>
        <div className="flex-1">
          <Input
            className="w-full"
            id="name"
            placeholder="9LC01..."
            isError={errors.name?.message !== undefined}
            errorMsg={errors.name?.message}
            {...register("name")}
          />
        </div>
      </div>
    </div>
  );
}
