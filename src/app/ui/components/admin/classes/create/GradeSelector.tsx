import React from "react";
import { FaCheck } from "react-icons/fa6";
import { useFormContext } from "react-hook-form";
import { CreateClassInputs } from "./CreateClass";
import { useQuery } from "@tanstack/react-query";
import { getAllGrades } from "@/app/lib/services/grade";
import SelectorLoading from "../../../_common/loading/SelectorLoading";

export default function GradeSelector() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateClassInputs>();
  // const [gradesTest, setGradesTest] = useState<GradeItem[]>([]);
  // const [loading, setLoading] = useState<boolean>(false);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       const response = await getAllGrades("", 15, 0);
  //       setGradesTest(response.content);
  //       console.log(response.content);
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, []);
  const { data: grades, status } = useQuery({
    queryKey: ["Grades"],
    queryFn: () => getAllGrades("", 15, 0),
  });
  return (
    <div>
      <h1 className="font-bold">Chọn khối cho lớp học</h1>
      <div className="flex flex-wrap gap-4 w-2/3 mt-2">
        {status === "pending" ? (
          <SelectorLoading size="sm" numberOfItems={12} />
        ) : (
          <>
            {grades?.content.map((grade) => (
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
