"use client";

import { Input } from "../../_common/text-field/Input";
import { Button } from "../../_common/Button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../../_common/Dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSession, updateSession } from "@/app/lib/services/session";
import { Session } from "@/app/types";
import { useCustomToast } from "@/app/lib/hooks/useToast";
import CustomTimePicker from "../../_common/text-field/CustomTimePicker";

const CreateSessionSchema = z
  .object({
    name: z.string().min(1, "Đây là trường bắt buộc"),
    startTime: z.string().min(1, "Đây là trường bắt buộc"),
    endTime: z.string().min(1, "Đây là trường bắt buộc"),
  })
  .refine(
    (data) => {
      const [startHour, startMinute] = data.startTime.split(":").map(Number);
      const [endHour, endMinute] = data.endTime.split(":").map(Number);
      const startTotalMinutes = startHour * 60 + startMinute;
      const endTotalMinutes = endHour * 60 + endMinute;
      return startTotalMinutes < endTotalMinutes;
    },
    {
      message: "Thời gian bắt đầu phải trước thời gian kết thúc",
      path: ["endTime"],
    },
  );

export type CreateSessionInputs = z.infer<typeof CreateSessionSchema>;

const SessionModal = ({
  isOpen,
  onClose,
  selectedSession,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedSession?: Session;
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<CreateSessionInputs>({
    resolver: zodResolver(CreateSessionSchema),
    defaultValues: {
      name: selectedSession?.name || "",
      startTime: selectedSession?.startTime || "",
      endTime: selectedSession?.endTime || "",
    },
  });
  const onSubmit = (data: CreateSessionInputs) => {
    if (selectedSession) {
      return useUpdateSessionMutation.mutate({
        id: selectedSession.id,
        name: data.name,
        startTime: data.startTime,
        endTime: data.endTime,
      });
    }
    return useCreateSessionMutation.mutate(data);
  };
  const { addToast } = useCustomToast();
  const queryClient = useQueryClient();
  const useCreateSessionMutation = useMutation({
    mutationFn: (data: CreateSessionInputs) => createSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Sessions"] });
      addToast.success("Tạo ca học mới thành công");
      onClose();
    },
    onError: () => {
      addToast.error("Tạo ca học thất bại");
    },
  });
  const useUpdateSessionMutation = useMutation({
    mutationFn: (data: Session) => updateSession(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Sessions"] });
      addToast.success("Chỉnh sửa ca học mới thành công");
      onClose();
    },
    onError: () => {
      addToast.error("Chỉnh sửa ca học thất bại");
    },
  });
  return (
    <Dialog className="w-1/2 md:w-1/3" isOpen={isOpen} onClose={onClose}>
      <DialogHeader className="text-center">Tạo ca học mới</DialogHeader>
      <DialogContent>
        <form
          id="SessionForm"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <Input
            placeholder="Tên ca học"
            label="Tên ca học"
            isError={!!errors.name}
            errorMsg={errors.name?.message}
            {...register("name")}
          />
          <CustomTimePicker
            control={control}
            name={"startTime"}
            prefix={"Giờ bắt đầu: "}
            format={"HH:mm"}
            isError={!!errors.startTime}
            errorMsg={errors.startTime?.message}
          />
          <CustomTimePicker
            control={control}
            name={"endTime"}
            prefix={"Giờ kết thúc: "}
            format={"HH:mm"}
            isError={!!errors.endTime}
            errorMsg={errors.endTime?.message}
          />
        </form>
      </DialogContent>
      <DialogFooter>
        {selectedSession ? (
          <Button
            form="SessionForm"
            isPending={useUpdateSessionMutation.status === "pending"}
            className="w-full"
          >
            Cập nhật ca học
          </Button>
        ) : (
          <Button
            form="SessionForm"
            isPending={useCreateSessionMutation.status === "pending"}
            className="w-full"
          >
            Tạo ca học mới
          </Button>
        )}
      </DialogFooter>
    </Dialog>
  );
};

export default SessionModal;
