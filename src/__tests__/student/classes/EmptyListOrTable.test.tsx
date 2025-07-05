import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock dynamic Lottie import
// eslint-disable-next-line react/display-name
jest.mock("lottie-react", () => () => <div data-testid="lottie-mock" />);

import EmptyListOrTable from "@/app/ui/components/_common/EmptyListOrTable";

describe("EmptyListOrTable", () => {
  it("renders with default message", () => {
    render(<EmptyListOrTable />);
    expect(screen.getByText("Không có dữ liệu")).toBeInTheDocument();
  });

  it("renders with custom message", () => {
    render(<EmptyListOrTable message="Không có lớp học nào" />);
    expect(screen.getByText("Không có lớp học nào")).toBeInTheDocument();
  });

  it("renders lottie animation when client", () => {
    render(<EmptyListOrTable />);
    // Lottie sẽ được mock thành lottie-mock
    expect(screen.getByTestId("lottie-mock")).toBeInTheDocument();
  });
});
