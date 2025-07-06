import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@/app/lib/services/class", () => ({
  getStudentClassCount: jest
    .fn()
    .mockResolvedValue({ totalClasses: 5, inProgressClasses: 3 }),
}));
jest.mock("@/app/lib/services/assignment", () => ({
  getAssignmentCount: jest.fn().mockImplementation((type) => {
    if (type === "PRACTICE")
      return Promise.resolve({ total: 10, overdue: 2, submitted: 8 });
    if (type === "TEST")
      return Promise.resolve({ total: 3, overdue: 0, submitted: 3 });
    return Promise.resolve({ total: 0, overdue: 0, submitted: 0 });
  }),
}));

import HeaderHome from "@/app/ui/components/user/student/home/HeaderHome";

describe("HeaderHome", () => {
  it("hiển thị loading khi đang tải dữ liệu", async () => {
    render(<HeaderHome />);
    // Kiểm tra có 3 skeleton loading bằng class hoặc container
    expect(
      screen.getAllByText((content, element) => {
        return !!element?.className.includes("bg-gray-200");
      }).length,
    ).toBeGreaterThanOrEqual(3);
  });

  it("hiển thị dữ liệu sau khi tải xong", async () => {
    render(<HeaderHome />);
    await waitFor(() => {
      expect(screen.getByText("Tổng số lớp học")).toBeInTheDocument();
      expect(screen.getByText("Bài tập thực hành")).toBeInTheDocument();
    });
  });
});
