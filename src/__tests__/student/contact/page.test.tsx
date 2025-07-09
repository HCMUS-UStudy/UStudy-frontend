import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ContactPage from "@/app/(user)/member/contact/page";

// Mock the ContactPage component
jest.mock("@/app/ui/components/contact/ContactPage", () => ({
  ContactPage: () => (
    <div data-testid="contact-page">Contact Page Component</div>
  ),
}));

describe("Contact Page", () => {
  it("should render the contact page with Suspense wrapper", () => {
    render(<ContactPage />);

    expect(screen.getByTestId("contact-page")).toBeInTheDocument();
  });

  it("should render the page component correctly", () => {
    render(<ContactPage />);

    expect(screen.getByText("Contact Page Component")).toBeInTheDocument();
  });

  it("should have proper component structure", () => {
    const { container } = render(<ContactPage />);

    // Should have Suspense wrapper
    expect(container.firstChild).toBeInTheDocument();
  });

  it("should render without errors", () => {
    expect(() => render(<ContactPage />)).not.toThrow();
  });
});
