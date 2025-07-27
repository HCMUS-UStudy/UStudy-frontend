import { GradeItem } from "@/app/types";
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
import { updateGrade } from "@/app/lib/services";
import { useCustomToast } from "@/app/lib/hooks/useToast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  grade?: GradeItem;
}

const editGradeSchema = z.object({
  name: z
    .string({ message: "Đây là trường bắt buộc" })
    .min(1, "Đây là trường bắt buộc"),
});

type Inputs = z.infer<typeof editGradeSchema>;

function EditGrade({ isOpen, onClose, grade }: Props) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<Inputs>({
    resolver: zodResolver(editGradeSchema),
  });
  useEffect(() => {
    setValue("name", grade?.name || "");
  }, [grade]);

  const { addToast } = useCustomToast();

  const queryClient = useQueryClient();

  const editGradeMutation = useMutation({
    mutationFn: ({ gradeId, name }: { gradeId: string; name: string }) => {
      return updateGrade({ gradeId, name });
    },
    onError: () => {
      addToast.error("Chỉnh sửa khối học thất bại");
      onClose();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Grades"] });
      addToast.success("Chỉnh sửa khối học thành công");
      onClose();
    },
  });
  const onSubmit = (data: Inputs) => {
    editGradeMutation.mutate({ gradeId: grade?.id || "", name: data.name });
  };
  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogHeader>Chỉnh sửa khối học</DialogHeader>
      <DialogContent>
        <form id="edit-course" onSubmit={handleSubmit(onSubmit)}>
          <Input
            className="w-full"
            type="text"
            label="Tên khối học*"
            alwaysShowLabel={true}
            placeholder="Nhập tên khối học (Bắt buộc)"
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
          isPending={editGradeMutation.status === "pending"}
        >
          Xác nhận
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

export default memo(EditGrade);
