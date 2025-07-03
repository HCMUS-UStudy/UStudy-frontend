/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import MemberPage from "@/app/(admin)/admin/classes/[classId]/members/page";

// Mock các service và hook phụ thuộc
jest.mock("@/app/lib/services/class", () => ({
  getListMembers: jest.fn(),
  removeMembers: jest.fn(),
}));
jest.mock("@/app/lib/hooks", () => ({
  useEncodedRoute: () => ({ decodeId: (id: string) => id }),
}));
jest.mock("@/app/lib/hooks/useToast", () => ({
  useCustomToast: () => ({
    addToast: { success: jest.fn(), error: jest.fn() },
  }),
}));
// eslint-disable-next-line react/display-name
jest.mock("@/app/ui/components/admin/classes/addMember/AddMember", () => () => (
  <button data-testid="add-member-btn">Thêm thành viên</button>
));
jest.mock("@/app/ui/components/_common/Tooltip", () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, react/display-name
  ({ children, text }: any) => <span title={text}>{children}</span>,
);
// eslint-disable-next-line react/display-name
jest.mock("@/app/ui/components/_common/loading/Loading", () => () => (
  <div data-testid="loading">Loading...</div>
));
jest.mock("@/app/ui/components/_common/text-field/SearchField", () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, react/display-name
  ({ placeholder }: any) => (
    <input placeholder={placeholder} data-testid="search-field" />
  ),
);
jest.mock("@/app/ui/components/_common/Table", () => ({
  Table: ({ children }: any) => <table>{children}</table>,
  TableHeader: ({ columns }: any) => (
    <thead>
      <tr>
        {columns.map((col: string) => (
          <th key={col}>{col}</th>
        ))}
      </tr>
    </thead>
  ),
  TableBody: ({ children }: any) => <tbody>{children}</tbody>,
  TableRow: ({ children }: any) => <tr>{children}</tr>,
  TableCell: ({ children, ...props }: any) => <td {...props}>{children}</td>,
}));
jest.mock("@/app/ui/components/_common/Pagination", () =>
  // eslint-disable-next-line react/display-name
  ({ currentPage, totalPages, handlePageClick, handlePreviousPage, handleNextPage }: any) => (
    <div data-testid="pagination">
      <button data-testid="prev-page" onClick={handlePreviousPage}>
        Prev
      </button>
      <span data-testid="current-page">{currentPage}</span>
      <span data-testid="total-pages">{totalPages}</span>
      <button data-testid="next-page" onClick={handleNextPage}>
        Next
      </button>
      <button data-testid="goto-page-2" onClick={() => handlePageClick(2)}>
        2
      </button>
    </div>
  ),
);
jest.mock("react-icons/ri", () => ({
  RiDeleteBin6Line: (props: any) => (
    <button data-testid="delete-icon" {...props}>
      Delete
    </button>
  ),
}));
jest.mock("@/app/ui/components/_common/DeletePopup", () =>
  // eslint-disable-next-line react/display-name
  ({ onDelete, onCancel }: any) => (
    <div data-testid="delete-popup">
      <button data-testid="confirm-delete" onClick={onDelete}>
        Xóa
      </button>
      <button data-testid="cancel-delete" onClick={onCancel}>
        Hủy
      </button>
    </div>
  ),
);

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useParams: () => ({ classId: "test-class-id" }),
  useSearchParams: () => ({ get: jest.fn(() => "") }),
}));

// Mock react-query
const mockUseQuery = jest.fn();
jest.mock("@tanstack/react-query", () => ({
  useQuery: (...args: any) => mockUseQuery(...args),
  useMutation: jest.fn(() => ({ mutate: jest.fn() })),
  useQueryClient: () => ({ invalidateQueries: jest.fn() }),
}));

describe("MemberPage (admin)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.innerWidth = 1024;
  });

  it("renders loading state", () => {
    mockUseQuery.mockReturnValue({ isLoading: true });
    render(<MemberPage />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders member list and table headers", async () => {
    mockUseQuery.mockReturnValue({
      isLoading: false,
      data: {
        content: [
          {
            id: "1",
            genId: "0123",
            name: "Nguyen Van A",
            email: "a@email.com",
            birthday: "2000-01-01",
            gender: "MALE",
          },
          {
            id: "2",
            genId: "1123",
            name: "Le Thi B",
            email: "b@email.com",
            birthday: "2001-02-02",
            gender: "FEMALE",
          },
        ],
        totalPages: 1,
      },
    });
    render(<MemberPage />);
    expect(screen.getByText("GenId")).toBeInTheDocument();
    expect(screen.getByText("Tên")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Ngày sinh")).toBeInTheDocument();
    expect(screen.getByText("Giới tính")).toBeInTheDocument();
    expect(screen.getByText("Vai trò")).toBeInTheDocument();
    expect(screen.getByText("0123")).toBeInTheDocument();
    expect(screen.getByText("Nguyen Van A")).toBeInTheDocument();
    expect(screen.getByText("a@email.com")).toBeInTheDocument();
    expect(screen.getByText("1/1/2000")).toBeInTheDocument();
    expect(screen.getByText("Nam")).toBeInTheDocument();
    expect(screen.getByText("Giáo vụ")).toBeInTheDocument();
    expect(screen.getByText("1123")).toBeInTheDocument();
    expect(screen.getByText("Le Thi B")).toBeInTheDocument();
    expect(screen.getByText("b@email.com")).toBeInTheDocument();
    expect(screen.getByText("2/2/2001")).toBeInTheDocument();
    expect(screen.getByText("Nữ")).toBeInTheDocument();
    expect(screen.getByText("Giáo viên")).toBeInTheDocument();
  });

  it("shows delete popup and calls remove function", async () => {
    const mutate = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    (require("@tanstack/react-query").useMutation as jest.Mock).mockReturnValue(
      { mutate },
    );
    mockUseQuery.mockReturnValue({
      isLoading: false,
      data: {
        content: [
          {
            id: "2",
            genId: "1123",
            name: "Le Thi B",
            email: "b@email.com",
            birthday: "2001-02-02",
            gender: "FEMALE",
          },
        ],
        totalPages: 1,
      },
    });
    render(<MemberPage />);
    fireEvent.click(screen.getByTestId("delete-icon"));
    expect(screen.getByTestId("delete-popup")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("confirm-delete"));
    expect(mutate).toHaveBeenCalled();
  });

  it("can cancel delete popup", async () => {
    mockUseQuery.mockReturnValue({
      isLoading: false,
      data: {
        content: [
          {
            id: "2",
            genId: "1123",
            name: "Le Thi B",
            email: "b@email.com",
            birthday: "2001-02-02",
            gender: "FEMALE",
          },
        ],
        totalPages: 1,
      },
    });
    render(<MemberPage />);
    fireEvent.click(screen.getByTestId("delete-icon"));
    expect(screen.getByTestId("delete-popup")).toBeInTheDocument();
    fireEvent.click(screen.getByTestId("cancel-delete"));
    expect(screen.queryByTestId("delete-popup")).not.toBeInTheDocument();
  });

  it("renders pagination when totalPages > 1", () => {
    mockUseQuery.mockReturnValue({
      isLoading: false,
      data: {
        content: [
          {
            id: "1",
            genId: "0123",
            name: "Nguyen Van A",
            email: "a@email.com",
            birthday: "2000-01-01",
            gender: "MALE",
          },
        ],
        totalPages: 2,
      },
    });
    render(<MemberPage />);
    expect(screen.getByTestId("pagination")).toBeInTheDocument();
    expect(screen.getByTestId("current-page")).toHaveTextContent("1");
    expect(screen.getByTestId("total-pages")).toHaveTextContent("2");
    fireEvent.click(screen.getByTestId("next-page"));
    expect(screen.getByTestId("current-page")).toBeInTheDocument();
  });

  it("renders search field and add member button", () => {
    mockUseQuery.mockReturnValue({
      isLoading: false,
      data: { content: [], totalPages: 1 },
    });
    render(<MemberPage />);
    expect(screen.getByTestId("search-field")).toBeInTheDocument();
    expect(screen.getByTestId("add-member-btn")).toBeInTheDocument();
  });
});
