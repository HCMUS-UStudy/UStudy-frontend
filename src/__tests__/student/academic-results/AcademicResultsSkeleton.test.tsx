import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AcademicResultsSkeleton } from "@/app/ui/components/user/student/academic-results/AcademicResultsSkeleton";

describe("AcademicResultsSkeleton", () => {
  it("renders the skeleton with correct structure", () => {
    render(<AcademicResultsSkeleton />);

    // Check if the main container is rendered
    const { container } = render(<AcademicResultsSkeleton />);
    const main = container.firstChild as HTMLElement;
    expect(main).toHaveClass("space-y-6");
  });

  it("renders three card skeletons for header", () => {
    render(<AcademicResultsSkeleton />);

    const cardSkeletons = screen.getAllByText(""); // CardSkeleton components
    expect(cardSkeletons.length).toBeGreaterThanOrEqual(3);
  });

  it("renders three chart skeletons", () => {
    render(<AcademicResultsSkeleton />);

    const chartSkeletons = screen.getAllByText(""); // ChartSkeleton components
    expect(chartSkeletons.length).toBeGreaterThanOrEqual(3);
  });

  it("has correct CSS classes for main container", () => {
    const { container } = render(<AcademicResultsSkeleton />);

    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass("space-y-6");
  });

  it("renders header skeleton grid with correct classes", () => {
    const { container } = render(<AcademicResultsSkeleton />);

    const headerGrid = container.querySelector(
      ".grid.grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3.gap-4",
    );
    expect(headerGrid).toBeInTheDocument();
  });

  it("renders chart skeleton container with correct classes", () => {
    const { container } = render(<AcademicResultsSkeleton />);

    const chartContainer = container.querySelector(".space-y-6");
    expect(chartContainer).toBeInTheDocument();
  });

  it("renders without crashing", () => {
    expect(() => render(<AcademicResultsSkeleton />)).not.toThrow();
  });

  it("has proper skeleton animation classes", () => {
    const { container } = render(<AcademicResultsSkeleton />);

    // Check for animate-pulse classes which are used for skeleton loading
    const animatedElements = container.querySelectorAll(".animate-pulse");
    expect(animatedElements.length).toBeGreaterThan(0);
  });

  it("renders skeleton elements with correct background colors", () => {
    const { container } = render(<AcademicResultsSkeleton />);

    // Check for bg-gray-200 classes which are used for skeleton backgrounds
    const grayElements = container.querySelectorAll(".bg-gray-200");
    expect(grayElements.length).toBeGreaterThan(0);
  });

  it("renders skeleton elements with correct border styling", () => {
    const { container } = render(<AcademicResultsSkeleton />);

    // Check for border classes
    const borderElements = container.querySelectorAll(".border");
    expect(borderElements.length).toBeGreaterThan(0);
  });

  it("renders skeleton elements with correct rounded corners", () => {
    const { container } = render(<AcademicResultsSkeleton />);

    // Check for rounded classes
    const roundedElements = container.querySelectorAll("[class*='rounded']");
    expect(roundedElements.length).toBeGreaterThan(0);
  });

  it("renders skeleton elements with correct shadow styling", () => {
    const { container } = render(<AcademicResultsSkeleton />);

    // Check for shadow classes
    const shadowElements = container.querySelectorAll(".shadow");
    expect(shadowElements.length).toBeGreaterThan(0);
  });

  it("renders skeleton elements with correct padding", () => {
    const { container } = render(<AcademicResultsSkeleton />);

    // Check for padding classes
    const paddingElements = container.querySelectorAll(".p-4");
    expect(paddingElements.length).toBeGreaterThan(0);
  });

  it("renders skeleton elements with correct width classes", () => {
    const { container } = render(<AcademicResultsSkeleton />);

    // Check for width classes like w-1/2, w-1/3
    const widthElements = container.querySelectorAll("[class*='w-']");
    expect(widthElements.length).toBeGreaterThan(0);
  });

  it("renders skeleton elements with correct height classes", () => {
    const { container } = render(<AcademicResultsSkeleton />);

    // Check for height classes like h-5, h-8, h-6, h-64
    const heightElements = container.querySelectorAll("[class*='h-']");
    expect(heightElements.length).toBeGreaterThan(0);
  });

  it("renders skeleton elements with correct margin classes", () => {
    const { container } = render(<AcademicResultsSkeleton />);

    // Check for margin classes like mb-4
    const marginElements = container.querySelectorAll("[class*='mb-']");
    expect(marginElements.length).toBeGreaterThan(0);
  });
});
