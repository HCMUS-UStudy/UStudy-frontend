import React, { useEffect, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { getCoursesByGradeId } from "@/app/lib/services/course";
import { CourseDto } from "@/app/types/type";
import SelectorLoading from "./SelectorLoading";
import { useFormContext } from "react-hook-form";
import { CreateClassInputs } from "@/app/(admin)/clerk/classes/create/page";

export default function CourseSelector() {
  const {
    register,
    formState: { errors },
    watch,
    setError,
  } = useFormContext<CreateClassInputs>();
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const selectedGrade = watch("gradeId");
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!selectedGrade) {
          return;
        }
        setLoading(true);
        const response = await getCoursesByGradeId(selectedGrade);
        setCourses(response.content);
        if (response.totalElements === 0) {
          setError("courseId", {
            message:
              "Chưa có môn học cho khối này, vui lòng chọn khối khác cho lớp học",
          });
        } else {
          setError("courseId", { message: "" });
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedGrade, setError]);

  if (selectedGrade === "") {
    return <></>;
  } else {
    return (
      <div>
        <h1 className="font-bold">Chọn môn cho lớp học</h1>
        <div className="flex flex-wrap gap-4 w-2/3 mt-2">
          {loading ? (
            <SelectorLoading size="sm" numberOfItems={5} />
          ) : (
            <>
              {courses.map((course) => (
                <label
                  htmlFor={course.id}
                  key={course.id}
                  className="relative px-3 py-6 shrink-0 grow-0 has-[:checked]:border-primary-darker flex items-center justify-center h-20 w-20 border-2 border-slate-200 text-md rounded hover:border-primary-darkest hover:text-primary-darkest hover:bg-primary cursor-pointer transition-all"
                >
                  <input
                    type="radio"
                    id={course.id}
                    className="hidden peer"
                    value={course.id}
                    {...register("courseId")}
                  />
                  <span className="peer-checked:text-primary-darkest text-black text-sm peer-checked:font-bold transition-all">
                    {course.name}
                  </span>
                  <FaCheck className="size-16 absolute text-primary-darkest opacity-0 peer-checked:opacity-10 transition-all" />
                </label>
              ))}
            </>
          )}
        </div>
        <div className="text-[13px] text-error mt-2">
          {errors.courseId?.message}
        </div>
      </div>
    );
  }
}
