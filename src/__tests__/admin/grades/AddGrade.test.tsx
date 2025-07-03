import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddGrade from "@/app/ui/components/admin/grades/AddGrade";

jest.mock("@/app/ui/components/_common/Button", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Button: (props: any) => <button {...props}>{props.children}</button>,
}));
jest.mock("@/app/ui/components/admin/grades/AddGradeModal", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid="add-grade-modal">
        <button data-testid="close-modal" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
}));

describe("AddGrade", () => {
  it("renders open modal button", () => {
    render(<AddGrade />);
    expect(screen.getByText("Tạo khối học")).toBeInTheDocument();
  });

  it("opens and closes AddGradeModal", () => {
    render(<AddGrade />);
    fireEvent.click(screen.getByText("Tạo khối học"));
    expect(screen.getByTestId("add-grade-modal")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("close-modal"));
    expect(screen.queryByTestId("add-grade-modal")).not.toBeInTheDocument();
  });
});
