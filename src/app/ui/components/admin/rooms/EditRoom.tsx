import { RoomItem } from "@/app/types";
import React, { memo, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../../_common/Dialog";
import { Input } from "../../_common/text-field";
import { Button } from "../../_common/Button";
import Tooltip from "../../_common/Tooltip";
import { FaEdit } from "react-icons/fa";
import { updateRoom } from "@/app/lib/services";
import { useCustomToast } from "@/app/lib/hooks/useToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@/app/store/store";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface Props {
  room: RoomItem;
}

const editRoom = z.object({
  name: z
    .string({ message: "Đây là trường bắt buộc" })
    .min(1, "Đây là trường bắt buộc"),
  capacity: z
    .string({ message: "Đây là trường bắt buộc" })
    .min(1, "Đây là trường bắt buộc")
    .transform((val) => Number(val))
    .refine((val) => {
      return Number.isInteger(val) && val > 1;
    }, "Sức chứa phải là số nguyên lớn hơn 1"),
});

type editRoom = z.infer<typeof editRoom>;

function EditRoom({ room }: Props) {
  const [showEditModal, setShowEditModal] = useState(false);
  const { addToast } = useCustomToast();
  const selectedBranchId = useAppSelector(
    (state) => state.branch.selectedBranchId,
  );

  const queryClient = useQueryClient();

  const updateRoomMutation = useMutation({
    mutationFn: (roomData: { id: string; name: string; capacity: number }) =>
      updateRoom(roomData.id, {
        name: roomData.name,
        capacity: roomData.capacity,
      }),
    onSuccess: () => {
      addToast.success("Cập nhật phòng học thành công");
      setShowEditModal(false);
      queryClient.invalidateQueries({
        queryKey: ["Rooms", selectedBranchId],
        exact: false,
      });
    },
    onError: () => {
      addToast.error("Cập nhật phòng học thất bại");
    },
  });

  const initialData = useMemo(
    () => ({
      name: room.name,
      capacity: room.capacity,
    }),
    [room],
  );

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<editRoom>({
    resolver: zodResolver(editRoom),
    defaultValues: initialData,
  });

  const onSubmit = (data: editRoom) => {
    return updateRoomMutation.mutate({
      id: room.id,
      name: data.name,
      capacity: data.capacity,
    });
  };

  return (
    <>
      <button
        data-testid="edit-room-button"
        onClick={() => setShowEditModal(true)}
        className="flex justify-center items-center text-blue-600 hover:text-blue-800 transition-colors"
      >
        <Tooltip text="Chỉnh sửa phòng học">
          <FaEdit className="size-4 md:size-4" />
        </Tooltip>
      </button>
      <Dialog isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
        <DialogHeader>Chỉnh sửa phòng học</DialogHeader>
        <DialogContent>
          <form
            id="editRoom"
            className="flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Input
              type="text"
              label="Tên phòng học"
              isError={!!errors.name}
              errorMsg={errors.name?.message}
              {...register("name")}
            />
            <Input
              type="number"
              label="Sức chứa"
              required={false}
              isError={!!errors.capacity}
              errorMsg={errors.capacity?.message}
              {...register("capacity")}
            />
          </form>
        </DialogContent>
        <DialogFooter>
          <Button
            form="editRoom"
            className="w-full"
            isPending={updateRoomMutation.status === "pending"}
          >
            Cập nhật phòng học
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default memo(EditRoom);
