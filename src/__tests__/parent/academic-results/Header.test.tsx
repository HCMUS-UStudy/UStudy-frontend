import React from "react";
import { render, screen } from "@testing-library/react";
import { Header } from "@/app/ui/components/user/parent/academic-results/Header";
import "@testing-library/jest-dom";

describe("Header", () => {
  const mockDetails = {
    id: "class1",
    classId: "class1",
    className: "Lớp 1",
    course: { id: "toan", name: "Toán" },
    grade: { id: "k1", name: "Khối 1" },
    startDate: "2023-08-01",
    endDate: "2024-05-31",
    teacher: { id: "gv1", name: "Nguyễn Văn A" },
    studentAverage: 8.5,
    classAverage: 7.9,
    studentRank: 2,
    totalStudents: 30,
    description: "Lớp học xuất sắc",
    percentageDifference: 8,
    scores: [
      { subject: "Toán", score: 9 },
      { subject: "Văn", score: 8 },
    ],
  };
  it("renders class info, course, grade, academic year, teacher", () => {
    render(<Header details={mockDetails} />);
    // Kiểm tra điểm trung bình
    expect(screen.getByText("8.5")).toBeInTheDocument();
    // Kiểm tra TB lớp
    expect(screen.getByText(/tb lớp/i)).toBeInTheDocument();
    // Kiểm tra xếp hạng
    expect(screen.getByText("2/30")).toBeInTheDocument();
    // Kiểm tra môn học
    expect(screen.getByText(/toán/i)).toBeInTheDocument();
    // Kiểm tra khối
    expect(screen.getByText(/khối 1/i)).toBeInTheDocument();
  });
});
