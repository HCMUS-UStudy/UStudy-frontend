"use client";

import React from "react";
import { Input } from "@/app/ui/components/_common/text-field/Input";
import { Button } from "@/app/ui/components/_common/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/app/ui/components/_common/Dialog";
import { createNewGrade } from "@/app/lib/services/grade";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCustomToast } from "@/app/lib/hooks/useToast";

const CreateGradeSchema = z.object({
  name: z
    .string({ message: "Đây là trường bắt buộc" })
    .min(1, "Đây là trường bắt buộc"),
});

export type CreateGradeInputs = z.infer<typeof CreateGradeSchema>;

const AddGradeModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<CreateGradeInputs>({
    resolver: zodResolver(CreateGradeSchema),
    // defaultValues: { creator: localStorage.getItem("creator") ?? undefined },
  });
  const onSubmit = (data: CreateGradeInputs) => {
    useCreateGradeMutation.mutate(data);
  };
  const queryClient = useQueryClient();
  const { addToast } = useCustomToast();
  const useCreateGradeMutation = useMutation({
    mutationFn: (data: CreateGradeInputs) => createNewGrade(data),
    onError: (error) => {
      console.log(error.message);
      addToast.error("Tạo khối học thất bại");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Grades"] });
      addToast.success("Tạo khối học thành công");
      onClose();
    },
  });

  return (
    <>
      <Dialog isOpen={isOpen} onClose={onClose} className="max-w-sm w-full">
        <DialogHeader>Tạo khối học mới</DialogHeader>
        <DialogContent>
          <form id="add-course-admin-form" onSubmit={handleSubmit(onSubmit)}>
            {/*Creator*/}
            {/* <Input
          type="text"
          readOnly
          placeholder="Người tạo"
          label="Người tạo *"
          disabled
          {...register("creator")}
        /> */}
            {/*Name*/}
            <Input
              type="text"
              placeholder="Nhập tên khối (Bắt buộc)"
              label="Tên khối *"
              isError={!!errors.name}
              errorMsg={errors.name?.message}
              {...register("name")}
            />
          </form>
        </DialogContent>
        <DialogFooter>
          <Button
            isPending={useCreateGradeMutation.status === "pending"}
            form="add-course-admin-form"
            type="submit"
            className="w-full"
          >
            Tạo khối mới
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default AddGradeModal;
