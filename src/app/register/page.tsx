"use client";
import React, { useState } from "react";
import { Button } from "../ui/components/_common/Button";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import StudentBasicInformation from "../ui/components/user/student/create/StudentBasicInformation";
import StudentGradeSelector from "../ui/components/user/student/create/StudentGradeSelector";
import StudentBranchSelector from "../ui/components/user/student/create/StudentBranchSelector";
import StudentCoursesSelector from "../ui/components/user/student/create/StudentCoursesSelector";
import { studentRegister } from "../lib/services/register";
import { toast } from "react-toastify";
import RegisterSuccessfully from "../ui/components/user/student/create/StudentRegisterSuccessfully";

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
        branchSessionId: z
          .string({ message: "Đây là trường bắt buộc" })
          .min(1, "Đây là trường bắt buộc"),
      }),
    )
    .min(1, "Chọn tối thiểu một ca học"),
});

export type StudentRegisterInputs = z.infer<typeof StudentRegisterSchema>;

export default function StudentRegister() {
  const methods = useForm<StudentRegisterInputs>({
    resolver: zodResolver(StudentRegisterSchema),
    defaultValues: {
      gender: "MALE",
      courses: [],
      grades: "",
      branchId: "",
    },
  });
  const [loadingRegister, setLoadingRegister] = useState<boolean>(false);
  const [registerSuccessfully, setRegisterSuccessfully] =
    useState<boolean>(false);

  const onSubmit = async (data: StudentRegisterInputs) => {
    console.log(data);
    try {
      setLoadingRegister(true);
      const response = await studentRegister(data);
      // console.log(response);
      if (response.status === 200) {
        setRegisterSuccessfully(true);
      }
    } catch (error) {
      console.log(error);
      toast.error("Đăng ký thất bại", {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: false,
      });
    } finally {
      setLoadingRegister(false);
    }
  };
  if (registerSuccessfully) {
    return <RegisterSuccessfully />;
  }

  return (
    <FormProvider {...methods}>
      <div className="flex items-center justify-center h-screen overflow-auto">
        <div className="flex relative items-center h-full justify-center w-full bg-primary-light">
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="bg-foreground py-10 px-10 lg:px-16 xl:px-20 rounded-3xl shadow-lg z-[100] flex flex-col gap-5 w-3/4"
          >
            <div className="text-highlight-text text-3xl font-bold mb-3 flex justify-center">
              Ghi danh
            </div>
            <div className="flex flex-col lg:grid grid-cols-5 lg:divide-x-2 gap-5">
              <StudentBasicInformation />
              <div className="col-span-3 flex flex-col gap-4 lg:pl-10">
                <StudentGradeSelector />
                <StudentBranchSelector />
                <StudentCoursesSelector />
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
    </FormProvider>
  );
}
