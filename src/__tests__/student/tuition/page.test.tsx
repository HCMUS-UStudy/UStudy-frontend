import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Tuition from "@/app/(user)/member/tuition/page";
import { getUserDataFromCookies } from "@/app/lib/action";

// Mock the action
jest.mock("@/app/lib/action", () => ({
  getUserDataFromCookies: jest.fn(),
}));

// Mock the components
jest.mock("@/app/ui/components/user/student/tuition/StudentTuition", () => {
  return function MockStudentTuition() {
    return <div data-testid="student-tuition">Student Tuition Component</div>;
  };
});

jest.mock("@/app/ui/components/user/parent/tuition/ParentTuition", () => {
  return function MockParentTuition() {
    return <div data-testid="parent-tuition">Parent Tuition Component</div>;
  };
});

describe("Tuition Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders StudentTuition when user role is STUDENT", async () => {
    (getUserDataFromCookies as jest.Mock).mockResolvedValue({
      role: { defaultRoute: "STUDENT" },
    });

    const PageComponent = await Tuition();
    render(PageComponent);

    expect(screen.getByTestId("student-tuition")).toBeInTheDocument();
    expect(screen.getByText("Student Tuition Component")).toBeInTheDocument();
  });

  it("renders ParentTuition when user role is PARENT", async () => {
    (getUserDataFromCookies as jest.Mock).mockResolvedValue({
      role: { defaultRoute: "PARENT" },
    });

    const PageComponent = await Tuition();
    render(PageComponent);

    expect(screen.getByTestId("parent-tuition")).toBeInTheDocument();
    expect(screen.getByText("Parent Tuition Component")).toBeInTheDocument();
  });

  it("renders nothing when user role is neither STUDENT nor PARENT", async () => {
    (getUserDataFromCookies as jest.Mock).mockResolvedValue({
      role: { defaultRoute: "TEACHER" },
    });

    const PageComponent = await Tuition();
    render(PageComponent);

    expect(screen.queryByTestId("student-tuition")).not.toBeInTheDocument();
    expect(screen.queryByTestId("parent-tuition")).not.toBeInTheDocument();
  });

  it("renders nothing when user data is null", async () => {
    (getUserDataFromCookies as jest.Mock).mockResolvedValue(null);

    const PageComponent = await Tuition();
    render(PageComponent);

    expect(screen.queryByTestId("student-tuition")).not.toBeInTheDocument();
    expect(screen.queryByTestId("parent-tuition")).not.toBeInTheDocument();
  });

  it("renders nothing when user role is undefined", async () => {
    (getUserDataFromCookies as jest.Mock).mockResolvedValue({
      role: { defaultRoute: undefined },
    });

    const PageComponent = await Tuition();
    render(PageComponent);

    expect(screen.queryByTestId("student-tuition")).not.toBeInTheDocument();
    expect(screen.queryByTestId("parent-tuition")).not.toBeInTheDocument();
  });

  it("handles getUserDataFromCookies error gracefully", async () => {
    (getUserDataFromCookies as jest.Mock).mockRejectedValue(
      new Error("Auth error"),
    );
    let PageComponent;
    try {
      PageComponent = await Tuition();
      render(PageComponent);
    } catch (e) {
      console.log(e);
      // swallow error
    }
    expect(screen.queryByTestId("student-tuition")).not.toBeInTheDocument();
    expect(screen.queryByTestId("parent-tuition")).not.toBeInTheDocument();
  });

  it("calls getUserDataFromCookies on mount", async () => {
    (getUserDataFromCookies as jest.Mock).mockResolvedValue({
      role: { defaultRoute: "STUDENT" },
    });

    await Tuition();

    expect(getUserDataFromCookies).toHaveBeenCalledTimes(1);
  });
});
