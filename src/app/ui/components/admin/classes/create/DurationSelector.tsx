import React from "react";
import { Input } from "../../../_common/text-field/Input";
import { useFormContext } from "react-hook-form";
import { CreateClassInputs } from "@/app/(admin)/admin/classes/create/page";

export default function DurationSelector() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateClassInputs>();
  // const [duration, setDuration] = useState<string>("");
  // const numLessons = watch("numLessons");
  // const [unit, setUnit] = useState<DurationType>("week");
  // const handleInputDuration = (e: ChangeEvent<HTMLInputElement>) => {
  //   const value = e.target.value;
  //   if (/^[1-9]\d*$/.test(value)) {
  //     setValue("numLessons", parseInt(value));
  //     clearErrors("numLessons");
  //     return;
  //   }
  //   // if (value === "") {
  //   //   setDuration("");
  //   //   return;
  //   // }
  // };
  // const [startDate, setStartDate] = useState<string>("");
  // useEffect(() => {
  //   if (isNaN(parseInt(duration)) || startDate === "") {
  //     // setError("startDate", {
  //     //   message: "Vui lòng chọn đầy đủ thời gian học và ngày bắt đầu",
  //     // });
  //     return;
  //   }
  //   const startDateObj = new Date(startDate);
  //   // console.log(startDateObj);
  //   const endDateObj = new Date(startDateObj);
  //   switch (unit) {
  //     case "week":
  //       endDateObj.setDate(startDateObj.getDate() + parseInt(duration) * 7);
  //       break;
  //     case "month":
  //       endDateObj.setMonth(startDateObj.getMonth() + parseInt(duration));
  //       break;
  //     case "year":
  //       endDateObj.setFullYear(startDateObj.getFullYear() + parseInt(duration));
  //       break;
  //     default:
  //       break;
  //   }
  //   setEndDate(endDateObj.toISOString().split("T")[0]);
  //   setValue("startDate", startDate);
  //   setValue("endDate", endDateObj.toISOString().split("T")[0]);
  //   clearErrors("startDate");
  // }, [startDate, unit, duration, setValue, clearErrors, setError]);
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
                // isError={errors.numLessons !== undefined}
                // errorMsg={errors.numLessons?.message}
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
            <div>
              <div className="flex gap-2 items-center">
                <label
                  htmlFor="startDate"
                  className="after:content-['*'] after:text-red-500"
                >
                  Bắt đầu từ:{" "}
                </label>
                <input
                  type="date"
                  id="startDate"
                  min={new Date().toISOString().split("T")[0]}
                  className="border-2 border-slate-200 px-2 py-1 rounded outline-none cursor-pointer"
                  // value={startDate}
                  // onChange={(e) => setStartDate(e.target.value)}
                  {...register("startDate")}
                />
              </div>
              <div className="text-[13px] text-error mt-2">
                {errors.startDate?.message}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
