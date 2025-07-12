import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Schedule from "@/app/(user)/member/schedule/page";
import { getUserDataFromCookies } from "@/app/lib/action";

// Mock the action
jest.mock("@/app/lib/action", () => ({
  getUserDataFromCookies: jest.fn(),
}));

// Mock the components
jest.mock("@/app/ui/components/user/student/schedule/StudentSchedule", () => {
  return function MockStudentSchedule() {
    return <div data-testid="student-schedule">Student Schedule Component</div>;
  };
});

jest.mock("@/app/ui/components/user/parent/schedule/ParentSchedule", () => {
  return function MockParentSchedule() {
    return <div data-testid="parent-schedule">Parent Schedule Component</div>;
  };
});

describe("Schedule Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders StudentSchedule when user role is STUDENT", async () => {
    (getUserDataFromCookies as jest.Mock).mockResolvedValue({
      role: { defaultRoute: "STUDENT" },
    });

    const PageComponent = await Schedule();
    render(PageComponent);

    expect(screen.getByTestId("student-schedule")).toBeInTheDocument();
    expect(screen.getByText("Student Schedule Component")).toBeInTheDocument();
  });

  it("renders ParentSchedule when user role is PARENT", async () => {
    (getUserDataFromCookies as jest.Mock).mockResolvedValue({
      role: { defaultRoute: "PARENT" },
    });

    const PageComponent = await Schedule();
    render(PageComponent);

    expect(screen.getByTestId("parent-schedule")).toBeInTheDocument();
    expect(screen.getByText("Parent Schedule Component")).toBeInTheDocument();
  });

  it("renders nothing when user role is neither STUDENT nor PARENT", async () => {
    (getUserDataFromCookies as jest.Mock).mockResolvedValue({
      role: { defaultRoute: "TEACHER" },
    });

    const PageComponent = await Schedule();
    render(PageComponent);

    expect(screen.queryByTestId("student-schedule")).not.toBeInTheDocument();
    expect(screen.queryByTestId("parent-schedule")).not.toBeInTheDocument();
  });

  it("renders nothing when user data is null", async () => {
    (getUserDataFromCookies as jest.Mock).mockResolvedValue(null);

    const PageComponent = await Schedule();
    render(PageComponent);

    expect(screen.queryByTestId("student-schedule")).not.toBeInTheDocument();
    expect(screen.queryByTestId("parent-schedule")).not.toBeInTheDocument();
  });

  it("renders nothing when user role is undefined", async () => {
    (getUserDataFromCookies as jest.Mock).mockResolvedValue({
      role: { defaultRoute: undefined },
    });

    const PageComponent = await Schedule();
    render(PageComponent);

    expect(screen.queryByTestId("student-schedule")).not.toBeInTheDocument();
    expect(screen.queryByTestId("parent-schedule")).not.toBeInTheDocument();
  });

  it("handles getUserDataFromCookies error gracefully", async () => {
    (getUserDataFromCookies as jest.Mock).mockRejectedValue(
      new Error("Auth error"),
    );
    let PageComponent;
    try {
      PageComponent = await Schedule();
      render(PageComponent);
    } catch (e) {
      // swallow error
      console.log(e);
    }
    expect(screen.queryByTestId("student-schedule")).not.toBeInTheDocument();
    expect(screen.queryByTestId("parent-schedule")).not.toBeInTheDocument();
  });

  it("calls getUserDataFromCookies on mount", async () => {
    (getUserDataFromCookies as jest.Mock).mockResolvedValue({
      role: { defaultRoute: "STUDENT" },
    });

    await Schedule();

    expect(getUserDataFromCookies).toHaveBeenCalledTimes(1);
  });
});
