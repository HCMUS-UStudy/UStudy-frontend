import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock AdminSchedule component
// eslint-disable-next-line react/display-name
jest.mock("@/app/ui/components/admin/schedule/AdminSchedule", () => () => (
  <div data-testid="admin-schedule" />
));

import SchedulePage from "@/app/(admin)/admin/schedule/page";

describe("SchedulePage", () => {
  it("renders AdminSchedule component", async () => {
    render(await SchedulePage());

    expect(screen.getByTestId("admin-schedule")).toBeInTheDocument();
  });

  it("renders without crashing", async () => {
    await expect(async () => render(await SchedulePage())).not.toThrow();
  });
});
