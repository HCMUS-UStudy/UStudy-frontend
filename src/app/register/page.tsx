"use client";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/components/_common/text-field/Input";
import { Button } from "../ui/components/_common/Button";
import { CourseDto, GradeItem } from "../types/type";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAllGrades } from "../lib/services/grade";
import SelectorLoading from "../ui/components/admin/classes/create/SelectorLoading";
import { FaCheck } from "react-icons/fa6";
import { getCoursesByGradeId } from "../lib/services/course";
import { Select, SelectItem } from "../ui/components/_common/Select";
import Loading from "../ui/components/_common/Loading";

const StudentRegisterSchema = z.object({
  name: z
    .string({ message: "Đây là trường bắt buộc" })
    .min(1, "Đây là trường bắt buộc"),
  email: z
    .string({ message: "Đây là trường bắt buộc" })
    .email("Email không hợp lệ"),
  birthday: z
    .string({ message: "Đây là trường bắt buộc" })
    .min(1, "Đây là trường bắt buộc")
    .refine((data) => !isNaN(Date.parse(data)), {
      message: "Ngày sinh không hợp lệ",
    }),
  phone: z
    .string({ message: "Đây là trường bắt buộc" })
    .regex(/^\d+$/, "Số điện thoại chỉ được chứa số")
    .min(9, "Số điện thoại từ 9 - 12 ký tự số")
    .max(12, "Số điện thoại từ 9 - 12 ký tự số"),
  parentPhone: z
    .string({ message: "Đây là trường bắt buộc" })
    .regex(/^\d+$/, "Số điện thoại chỉ được chứa số")
    .min(9, "Số điện thoại từ 9 - 12 ký tự số")
    .max(12, "Số điện thoại từ 9 - 12 ký tự số"),
  address: z
    .string({ message: "Đây là trường bắt buộc" })
    .min(1, "Đây là trường bắt buộc"),
  grades: z
    .string({ message: "Đây là trường bắt buộc" })
    .min(1, "Đây là trường bắt buộc"),
  courses: z.array(z.string()).min(1, "Chọn tối thiểu một khối học"),
  branchId: z
    .string({ message: "Đây là trường bắt buộc" })
    .min(1, "Đây là trường bắt buộc"),
  gender: z.enum(["MALE", "FEMALE"], { message: "Vui lòng chọn giới tính" }),
});

type StudentRegisterInputs = z.infer<typeof StudentRegisterSchema>;

export default function StudentRegister() {
  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
    setValue,
  } = useForm<StudentRegisterInputs>({
    resolver: zodResolver(StudentRegisterSchema),
    defaultValues: {
      gender: "MALE",
      courses: [],
      grades: "",
    },
  });
  const [grades, setGrades] = useState<GradeItem[]>([]);
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [loadingCourse, setLoadingCourses] = useState<boolean>(false);
  const [loadingGrades, setLoadingGrades] = useState<boolean>(false);
  const [loadingRegister, setLoadingRegister] = useState<boolean>(false);
  const selectedGrade = watch("grades");

  const onSubmit = (data: StudentRegisterInputs) => {
    console.log(data);
    try {
      setLoadingRegister(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingRegister(false);
    }
  };

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        setLoadingGrades(true);
        const response = await getAllGrades("", 15, 0);
        setGrades(response.content);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingGrades(false);
      }
    };
    fetchGrades();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        const response = await getCoursesByGradeId(selectedGrade);
        // console.log(response.content);
        setCourses(response.content);
        setValue("courses", []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, [selectedGrade, setValue]);

  return (
    <>
      <div className="flex items-center justify-center h-screen overflow-auto">
        <div className="flex relative items-center h-full justify-center w-full bg-primary-light">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-foreground py-10 px-20 rounded-3xl shadow-lg z-[100] flex flex-col gap-5 w-3/4"
          >
            <div className="text-[#F48C06] text-3xl font-bold mb-3 flex justify-center">
              Ghi danh
            </div>
            <div className="grid grid-cols-5 divide-x-2 gap-10">
              <div className="flex flex-col gap-4 col-span-2">
                <div>
                  <Input
                    className="text-[14px]"
                    type="text"
                    placeholder="Họ và tên"
                    label="Họ và tên"
                    isError={errors.name !== undefined}
                    errorMsg={errors.name?.message}
                    {...register("name")}
                  />
                </div>
                <div>
                  <Input
                    className="text-[14px]"
                    type="text"
                    placeholder="Email"
                    label="Email"
                    isError={errors.email !== undefined}
                    errorMsg={errors.email?.message}
                    {...register("email")}
                  />
                </div>
                <div>
                  <Input
                    className="text-[14px]"
                    type="date"
                    placeholder="Ngày sinh"
                    label="Ngày sinh"
                    isError={errors.birthday !== undefined}
                    errorMsg={errors.birthday?.message}
                    {...register("birthday")}
                  />
                </div>
                <div>
                  <Input
                    className="text-[14px]"
                    type="text"
                    placeholder="Số điện thoại"
                    label="Số điện thoại"
                    isError={errors.phone !== undefined}
                    errorMsg={errors.phone?.message}
                    {...register("phone")}
                  />
                </div>
                <div>
                  <Input
                    className="text-[14px]"
                    type="text"
                    placeholder="Số điện thoại phụ huynh"
                    label="Số điện thoại phụ huynh"
                    isError={errors.parentPhone !== undefined}
                    errorMsg={errors.parentPhone?.message}
                    {...register("parentPhone")}
                  />
                </div>
                <div>
                  <Input
                    className="text-[14px]"
                    type="text"
                    placeholder="Địa chỉ"
                    label="Địa chỉ"
                    isError={errors.address !== undefined}
                    errorMsg={errors.address?.message}
                    {...register("address")}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <h1 className="text-gray-700">Giới tính:{"  "}</h1>
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="MALE"
                      className="cursor-pointer h-8 w-8 bg-background border-2  rounded-full flex justify-center items-center relative"
                    >
                      <input
                        type="radio"
                        id="MALE"
                        className="hidden peer"
                        value={"MALE"}
                        {...register("gender")}
                      />
                      <div className="w-full h-full absolute bg-transparent border-primary-dark border-0 peer-checked:border-2 transition-colors rounded-full"></div>
                      <div className="w-4 h-4 bg-primary-darkest scale-0  peer-checked:scale-100 transition-transform rounded-full"></div>
                    </label>
                    <span>Nam</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <label
                      htmlFor="FEMALE"
                      className="cursor-pointer h-8 w-8 bg-background border-2  rounded-full flex justify-center items-center relative"
                    >
                      <input
                        type="radio"
                        id="FEMALE"
                        className="hidden peer"
                        value={"FEMALE"}
                        {...register("gender")}
                      />
                      <div className="w-full h-full absolute bg-transparent border-primary-dark border-0 peer-checked:border-2 transition-colors rounded-full"></div>
                      <div className="w-4 h-4 bg-primary-darkest scale-0  peer-checked:scale-100 transition-transform rounded-full"></div>
                    </label>
                    <span>Nữ</span>
                  </div>
                </div>
              </div>
              <div className="col-span-3 pl-10">
                {loadingGrades ? (
                  <div className="px-2 py-0.5 flex justify-start border-2 border-slate-300 rounded-md">
                    <Loading text="Chọn khối học của bạn" />
                  </div>
                ) : (
                  <div>
                    <Select
                      name="GradeSelector"
                      defaultLabel="Chọn khối học của bạn"
                      onValueChange={(gradeId) =>
                        setValue("grades", gradeId as string)
                      }
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

                {selectedGrade !== "" && (
                  <div>
                    <div className="text-gray-700 font-bold mt-2">
                      Bạn mong muốn học môn nào ?
                    </div>
                    <div>
                      {loadingCourse ? (
                        <SelectorLoading
                          size="sm"
                          numberOfItems={12}
                        ></SelectorLoading>
                      ) : courses.length !== 0 ? (
                        <>
                          <div className="flex flex-wrap gap-3 mt-3">
                            {courses.map((course) => (
                              <label
                                key={course.id}
                                className="relative px-3 py-6 shrink-0 grow-0 has-[:checked]:border-primary-darker flex items-center justify-center h-20 w-20 border-2 border-control-border text-md rounded hover:border-primary-darkest hover:text-primary-darkest hover:bg-primary cursor-pointer transition-all"
                              >
                                <input
                                  type="checkbox"
                                  className="hidden peer"
                                  value={course.id}
                                  {...register("courses")}
                                />
                                <span className="peer-checked:text-primary-darkest text-gray-700 transition-colors text-sm">
                                  {course.name}
                                </span>
                                <FaCheck className="size-16 absolute text-primary-darkest opacity-0 peer-checked:opacity-10 transition-all" />
                              </label>
                            ))}
                          </div>
                        </>
                      ) : (
                        <span className="text-[13px] text-error">
                          Chưa có môn học cho khối này, vui lòng chọn khối khác
                        </span>
                      )}
                    </div>
                    <div className="text-[13px] text-error mt-1">
                      {errors.courses?.message}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button
              isPending={loadingRegister}
              className="mt-6 w-full"
              type="submit"
            >
              Đăng ký
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
