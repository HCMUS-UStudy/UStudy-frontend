import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Loading from "@/app/ui/components/_common/loading/Loading";

describe("Loading", () => {
  it("renders without crashing", () => {
    const { container } = render(<Loading />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders with custom text", () => {
    render(<Loading text="Đang tải..." />);
    expect(screen.getByText("Đang tải...")).toBeInTheDocument();
  });

  it("renders without text when not provided", () => {
    const { container } = render(<Loading />);
    expect(container.querySelector("span")).not.toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<Loading className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("applies custom spinner style", () => {
    const { container } = render(
      <Loading customStyle={{ spinner: "custom-spinner" }} />,
    );
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toHaveClass("custom-spinner");
  });

  it("applies custom text style", () => {
    render(<Loading text="Loading..." customStyle={{ text: "custom-text" }} />);
    const textElement = screen.getByText("Loading...");
    expect(textElement).toHaveClass("custom-text");
  });

  it("has correct default structure", () => {
    const { container } = render(<Loading />);
    expect(container.firstChild).toHaveClass(
      "flex",
      "items-center",
      "justify-center",
      "gap-4",
    );
  });

  it("spinner has correct default classes", () => {
    const { container } = render(<Loading />);
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toHaveClass("text-primary-darkest", "h-8", "w-8");
  });
});
