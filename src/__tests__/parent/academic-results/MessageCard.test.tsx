import React from "react";
import { render, screen } from "@testing-library/react";
import { MessageCard } from "@/app/ui/components/user/parent/academic-results/MessageCard";
import "@testing-library/jest-dom";

describe("MessageCard", () => {
  it("renders message", () => {
    render(<MessageCard message="Test message" />);
    expect(screen.getByText(/test message/i)).toBeInTheDocument();
  });
});
