import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import DropdownGrade from "@/app/ui/components/admin/grades/DropdownGrade";

jest.mock("@/app/lib/services/grade", () => ({
  getAllGrades: jest.fn(() =>
    Promise.resolve({
      content: [
        { id: "1", name: "Khối 10" },
        { id: "2", name: "Khối 11" },
      ],
    }),
  ),
}));
jest.mock("next/navigation", () => ({
  usePathname: () => "/admin/grades",
  useRouter: () => ({ replace: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));
jest.mock("react-icons/fi", () => ({
  FiFilter: () => <span data-testid="filter-icon">Filter</span>,
}));

describe("DropdownGrade", () => {
  it("renders and fetches grades", async () => {
    render(<DropdownGrade label="Chọn khối" />);
    await waitFor(() => {
      expect(
        screen.getAllByText((content, node) => node?.textContent === "All"),
      ).toHaveLength(1);
    });
  });

  it("opens dropdown and selects item", async () => {
    render(<DropdownGrade label="Chọn khối" />);
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => {
      expect(
        screen.getAllByText((content, node) => node?.textContent === "All"),
      ).toHaveLength(2);
      expect(
        screen.getAllByText((content, node) => node?.textContent === "Khối 10"),
      ).toHaveLength(1);
      expect(
        screen.getAllByText((content, node) => node?.textContent === "Khối 11"),
      ).toHaveLength(1);
    });
    fireEvent.click(
      screen.getAllByText(
        (content, node) => node?.textContent === "Khối 10",
      )[0],
    );
    expect(
      screen.getAllByText((content, node) => node?.textContent === "Khối 10"),
    ).toHaveLength(1);
  });
});
