import { render, screen, fireEvent } from "@testing-library/react";
import { Button, SelectingButton } from "@/app/ui/components/_common/Button";
import "@testing-library/jest-dom";

describe("Button Component", () => {
  it("renders button with children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText("Click me"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies primary variant styles by default", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByText("Click me");
    expect(button).toHaveClass("bg-primary");
  });

  it("applies basic variant styles", () => {
    render(<Button variant="basic">Click me</Button>);
    const button = screen.getByText("Click me");
    expect(button).toHaveClass("border-primary-darker");
  });

  it("applies outlined variant styles", () => {
    render(<Button variant="outlined">Click me</Button>);
    const button = screen.getByText("Click me");
    expect(button).toHaveClass("border-primary-darker");
  });

  it("shows loading spinner when isPending is true", () => {
    render(<Button isPending>Click me</Button>);
    expect(screen.getByRole("button")).toHaveClass("cursor-progress");
  });

  it("applies disabled styles when disabled", () => {
    render(<Button disabled>Click me</Button>);
    const button = screen.getByText("Click me");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("cursor-not-allowed");
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Click me</Button>);
    expect(screen.getByText("Click me")).toHaveClass("custom-class");
  });
});

describe("SelectingButton Component", () => {
  it("renders selecting button with placeholder", () => {
    render(<SelectingButton placeholder="Select an option" />);
    expect(screen.getByText("Select an option")).toBeInTheDocument();
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<SelectingButton onClick={handleClick} placeholder="Select" />);
    fireEvent.click(screen.getByText("Select"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("shows error message when isError is true", () => {
    render(
      <SelectingButton
        isError
        errorMsg="This field is required"
        placeholder="Select"
      />,
    );
    expect(screen.getByText("This field is required")).toBeInTheDocument();
    expect(screen.getByText("This field is required")).toHaveClass(
      "text-error",
    );
  });

  it("applies error styles when isError is true", () => {
    render(<SelectingButton isError placeholder="Select" />);
    const button = screen.getByText("Select").closest("button");
    expect(button).toHaveClass("border-error");
  });

  it("hides chevron icon when disabled", () => {
    render(<SelectingButton disabled placeholder="Select" />);
    expect(screen.queryByTestId("chevron-down")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<SelectingButton className="custom-class" placeholder="Select" />);
    expect(screen.getByText("Select").closest("button")).toHaveClass(
      "custom-class",
    );
  });
});
