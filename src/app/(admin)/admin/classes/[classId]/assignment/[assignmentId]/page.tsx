"use client";

import { IoReturnUpBack } from "react-icons/io5";
import Tooltip from "@/app/ui/components/_common/Tooltip";

const assignment = {
  id: "ass1",
  title: "Bài tập chương 1: Định lý Pythagoras",
  duration: 45,
  format: "MULTIPLE_CHOICE",
  numAttempts: 1,
  startTime: "2025-05-05T17:14:30.531Z",
  endTime: "2025-05-05T19:14:30.531Z",
  aclass: {
    id: "class1",
    name: "Lớp 10A1",
    description: "Lớp chuyên Toán",
    startDate: "2025-01-01",
    endDate: "2025-12-31",
    grade: {
      id: "g10",
      name: "Khối 10",
    },
    course: {
      id: "math10",
      name: "Toán 10",
    },
    teacher: [
      {
        id: "t1",
        genId: "GV001",
        email: "gv1@example.com",
        name: "Nguyễn Văn A",
        gender: "MALE",
      },
    ],
  },
};

export default function AssignmentDetail() {
  return (
    <div className="p-6">
      <div className="flex items-center mb-4 gap-4">
        <Tooltip text="Quay lại">
          <IoReturnUpBack
            className="cursor-pointer text-[25px] text-primary-dark hover:text-primary-darkest"
            onClick={() => window.history.back()}
          />
        </Tooltip>
        <h1 className="text-2xl font-bold">{assignment.title}</h1>
      </div>

      <div className="space-y-4 text-gray-700 ml-12">
        <div>
          <span className="font-semibold">Thời lượng:</span>{" "}
          {assignment.duration} phút
        </div>
        <div>
          <span className="font-semibold">Hình thức:</span>{" "}
          {assignment.format === "MULTIPLE_CHOICE"
            ? "Trắc nghiệm"
            : assignment.format}
        </div>
        <div>
          <span className="font-semibold">Số lần làm bài:</span>{" "}
          {assignment.numAttempts}
        </div>
        <div>
          <span className="font-semibold">Thời gian mở:</span>{" "}
          {new Date(assignment.startTime).toLocaleString()}
        </div>
        <div>
          <span className="font-semibold">Thời gian đóng:</span>{" "}
          {new Date(assignment.endTime).toLocaleString()}
        </div>

        <hr className="my-4" />

        <h2 className="text-lg font-bold">Thông tin lớp học</h2>
        <div>
          <span className="font-semibold">Lớp:</span> {assignment.aclass.name}
        </div>
        <div>
          <span className="font-semibold">Khối:</span>{" "}
          {assignment.aclass.grade.name}
        </div>
        <div>
          <span className="font-semibold">Môn học:</span>{" "}
          {assignment.aclass.course.name}
        </div>
        <div>
          <span className="font-semibold">Giáo viên:</span>{" "}
          {assignment.aclass.teacher.map((t) => t.name).join(", ")}
        </div>
      </div>
    </div>
  );
}
