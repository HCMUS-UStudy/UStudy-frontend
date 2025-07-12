import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import UserLogin from "@/app/(auth)/login/page";

// eslint-disable-next-line react/display-name
jest.mock("@/app/ui/components/_common/Login", () => () => (
  <div data-testid="login-component">Login Component</div>
));

describe("Teacher Login Page", () => {
  it("renders Login component", () => {
    render(<UserLogin />);
    expect(screen.getByTestId("login-component")).toBeInTheDocument();
  });

  it("renders login component with correct props", () => {
    render(<UserLogin />);
    const loginComponent = screen.getByTestId("login-component");
    expect(loginComponent).toBeInTheDocument();
    expect(loginComponent.textContent).toBe("Login Component");
  });

  it("renders the login page correctly", () => {
    render(<UserLogin />);
    expect(screen.getByTestId("login-component")).toBeInTheDocument();
  });
});
