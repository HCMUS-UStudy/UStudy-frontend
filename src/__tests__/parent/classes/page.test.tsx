/* eslint-disable @typescript-eslint/no-require-imports */
import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import Classes from "@/app/(user)/member/classes/page";

// Mock the components
jest.mock("@/app/ui/components/user/parent/classes/ParentClasses", () => {
  return function MockParentClasses() {
    return <div data-testid="parent-classes">Parent Classes Component</div>;
  };
});

jest.mock("@/app/ui/components/user/student/classes/StudentClassesPage", () => {
  return function MockStudentClassesPage() {
    return <div data-testid="student-classes">Student Classes Component</div>;
  };
});

// Mock the action
jest.mock("@/app/lib/action", () => ({
  getUserDataFromCookies: jest.fn(),
}));

describe("Classes Page for Parent", () => {
  it("renders ParentClasses component when user is PARENT", async () => {
    const { getUserDataFromCookies } = require("@/app/lib/action");
    getUserDataFromCookies.mockResolvedValue({
      role: { defaultRoute: "PARENT" },
    });

    const PageComponent = await Classes();
    render(PageComponent);

    expect(screen.getByTestId("parent-classes")).toBeInTheDocument();
    expect(screen.queryByTestId("student-classes")).not.toBeInTheDocument();
  });

  it("renders StudentClassesPage component when user is STUDENT", async () => {
    const { getUserDataFromCookies } = require("@/app/lib/action");
    getUserDataFromCookies.mockResolvedValue({
      role: { defaultRoute: "STUDENT" },
    });

    const PageComponent = await Classes();
    render(PageComponent);

    expect(screen.getByTestId("student-classes")).toBeInTheDocument();
    expect(screen.queryByTestId("parent-classes")).not.toBeInTheDocument();
  });

  it("renders nothing when user role is not PARENT or STUDENT", async () => {
    const { getUserDataFromCookies } = require("@/app/lib/action");
    getUserDataFromCookies.mockResolvedValue({
      role: { defaultRoute: "TEACHER" },
    });

    const PageComponent = await Classes();
    render(PageComponent);

    expect(screen.queryByTestId("parent-classes")).not.toBeInTheDocument();
    expect(screen.queryByTestId("student-classes")).not.toBeInTheDocument();
  });

  it("handles null user data gracefully", async () => {
    const { getUserDataFromCookies } = require("@/app/lib/action");
    getUserDataFromCookies.mockResolvedValue(null);

    const PageComponent = await Classes();
    render(PageComponent);

    expect(screen.queryByTestId("parent-classes")).not.toBeInTheDocument();
    expect(screen.queryByTestId("student-classes")).not.toBeInTheDocument();
  });
});
