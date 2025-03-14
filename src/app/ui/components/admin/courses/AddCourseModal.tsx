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
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCreatorFromCookies } from "@/app/lib/action";

const CreateGradeSchema = z.object({
  creator: z.string(),
  name: z
    .string({ message: "(*) Đây là trường bắt buộc" })
    .min(1, "(*) Đây là trường bắt buộc"),
  description: z
    .string({ message: "(*) Đây là trường bắt buộc" })
    .min(1, "(*) Đây là trường bắt buộc"),
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

  const router = useRouter();

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const onSubmit = async (data: CreateGradeInputs) => {
    try {
      const response = await createNewCourse(data);
      console.log(response);

      if (response.statusCode === "OK") {
        toast.success("Tạo môn học thành công!", {
          position: "bottom-right",
          autoClose: 3000,
        });

        setShowModal(false);
        router.push("/admin/courses");
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      toast.error("Lỗi hệ thống. Vui lòng thử lại sau.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
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
            className="space-y-6"
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
                {...register("name")}
              />
              <span className="text-error text-sm">{errors.name?.message}</span>
            </div>

            {/*Description*/}
            <div className="relative mb-4">
              <TextArea
                placeholder="Nhập mô tả môn học"
                label="Mô tả môn học *"
                {...register("description")}
              />
              <span className="text-error text-sm">
                {errors.description?.message}
              </span>
            </div>
          </form>
        </DialogContent>
        <DialogFooter>
          {/*Buttons*/}
          <div className="flex justify-between">
            <Button
              variant="basic"
              onClick={handleCloseModal}
              className="bg-neutral hover:bg-neutral/80 text-primary-text w-[15%]"
            >
              Hủy
            </Button>
            <Button
              form="add-course-admin-form"
              type="submit"
              className="w-[15%]"
            >
              Tạo
            </Button>
          </div>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default AddCourseModal;
