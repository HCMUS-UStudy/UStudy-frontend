import "@testing-library/jest-dom";
import UserVerifyToken from "@/app/(auth)/verify-token/page";
import { render, screen } from "@testing-library/react";
import React from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let receivedProps: any = {};
jest.mock(
  "@/app/ui/components/_common/verifyToken/VerifyTokenPage",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, react/display-name
  () => (props: any) => {
    receivedProps = props;
    return <div data-testid="verify-token-page" />;
  },
);

describe("VerifyToken page", () => {
  beforeEach(() => {
    receivedProps = {};
  });
  it("renders VerifyTokenPage with correct props", () => {
    render(<UserVerifyToken />);
    expect(screen.getByTestId("verify-token-page")).toBeInTheDocument();
    expect(receivedProps.heading).toBeDefined();
    expect(receivedProps.subheading).toBeDefined();
    expect(receivedProps.onSuccessRedirect).toBeDefined();
  });

  it("renders loading fallback when suspense", () => {
    render(<UserVerifyToken />);
    expect(screen.getByTestId("verify-token-page")).toBeInTheDocument();
  });
});
