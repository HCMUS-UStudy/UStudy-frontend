"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { createRoom } from "@/app/lib/services/room";
import { RoomRequest } from "@/app/types/room";
import { useQueryClient } from "@tanstack/react-query";
import { useCustomToast } from "@/app/lib/hooks/useToast";

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
      <button
        className="bg-primary-dark hover:bg-primary-darker text-white px-4 py-2 rounded-lg font-semibold transition-colors"
        onClick={() => setShowModal(true)}
        disabled={!selectedBranchId}
      >
        {buttonLabel}
      </button>

      {/* Modal for create room */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Thêm phòng học</h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Tên phòng</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  placeholder="Nhập tên phòng học..."
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  Sức chứa (học sinh)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={roomCapacity}
                  onChange={(e) => setRoomCapacity(Number(e.target.value))}
                  required
                  disabled={loading}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition-colors"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary-dark text-white hover:bg-primary-darker font-semibold transition-colors"
                  disabled={loading}
                >
                  {loading ? "Đang tạo..." : "Tạo phòng"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddRoomModal;
