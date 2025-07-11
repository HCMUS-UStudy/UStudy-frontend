import React from "react";
import { render } from "@testing-library/react";
import ProfileLoadingSkeleton from "@/app/ui/components/_common/profile/ProfileLoadingSkeleton";

describe("ProfileLoadingSkeleton", () => {
  it("hiển thị skeleton loading", () => {
    const { container } = render(<ProfileLoadingSkeleton />);
    // Kiểm tra có class animate-pulse (ảnh đại diện và các item)
    expect(container.querySelectorAll(".animate-pulse").length).toBeGreaterThan(
      0,
    );
    // Kiểm tra có 6 item skeleton
    expect(container.querySelectorAll(".h-20.bg-gray-100").length).toBe(6);
  });
});
