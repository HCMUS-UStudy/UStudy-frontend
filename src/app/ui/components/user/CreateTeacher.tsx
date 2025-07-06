"use client";
import React, { useEffect, useState } from "react";
import { Input } from "@/app/ui/components/_common/text-field/Input";
import { Button } from "@/app/ui/components/_common/Button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaCheck } from "react-icons/fa6";
import SelectorLoading from "../_common/loading/SelectorLoading";
import { getGradesByCourseId } from "@/app/lib/services/grade";
// import { getAllCourses } from "@/app/lib/services/course";
import { teacherRegister } from "@/app/lib/services/register";
import { useCustomToast } from "@/app/lib/hooks/useToast";
import { useQuery } from "@tanstack/react-query";
import { getAllCourses } from "@/app/lib/services/course";

const TeacherRegisterSchema = z.object({
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
  gender: z.enum(["MALE", "FEMALE"], { message: "Vui lòng chọn giới tính" }),
  phone: z
    .string({ message: "Đây là trường bắt buộc" })
    .regex(/^\d+$/, "Số điện thoại chỉ được chứa số")
    .min(9, "Số điện thoại từ 9 - 12 ký tự số")
    .max(12, "Số điện thoại từ 9 - 12 ký tự số"),
  address: z
    .string({ message: "Đây là trường bắt buộc" })
    .min(1, "Đây là trường bắt buộc"),
  courses: z
    .string({ message: "Đây là trường bắt buộc" })
    .min(1, "Đây là trường bắt buộc"),
  grades: z.array(z.string()).min(1, "Chọn tối thiểu một khối học"),
});

type TeacherRegisterInputs = z.infer<typeof TeacherRegisterSchema>;

export default function CreateTeacher() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<TeacherRegisterInputs>({
    resolver: zodResolver(TeacherRegisterSchema),
    defaultValues: {
      gender: "MALE",
      grades: [],
    },
  });
  const { addToast } = useCustomToast();
  const onSubmit = async (data: TeacherRegisterInputs) => {
    console.log(data);
    // call api
    try {
      setLoadingRegister(true);
      const response = await teacherRegister({
        name: data.name,
        email: data.email,
        birthday: data.birthday,
        phone: data.phone,
        address: data.address,
        courses: [data.courses],
        grades: data.grades,
        gender: data.gender,
      });
      if (response.status === 200) {
        addToast.success("Đăng ký dạy thành công!");
        reset();
      } else {
        addToast.error("Đăng ký dạy thất bại!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingRegister(false);
    }
  };

  const selectedCourse = watch("courses");

  // const [grades, setGrades] = useState<GradeItem[]>([]);
  // const [courses, setCourses] = useState<CourseItem[]>([]);
  // const [loadingCourses, setLoadingCourses] = useState<boolean>(false);
  // const [loadingGrades, setLoadingGrades] = useState<boolean>(false);
  const [loadingRegister, setLoadingRegister] = useState<boolean>(false);

  const { data: courses, status } = useQuery({
    queryKey: ["Courses"],
    queryFn: () => getAllCourses("", 15, 0),
  });

  // useEffect(() => {
  //   const fetchCourses = async () => {
  //     try {
  //       setLoadingCourses(true);
  //       const response = await getAllCourses("", 15, 0);
  //       setCourses(response.content);
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       setLoadingCourses(false);
  //     }
  //   };
  //   fetchCourses();
  // }, []);

  const { data: grades, status: gradesStatus } = useQuery({
    queryKey: ["Grades", selectedCourse],
    queryFn: () => getGradesByCourseId("", 0, selectedCourse),
    enabled: !!selectedCourse,
  });

  useEffect(() => {
    setValue("grades", []);
  }, [selectedCourse, setValue]);

  // useEffect(() => {
  //   const fetchGrades = async () => {
  //     try {
  //       setLoadingGrades(true);
  //       const response = await getGradesByCourseId("", 0, selectedCourse);
  //       setGrades(response.content);
  //       setValue("grades", []);
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       setLoadingGrades(false);
  //     }
  //   };
  //   fetchGrades();
  // }, [selectedCourse, setValue]);

  return (
    <div>
      <div className="font-bold text-[30px] md:text-[50px] tracking-tighter md:tracking-normal text-center">
        Trở thành<span className="text-highlight-text"> Giáo Viên</span>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[75vw] lg:w-[500px] md:w-[550px] mt-4 flex flex-col gap-3 md:gap-5"
      >
        <div>
          <Input
            className="w-full h-11 text-base"
            placeholder="Họ tên"
            isError={errors.name?.message !== undefined}
            errorMsg={errors.name?.message}
            {...register("name")}
          />
        </div>
        <div>
          <Input
            className="w-full h-11 text-base"
            placeholder="Email"
            isError={errors.email?.message !== undefined}
            errorMsg={errors.email?.message}
            {...register("email")}
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
        <div>
          <div className="flex gap-2 items-center w-full">
            <label htmlFor="birthday" className="text-gray-700">
              Ngày sinh:
            </label>
            <input
              id="birthday"
              className="px-3 py-2 text-base flex-1 rounded-md focus-within:ring-2 focus-within:ring-control-ring bg-transparent border-control-border border placeholder-control-placeholder outline-none"
              placeholder="Ngày sinh"
              type="date"
              {...register("birthday")}
            />
          </div>
          <div className="text-[13px] text-error mt-1">
            {errors.birthday?.message}
          </div>
        </div>
        <div>
          <Input
            type="text"
            className="w-full h-11 text-base"
            placeholder="Số điện thoại"
            isError={errors.phone?.message !== undefined}
            errorMsg={errors.phone?.message}
            {...register("phone")}
            // onChange={(e) => {
            //   e.target.value = e.target.value.replace(/\D/g, "");
            // }}
          />
        </div>
        <div>
          <Input
            className="w-full h-11 text-base"
            placeholder="Địa chỉ"
            isError={errors.address?.message !== undefined}
            errorMsg={errors.address?.message}
            {...register("address")}
          />
        </div>
        {status === "pending" ? (
          <SelectorLoading size="sm"></SelectorLoading>
        ) : (
          <>
            <div>
              <div className="text-gray-700 font-bold">
                Bạn mong muốn dạy môn học nào ?
              </div>
              <div className="flex flex-wrap gap-3 mt-3">
                {courses?.content.map((course) => (
                  <label
                    key={course.detailedCourseDto.id}
                    className="relative px-3 py-6 shrink-0 grow-0 has-[:checked]:border-primary-darker flex items-center justify-center h-20 w-20 border-2 border-control-border text-md rounded hover:border-primary-darkest hover:text-primary-darkest hover:bg-primary cursor-pointer transition-all"
                  >
                    <input
                      type="radio"
                      className="hidden peer"
                      value={course.detailedCourseDto.id}
                      {...register("courses")}
                    />
                    <span className="peer-checked:text-primary-darkest text-gray-700 transition-colors text-sm">
                      {course.detailedCourseDto.name}
                    </span>
                    <FaCheck className="size-16 absolute text-primary-darkest opacity-0 peer-checked:opacity-10 transition-all" />
                  </label>
                ))}
              </div>
              <div className="text-[13px] text-error mt-1">
                {errors.courses?.message}
              </div>
            </div>
          </>
        )}

        {selectedCourse !== null && selectedCourse !== undefined && (
          <div>
            <div className="text-gray-700 font-bold">
              Bạn mong muốn dạy khối nào ?
            </div>
            <div className="mt-3">
              {gradesStatus === "pending" ? (
                <SelectorLoading size="sm" numberOfItems={12}></SelectorLoading>
              ) : grades?.content.length !== 0 ? (
                <>
                  <div className="flex flex-wrap gap-3">
                    {grades?.content.map((grade) => (
                      <label
                        key={grade.id}
                        className="relative px-3 py-6 shrink-0 grow-0 has-[:checked]:border-primary-darker flex items-center justify-center h-20 w-20 border-2 border-control-border text-md rounded hover:border-primary-darkest hover:text-primary-darkest hover:bg-primary cursor-pointer transition-all"
                      >
                        <input
                          type="checkbox"
                          className="hidden peer"
                          value={grade.id}
                          {...register("grades")}
                        />
                        <span className="peer-checked:text-primary-darkest text-gray-700 transition-colors text-sm">
                          {grade.name}
                        </span>
                        <FaCheck className="size-16 absolute text-primary-darkest opacity-0 peer-checked:opacity-10 transition-all" />
                      </label>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-error">
                  Chưa có khối cho môn học này, vui lòng chọn môn học khác
                </div>
              )}
            </div>
            <div className="text-[13px] text-error mt-1">
              {errors.grades?.message}
            </div>
          </div>
        )}

        <Button
          isPending={loadingRegister}
          type="submit"
          className="mt-5 w-full"
        >
          Đăng ký
        </Button>
      </form>
    </div>
  );
}
