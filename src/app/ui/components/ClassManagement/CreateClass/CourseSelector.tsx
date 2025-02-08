import React, { ChangeEvent, useEffect, useState } from "react";
import { useSlider } from "../../slider";
import { FaCheck } from "react-icons/fa6";
import { useCreateClassContext } from "./createClassContent";
import { getCoursesByGradeId } from "@/app/lib/services/course";
import { CourseItem } from "@/app/types/type";
import SelectorLoading from "./SelectorLoading";

export default function CourseSelector() {
  const context = useSlider();
  const { newClass, setNewClass } = useCreateClassContext();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getCoursesByGradeId(newClass.gradeId);
        setCourses(response.data.data.content);
        console.log(response);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [newClass.gradeId]);
  const handleSelectCourse = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("here");
    setNewClass((currentClass) => ({
      ...currentClass,
      courseId: e.target.value,
    }));
    context.nextStep();
  };
  return (
    <div className="flex flex-col mb-3">
      <h1 className="text-center font-medium text-lg">Chọn môn cho lớp học</h1>
      <div className="grid grid-cols-3 divide-x-2 divide-slate-200 mt-4">
        <div className="col-span-2 flex flex-wrap gap-4 px-10">
          {loading ? (
            <SelectorLoading />
          ) : (
            <>
              {courses.map((course) => (
                <label
                  htmlFor={course.id}
                  key={course.id}
                  className="relative px-4 py-6 shrink-0 grow-0 has-[:checked]:border-blue-400 flex items-center justify-center h-24 w-24 border-2 border-slate-200 text-md rounded hover:border-blue-400 hover:text-blue-600 hover:bg-blue-100 cursor-pointer transition-all"
                >
                  <input
                    type="radio"
                    name="selectCourse"
                    id={course.id}
                    className="hidden peer"
                    value={course.id}
                    onChange={handleSelectCourse}
                  />
                  <span className="peer-checked:text-blue-600 text-black transition-colors">
                    {course.name}
                  </span>
                  <FaCheck className="size-20 absolute text-blue-600 opacity-0 peer-checked:opacity-10 transition-all" />
                </label>
              ))}
            </>
          )}
        </div>
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
