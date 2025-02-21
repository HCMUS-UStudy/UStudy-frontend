"use client";

import React, { useState } from "react";
import { Input } from "@/app/ui/components/_common/text-field/Input";
import { Button } from "@/app/ui/components/_common/Button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/app/ui/components/_common/Dialog";
import { createNewGrade } from "@/app/lib/services/grade";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const CreateGradeSchema = z.object({
  creator: z.string(),
  name: z
    .string({ message: "(*) Đây là trường bắt buộc" })
    .min(1, "(*) Đây là trường bắt buộc"),
});

type CreateGradeInputs = z.infer<typeof CreateGradeSchema>;

interface ModalGradeWrapperProps {
  buttonLabel: string;
}

const AddGradeModal: React.FC<ModalGradeWrapperProps> = ({ buttonLabel }) => {
  const [showModal, setShowModal] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateGradeInputs>({
    resolver: zodResolver(CreateGradeSchema),
    defaultValues: { creator: localStorage.getItem("creator") ?? undefined },
  });
  const onSubmit = async (data: CreateGradeInputs) => {
    try {
      const response = await createNewGrade(data);
      console.log(response);

      if (response.statusCode === "OK") {
        toast.success("Tạo khối học thành công!", {
          position: "bottom-right",
          autoClose: 3000,
        });

        setShowModal(false);
        router.push("/admin/grades");
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
      toast.error("Lỗi hệ thống. Vui lòng thử lại sau.", {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  const router = useRouter();

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
      <ToastContainer />
      <Button onClick={handleOpenModal} className="pl-6 pr-6">
        {buttonLabel}
      </Button>

      <Dialog
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        className="w-[50vw]"
      >
        <DialogHeader>Tạo khối học mới</DialogHeader>
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
              {...register("creator")}
            />
            {/*Name*/}
            <div className="relative mb-4">
              <Input
                type="text"
                placeholder="Nhập tên khối"
                label="Tên khối *"
                {...register("name")}
              />
              <span className="text-error text-sm">{errors.name?.message}</span>
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

export default AddGradeModal;
