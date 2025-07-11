import React from "react";
import { render } from "@testing-library/react";
import { AcademicResultsSkeleton } from "@/app/ui/components/user/parent/academic-results/AcademicResultsSkeleton";
import "@testing-library/jest-dom";

describe("AcademicResultsSkeleton", () => {
  it("renders skeleton with animate-pulse", () => {
    const { container } = render(<AcademicResultsSkeleton />);
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(
      0,
    );
  });
});
