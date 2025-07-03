import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SessionManagement from "@/app/ui/components/admin/sessions/SessionPage";

jest.mock("@/app/lib/services/session", () => ({
  getSession: jest.fn(),
  deleteSession: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => ({
  useQuery: jest.fn(() => ({
    data: { content: [], totalPages: 1 },
    status: "pending",
  })),
  useMutation: jest.fn(() => ({ mutate: jest.fn() })),
  useQueryClient: jest.fn(() => ({ invalidateQueries: jest.fn() })),
  keepPreviousData: undefined,
}));

// eslint-disable-next-line react/display-name
jest.mock("@/app/ui/components/_common/text-field/SearchField", () => () => (
  <input placeholder="Tìm ca học..." />
));
jest.mock("@/app/ui/components/_common/Table", () => ({
  Table: ({ children }: { children: React.ReactNode }) => (
    <table>{children}</table>
  ),
  TableBody: ({ children }: { children: React.ReactNode }) => (
    <tbody>{children}</tbody>
  ),
  TableCell: ({ children }: { children: React.ReactNode }) => (
    <td>{children}</td>
  ),
  TableHeader: ({ columns }: { columns: string[] }) => (
    <thead>
      <tr>
        {columns.map((col: string) => (
          <th key={col}>{col}</th>
        ))}
      </tr>
    </thead>
  ),
  TableRow: ({ children }: { children: React.ReactNode }) => (
    <tr>{children}</tr>
  ),
}));
jest.mock("@/app/ui/components/_common/Tooltip", () =>
  // eslint-disable-next-line react/display-name
  ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
);
// eslint-disable-next-line react/display-name
jest.mock("@/app/ui/components/_common/Pagination", () => () => (
  <div>PaginationMock</div>
));
// eslint-disable-next-line react/display-name
jest.mock("@/app/ui/components/admin/branches/SessionModal", () => () => (
  <div>SessionModalMock</div>
));
jest.mock("@/app/lib/hooks/useToast", () => ({
  useCustomToast: () => ({
    addToast: { error: jest.fn(), success: jest.fn() },
  }),
}));

describe("SessionManagement", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    render(<SessionManagement />);
    expect(screen.getByText(/Tổng số ca học/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Tìm ca học/i)).toBeInTheDocument();
  });

  it("renders sessions data", async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require("@tanstack/react-query").useQuery.mockImplementation(() => ({
      data: {
        content: [
          { id: "1", name: "Session 1", startTime: "08:00", endTime: "09:00" },
          { id: "2", name: "Session 2", startTime: "09:00", endTime: "10:00" },
        ],
        totalPages: 1,
      },
      status: "success",
    }));
    render(<SessionManagement />);
    await waitFor(() => {
      expect(screen.getByText("Session 1")).toBeInTheDocument();
      expect(screen.getByText("Session 2")).toBeInTheDocument();
      expect(screen.getByText("08:00")).toBeInTheDocument();
      expect(screen.getAllByText("09:00").length).toBeGreaterThan(1);
      expect(screen.getByText("10:00")).toBeInTheDocument();
    });
  });
});
