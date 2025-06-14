import React from "react";
import Image from "next/image";
import { AssignmentItem } from "@/app/types";
import { Button } from "@/app/ui/components/_common/Button";
import { FaBook, FaClipboardCheck } from "react-icons/fa";

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
    });
  }

  const getModeIcon = () => {
    return assignment.mode === "PRACTICE" ? (
      <FaBook className="w-4 h-4" />
    ) : (
      <FaClipboardCheck className="w-4 h-4" />
    );
  };

  const getModeColor = () => {
    return assignment.mode === "PRACTICE"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-purple-100 text-purple-800 border-purple-200";
  };

  return (
    <div
      className={`rounded-lg shadow-lg border-2 transition-all duration-300 ${
        viewMode === "list"
          ? "flex items-center gap-4 p-4 hover:bg-gray-50"
          : "p-5"
      }`}
    >
      <div
        className={`relative rounded-lg overflow-hidden ${
          viewMode === "list" ? "w-56 h-32 flex-shrink-0" : ""
        }`}
      >
        <Image
          width={224}
          height={128}
          src={randomImage}
          alt="Quiz banner"
          className={`object-cover rounded-lg ${
            viewMode === "list" ? "w-56 h-32" : "w-full h-40"
          }`}
        />

        <div className="absolute top-2 left-2 flex gap-2">
          <div
            className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1 border ${getModeColor()}`}
          >
            {getModeIcon()}
            {assignment.mode === "PRACTICE" ? "Luyện tập" : "Kiểm tra"}
          </div>
        </div>

        <div
          className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
            assignment.format === "MULTIPLE_CHOICE"
              ? "bg-blue-500 text-white"
              : assignment.format === "ESSAY"
                ? "bg-red-500 text-white"
                : "bg-yellow-500 text-black"
          }`}
        >
          {assignment.format === "MULTIPLE_CHOICE"
            ? "Trắc nghiệm"
            : assignment.format === "ESSAY"
              ? "Tự luận"
              : "Kết hợp"}
        </div>
      </div>

      <div
        className={`flex-1 min-w-0 ${
          viewMode === "list" ? "flex flex-col justify-center gap-2" : ""
        }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <h2
            className={`font-semibold text-primary-darker truncate ${
              viewMode === "list" ? "text-lg" : "text-xl mt-2 mb-2"
            }`}
          >
            {assignment.title}
          </h2>
        </div>

        <div className="flex items-center text-primary-dark text-sm">
          <span>📅 {formatDateToVN(assignment.startTime)}</span>
          <span className="mx-2">•</span>
          <span>⏳ {formatDateToVN(assignment.endTime)}</span>
        </div>

        <div className="flex items-center mt-2 space-x-3">
          <Image
            width={32}
            height={32}
            src={assignment.createdBy.avatar || "/student.png"}
            alt={assignment.createdBy.name}
            className="w-8 h-8 rounded-full border border-gray-300 shadow-sm"
          />
          <span className="text-primary-darkest font-medium text-sm">
            {assignment.createdBy.name}
          </span>
        </div>
      </div>

      <div
        className={`${
          viewMode === "list"
            ? "flex items-center ml-auto"
            : "flex items-center justify-end mt-4"
        }`}
      >
        <Button
          className={`px-4 py-2 text-sm transition-all ${
            assignment.mode === "PRACTICE"
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
          onClick={() => onStart(assignment)}
        >
          {assignment.mode === "PRACTICE"
            ? "Luyện tập ngay"
            : "Bắt đầu kiểm tra"}
        </Button>
      </div>
    </div>
  );
};

export default AssignmentCard;
