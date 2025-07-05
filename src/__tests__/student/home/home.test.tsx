import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@/app/lib/action", () => ({
  getUserDataFromCookies: jest
    .fn()
    .mockResolvedValue({ role: { defaultRoute: "STUDENT" } }),
}));

// eslint-disable-next-line react/display-name
jest.mock("@/app/ui/components/user/student/home/StudentHome", () => () => (
  <div data-testid="student-home" />
));

import Home from "@/app/(user)/member/home/page";

describe("Student Home Page", () => {
  it("render StudentHome khi role là STUDENT", async () => {
    // Home là async function component
    const HomePage = await Home();
    const { getByTestId } = render(HomePage);
    expect(getByTestId("student-home")).toBeInTheDocument();
  });
});
