import React from "react";
import { render } from "@testing-library/react";
import PaymentLoadingSkeleton from "@/app/ui/components/user/parent/tuition/PaymentLoadingSkeleton";
import "@testing-library/jest-dom";

describe("PaymentLoadingSkeleton", () => {
  it("renders 5 loading rows", () => {
    render(<PaymentLoadingSkeleton />);
    expect(document.querySelectorAll(".animate-pulse").length).toBe(1);
  });
});
