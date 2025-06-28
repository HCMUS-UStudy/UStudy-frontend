import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DashboardPage from "@/app/(admin)/admin/dashboard/page";

// Mock react-chartjs-2 to avoid canvas errors in JSDOM
jest.mock("react-chartjs-2", () => ({
  Line: () => null,
  Bar: () => null,
  Doughnut: () => null,
}));

describe("Admin Dashboard Page", () => {
  it("renders the main stat cards", () => {
    render(<DashboardPage />);

    // Check for the titles of the stat cards
    expect(screen.getByText("Tổng học viên")).toBeInTheDocument();
    expect(screen.getByText("Tổng giáo viên")).toBeInTheDocument();
    expect(screen.getByText("Tổng lớp học")).toBeInTheDocument();
    expect(screen.getByText("Đơn chờ duyệt")).toBeInTheDocument();
  });

  it("renders chart titles", () => {
    render(<DashboardPage />);

    // Check for the titles of the chart cards
    expect(screen.getByText("Học viên đăng ký theo tháng")).toBeInTheDocument();
    expect(screen.getByText("Tỷ lệ hoàn thành lớp học")).toBeInTheDocument();
    expect(
      screen.getByText("Phân bố học viên theo cấp học"),
    ).toBeInTheDocument();
  });
});
