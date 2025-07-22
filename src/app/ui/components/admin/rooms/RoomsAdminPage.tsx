"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import {
  getBranchRooms,
  updateRoom,
  deleteRoom,
} from "@/app/lib/services/room";
import { RoomItem } from "@/app/types/room";
import Pagination from "@/app/ui/components/_common/Pagination";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import Tooltip from "@/app/ui/components/_common/Tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/app/ui/components/_common/Table";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useCustomToast } from "@/app/lib/hooks/useToast";

interface RoomsAdminPageProps {
  searchQuery?: string;
}

const PAGE_SIZE = 10;

const RoomsAdminPage: React.FC<RoomsAdminPageProps> = ({
  searchQuery = "",
}) => {
  const { selectedBranchId } = useSelector((state: RootState) => state.branch);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomItem | null>(null);
  const [roomName, setRoomName] = useState("");
  const [roomCapacity, setRoomCapacity] = useState<number>(30);
  const [deletingRoomId, setDeletingRoomId] = useState<string | null>(null);

  const { addToast } = useCustomToast();
  const queryClient = useQueryClient();

  const {
    data: roomsData,
    error,
    status,
  } = useQuery({
    queryKey: ["Rooms", selectedBranchId, searchQuery, currentPage - 1],
    queryFn: () =>
      getBranchRooms(selectedBranchId!, currentPage - 1, PAGE_SIZE),
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
    enabled: !!selectedBranchId,
  });

  useEffect(() => {
    setTotalPages(roomsData?.data.totalPages || 1);
  }, [roomsData]);

  // Filter rooms based on search query
  const filteredRooms =
    roomsData?.data.content.filter(
      (room) =>
        !searchQuery ||
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.id.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  // Open edit modal
  const openEditModal = (room: RoomItem) => {
    setSelectedRoom(room);
    setRoomName(room.name);
    setRoomCapacity(room.capacity || 30);
    setShowEditModal(true);
  };

  // Handle edit submit
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

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    updateRoomMutation.mutate({
      id: selectedRoom.id,
      name: roomName.trim(),
      capacity: roomCapacity,
    });
  };

  // Handle delete
  const deleteRoomMutation = useMutation({
    mutationFn: (roomId: string) => deleteRoom(roomId),
    onSuccess: () => {
      addToast.success("Xóa phòng học thành công");
      setDeletingRoomId(null);
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

  if (!selectedBranchId) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <p className="text-gray-500">
          Vui lòng chọn chi nhánh để xem danh sách phòng học.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto mt-6 max-h-[400px]">
        <Table>
          <TableHeader columns={["Tên phòng", "Sức chứa", "Hành động"]} />
          <TableBody isLoading={status === "pending"}>
            {error ? (
              <TableRow>
                <TableCell colSpan={3} className="text-red-500">
                  {error.message}
                </TableCell>
              </TableRow>
            ) : filteredRooms.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 text-gray-400"
                >
                  {searchQuery
                    ? "Không tìm thấy phòng học phù hợp."
                    : "Không có phòng học nào."}
                </TableCell>
              </TableRow>
            ) : (
              filteredRooms.map((room) => (
                <TableRow
                  key={room.id}
                  className="hover:bg-primary-lighter cursor-pointer"
                >
                  <TableCell className="font-medium">{room.name}</TableCell>
                  <TableCell>{room.capacity || 30} học sinh</TableCell>
                  <TableCell className="flex justify-start items-center gap-2">
                    <button
                      data-testid="edit-room-button"
                      onClick={() => openEditModal(room)}
                      className="flex justify-center items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      <Tooltip text="Chỉnh sửa phòng học">
                        <FaEdit className="size-4 md:size-4" />
                      </Tooltip>
                    </button>
                    <button
                      data-testid="delete-room-button"
                      onClick={() => setDeletingRoomId(room.id)}
                      className="flex justify-center items-center text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Tooltip text="Xóa phòng học">
                        <FaTrashAlt className="size-4 md:size-4" />
                      </Tooltip>
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageClick={(page) => setCurrentPage(page)}
        handlePreviousPage={() =>
          setCurrentPage((prev) => Math.max(prev - 1, 1))
        }
        handleNextPage={() =>
          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
        }
      />

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Chỉnh sửa phòng học</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Tên phòng</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  required
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
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                  onClick={() => setShowEditModal(false)}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary-dark text-white hover:bg-primary-darker font-semibold"
                  disabled={updateRoomMutation.isPending}
                >
                  {updateRoomMutation.isPending
                    ? "Đang cập nhật..."
                    : "Cập nhật"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm delete dialog */}
      {deletingRoomId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-sm">
            <h2 className="text-lg font-bold mb-4">Xác nhận xóa phòng học</h2>
            <p className="mb-6">
              Bạn có chắc chắn muốn xóa phòng học này không?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                onClick={() => setDeletingRoomId(null)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-semibold"
                onClick={() => handleDelete(deletingRoomId)}
                disabled={deleteRoomMutation.isPending}
              >
                {deleteRoomMutation.isPending ? "Đang xóa..." : "Xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsAdminPage;
