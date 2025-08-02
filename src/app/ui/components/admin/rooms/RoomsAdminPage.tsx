"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { getBranchRooms } from "@/app/lib/services/room";
import Pagination from "@/app/ui/components/_common/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/app/ui/components/_common/Table";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import EditRoom from "./EditRoom";
import DeleteRoom from "./DeleteRoom";

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
                  <TableCell className="flex justify-start items-center px-8 gap-2">
                    <EditRoom room={room} />
                    <DeleteRoom room={room} />
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
    </div>
  );
};

export default RoomsAdminPage;
