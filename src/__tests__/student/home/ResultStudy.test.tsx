jest.mock("@/app/lib/services/class", () => ({
  getStudentClassesWithGrades: jest.fn().mockResolvedValue([
    {
      course: { name: "Toán" },
      classAverage: 8.5,
      studentAverage: 9.0,
    },
  ]),
}));

jest.mock("react-chartjs-2", () => ({
  Bar: () => <div data-testid="chart-bar" />,
}));

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ResultStudy from "@/app/ui/components/user/student/home/ResultStudy";

describe("ResultStudy", () => {
  it("hiển thị loading khi đang tải dữ liệu", () => {
    render(<ResultStudy />);
    expect(screen.getByText("Đang tải dữ liệu...")).toBeInTheDocument();
  });

  it("hiển thị chart sau khi tải xong", async () => {
    render(<ResultStudy />);
    await waitFor(() => {
      expect(screen.getByTestId("chart-bar")).toBeInTheDocument();
    });
  });
});
