import "@testing-library/jest-dom";
import ResetPasswordAnimation from "@/app/ui/components/_common/resetPassword/ResetPasswordAnimation";
import { render } from "@testing-library/react";
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any, react/display-name
jest.mock("next/dynamic", () => () => (props: any) => (
  <div data-testid="lottie-mock" {...props} />
));
jest.mock("lottie-react", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => <div data-testid="lottie-mock" {...props} />,
}));

describe("ResetPasswordAnimation", () => {
  it("renders Lottie with given className", () => {
    const { getByTestId } = render(
      <ResetPasswordAnimation className="test-class" />,
    );
    expect(getByTestId("lottie-mock")).toBeInTheDocument();
  });
});
