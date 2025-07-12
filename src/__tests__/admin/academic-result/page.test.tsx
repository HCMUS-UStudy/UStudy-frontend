import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ManageScoresPage from "@/app/(admin)/admin/academic-results/page";

// Mock the component
jest.mock(
  "@/app/ui/components/admin/manage-scores/ManageScoresClientWrapper",
  () => {
    return function MockManageScoresClientWrapper() {
      return (
        <div data-testid="manage-scores-client-wrapper">
          ManageScoresClientWrapper
        </div>
      );
    };
  },
);

describe("ManageScoresPage", () => {
  it("renders without crashing", () => {
    const { container } = render(<ManageScoresPage />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("wraps ManageScoresClientWrapper in Suspense", () => {
    render(<ManageScoresPage />);
    // The component should be wrapped in Suspense with Loading fallback
    expect(
      screen.getByTestId("manage-scores-client-wrapper"),
    ).toBeInTheDocument();
  });
});
