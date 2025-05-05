"use client";
import { createNewClass } from "@/app/lib/services/class";
import { RootState } from "@/app/store/store";
import { Button } from "@/app/ui/components/_common/Button";
import ClassDescription from "@/app/ui/components/admin/classes/create/ClassDescription";
import CourseSelector from "@/app/ui/components/admin/classes/create/CourseSelector";
import DayRoomSessionSelector from "@/app/ui/components/admin/classes/create/DayRoomSessionSelector";
import DurationSelector from "@/app/ui/components/admin/classes/create/DurationSelector";
import GradeSelector from "@/app/ui/components/admin/classes/create/GradeSelector";
import NameSelector from "@/app/ui/components/admin/classes/create/NameSelector";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { z } from "zod";

const today = new Date().toISOString().split("T")[0];

const CreateClassSchema = z.object({
  name: z
    .string({ message: "Đây là trường bắt buộc" })
    .min(1, "Đây là trường bắt buộc"),
  courseId: z
    .string({ message: "Đây là trường bắt buộc" })
    .min(1, "Đây là trường bắt buộc"),
  gradeId: z
    .string({ message: "Đây là trường bắt buộc" })
    .min(1, "Vui lòng chọn khối cho lớp học"),
  startDate: z
    .string({
      message: "Vui lòng chọn đầy đủ thời gian học và ngày bắt đầu học",
    })
    .min(1, "Vui lòng chọn ngày bắt đầu học")
    .refine((date) => date >= today, {
      message: "Ngày bắt đầu phải lớn hơn hoặc bằng hôm nay",
    }),
  numLessons: z
    .number({ message: "Vui lòng nhập số buổi học" })
    .gte(1, "Số buổi học phải lớn hơn hoặc bằng 1"),
  description: z.optional(z.string()),
  branchId: z
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
        roomId: z.string().nullable(),
      }),
    )
    .min(1, "Vui lòng chọn đầy đủ ngày học"),
});

export type CreateClassInputs = z.infer<typeof CreateClassSchema>;

export default function CreateClass() {
  const { selectedBranchId } = useSelector((state: RootState) => state.branch);
  const methods = useForm<CreateClassInputs>({
    resolver: zodResolver(CreateClassSchema),
    defaultValues: {
      classTimes: [],
      gradeId: "",
      startDate: "",
      numLessons: 0,
      branchId: selectedBranchId ?? undefined,
    },
  });
  useEffect(() => {
    console.log(methods.formState.errors);
  }, [methods.formState.errors]);
  const router = useRouter();
  const queryClient = useQueryClient();
  const useCreateClassMutation = useMutation({
    mutationFn: (classData: CreateClassInputs) => createNewClass(classData),
    onError: (error) => {
      console.log(error.message);
      toast.error("Tạo lớp học thất bại", {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: false,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Classes"] });
      toast.success("Tạo lớp học thành công", {
        position: "bottom-right",
        autoClose: 3000,
        pauseOnHover: false,
      });
      router.push("/admin/classes");
    },
  });

  const onSubmit = (data: CreateClassInputs) => {
    console.log(data);
    useCreateClassMutation.mutate(data);
  };

  useEffect(() => {
    console.log(methods.formState.errors);
  }, [methods]);

  // const [loading, setLoading] = useState<boolean>(false);

  // const onSubmit = async (data: CreateClassInputs) => {
  //   try {
  //     setLoading(true);
  //     const response = await createNewClass(data);
  //     console.log(response);
  //     if (response.status === 200) {
  //       toast.success("Tạo lớp học thành công ! Đang chuyển hướng...", {
  //         position: "bottom-right",
  //         autoClose: 3000,
  //         pauseOnHover: false,
  //       });
  //       router.push("/admin/classes");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Tạo lớp học thất bại", {
  //       position: "bottom-right",
  //       autoClose: 3000,
  //       pauseOnHover: false,
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };
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
          {/* <SessionSelector /> */}
          <DurationSelector />
          {/* <RoomSelector /> */}
          {/* {numLessons !== 0 && !isNaN(numLessons) && startDate !== "" && (
            <DayRoomSessionSelector />
          )} */}
          <DayRoomSessionSelector />
          <ClassDescription />
          <Button
            isPending={useCreateClassMutation.status === "pending"}
            type="submit"
            className="w-full"
          >
            Tạo lớp học mới
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
