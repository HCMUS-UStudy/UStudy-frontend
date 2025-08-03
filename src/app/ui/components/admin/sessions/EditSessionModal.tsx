"use client";

import { Button } from "@/app/ui/components/_common/Button";
import { memo, useMemo, useState } from "react";
import { Session } from "@/app/types";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../../_common/Dialog";
import { Input } from "../../_common/text-field";
import { FaEdit } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CustomTimePicker from "../../_common/text-field/CustomTimePicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSession } from "@/app/lib/services";
import { useCustomToast } from "@/app/lib/hooks/useToast";

const editSessionSchema = z.object({
  id: z.string().optional(),
  name: z
    .string({ message: "Đây là trường bắt buộc" })
    .min(1, "Đây là trường bắt buộc"),
  startTime: z
    .string({ message: "Đây là trường bắt buộc" })
    .min(1, "Đây là trường bắt buộc"),
  endTime: z
    .string({ message: "Đây là trường bắt buộc" })
    .min(1, "Đây là trường bắt buộc"),
});

function EditSessionModal({ session }: { session: Session }) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const defaultValues: Session = useMemo(() => {
    return {
      id: session.id,
      name: session.name,
      startTime: session.startTime,
      endTime: session.endTime,
    };
  }, [session]);

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<Session>({
    resolver: zodResolver(editSessionSchema),
    defaultValues: defaultValues,
  });

  // // Update form when session prop changes
  const { addToast } = useCustomToast();
  const queryClient = useQueryClient();

  const updateSessionMutation = useMutation({
    mutationFn: (updatedSession: Session) => updateSession(updatedSession),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["Sessions"] });
      addToast.success("Cập nhật ca học thành công");
      setIsOpen(false);
    },
    onError: () => {
      addToast.error("Có lỗi xảy ra khi cập nhật ca học");
    },
  });

  const onSubmit = (data: Session) => {
    updateSessionMutation.mutate(data);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-600 hover:text-blue-800 transition-all"
      >
        <FaEdit className="size-4 md:size-5" />
      </button>
      <Dialog
        className="w-1/3"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <DialogHeader>Chỉnh sửa ca học</DialogHeader>
        <DialogContent>
          <form
            id="EditSession"
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
            action=""
          >
            <Input
              label="Tên ca học"
              placeholder="Nhập tên ca học..."
              isError={!!errors.name}
              errorMsg={errors.name?.message}
              {...register("name")}
            />
            <CustomTimePicker
              prefix={"Giờ bắt đầu:"}
              format={"HH:mm"}
              control={control}
              isError={!!errors.startTime}
              errorMsg={errors.startTime?.message}
              name="startTime"
            />
            <CustomTimePicker
              prefix={"Giờ kết thúc:"}
              format={"HH:mm"}
              control={control}
              isError={!!errors.endTime}
              errorMsg={errors.endTime?.message}
              name="endTime"
            />
          </form>
        </DialogContent>
        <DialogFooter>
          <Button
            form="EditSession"
            className="w-full"
            isPending={updateSessionMutation.status === "pending"}
          >
            Chỉnh sửa
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default memo(EditSessionModal);
