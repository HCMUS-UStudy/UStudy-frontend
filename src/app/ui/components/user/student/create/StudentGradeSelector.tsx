import React, { useEffect, useState } from "react";
import Loading from "../../../_common/Loading";
import { Select, SelectItem } from "../../../_common/Select";
import { GradeItem } from "@/app/types/type";
import { getAllGrades } from "@/app/lib/services/grade";
import { useFormContext } from "react-hook-form";
import { StudentRegisterInputs } from "@/app/register/page";

export default function StudentGradeSelector() {
  const {
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<StudentRegisterInputs>();
  const [grades, setGrades] = useState<GradeItem[]>([]);
  const [loadingGrades, setLoadingGrades] = useState<boolean>(false);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoadingGrades(true);
        const gradesRes = await getAllGrades("", 15, 0);
        setGrades(gradesRes.content);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingGrades(false);
      }
    };
    fetchGrades();
    return;
  }, []);

  const handleSelectGrade = (gradeId: string) => {
    setValue("grades", gradeId);
    clearErrors("grades");
    setValue("classTimes", []);
  };

  return (
    <>
      {loadingGrades ? (
        <div className="px-2 py-0.5 flex justify-start border-2 border-slate-300 rounded-md">
          <Loading text="Chọn khối học của bạn" />
        </div>
      ) : (
        <div>
          <Select
            name="GradeSelector"
            defaultLabel="Chọn khối học của bạn"
            onValueChange={(gradeId) => handleSelectGrade(gradeId as string)}
          >
            {grades.map((grade) => (
              <SelectItem key={grade.id} value={grade.id}>
                {grade.name}
              </SelectItem>
            ))}
          </Select>
          <span className="text-[13px] text-error">
            {errors.grades?.message}
          </span>
        </div>
      )}
    </>
  );
}
