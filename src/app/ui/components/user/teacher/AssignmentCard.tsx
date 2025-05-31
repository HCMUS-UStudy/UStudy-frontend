import React from "react";
import Image from "next/image";
import { AssignmentItem } from "@/app/types";
import { Button } from "@/app/ui/components/_common/Button";

interface Props {
  assignment: AssignmentItem;
  viewMode: "list" | "grid";
  onStart: (assignment: AssignmentItem) => void;
}

const AssignmentCard: React.FC<Props> = ({ assignment, viewMode, onStart }) => {
  const randomImages = [
    "https://storage.googleapis.com/a1aa/image/etK-TPGHJCUFTdDL1RCjvPVzYEME-6M-4WM0R6qL1r4.jpg",
    "https://storage.googleapis.com/a1aa/image/b3_Tj5jRj0RauxUD0v2nmQbjuj4Ru05BPm2FGdHScV0.jpg",
    "https://storage.googleapis.com/a1aa/image/PRGq1Y0nXy0j83lLVvMrOvRvLAA9xn0liXQYUWGk4No.jpg",
    "https://storage.googleapis.com/a1aa/image/KYIVzXTF65wwyjZHgfB2EZmGggTcgNIV074jfvlpeyI.jpg",
    "https://storage.googleapis.com/a1aa/image/A2gBNcHuLIFDRYPmfXmepimBj79IpJsVpOeg4aolK3U.jpg",
  ];
  const randomImage =
    randomImages[Math.floor(Math.random() * randomImages.length)];

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
      className={`rounded-xl shadow-md border hover:shadow-xl transition duration-300 ease-in-out bg-white overflow-hidden ${
        viewMode === "list"
          ? "flex gap-5 items-center p-4 w-full"
          : "flex flex-col p-4 w-full h-full"
      }`}
    >
      {/* Image section */}
      <div
        className={`relative overflow-hidden rounded-lg ${
          viewMode === "list" ? "w-32 h-20 flex-shrink-0" : "w-full h-40 mb-4"
        }`}
      >
        <Image
          src={randomImage}
          alt="Assignment"
          width={viewMode === "list" ? 128 : 640}
          height={viewMode === "list" ? 80 : 160}
          className={`object-cover rounded-lg w-full ${
            viewMode === "list" ? "h-20" : "h-40"
          }`}
        />
        <div
          className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-bold shadow-md ${
            assignment.format === "MULTIPLE_CHOICE"
              ? "bg-blue-600 text-white"
              : assignment.format === "ESSAY"
                ? "bg-red-500 text-white"
                : "bg-yellow-400 text-black"
          }`}
        >
          {assignment.format === "MULTIPLE_CHOICE"
            ? "Trắc nghiệm"
            : assignment.format === "ESSAY"
              ? "Tự luận"
              : "Kết hợp"}
        </div>
      </div>

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

        <div
          className={`${
            viewMode === "list" ? "self-center" : "mt-4 flex justify-end"
          }`}
        >
          <Button
            className="px-4 py-2 text-sm font-medium bg-primary-darkest text-white hover:bg-white hover:text-primary-darkest border border-primary-darkest transition-colors rounded-lg"
            onClick={() => onStart(assignment)}
          >
            Bắt đầu
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;
