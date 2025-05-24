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
    });
  }

  return (
    <div
      className={`rounded-lg shadow-lg border-2 transition-shadow duration-300 p-5 ${
        viewMode === "list"
          ? "flex items-center gap-6 p-5 hover:bg-gray-100"
          : ""
      }`}
    >
      <div
        className={`relative rounded-lg overflow-hidden ${
          viewMode === "list" ? "w-32 h-20 flex-shrink-0" : ""
        }`}
      >
        <Image
          width={128}
          height={20}
          src={randomImage}
          alt="Quiz banner"
          className={`object-cover rounded-lg ${
            viewMode === "list" ? "w-32 h-20" : "w-full h-40"
          }`}
        />

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
        className={`flex-1 ${viewMode === "list" ? "flex flex-col gap-1" : ""}`}
      >
        <h2
          className={`text-xl font-semibold text-primary-darker truncate ${
            viewMode === "list" ? "" : "mt-2 mb-2"
          }`}
        >
          {assignment.title}
        </h2>

        <div className="flex items-center text-primary-dark text-sm">
          <span>📅 {formatDateToVN(assignment.startTime)}</span>
          <span className="mx-2">•</span>
          <span>⏳ {formatDateToVN(assignment.endTime)}</span>
        </div>

        <div className="flex items-center mt-2 space-x-3">
          <Image
            width={40}
            height={40}
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
            ? "flex items-center space-x-3"
            : "flex items-center justify-end mt-4"
        }`}
      >
        <div className="flex space-x-2">
          <Button
            className="px-3 py-1 text-sm bg-primary-darkest hover:bg-white text-white hover:text-primary-darkest border border-primary-darkest transition-all"
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
