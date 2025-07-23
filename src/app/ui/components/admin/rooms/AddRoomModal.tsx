"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { createRoom } from "@/app/lib/services/room";
import { RoomRequest } from "@/app/types/room";
import { useQueryClient } from "@tanstack/react-query";
import { useCustomToast } from "@/app/lib/hooks/useToast";
import { Button } from "@/app/ui/components/_common/Button";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
} from "@/app/ui/components/_common/Dialog";
import { Input } from "../../_common/text-field";

interface AddRoomModalProps {
  buttonLabel: string;
}

const AddRoomModal: React.FC<AddRoomModalProps> = ({ buttonLabel }) => {
  const { selectedBranchId } = useSelector((state: RootState) => state.branch);
  const [showModal, setShowModal] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomCapacity, setRoomCapacity] = useState<number>(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { addToast } = useCustomToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBranchId) {
      setError("Vui lòng chọn chi nhánh.");
      return;
    }

    if (!roomName.trim()) {
      setError("Vui lòng nhập tên phòng học.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const roomData: RoomRequest = {
        name: roomName.trim(),
        capacity: roomCapacity,
      };

      await createRoom(selectedBranchId, roomData);
      setShowModal(false);
      setRoomName("");
      setRoomCapacity(30);
      setError(null);

      // Invalidate rooms query to refresh the table
      queryClient.invalidateQueries({
        queryKey: ["Rooms", selectedBranchId],
        exact: false,
      });

      // Show success toast
      addToast.success("Tạo phòng học thành công");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err);
      setError("Có lỗi xảy ra khi tạo phòng học.");
      addToast.error("Tạo phòng học thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setRoomName("");
    setRoomCapacity(30);
    setError(null);
  };

  return (
    <>
      <Button
        variant="primary"
        onClick={() => setShowModal(true)}
        disabled={!selectedBranchId}
      >
        {buttonLabel}
      </Button>

      <Dialog
        isOpen={showModal}
        onClose={handleClose}
        className="max-w-xl w-full"
      >
        <DialogHeader>Thêm phòng học</DialogHeader>
        <DialogContent>
          {/* {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )} */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Tên phòng</label>
              <Input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Nhập tên phòng học..."
                isError={!!error}
                errorMsg={error}
                disabled={loading}
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">
                Sức chứa (học sinh)
              </label>
              <Input
                type="number"
                min="1"
                max="100"
                value={roomCapacity}
                onChange={(e) => setRoomCapacity(Number(e.target.value))}
                isError={!!error}
                errorMsg={error}
                disabled={loading}
              />
            </div>
            {/* Buttons moved to DialogFooter */}
          </form>
        </DialogContent>
        <DialogFooter>
          <div className="flex justify-end space-x-2 w-full">
            <Button
              type="button"
              variant="basic"
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
              onClick={handleClose}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
              isPending={loading}
              form={undefined} // prevent warning, handled by form submit
              onClick={() => {
                // submit form manually
                const form = document.querySelector("form");
                if (form)
                  form.dispatchEvent(
                    new Event("submit", { cancelable: true, bubbles: true }),
                  );
              }}
            >
              {loading ? "Đang tạo..." : "Tạo phòng"}
            </Button>
          </div>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default AddRoomModal;
