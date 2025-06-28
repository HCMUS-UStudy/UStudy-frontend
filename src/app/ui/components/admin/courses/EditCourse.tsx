import { CourseItem, CourseSchema } from "@/app/types";
import React, { memo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../../_common/Dialog";
import { Input } from "../../_common/text-field";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../../_common/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCourse } from "@/app/lib/services";
import { useCustomToast } from "@/app/lib/hooks/useToast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  course?: CourseItem;
}

const EditCourseSchema = z.object({
  name: z
    .string({ message: "Đây là trường bắt buộc" })
    .min(1, "Đây là trường bắt buộc"),
});

type Inputs = z.infer<typeof EditCourseSchema>;

function EditCourse({ isOpen, onClose, course }: Props) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<Inputs>({
    resolver: zodResolver(EditCourseSchema),
  });
  useEffect(() => {
    setValue("name", course?.detailedCourseDto.name || "");
  }, [course]);

  const { addToast } = useCustomToast();

  const queryClient = useQueryClient();

  const editCourseMutation = useMutation({
    mutationFn: ({
      courseId,
      data,
    }: {
      courseId: string;
      data: CourseSchema;
    }) => {
      return updateCourse({ courseId, data });
    },
    onError: () => {
      addToast.error("Chỉnh sửa lớp học thất bại");
      onClose();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Courses"] });
      addToast.success("Chỉnh sửa lớp học thành công");
      onClose();
    },
  });
  const onSubmit = (data: Inputs) => {
    editCourseMutation.mutate({
      courseId: course?.detailedCourseDto.id || "",
      data: {
        name: data.name,
        description: "",
      },
    });
  };
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>Chỉnh sửa môn học</DialogHeader>
      <DialogContent>
        <form id="edit-course" onSubmit={handleSubmit(onSubmit)}>
          <Input
            className="w-full"
            type="text"
            label="Tên môn học"
            alwaysShowLabel={true}
            placeholder="Enter your full name"
            isError={!!errors.name}
            errorMsg={errors.name?.message}
            {...register("name")}
          />
        </form>
      </DialogContent>
      <DialogFooter>
        <Button
          form="edit-course"
          className="w-full"
          isPending={editCourseMutation.status === "pending"}
        >
          Xác nhận
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default memo(EditCourse);
