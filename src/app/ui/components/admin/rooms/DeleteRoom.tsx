import { RoomItem } from "@/app/types";
import React, { memo, useState } from "react";
import Tooltip from "../../_common/Tooltip";
import { FaTrashAlt } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../../_common/Dialog";
import { Button } from "../../_common/Button";
import { useCustomToast } from "@/app/lib/hooks/useToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteRoom } from "@/app/lib/services";
import { useAppSelector } from "@/app/store/store";

interface Props {
  room: RoomItem;
}

function DeleteRoom({ room }: Props) {
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const { addToast } = useCustomToast();
  const queryClient = useQueryClient();
  const selectedBranchId = useAppSelector(
    (state) => state.branch.selectedBranchId,
  );

  const deleteRoomMutation = useMutation({
    mutationFn: (roomId: string) => deleteRoom(roomId),
    onSuccess: () => {
      addToast.success("Xóa phòng học thành công");
      queryClient.invalidateQueries({
        queryKey: ["Rooms", selectedBranchId],
        exact: false,
      });
    },
    onError: () => {
      addToast.error("Xóa phòng học thất bại");
    },
  });

  const handleDelete = async (roomId: string) => {
    deleteRoomMutation.mutate(roomId);
  };

  return (
    <>
      <button
        data-testid="delete-room-button"
        onClick={() => setShowEditModal(true)}
        className="flex justify-center items-center text-red-600 hover:text-red-800 transition-colors"
      >
        <Tooltip text="Xóa phòng học">
          <FaTrashAlt className="size-4 md:size-4" />
        </Tooltip>
      </button>
      <Dialog isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
        <DialogHeader>Xác nhận xóa phòng học</DialogHeader>
        <DialogContent>
          <div className="text-error">
            Bạn có chắc muốn xóa phòng học {room.name} không ?
          </div>
        </DialogContent>
        <DialogFooter className="flex gap-3 justify-end">
          <Button
            className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-all"
            onClick={() => setShowEditModal(false)}
          >
            Hủy
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => handleDelete(room.id)}
            isPending={deleteRoomMutation.status === "pending"}
          >
            Xóa phòng học
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default memo(DeleteRoom);
