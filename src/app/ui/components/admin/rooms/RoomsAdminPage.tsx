"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { RootState } from "@/app/store/store";
import {
  getBranchRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from "@/app/lib/services/room";
import { RoomItem, RoomRequest } from "@/app/types/room";
import Pagination from "@/app/ui/components/_common/Pagination";
import BranchSelector from "@/app/ui/components/admin/BranchSelector";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import { Search, Building2 } from "lucide-react";
import Tooltip from "@/app/ui/components/_common/Tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/app/ui/components/_common/Table";

const PAGE_SIZE = 10;

const RoomsAdminPage: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  const { selectedBranchId } = useSelector((state: RootState) => state.branch);
  const [rooms, setRooms] = useState<RoomItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedRoom, setSelectedRoom] = useState<RoomItem | null>(null);
  const [roomName, setRoomName] = useState("");
  const [roomCapacity, setRoomCapacity] = useState<number>(30);
  const [deletingRoomId, setDeletingRoomId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // URL state management - only access after mounting
  const query = mounted ? searchParams.get("query") || "" : "";
  const page = mounted ? Number(searchParams.get("page")) || 1 : 1;

  // Handler cập nhật URL
  const updateUrl = (paramsObj: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(paramsObj).forEach(([key, value]) => {
      params.set(key, value);
    });
    // Reset page về 1 khi search
    if (paramsObj.query) {
      params.set("page", "1");
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateUrl({ query: e.target.value });

  const handlePageChange = (pageNum: number) =>
    updateUrl({ page: String(pageNum) });

  // Fetch rooms
  const fetchRooms = async (currentPage = 1) => {
    if (!selectedBranchId) return;

    setLoading(true);
    setError(null);
    try {
      const res = await getBranchRooms(
        selectedBranchId,
        currentPage - 1,
        PAGE_SIZE,
      );
      // Filter rooms based on search query
      let filteredRooms = res.data.content;
      if (query) {
        filteredRooms = filteredRooms.filter(
          (room) =>
            room.name.toLowerCase().includes(query.toLowerCase()) ||
            room.id.toLowerCase().includes(query.toLowerCase()),
        );
      }
      setRooms(filteredRooms);
      setTotalPages(res.data.totalPages);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err);
      setError("Không thể tải danh sách phòng học.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedBranchId && mounted) {
      fetchRooms(page);
    }
  }, [page, selectedBranchId, query, mounted]);

  // Reset page when branch changes
  useEffect(() => {
    if (mounted) {
      updateUrl({ page: "1" });
    }
  }, [selectedBranchId, mounted]);

  // Open modal for create/edit
  const openModal = (mode: "create" | "edit", room?: RoomItem) => {
    setModalMode(mode);
    setShowModal(true);
    if (mode === "edit" && room) {
      setSelectedRoom(room);
      setRoomName(room.name);
      setRoomCapacity(room.capacity || 30);
    } else {
      setSelectedRoom(null);
      setRoomName("");
      setRoomCapacity(30);
    }
  };

  // Handle create/edit submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBranchId) {
      setError("Vui lòng chọn chi nhánh.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const roomData: RoomRequest = {
        name: roomName,
        capacity: roomCapacity,
      };

      if (modalMode === "create") {
        await createRoom(selectedBranchId, roomData);
      } else if (modalMode === "edit" && selectedRoom) {
        await updateRoom(selectedRoom.id, roomData);
      }
      setShowModal(false);
      fetchRooms(page);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err);
      setError("Có lỗi xảy ra khi lưu phòng học.");
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (roomId: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteRoom(roomId);
      setDeletingRoomId(null);
      fetchRooms(page);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.log(err);
      setError("Có lỗi xảy ra khi xóa phòng học.");
    } finally {
      setLoading(false);
    }
  };

  // Show loading while not mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!selectedBranchId) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="px-6 py-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Quản lý phòng học</h1>
            <BranchSelector />
          </div>
          <div className="bg-white rounded-xl shadow border border-gray-100 p-8 text-center">
            <p className="text-gray-500">
              Vui lòng chọn chi nhánh để xem danh sách phòng học.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-blue-500 rounded-xl shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý phòng học
              </h1>
              <p className="text-gray-600 mt-1">
                Quản lý danh sách phòng học của chi nhánh
              </p>
            </div>
          </div>

          {/* Search Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Tìm kiếm phòng học theo tên..."
                  defaultValue={query}
                  onChange={handleSearch}
                  className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white focus:bg-white"
                />
              </div>
              <div className="flex items-center space-x-4">
                <button
                  className="bg-primary-dark hover:bg-primary-darker text-white px-4 py-2 rounded-lg font-semibold shadow"
                  onClick={() => openModal("create")}
                >
                  Thêm phòng học
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        {error && <div className="text-red-600 mb-2">{error}</div>}

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
          <Table>
            <TableHeader
              columns={["Tên phòng", "Sức chứa", "Hành động"]}
              className="bg-gray-100"
            />
            <TableBody isLoading={loading}>
              {error ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-red-500">
                    {error}
                  </TableCell>
                </TableRow>
              ) : rooms.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center py-8 text-gray-400"
                  >
                    {query
                      ? "Không tìm thấy phòng học phù hợp."
                      : "Không có phòng học nào."}
                  </TableCell>
                </TableRow>
              ) : (
                rooms.map((room) => (
                  <TableRow
                    key={room.id}
                    className="hover:bg-primary-lighter cursor-pointer"
                  >
                    <TableCell className="font-medium">{room.name}</TableCell>
                    <TableCell>{room.capacity || 30} học sinh</TableCell>
                    <TableCell className="flex justify-start items-center gap-2">
                      <button
                        onClick={() => openModal("edit", room)}
                        className="flex justify-center items-center text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Tooltip text="Chỉnh sửa phòng học">
                          <FaEdit className="size-4 md:size-4" />
                        </Tooltip>
                      </button>
                      <button
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

        <div className="flex justify-end mt-6">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            handlePageClick={handlePageChange}
            handlePreviousPage={() => handlePageChange(Math.max(page - 1, 1))}
            handleNextPage={() =>
              handlePageChange(Math.min(page + 1, totalPages))
            }
          />
        </div>

        {/* Modal for create/edit */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">
                {modalMode === "create"
                  ? "Thêm phòng học"
                  : "Chỉnh sửa phòng học"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
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
                    onClick={() => setShowModal(false)}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-primary-dark text-white hover:bg-primary-darker font-semibold"
                    disabled={loading}
                  >
                    Lưu
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirm delete dialog */}
        {deletingRoomId && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm">
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
                  disabled={loading}
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomsAdminPage;
