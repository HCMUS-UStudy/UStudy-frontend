import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import GradeNumber from "@/app/ui/components/admin/grades/GradeNumber";

jest.mock("@/app/lib/services/grade", () => ({ getAllGrades: jest.fn() }));
// eslint-disable-next-line @typescript-eslint/no-require-imports
const mockGetAllGrades = require("@/app/lib/services/grade").getAllGrades;

describe("GradeNumber", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", async () => {
    mockGetAllGrades.mockImplementation(() => new Promise(() => {}));
    render(<GradeNumber searchQuery="" gradeQuery="All" />);
    expect(screen.getByText(/Tổng số khối học/)).toHaveTextContent(
      "Đang tải...",
    );
  });

  it("renders total number of grades", async () => {
    mockGetAllGrades.mockResolvedValue({
      content: [
        { id: 1, name: "Khối 10" },
        { id: 2, name: "Khối 11" },
      ],
    });
    render(<GradeNumber searchQuery="" gradeQuery="All" />);
    await waitFor(() =>
      expect(screen.getByText(/Tổng số khối học/)).toHaveTextContent("2"),
    );
  });
});
