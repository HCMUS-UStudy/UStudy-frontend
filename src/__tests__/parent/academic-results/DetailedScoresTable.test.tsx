import React from "react";
import { render, screen } from "@testing-library/react";
import DetailedScoresTable from "@/app/ui/components/user/parent/academic-results/DetailedScoresTable";
import "@testing-library/jest-dom";

describe("DetailedScoresTable", () => {
  it("renders table with details", () => {
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
    render(<DetailedScoresTable details={mockDetails} />);
    expect(screen.getByText(/lớp 1/i)).toBeInTheDocument();
    expect(screen.getByText(/toán/i)).toBeInTheDocument();
    expect(screen.getByText(/khối 1/i)).toBeInTheDocument();
    expect(screen.getByText(/8.5/)).toBeInTheDocument();
    expect(screen.getByText(/7.9/)).toBeInTheDocument();
    expect(screen.getByText(/2\/30/)).toBeInTheDocument();
    expect(screen.getByText(/lớp học xuất sắc/i)).toBeInTheDocument();
  });
});
