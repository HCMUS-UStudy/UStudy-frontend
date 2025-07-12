import "@testing-library/jest-dom";
import VerifyTokenAnimation from "@/app/ui/components/_common/verifyToken/VerifyTokenAnimation";
import { render } from "@testing-library/react";
import React from "react";

// eslint-disable-next-line react/display-name, @typescript-eslint/no-explicit-any
jest.mock("next/dynamic", () => () => (props: any) => (
  <div data-testid="lottie-mock" {...props} />
));
jest.mock("lottie-react", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => <div data-testid="lottie-mock" {...props} />,
}));

describe("VerifyTokenAnimation", () => {
  it("renders Lottie with given className", () => {
    const { getByTestId } = render(
      <VerifyTokenAnimation className="test-class" />,
    );
    expect(getByTestId("lottie-mock")).toBeInTheDocument();
  });
});
