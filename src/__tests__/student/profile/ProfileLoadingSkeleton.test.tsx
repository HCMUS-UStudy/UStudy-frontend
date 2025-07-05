import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

const ProfileLoadingSkeleton =
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("@/app/ui/components/_common/profile/ProfileLoadingSkeleton").default;

describe("ProfileLoadingSkeleton (student)", () => {
  it("renders skeleton container and 6 grid items", () => {
    render(<ProfileLoadingSkeleton />);
    expect(
      screen.getByText(
        (content, element) =>
          element?.className?.includes("max-w-5xl") ?? false,
      ),
    ).toBeInTheDocument();
    expect(
      document.querySelectorAll(".animate-pulse").length,
    ).toBeGreaterThanOrEqual(2); // avatar + grid
    expect(document.querySelectorAll(".h-20.bg-gray-100").length).toBe(6);
  });
});
