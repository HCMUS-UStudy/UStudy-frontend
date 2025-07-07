import "@testing-library/jest-dom";
import React from "react";
import { render, screen } from "@testing-library/react";
import { Button } from "@/app/ui/components/_common/Button";

describe("Button Component", () => {
  it("renders button with text", () => {
    render(<Button>Đăng nhập</Button>);
    expect(screen.getByText("Đăng nhập")).toBeInTheDocument();
  });

  it("renders disabled button", () => {
    render(<Button disabled>Đăng nhập</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("renders loading state", () => {
    render(<Button isPending>Đăng nhập</Button>);
    expect(screen.getByText(/đăng nhập/i)).toBeInTheDocument();
  });
});
