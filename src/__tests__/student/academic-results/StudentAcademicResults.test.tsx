import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import StudentAcademicResults from "@/app/ui/components/user/student/academic-results/StudentAcademicResults";

// Mock the AcademicResultsView component
jest.mock(
  "@/app/ui/components/user/student/academic-results/AcademicResultsView",
  () => {
    return function MockAcademicResultsView() {
      return (
        <div data-testid="academic-results-view">Academic Results View</div>
      );
    };
  },
);

describe("StudentAcademicResults", () => {
  it("renders the component with correct structure", () => {
    render(<StudentAcademicResults />);

    // Check if the main container is rendered
    const container = screen.getByTestId("academic-results-view");
    expect(container).toBeInTheDocument();
    expect(container).toHaveTextContent("Academic Results View");
  });

  it("has correct CSS classes", () => {
    const { container } = render(<StudentAcademicResults />);

    // Check if the main div has the correct class
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass("px-2");
  });

  it("renders without crashing", () => {
    expect(() => render(<StudentAcademicResults />)).not.toThrow();
  });
});
