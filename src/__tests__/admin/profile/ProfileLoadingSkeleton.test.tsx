import React from "react";
import { render } from "@testing-library/react";
import ProfileLoadingSkeleton from "@/app/ui/components/_common/profile/ProfileLoadingSkeleton";

describe("ProfileLoadingSkeleton", () => {
  it("render không lỗi", () => {
    render(<ProfileLoadingSkeleton />);
  });
});
