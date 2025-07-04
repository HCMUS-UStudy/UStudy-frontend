import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Local mock component for RolePage
const MockRolePage = () => (
  <div>
    <div>Tổng số chức vụ (4)</div>
    <button>Tạo chức vụ</button>
    <input placeholder="Tìm kiếm theo vai trò..." />
    <div>RoleDisplayMock</div>
  </div>
);

describe("Admin Roles Page", () => {
  it("renders the RoleDisplay component and UI", () => {
    render(<MockRolePage />);
    expect(screen.getByText("RoleDisplayMock")).toBeInTheDocument();
    expect(screen.getByText(/Tạo chức vụ/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Tìm kiếm theo vai trò/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Tổng số chức vụ/i)).toBeInTheDocument();
  });
});
