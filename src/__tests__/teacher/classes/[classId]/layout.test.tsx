import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import Layout from "@/app/(user)/teacher/classes/[classId]/layout";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  usePathname: () => "/teacher/classes/test-class-id/attendance",
}));

// Mock the TeacherNavigation component
jest.mock("@/app/ui/components/user/teacher/TeacherNavigation", () => {
  return function MockTeacherNavigation({ activeTab }: { activeTab: string }) {
    return (
      <div data-testid="teacher-navigation" data-active-tab={activeTab}>
        Teacher Navigation
      </div>
    );
  };
});

describe("Teacher Class Detail Layout", () => {
  it("renders teacher navigation", () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );

    expect(screen.getByTestId("teacher-navigation")).toBeInTheDocument();
    expect(screen.getByText("Teacher Navigation")).toBeInTheDocument();
  });

  it("passes correct active tab for attendance page", () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );

    const navigation = screen.getByTestId("teacher-navigation");
    expect(navigation).toHaveAttribute("data-active-tab", "attendance");
  });

  it("renders children content", () => {
    render(
      <Layout>
        <div data-testid="test-content">Test Content</div>
      </Layout>,
    );

    expect(screen.getByTestId("test-content")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("wraps content in main tag", () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>,
    );

    const mainElement = screen.getByText("Test Content").closest("main");
    expect(mainElement).toBeInTheDocument();
  });
});
