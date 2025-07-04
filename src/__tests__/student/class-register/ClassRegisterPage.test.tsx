import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock all child components
// eslint-disable-next-line react/display-name
jest.mock("@/app/ui/components/_common/text-field/SearchField", () => () => (
  <div data-testid="search-field" />
));
jest.mock(
  "@/app/ui/components/_common/text-field/SearchParamsRadioGroup",
  () => ({
    SearchParamsRadioGroup: () => (
      <div data-testid="search-params-radio-group" />
    ),
  }),
);
jest.mock(
  "@/app/ui/components/user/student/class-register/ClassFilter",
  // eslint-disable-next-line react/display-name
  () => () => <div data-testid="class-filter" />,
);
jest.mock(
  "@/app/ui/components/user/student/class-register/RegisterClasses",
  // eslint-disable-next-line react/display-name
  () => () => <div data-testid="register-classes" />,
);

import ClassRegister from "@/app/(user)/member/class-register/page";

describe("ClassRegister Page", () => {
  it("renders all main UI elements and child components", async () => {
    // page is an async function component
    const Page = await ClassRegister({
      searchParams: Promise.resolve({ query: "" }),
    });
    render(Page);
    expect(screen.getByText("Các lớp học hiện có")).toBeInTheDocument();
    expect(screen.getByTestId("search-field")).toBeInTheDocument();
    expect(screen.getByTestId("search-params-radio-group")).toBeInTheDocument();
    expect(screen.getByTestId("class-filter")).toBeInTheDocument();
    expect(screen.getByTestId("register-classes")).toBeInTheDocument();
  });
});
