import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import UserLogin from "@/app/(auth)/login/page";

// eslint-disable-next-line react/display-name
jest.mock("@/app/ui/components/_common/Login", () => () => (
  <div data-testid="login-component">Login Component</div>
));

describe("Student Login Page", () => {
  it("renders Login component", () => {
    render(<UserLogin />);
    expect(screen.getByTestId("login-component")).toBeInTheDocument();
  });
});
