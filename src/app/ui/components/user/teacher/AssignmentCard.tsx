import React from "react";
import Image from "next/image";
import { AssignmentItem } from "@/app/types";

interface Props {
  assignment: AssignmentItem;
  viewMode: "list" | "grid";
  onStart: (assignment: AssignmentItem) => void;
}

const AssignmentCard: React.FC<Props> = ({ assignment, viewMode, onStart }) => {
  function formatDateToVN(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div
      className={`rounded-xl shadow-md border hover:shadow-xl transition duration-300 ease-in-out 
        bg-white overflow-hidden cursor-pointer select-none ${
          viewMode === "list"
            ? "flex gap-5 items-center p-4 w-full"
            : "flex flex-col p-4 w-full h-full"
        }`}
      onClick={() => onStart(assignment)}
    >
      {/* Content */}
      <div
        className={`flex-1 ${
          viewMode === "list"
            ? "flex justify-between items-center gap-6"
            : "flex flex-col justify-between gap-3 flex-grow"
        }`}
      >
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-gray-800 truncate">
            {assignment.title}
          </h2>

          <div className="text-sm text-gray-600 space-y-1">
            <p>
              <strong className="text-gray-700">Lớp:</strong>{" "}
              {assignment.aclass?.name} |{" "}
              <strong className="text-gray-700">Môn:</strong>{" "}
              {assignment.aclass?.course?.name}
            </p>
            <p>
              <strong className="text-gray-700">Thời gian làm bài:</strong>{" "}
              {assignment.duration} phút
            </p>
            <p>
              <strong className="text-gray-700">Thời gian:</strong>{" "}
              {formatDateToVN(assignment.startTime)} -{" "}
              {formatDateToVN(assignment.endTime)}
            </p>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <Image
              src={assignment.createdBy.avatar || "/student.png"}
              alt={assignment.createdBy.name}
              width={32}
              height={32}
              className="w-8 h-8 rounded-full border shadow"
            />
            <span className="text-sm font-medium text-gray-800">
              GV: {assignment.createdBy.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;
