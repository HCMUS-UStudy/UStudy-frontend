"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/app/ui/components/_common/text-field/Input";
import { Button } from "@/app/ui/components/_common/Button";
import { toast } from "react-toastify";
import { createNewCourse } from "@/app/lib/services/course";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/app/ui/components/_common/Dialog";
import TextArea from "@/app/ui/components/_common/text-field/TextArea";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCreatorFromCookies } from "@/app/lib/action";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CreateGradeSchema = z.object({
  creator: z.string(),
  name: z
    .string({ message: "Đây là trường bắt buộc" })
    .min(1, "Đây là trường bắt buộc"),
  description: z
    .string({ message: "Đây là trường bắt buộc" })
    .min(1, "Đây là trường bắt buộc"),
});

interface ModalCourseWrapperProps {
  buttonLabel: string;
}

type CreateGradeInputs = z.infer<typeof CreateGradeSchema>;

const AddCourseModal: React.FC<ModalCourseWrapperProps> = ({ buttonLabel }) => {
  const [showModal, setShowModal] = useState(false);
  const [creator, setCreator] = useState<string | null>(null);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateGradeInputs>({
    resolver: zodResolver(CreateGradeSchema),
    defaultValues: { creator: creator ?? undefined },
  });

  const queryClient = useQueryClient();

  const handleOpenModal = () => setShowModal(true);

  const createCourseMutation = useMutation({
    mutationFn: (data: CreateGradeInputs) => createNewCourse(data),
    onSuccess: () => {
      toast.success("Tạo môn học thành công!", {
        position: "bottom-right",
        autoClose: 3000,
      });
      setShowModal(false);
      queryClient.invalidateQueries({ queryKey: ["Courses"] });
    },
    onError: (error) => {
      console.error("Error creating course:", error);
      toast.error("Lỗi hệ thống. Vui lòng thử lại sau.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    },
  });

  const onSubmit = async (data: CreateGradeInputs) => {
    createCourseMutation.mutate(data);
  };

  useEffect(() => {
    const getDataFromCookies = async () => {
      setCreator(await getCreatorFromCookies());
    };
    getDataFromCookies();
  }, []);

  return (
    <>
      <Button onClick={handleOpenModal} className="pl-6 pr-6">
        {buttonLabel}
      </Button>

      <Dialog
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        className="w-[50vw]"
      >
        <DialogHeader>Tạo môn học mới</DialogHeader>
        <DialogContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-3"
            id="add-course-admin-form"
          >
            {/*Creator*/}
            <Input
              type="text"
              readOnly
              placeholder="Người tạo"
              label="Người tạo *"
              disabled
              {...register("creator")}
            />
            {/*Name*/}
            <div className="relative mb-4">
              <Input
                type="text"
                placeholder="Nhập tên môn học"
                label="Tên môn *"
                isError={errors.name !== undefined}
                errorMsg={errors.name?.message}
                {...register("name")}
              />
            </div>

            {/*Description*/}
            <div className="relative mb-4">
              <TextArea
                placeholder="Nhập mô tả môn học"
                isError={errors.description !== undefined}
                errorMsg={errors.description?.message}
                label="Mô tả môn học *"
                {...register("description")}
              />
            </div>
          </form>
        </DialogContent>
        <DialogFooter>
          {/*Buttons*/}
          <div className="flex justify-between">
            <Button
              form="add-course-admin-form"
              type="submit"
              className="w-full"
              disabled={createCourseMutation.isPending}
            >
              {createCourseMutation.isPending ? "Đang tạo..." : "Tạo môn học"}
            </Button>
          </div>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default AddCourseModal;
