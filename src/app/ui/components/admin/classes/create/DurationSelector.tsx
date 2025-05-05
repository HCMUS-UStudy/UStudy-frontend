import React from "react";
import { Input } from "../../../_common/text-field/Input";
import { useFormContext } from "react-hook-form";
import { CreateClassInputs } from "./CreateClass";
import { CustomDatePicker } from "../../../_common/text-field/CustomDatePicker";

export default function DurationSelector() {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext<CreateClassInputs>();
  return (
    <div className="flex flex-col mt-2">
      <h1 className="font-bold">Chọn thời gian học cho lớp</h1>
      <div className="w-2/3 mt-2">
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex items-center gap-5 max-h-8 w-full">
              <label
                htmlFor="class-duration"
                className="after:content-['*'] after:text-red-500"
              >
                Số buổi học:{" "}
              </label>
              <Input
                id="class-duration"
                type="number"
                placeholder="VD: 1, 2, 3"
                {...register("numLessons", {
                  valueAsNumber: true,
                })}
              />
            </div>
            <div className="text-[13px] text-error mt-2">
              {errors.numLessons?.message}
            </div>
          </div>
          <div className="flex justify-between">
            <CustomDatePicker
              name="startDate"
              label="Bắt đầu từ:"
              errorMsg={errors.startDate?.message}
              control={control}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
