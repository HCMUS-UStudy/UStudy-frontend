"use client";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/components/_common/text-field/Input";
import { Button } from "../ui/components/_common/Button";
import {
  Branch,
  ClassSessionItem,
  CourseDto,
  DaysInWeek,
  GradeItem,
} from "../types/type";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getAllGrades } from "../lib/services/grade";
import SelectorLoading from "../ui/components/admin/classes/create/SelectorLoading";
import { FaCheck } from "react-icons/fa6";
import { getCoursesByGradeId } from "../lib/services/course";
import { Select, SelectItem } from "../ui/components/_common/Select";
import Loading from "../ui/components/_common/Loading";
import { getAllBranches } from "../lib/services/branch";
import { getClassSession } from "../lib/services/session";

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
  classTimes: z
    .array(
      z.object({
        day: z.enum([
          "MONDAY",
          "TUESDAY",
          "WEDNESDAY",
          "THURSDAY",
          "FRIDAY",
          "SATURDAY",
          "SUNDAY",
        ]),
        startTime: z
          .string({ message: "Đây là trường bắt buộc" })
          .min(1, "Đây là trường bắt buộc"),
        endTime: z
          .string({ message: "Đây là trường bắt buộc" })
          .min(1, "Đây là trường bắt buộc"),
      }),
    )
    .min(1, "Chọn tối thiểu một ca học"),
});

export type StudentRegisterInputs = z.infer<typeof StudentRegisterSchema>;

export default function StudentRegister() {
  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
    clearErrors,
    setValue,
  } = useForm<StudentRegisterInputs>({
    resolver: zodResolver(StudentRegisterSchema),
    defaultValues: {
      gender: "MALE",
      courses: [],
      grades: "",
      branchId: "",
    },
  });
  const [grades, setGrades] = useState<GradeItem[]>([]);
  const [courses, setCourses] = useState<CourseDto[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingCourse, setLoadingCourses] = useState<boolean>(false);
  const [loadingGrades, setLoadingGrades] = useState<boolean>(false);
  const [loadingRegister, setLoadingRegister] = useState<boolean>(false);
  const [loadingClassSession, setLoadingClassSession] =
    useState<boolean>(false);
  const selectedGrade = watch("grades");
  const selectedBranch = watch("branchId");
  const selectedCourses = watch("courses");

  const [classSessions, setClassSessions] = useState<ClassSessionItem[]>([]);

  const DayMapping: Record<DaysInWeek, string> = {
    MONDAY: "Thứ Hai",
    TUESDAY: "Thứ Ba",
    WEDNESDAY: "Thứ Tư",
    THURSDAY: "Thứ Năm",
    FRIDAY: "Thứ Sáu",
    SATURDAY: "Thứ Bảy",
    SUNDAY: "Chủ Nhật",
  };

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

  const handleSelectGrade = (gradeId: string) => {
    setValue("grades", gradeId);
    clearErrors("grades");
    setValue("classTimes", []);
  };

  const handleSelectBranch = (branchId: string) => {
    setValue("branchId", branchId);
    clearErrors("branchId");
    setValue("classTimes", []);
  };

  const handleSelectCourse = async (courseId: string) => {
    const currentCourses = [...selectedCourses];
    const updatedClassSessions = [...classSessions];
    let isAdded = false;
    if (!selectedCourses.includes(courseId)) {
      setValue("courses", [...currentCourses, courseId]);
      isAdded = true;
    } else {
      setValue(
        "courses",
        currentCourses.filter((item) => item !== courseId),
      );
    }
    try {
      setLoadingClassSession(true);
      const response = await getClassSession(
        selectedBranch,
        selectedGrade,
        courseId,
      );
      // console.log(response);
      if (isAdded) {
        setClassSessions((currentSession) => [...currentSession, ...response]);
      } else {
        response.map((item) => {
          const index = updatedClassSessions.indexOf(item);
          updatedClassSessions.splice(index, 1);
        });
        setClassSessions(updatedClassSessions);
      }
      clearErrors("classTimes");
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingClassSession(false);
    }
  };
  useEffect(() => console.log(classSessions), [classSessions]);

  const handleSelectClassSession = (
    day: DaysInWeek,
    startTime: string,
    endTime: string,
  ) => {
    const currentClassTimes = watch("classTimes");
    const isSelected = currentClassTimes.some(
      (item) =>
        item.day === day &&
        item.startTime === startTime &&
        item.endTime === endTime,
    );
    const updatedData = isSelected
      ? currentClassTimes.filter(
          (item) =>
            !(
              item.day === day &&
              item.startTime === startTime &&
              item.endTime === endTime
            ),
        )
      : [...currentClassTimes, { day, startTime, endTime }];
    setValue("classTimes", updatedData);
  };

  useEffect(() => {
    const fetchGradesAndBranches = async () => {
      try {
        setLoadingGrades(true);
        const [gradesRes, branchRes] = await Promise.all([
          getAllGrades("", 15, 0),
          getAllBranches(0, 20),
        ]);
        setGrades(gradesRes.content);
        setBranches(branchRes.content);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingGrades(false);
      }
    };
    fetchGradesAndBranches();
    return;
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      if (selectedGrade === "") {
        return;
      }
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
    return;
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
              <div className="col-span-3 flex flex-col gap-4 pl-10">
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
                        handleSelectGrade(gradeId as string)
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
                {loadingGrades ? (
                  <div className="px-2 py-0.5 flex justify-start border-2 border-slate-300 rounded-md">
                    <Loading text="Chọn chi nhánh" />
                  </div>
                ) : (
                  <div>
                    <Select
                      name="BranchSelector"
                      defaultLabel="Chọn chi nhánh"
                      onValueChange={(branchId) =>
                        handleSelectBranch(branchId as string)
                      }
                    >
                      {branches.map((branch) => (
                        <SelectItem key={branch.id} value={branch.id}>
                          {branch.name}
                        </SelectItem>
                      ))}
                    </Select>
                    <span className="text-[13px] text-error">
                      {errors.branchId?.message}
                    </span>
                  </div>
                )}

                {selectedGrade !== "" && (
                  <div>
                    <div className="text-gray-700 font-bold">
                      Bạn mong muốn học môn nào ?
                    </div>
                    <div>
                      {loadingCourse ? (
                        <SelectorLoading
                          size="sm"
                          numberOfItems={5}
                        ></SelectorLoading>
                      ) : courses.length !== 0 ? (
                        <>
                          <div className="flex gap-3 mt-2">
                            {courses.map((course) => (
                              <label
                                key={course.id}
                                className="relative px-3 py-6 shrink-0 grow-0 has-[:checked]:border-primary-darker flex items-center justify-center h-20 w-20 border-2 border-control-border text-md rounded hover:border-primary-darkest hover:text-primary-darkest hover:bg-primary cursor-pointer transition-all"
                              >
                                <input
                                  type="checkbox"
                                  className="hidden peer"
                                  // value={course.id}
                                  // {...register("courses")}
                                  checked={selectedCourses.includes(course.id)}
                                  onChange={() => handleSelectCourse(course.id)}
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
                {selectedGrade !== "" &&
                  selectedBranch !== "" &&
                  selectedCourses.length !== 0 && (
                    <div>
                      <div className="text-gray-700 font-bold">Chọn ca học</div>
                      <div>
                        {loadingClassSession ? (
                          <SelectorLoading
                            size="sm"
                            numberOfItems={5}
                          ></SelectorLoading>
                        ) : classSessions.length !== 0 ? (
                          <>
                            <div className="flex flex-col mt-3 overflow-auto h-52 divide-y">
                              {/* {classSessions.map((cs, index) => (
                                <label
                                  key={index}
                                  className="relative px-3 py-2 shrink-0 grow-0 has-[:checked]:border-primary-darker flex items-center justify-start border-control-border text-md hover:border-primary-darkest hover:text-primary-darkest hover:bg-primary has-[:checked]:bg-primary-lighter cursor-pointer transition-all"
                                >
                                  <input
                                    type="checkbox"
                                    className="hidden peer"
                                    name="ClassSessionSelector"
                                    onChange={() =>
                                      handleSelectClassSession(
                                        cs.day,
                                        cs.startTime,
                                        cs.endTime,
                                      )
                                    }
                                  />
                                  <span className="peer-checked:text-primary-darkest text-gray-700 transition-colors text-sm">
                                    {DayMapping[cs.day]} -{" "}
                                    {cs.startTime.slice(0, -3)} -{" "}
                                    {cs.endTime.slice(0, -3)}
                                  </span>
                                  <FaCheck className="size-6 absolute right-3 text-primary-darkest opacity-0 peer-checked:opacity-70 transition-all" />
                                </label>
                              ))} */}
                              {[
                                ...new Map(
                                  classSessions.map((cs) => [
                                    `${cs.day}-${cs.startTime}-${cs.endTime}`,
                                    cs,
                                  ]),
                                ).values(),
                              ].map((cs, index) => (
                                <label
                                  key={index}
                                  className="relative px-3 py-2 shrink-0 grow-0 has-[:checked]:border-primary-darker flex items-center justify-start border-control-border text-md hover:border-primary-darkest hover:text-primary-darkest hover:bg-primary has-[:checked]:bg-primary-lighter cursor-pointer transition-all"
                                >
                                  <input
                                    type="checkbox"
                                    className="hidden peer"
                                    name="ClassSessionSelector"
                                    onChange={() =>
                                      handleSelectClassSession(
                                        cs.day,
                                        cs.startTime,
                                        cs.endTime,
                                      )
                                    }
                                  />
                                  <span className="peer-checked:text-primary-darkest text-gray-700 transition-colors text-sm">
                                    {DayMapping[cs.day]} -{" "}
                                    {cs.startTime.slice(0, -3)} -{" "}
                                    {cs.endTime.slice(0, -3)}
                                  </span>
                                  <FaCheck className="size-6 absolute right-3 text-primary-darkest opacity-0 peer-checked:opacity-70 transition-all" />
                                </label>
                              ))}
                            </div>
                          </>
                        ) : (
                          <span className="text-[13px] text-error">
                            Chưa có ca học cho môn học và khối này, vui lòng
                            chọn môn học hoặc khối khác
                          </span>
                        )}
                      </div>
                      <div className="text-[13px] text-error mt-1">
                        {errors.classTimes?.message}
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
