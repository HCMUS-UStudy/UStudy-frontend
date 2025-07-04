import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// eslint-disable-next-line react/display-name
jest.mock("@/app/ui/components/user/student/home/HeaderHome", () => () => (
  <div data-testid="header-home" />
));
// eslint-disable-next-line react/display-name
jest.mock("@/app/ui/components/user/student/home/Homework", () => () => (
  <div data-testid="homework" />
));
// eslint-disable-next-line react/display-name
jest.mock("@/app/ui/components/user/student/home/ResultStudy", () => () => (
  <div data-testid="result-study" />
));
// eslint-disable-next-line react/display-name
jest.mock("@/app/ui/components/user/student/home/Schedule", () => () => (
  <div data-testid="schedule" />
));

import StudentHome from "@/app/ui/components/user/student/home/StudentHome";

describe("StudentHome", () => {
  it("render đầy đủ các component con", () => {
    render(<StudentHome />);
    expect(screen.getByTestId("header-home")).toBeInTheDocument();
    expect(screen.getByTestId("homework")).toBeInTheDocument();
    expect(screen.getByTestId("result-study")).toBeInTheDocument();
    expect(screen.getByTestId("schedule")).toBeInTheDocument();
  });
});
