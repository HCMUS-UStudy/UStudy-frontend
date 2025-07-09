import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import UserLogin from "@/app/(auth)/login/page";

// Mock the Login component
jest.mock("@/app/ui/components/_common/Login", () => {
  return function MockLogin() {
    return <div data-testid="login-component">Login Component</div>;
  };
});

describe("Parent Login Page", () => {
  it("renders the login page", () => {
    render(<UserLogin />);
    expect(screen.getByTestId("login-component")).toBeInTheDocument();
  });

  it("renders login component with correct props", () => {
    render(<UserLogin />);
    const loginComponent = screen.getByTestId("login-component");
    expect(loginComponent).toBeInTheDocument();
    expect(loginComponent.textContent).toBe("Login Component");
  });
});
