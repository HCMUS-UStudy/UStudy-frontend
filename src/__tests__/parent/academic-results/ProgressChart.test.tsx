import React from "react";
import { render } from "@testing-library/react";
import { ProgressChart } from "@/app/ui/components/user/parent/academic-results/ProgressChart";
import "@testing-library/jest-dom";

describe("ProgressChart", () => {
  it("renders without crashing with data", () => {
    const mockData = [
      {
        id: "1",
        classId: "class1",
        className: "Lớp 1",
        course: { id: "toan", name: "Toán" },
        grade: { id: "k1", name: "Khối 1" },
        studentAverage: 9,
        classAverage: 8,
        description: "Lớp học xuất sắc",
        percentageDifference: 10,
        scores: [
          { subject: "Toán", score: 9 },
          { subject: "Văn", score: 8 },
        ],
      },
      {
        id: "2",
        classId: "class2",
        className: "Lớp 2",
        course: { id: "van", name: "Văn" },
        grade: { id: "k1", name: "Khối 1" },
        studentAverage: 8,
        classAverage: 7.5,
        description: "Lớp học khá",
        percentageDifference: 5,
        scores: [
          { subject: "Toán", score: 8 },
          { subject: "Văn", score: 7 },
        ],
      },
    ];
    render(<ProgressChart data={mockData} />);
    // Không throw là pass, vì chart là canvas
  });
});
