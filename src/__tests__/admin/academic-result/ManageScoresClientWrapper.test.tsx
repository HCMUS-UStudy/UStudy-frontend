import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ManageScoresClientWrapper from "@/app/ui/components/admin/manage-scores/ManageScoresClientWrapper";

// Mock the component
jest.mock(
  "@/app/ui/components/admin/manage-scores/ManageScoresClientPage",
  () => {
    return function MockManageScoresClientPage() {
      return (
        <div data-testid="manage-scores-client-page">
          ManageScoresClientPage
        </div>
      );
    };
  },
);

describe("ManageScoresClientWrapper", () => {
  it("renders without crashing", () => {
    const { container } = render(<ManageScoresClientWrapper />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders ManageScoresClientPage component", () => {
    render(<ManageScoresClientWrapper />);
    expect(screen.getByTestId("manage-scores-client-page")).toBeInTheDocument();
  });

  it("has correct component structure", () => {
    const { container } = render(<ManageScoresClientWrapper />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
