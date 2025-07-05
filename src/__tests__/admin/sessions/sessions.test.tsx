import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import SessionsPage from "@/app/(admin)/admin/sessions/page";

// eslint-disable-next-line react/display-name
jest.mock("@/app/ui/components/admin/sessions/SessionPage", () => () => (
  <div>SessionManagementMock</div>
));

describe("Admin Sessions Page", () => {
  it("renders the SessionManagement component", () => {
    render(<SessionsPage />);
    expect(screen.getByText("SessionManagementMock")).toBeInTheDocument();
  });
});
