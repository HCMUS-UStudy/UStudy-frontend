/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MessageCard } from "@/app/ui/components/user/student/academic-results/MessageCard";

// Mock react-icons
jest.mock("react-icons/bs", () => ({
  BsInfoCircle: () => <div data-testid="info-icon">Info Icon</div>,
}));

// Mock Card components
jest.mock("@/app/ui/components/_common/Card", () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardContent: ({ children }: any) => (
    <div data-testid="card-content">{children}</div>
  ),
  CardHeader: ({ children }: any) => (
    <div data-testid="card-header">{children}</div>
  ),
  CardTitle: ({ children, className }: any) => (
    <div data-testid="card-title" className={className}>
      {children}
    </div>
  ),
}));

describe("MessageCard", () => {
  it("renders the card with correct structure", () => {
    const message = "Test message";
    render(<MessageCard message={message} />);

    expect(screen.getByTestId("card")).toBeInTheDocument();
    expect(screen.getByTestId("card-header")).toBeInTheDocument();
    expect(screen.getByTestId("card-content")).toBeInTheDocument();
  });

  it("displays the provided message", () => {
    const message = "This is a test message";
    render(<MessageCard message={message} />);

    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it("renders the title with info icon", () => {
    render(<MessageCard message="Test message" />);

    expect(screen.getByText("Thông báo")).toBeInTheDocument();
    expect(screen.getByTestId("info-icon")).toBeInTheDocument();
  });

  it("has correct CSS classes", () => {
    const {} = render(<MessageCard message="Test message" />);

    const card = screen.getByTestId("card");
    expect(card).toHaveClass(
      "border-primary-light",
      "bg-white",
      "hover:shadow-xl",
      "transition-shadow",
    );

    const cardTitle = screen.getByTestId("card-title");
    expect(cardTitle).toHaveClass("flex", "items-center", "gap-2");
  });

  it("displays message with correct styling", () => {
    render(<MessageCard message="Test message" />);

    const messageElement = screen.getByText("Test message");
    expect(messageElement).toHaveClass("text-gray-600", "text-lg");
  });

  it("renders empty message correctly", () => {
    render(<MessageCard message="" />);
    // Should render at least one element with empty text
    const emptyNodes = screen.queryAllByText("");
    expect(emptyNodes.length).toBeGreaterThan(0);
  });

  it("renders long message correctly", () => {
    const longMessage =
      "This is a very long message that should be displayed properly in the message card component without any issues or truncation";
    render(<MessageCard message={longMessage} />);

    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  it("renders special characters in message", () => {
    const specialMessage =
      "Message with special chars: !@#$%^&*()_+-=[]{}|;':\",./<>?";
    render(<MessageCard message={specialMessage} />);

    expect(screen.getByText(specialMessage)).toBeInTheDocument();
  });

  it("renders Vietnamese characters correctly", () => {
    const vietnameseMessage =
      "Thông báo bằng tiếng Việt với các ký tự đặc biệt: ă, â, ê, ô, ơ, ư, đ";
    render(<MessageCard message={vietnameseMessage} />);

    expect(screen.getByText(vietnameseMessage)).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    expect(() => render(<MessageCard message="Test" />)).not.toThrow();
  });

  it("has correct layout structure", () => {
    render(<MessageCard message="Test message" />);

    const cardContent = screen.getByTestId("card-content");
    const messageContainer = cardContent.querySelector("div");

    expect(messageContainer).toHaveClass("text-center", "py-8");
  });
});
