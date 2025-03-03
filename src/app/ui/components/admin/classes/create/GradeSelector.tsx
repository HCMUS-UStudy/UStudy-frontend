import React, { useEffect, useState } from "react";
import { getAllGrades } from "@/app/lib/services/grade";
import { GradeItem } from "@/app/types/type";
import { FaCheck } from "react-icons/fa6";
import SelectorLoading from "./SelectorLoading";
import { useFormContext } from "react-hook-form";
import { CreateClassInputs } from "@/app/(admin)/clerk/classes/create/page";

export default function GradeSelector() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateClassInputs>();
  const [grades, setGrades] = useState<GradeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getAllGrades("", 15, 0);
        setGrades(response.content);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  return (
    <div>
      <h1 className="font-bold">Chọn khối cho lớp học</h1>
      <div className="flex flex-wrap gap-4 w-2/3 mt-2">
        {loading ? (
          <SelectorLoading size="sm" numberOfItems={12} />
        ) : (
          <>
            {grades.map((grade) => (
              <label
                htmlFor={grade.id}
                key={grade.id}
                className="relative px-3 py-6 shrink-0 grow-0 has-[:checked]:border-primary-darker flex items-center justify-center h-20 w-20 border-2 border-slate-200 text-md rounded hover:border-primary-darkest hover:text-primary-darkest hover:bg-primary cursor-pointer transition-all"
              >
                <input
                  type="radio"
                  id={grade.id}
                  className="hidden peer"
                  value={grade.id}
                  {...register("gradeId")}
                />
                <span className="peer-checked:text-primary-darkest text-black text-sm peer-checked:font-bold transition-all">
                  {grade.name}
                </span>
                <FaCheck className="size-16 absolute text-primary-darkest opacity-0 peer-checked:opacity-10 transition-all" />
              </label>
            ))}
          </>
        )}
      </div>
      <div className="text-[13px] text-error mt-2">
        {errors.gradeId?.message}
      </div>
    </div>
  );
}
