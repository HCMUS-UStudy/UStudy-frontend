jest.mock("@/app/lib/services/class", () => ({
  getStudentClassesWithStats: jest.fn().mockResolvedValue([
    {
      id: "1",
      name: "Bài tập 1",
      status: "IN_PROGRESS",
      completionRate: 80,
      course: { name: "Toán" },
      grade: { name: "10A1" },
    },
  ]),
}));

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Homework from "@/app/ui/components/user/student/home/Homework";

describe("Homework", () => {
  it("hiển thị loading khi đang tải dữ liệu", () => {
    render(<Homework />);
    expect(screen.getByText("Đang tải...")).toBeInTheDocument();
  });

  it("hiển thị danh sách bài tập sau khi tải xong", async () => {
    render(<Homework />);
    await waitFor(() => {
      expect(screen.getByText("Bài tập 1")).toBeInTheDocument();
      expect(screen.getByText("Toán")).toBeInTheDocument();
      expect(screen.getByText("10A1")).toBeInTheDocument();
    });
  });
});
