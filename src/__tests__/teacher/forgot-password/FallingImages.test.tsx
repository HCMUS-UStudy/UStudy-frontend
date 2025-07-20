import FallingImages from "@/app/ui/components/_common/forgetPassword/FallingImages";
import { render, screen } from "@testing-library/react";
import React from "react";

describe("FallingImages", () => {
  it("renders 5 falling images with correct alt text", () => {
    render(<FallingImages />);
    const images = screen.getAllByAltText(/intersect/i);
    expect(images).toHaveLength(5);
  });
});
