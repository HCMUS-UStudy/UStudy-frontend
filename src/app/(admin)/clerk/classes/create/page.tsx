"use client";
import { Button } from "@/app/ui/components/_common/Button";
import ClassDescription from "@/app/ui/components/ClassManagement/CreateClass/ClassDescription";
import CourseSelector from "@/app/ui/components/ClassManagement/CreateClass/CourseSelector";
import DurationSelector from "@/app/ui/components/ClassManagement/CreateClass/DurationSelector";
import GradeSelector from "@/app/ui/components/ClassManagement/CreateClass/GradeSelector";
import NameSelector from "@/app/ui/components/ClassManagement/CreateClass/NameSelector";
import RoomSelector from "@/app/ui/components/ClassManagement/CreateClass/RoomSelector";
import SessionSelector from "@/app/ui/components/ClassManagement/CreateClass/SessionSelector";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

const today = new Date().toISOString().split("T")[0];

const CreateClassSchema = z.object({
  name: z
    .string({ message: "Đây là trường bắt buộc" })
    .min(1, "Đây là trường bắt buộc"),
  gradeId: z
    .string({ message: "Đây là trường bắt buộc" })
    .min(1, "Đây là trường bắt buộc"),
  courseId: z
    .string({ message: "Đây là trường bắt buộc" })
    .min(1, "Đây là trường bắt buộc"),
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
    .min(1, "Vui lòng chọn đầy đủ thứ và ca học"),
  startDate: z
    .string({
      message: "Vui lòng chọn đầy đủ thời gian học và ngày bắt đầu học",
    })
    .min(1, "Vui lòng chọn đầy đủ thời gian học và ngày bắt đầu học")
    .refine((date) => date >= today, {
      message: "Ngày bắt đầu phải lớn hơn hoặc bằng hôm nay",
    }),
  endDate: z
    .string({ message: "Đây là trường bắt buộc" })
    .min(1, "Đây là trường bắt buộc"),
  roomId: z
    .string({ message: "Đây là trường bắt buộc" })
    .min(1, "Đây là trường bắt buộc"),
  description: z.optional(z.string()),
});

export type CreateClassInputs = z.infer<typeof CreateClassSchema>;

export default function CreateClass() {
  const methods = useForm<CreateClassInputs>({
    resolver: zodResolver(CreateClassSchema),
    defaultValues: {
      classTimes: [],
      gradeId: "",
      startDate: "",
      endDate: "",
    },
  });
  const onSubmit = (data: CreateClassInputs) => {
    console.log(data);
  };
  return (
    <div>
      <h1 className="font-bold text-center mb-5">TẠO LỚP HỌC MỚI</h1>
      <FormProvider {...methods}>
        <form
          className="flex flex-col gap-2"
          onSubmit={methods.handleSubmit(onSubmit)}
        >
          <NameSelector />
          <GradeSelector />
          <CourseSelector />
          <SessionSelector />
          <DurationSelector />
          <RoomSelector />
          <ClassDescription />
          <Button type="submit" className="w-full">
            Tạo lớp học mới
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
