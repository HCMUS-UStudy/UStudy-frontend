/* eslint-disable react/display-name */
import "@testing-library/jest-dom";
import ParentHome from "@/app/ui/components/user/parent/home/ParentHome";
import { render, screen } from "@testing-library/react";
import React from "react";

jest.mock("@/app/ui/components/user/parent/home/ProgressLearning", () => () => (
  <div data-testid="progress-learning" />
));
jest.mock("@/app/ui/components/user/parent/home/RegisteredClass", () => () => (
  <div data-testid="registered-class" />
));
jest.mock("@/app/ui/components/user/parent/home/Notifications", () => () => (
  <div data-testid="notifications" />
));
jest.mock("@/app/ui/components/user/parent/home/Events", () => () => (
  <div data-testid="events" />
));

describe("ParentHome", () => {
  it("renders all child components", () => {
    render(<ParentHome />);
    expect(screen.getByTestId("progress-learning")).toBeInTheDocument();
    expect(screen.getByTestId("registered-class")).toBeInTheDocument();
    expect(screen.getByTestId("notifications")).toBeInTheDocument();
    expect(screen.getByTestId("events")).toBeInTheDocument();
  });
});
