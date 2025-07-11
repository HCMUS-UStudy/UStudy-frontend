import React from "react";
import { render, screen } from "@testing-library/react";
import ParentAcademicResults from "@/app/ui/components/user/parent/academic-results/ParentAcademicResults";
import "@testing-library/jest-dom";

jest.mock(
  "@/app/ui/components/user/parent/academic-results/ParentAcademicResultsView",
  // eslint-disable-next-line react/display-name
  () => () => <div data-testid="parent-academic-results-view" />,
);

describe("ParentAcademicResults page", () => {
  it("renders without crashing and contains ParentAcademicResultsView", () => {
    render(<ParentAcademicResults />);
    expect(
      screen.getByTestId("parent-academic-results-view"),
    ).toBeInTheDocument();
  });
});
