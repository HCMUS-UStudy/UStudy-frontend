import React from "react";
import { render } from "@testing-library/react";
import { SkillChart } from "@/app/ui/components/user/parent/academic-results/SkillChart";
import "@testing-library/jest-dom";

describe("SkillChart", () => {
  it("renders without crashing with data", () => {
    const mockData = [
      {
        id: "1",
        classId: "class1",
        className: "Lớp 1",
        course: { id: "tuduy", name: "Tư duy" },
        grade: { id: "k1", name: "Khối 1" },
        studentAverage: 8,
        classAverage: 7.5,
        description: "Lớp học tư duy",
        percentageDifference: 7,
        scores: [{ subject: "Tư duy", score: 8 }],
      },
      {
        id: "2",
        classId: "class2",
        className: "Lớp 2",
        course: { id: "giaotiep", name: "Giao tiếp" },
        grade: { id: "k1", name: "Khối 1" },
        studentAverage: 7,
        classAverage: 7.2,
        description: "Lớp học giao tiếp",
        percentageDifference: 3,
        scores: [{ subject: "Giao tiếp", score: 7 }],
      },
    ];
    render(<SkillChart data={mockData} />);
    // Không throw là pass, vì chart là canvas
  });
});
