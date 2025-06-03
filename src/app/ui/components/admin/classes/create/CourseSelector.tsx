import React, { useEffect } from "react";
import { getCoursesByGradeId } from "@/app/lib/services/course";
import { useFormContext } from "react-hook-form";
import { CreateClassInputs } from "./CreateClass";
import { useQuery } from "@tanstack/react-query";
import Selector from "../../../_common/Selector";

export default function CourseSelector() {
  const {
    register,
    formState: { errors },
    watch,
    setError,
  } = useFormContext<CreateClassInputs>();
  const selectedGrade = watch("gradeId");

  const { data: courses, status } = useQuery({
    queryKey: ["CoursesByGradeId", selectedGrade],
    queryFn: () => {
      if (selectedGrade) {
        return getCoursesByGradeId(selectedGrade);
      }
      return null;
    },
    enabled: !!selectedGrade,
  });

  useEffect(() => {
    if (courses?.totalElements === 0) {
      setError("courseId", {
        message:
          "Chưa có môn học cho khối này, vui lòng chọn khối khác cho lớp học",
      });
    } else {
      setError("courseId", { message: "" });
    }
  }, [courses, setError]);

  if (selectedGrade === "") {
    return <></>;
  } else {
    return (
      <div>
        <h1 className="font-bold text-sm md:text-base">Chọn môn cho lớp học</h1>
        <div className="flex flex-wrap gap-2 md:gap-4 w-full md:w-2/3 mt-2">
          <Selector
            data={courses?.content || []}
            register={register}
            name="courseId"
            status={status}
          />
        </div>
        <div className="text-[13px] text-error mt-2">
          {errors.courseId?.message}
        </div>
      </div>
    );
  }
}
