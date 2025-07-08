import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import StudentClassesLoading from "@/app/ui/components/_common/loading/StudentClassesLoading";

describe("StudentClassesLoading", () => {
  it("renders 3 loading skeleton items", () => {
    render(<StudentClassesLoading />);
    // Đếm số div skeleton cha qua class đặc trưng
    const skeletons = document.querySelectorAll(
      ".bg-gray-100.border.border-gray-200.p-6.rounded-2xl.animate-pulse",
    );
    expect(skeletons.length).toBe(3);
  });

  it("renders correct class names for skeleton items", () => {
    render(<StudentClassesLoading />);
    // Kiểm tra className của phần tử avatar skeleton
    const avatar = screen.getAllByText((content, element) => {
      return Boolean(
        element?.className.includes("rounded-full") &&
          element.className.includes("bg-gray-300"),
      );
    });
    expect(avatar.length).toBeGreaterThanOrEqual(1);
  });
});
