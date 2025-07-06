"use client";

import React from "react";
import { useSelector } from "react-redux";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { RootState } from "@/app/store/store";
import { getBranchRooms } from "@/app/lib/services/room";

interface RoomNumberProps {
  searchQuery?: string;
}

const RoomNumber: React.FC<RoomNumberProps> = ({ searchQuery = "" }) => {
  const { selectedBranchId } = useSelector((state: RootState) => state.branch);

  const { data: roomsData, status } = useQuery({
    queryKey: ["Rooms", selectedBranchId, searchQuery],
    queryFn: () => getBranchRooms(selectedBranchId!, 0, 10000), // Get all rooms for counting
    placeholderData: keepPreviousData,
    enabled: !!selectedBranchId,
  });

  // Filter rooms based on search query if provided
  const filteredRooms =
    roomsData?.data.content.filter(
      (room) =>
        !searchQuery ||
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.id.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  return (
    <h2
      className={`text-lg md:text-2xl font-bold ${
        status === "pending" ? "animate-pulse text-gray-400" : ""
      }`}
    >
      Tổng số phòng học (
      {status === "pending"
        ? "Đang tải..."
        : filteredRooms.length.toLocaleString("vi-VN")}
      )
    </h2>
  );
};

export default RoomNumber;
