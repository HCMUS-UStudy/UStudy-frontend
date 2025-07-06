import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import DashboardPage from "@/app/(admin)/admin/dashboard/page";

// Mock Card và các chart component
jest.mock("@/app/ui/components/_common/Card", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Card: ({ children }: any) => <div data-testid="card">{children}</div>,
}));
jest.mock("lucide-react", () => ({
  Users: () => <span data-testid="icon-users">Users</span>,
  GraduationCap: () => <span data-testid="icon-teacher">Teacher</span>,
  Bell: () => <span data-testid="icon-bell">Bell</span>,
  MessageSquare: () => <span data-testid="icon-message">Msg</span>,
  AlertTriangle: () => <span data-testid="icon-alert">Alert</span>,
  BookOpen: () => <span data-testid="icon-book">Book</span>,
  TrendingUp: () => <span data-testid="icon-trend">Trend</span>,
}));
jest.mock("react-chartjs-2", () => ({
  Line: () => <div data-testid="line-chart">LineChart</div>,
  Bar: () => <div data-testid="bar-chart">BarChart</div>,
  Doughnut: () => <div data-testid="doughnut-chart">DoughnutChart</div>,
}));

describe("DashboardPage (admin)", () => {
  it("renders stat cards, charts, and notifications", () => {
    render(<DashboardPage />);
    // Stat cards
    expect(
      screen.getAllByText(
        /Tổng học viên|Tổng giáo viên|Tổng lớp học|Đơn chờ duyệt/,
      ),
    ).toHaveLength(4);
    expect(screen.getAllByTestId("icon-users")).toHaveLength(1);
    expect(screen.getAllByTestId("icon-teacher")).toHaveLength(1);
    expect(screen.getAllByTestId("icon-book")).toHaveLength(2); // BookOpen dùng 2 nơi
    expect(screen.getAllByTestId("icon-bell")).toHaveLength(2); // Bell dùng 2 nơi
    // Charts
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
    expect(screen.getByTestId("bar-chart")).toBeInTheDocument();
    expect(screen.getByTestId("doughnut-chart")).toBeInTheDocument();
    // Notifications
    expect(screen.getByText("Đơn đăng ký mới")).toBeInTheDocument();
    expect(screen.getByText("Tin nhắn từ giáo viên")).toBeInTheDocument();
    expect(screen.getByText("Báo lỗi hệ thống")).toBeInTheDocument();
    expect(screen.getByText("Lớp mới")).toBeInTheDocument();
  });
});
