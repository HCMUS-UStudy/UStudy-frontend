import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/app/ui/components/_common/Button";

describe("Button Component for Parent Login", () => {
  it("renders button with text", () => {
    render(<Button>Đăng nhập</Button>);
    expect(
      screen.getByRole("button", { name: /đăng nhập/i }),
    ).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Đăng nhập</Button>);

    const button = screen.getByRole("button", { name: /đăng nhập/i });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies disabled state", () => {
    render(<Button disabled>Đăng nhập</Button>);

    const button = screen.getByRole("button", { name: /đăng nhập/i });
    expect(button).toBeDisabled();
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Đăng nhập</Button>);

    const button = screen.getByRole("button", { name: /đăng nhập/i });
    expect(button).toHaveClass("custom-class");
  });

  it("renders button with loading state", () => {
    render(<Button isPending>Đăng nhập</Button>);

    const button = screen.getByRole("button", { name: /đăng nhập/i });
    expect(button).toHaveClass("cursor-progress");
  });

  it("renders button with different variants", () => {
    const { rerender } = render(<Button variant="primary">Đăng nhập</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-primary");

    rerender(<Button variant="basic">Đăng nhập</Button>);
    expect(screen.getByRole("button")).toHaveClass("border-primary-darker");
  });
});
