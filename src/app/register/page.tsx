"use client";
import React, { useState } from "react";
import { Button } from "../ui/components/_common/Button";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import StudentBasicInformation from "../ui/components/user/student/create/StudentBasicInformation";
import { studentRegister } from "../lib/services/register";
import { toast } from "react-toastify";
import RegisterSuccessfully from "../ui/components/user/student/create/StudentRegisterSuccessfully";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CustomError } from "../types";
import registeringAnimation from "@/app/ui/lotties/registering.json";
import dynamic from "next/dynamic";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const StudentRegisterSchema = z
  .object({
    name: z
      .string({ message: "Đây là trường bắt buộc" })
      .min(1, "Đây là trường bắt buộc"),
    username: z
      .string({ message: "Đây là trường bắt buộc" })
      .min(1, "Đây là trường bắt buộc"),
    password: z
      .string({ message: "Đây là trường bắt buộc" })
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        "Mật khẩu phải bao gồm cả chữ cái và chữ số",
      ),
    retypePassword: z
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
    gender: z.enum(["MALE", "FEMALE"], { message: "Vui lòng chọn giới tính" }),
  })
  .refine(
    (data) => {
      return data.password === data.retypePassword;
    },
    {
      path: ["retypePassword"],
      message: "Mật khẩu nhập lại không khớp",
    },
  );

export type StudentRegisterInputs = z.infer<typeof StudentRegisterSchema>;

export default function StudentRegister() {
  const methods = useForm<StudentRegisterInputs>({
    resolver: zodResolver(StudentRegisterSchema),
    defaultValues: {
      gender: "MALE",
    },
  });
  const queryClient = useQueryClient();
  const useRegisterMutation = useMutation({
    mutationFn: (data: StudentRegisterInputs) => studentRegister(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["RegisterStudents"] });
      setRegisterSuccessfully(true);
    },
    onError: (error) => {
      const customError = error as CustomError;
      methods.setError("email", { message: String(customError.data) });
      toast.error(String(customError.data), {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: true,
      });
    },
  });
  // const [loadingRegister, setLoadingRegister] = useState<boolean>(false);
  const [registerSuccessfully, setRegisterSuccessfully] =
    useState<boolean>(false);

  const onSubmit = async (data: StudentRegisterInputs) => {
    // console.log(data);
    useRegisterMutation.mutate(data);
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
            className="relative bg-foreground py-10 px-10 lg:px-16 xl:px-20 rounded-3xl shadow-lg z-[100] flex flex-col gap-2 w-2/3"
          >
            <Lottie
              className="absolute -top-28 -left-20 size-56"
              animationData={registeringAnimation}
              loop
            />

            <div className="text-highlight-text text-3xl font-bold mb-3 flex justify-center">
              Ghi danh
            </div>
            <StudentBasicInformation />
            {/* <div className="col-span-3 flex flex-col gap-4 lg:pl-10">
                <StudentGradeSelector />
                <StudentBranchSelector />
                <StudentCoursesSelector />
              </div> */}
            <Button
              isPending={useRegisterMutation.status === "pending"}
              className="mt-6 w-full text-md"
              type="submit"
            >
              Đăng ký tài khoản
            </Button>
          </form>
        </div>
      </div>
    </FormProvider>
  );
}
