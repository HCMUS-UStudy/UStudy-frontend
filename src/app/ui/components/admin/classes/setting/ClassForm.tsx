import { ClassDetail, CourseItem, GradeItem } from "@/app/types";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../_common/Card";
import { Button } from "../../../_common/Button";
import { Check } from "lucide-react";
import { Input } from "../../../_common/text-field/Input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { convertToVietnameseText } from "@/app/lib/utils";
import TextArea from "../../../_common/text-field/TextArea";
import {
  CustomDatePicker,
  ReadonlyTextField,
} from "../../../_common/text-field";
import { UpdateClassType } from "@/app/(admin)/admin/classes/[classId]/setting/page";
import GradeAndCourseSelector from "./gradeAndCourseSelector";
import dayjs from "dayjs";

const updateClassSchema = z
  .object({
    name: z.string().min(1, "Tên lớp không được để trống"),
    description: z.string().optional(),
    courseId: z.string().min(1, "Vui lòng chọn môn học"),
    gradeId: z.string().min(1, "Vui lòng chọn khối học"),
    fee: z
      .number()
      .min(0, "Học phí không được âm")
      .max(100000000, "Học phí không được quá 100.000.000 vnđ"),
    startDate: z.string(),
    endDate: z.string(),
    numLessons: z
      .preprocess(
        (val) => (val !== null && val !== undefined ? Number(val) : val),
        z.number().min(0, "Số buổi học không được âm"),
      )
      .optional()
      .default(0),
  })
  .superRefine((data, ctx) => {
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);

    if (endDate <= startDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Ngày kết thúc phải sau ngày bắt đầu",
        path: ["endDate"],
      });
    }
  });

export type updateClassFormInputs = z.infer<typeof updateClassSchema>;

interface Props {
  classDetail: ClassDetail;
  grades: GradeItem[];
  courses: CourseItem[];
  handleUpdate: ({
    classId,
    data,
  }: {
    classId: string;
    data: UpdateClassType;
  }) => void;
}

function ClassForm({ classDetail, grades, courses, handleUpdate }: Props) {
  // const selectedBranchId =
  //   useAppSelector((state) => state.branch.selectedBranchId) ?? "";
  const [fee, setFee] = useState<{
    value: number;
    formatted: string;
    text: string;
  }>({
    value: 0,
    formatted: "",
    text: "",
  });
  const [isSelectingGradesCourses, setIsSelectingGradesCourses] =
    useState<boolean>(false);

  const defaultValues = useMemo(() => {
    return {
      name: classDetail.name,
      courseId: classDetail.course.id,
      description: classDetail.description,
      startDate: classDetail.startDate,
      endDate: classDetail.endDate,
      numLessons: classDetail.numLessons || 0,
      fee: classDetail.fee,
      gradeId: classDetail.grade.id,
    };
  }, [classDetail]);

  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
  } = useForm<updateClassFormInputs>({
    resolver: zodResolver(updateClassSchema),
    defaultValues: defaultValues,
  });

  const gradeId = watch("gradeId");

  useEffect(() => {
    const nameInput = document.getElementById("name") as HTMLInputElement;
    if (nameInput) {
      nameInput.focus();
    }
  }, []);

  useEffect(() => {
    setFee({
      value: classDetail.fee,
      formatted: new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "VND",
      })
        .format(classDetail.fee)
        .replace("VND", "")
        .trim(),
      text: convertToVietnameseText(classDetail.fee),
    });
  }, []);

  const handleFeeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputFee = e.target.value.replace(/[^0-9]/g, "");
      const value = Number(inputFee);
      if (value > 100000000) {
        setError("fee", {
          message: '"Học phí không được quá 100.000.000 vnđ"',
        });
        return;
      } else {
        clearErrors("fee");
      }
      const formatted = new Intl.NumberFormat("it-IT", {
        style: "currency",
        currency: "VND",
      })
        .format(Number(inputFee))
        .replace("VND", "")
        .trim();

      setFee({ value, formatted, text: convertToVietnameseText(value) });
      setValue("fee", value);
    },
    [],
  );

  const handleChangeGradeAndCourse = useCallback(
    ({ gradeId, courseId }: { gradeId: string; courseId: string }) => {
      setValue("gradeId", gradeId);
      setValue("courseId", courseId);
    },
    [],
  );

  const onSubmit = (inputs: updateClassFormInputs) => {
    // console.log(classDetail.id, {
    //   name: inputs.name,
    //   description: inputs.description || "",
    //   courseId: inputs.courseId,
    //   gradeId: inputs.gradeId,
    //   fee: inputs.fee,
    // });
    handleUpdate({
      classId: classDetail.id,
      data: {
        name: inputs.name,
        description: inputs.description || "",
        courseId: inputs.courseId,
        gradeId: inputs.gradeId,
        fee: inputs.fee,
      },
    });
  };

  return (
    <div className="mx-auto py-6" onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col gap-3 md:flex-row justify-between items-center text-lg md:text-xl">
            <span className="">Thông tin lớp học</span>
            <div className="flex flex-row gap-1 md:gap-3 w-full md:w-auto">
              <Button className="flex-1" form="edit-class-form" type="submit">
                <span className="hidden md:flex">Lưu thay đổi</span>
                <Check className="flex md:hidden size-5" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form id="edit-class-form">
            <div className="grid grid-cols-1 md:grid-cols-2 mb-3 gap-4 md:gap-8">
              <div className="flex flex-col gap-4 mb-3">
                <Input
                  id="name"
                  label="Tên lớp*"
                  isError={errors.name !== undefined}
                  errorMsg={errors.name?.message}
                  {...register("name")}
                />

                <div
                  onClick={() => setIsSelectingGradesCourses(true)}
                  className="flex flex-col gap-4 border-dashed border-2 border-primary-dark hover:bg-primary-lighter rounded-lg p-3 transition-all cursor-pointer"
                >
                  <ReadonlyTextField
                    className="bg-white"
                    text={
                      grades.find((item) => item.id === watch("gradeId"))
                        ?.name || ""
                    }
                    label="Khối học*"
                  />
                  <ReadonlyTextField
                    className="bg-white"
                    text={
                      courses.find(
                        (item) =>
                          item.detailedCourseDto.id === watch("courseId"),
                      )?.detailedCourseDto.name || ""
                    }
                    label="Môn học*"
                  />
                </div>
                <div className="flex gap-2">
                  <CustomDatePicker
                    label="Ngày bắt đầu"
                    value={dayjs(classDetail.startDate)}
                    disabled
                    suffixIcon={null}
                  />
                  <CustomDatePicker
                    label="Ngày kết thúc"
                    value={dayjs(classDetail.endDate)}
                    disabled
                    suffixIcon={null}
                  />
                  {/* Ngày bắt đầu */}
                  {/* <div className="flex flex-col">
                    <label
                      htmlFor="startDate"
                      className="mb-1 text-sm font-medium text-gray-700"
                    >
                      Ngày bắt đầu*
                    </label>
                    <input
                      type="text"
                      id="startDate"
                      className="px-4 py-2 border rounded-lg bg-gray-100 text-gray-800 outline-none cursor-not-allowed"
                      value={formatDate(classDetail?.startDate)}
                      readOnly
                    />
                  </div> */}

                  {/* Ngày kết thúc */}
                  {/* <div className="flex flex-col">
                    <label
                      htmlFor="endDate"
                      className="mb-1 text-sm font-medium text-gray-700"
                    >
                      Ngày kết thúc*
                    </label>
                    <input
                      type="text"
                      id="endDate"
                      className="px-4 py-2 border rounded-lg bg-gray-100 text-gray-800 outline-none cursor-not-allowed"
                      value={formatDate(classDetail?.endDate)}
                      readOnly
                    />
                  </div> */}

                  {/* Số buổi */}
                  {/* <div className="flex flex-col">
                    <label
                      htmlFor="numLessons"
                      className="mb-1 text-sm font-medium text-gray-700"
                    >
                      Số buổi*
                    </label>
                    <input
                      type="number"
                      id="numLessons"
                      className="px-4 py-2 border rounded-lg text-gray-800 outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      defaultValue={classDetail?.numLessons || 0}
                    />
                  </div> */}
                </div>
                <div>
                  <Input
                    type="number"
                    label="Số buổi học"
                    isError={!!errors.numLessons}
                    errorMsg={errors.numLessons?.message}
                    {...register("numLessons")}
                  />
                </div>

                <div>
                  <Input
                    id="fee"
                    value={fee.formatted}
                    onChange={handleFeeChange}
                    isError={errors.fee !== undefined}
                    errorMsg={errors.fee?.message}
                    label="Học phí*"
                  />
                  <span className="text-primary-darkest text-sm">
                    {fee.text}
                  </span>
                </div>
              </div>

              <div className="h-full">
                <TextArea
                  id="description"
                  label="Mô tả lớp học"
                  className="h-full min-h-52 max-h-52 overflow-y-auto"
                  {...register("description")}
                />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <GradeAndCourseSelector
        isOpen={isSelectingGradesCourses}
        onClose={() => setIsSelectingGradesCourses(false)}
        gradeId={gradeId}
        onSave={handleChangeGradeAndCourse}
      />
    </div>
  );
}

export default memo(ClassForm);
