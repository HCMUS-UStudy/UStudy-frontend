import React from "react";
import { useFormContext } from "react-hook-form";
import { CreateClassInputs } from "./CreateClass";
import { useQuery } from "@tanstack/react-query";
import { getAllGrades } from "@/app/lib/services/grade";
import Selector from "../../../_common/Selector";

export default function GradeSelector() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateClassInputs>();

  const { data: grades, status } = useQuery({
    queryKey: ["Grades"],
    queryFn: () => getAllGrades("", 15, 0),
  });

  return (
    <div>
      <h1 className="font-bold text-sm md:text-base">
        Chọn khối cho lớp học *
      </h1>
      <div className="flex flex-wrap gap-2 md:gap-4 w-full xl:w-2/3 mt-2">
        <Selector
          data={grades?.content || []}
          status={status}
          type="radio"
          register={register}
          name="gradeId"
        />
      </div>
      <div className="text-[13px] text-error mt-2">
        {errors.gradeId?.message}
      </div>
    </div>
  );
}
