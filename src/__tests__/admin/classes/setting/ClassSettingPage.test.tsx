import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ClassSetting from "@/app/(admin)/admin/classes/[classId]/setting/page";

// Mock các service và hook phụ thuộc
jest.mock("@/app/lib/services", () => ({
  getClassById: jest.fn(),
  getAllCourses: jest.fn(),
  getAllGrades: jest.fn(),
  updateClass: jest.fn(),
}));
jest.mock("@/app/lib/hooks", () => ({
  useEncodedRoute: () => ({ decodeId: (id: string) => id }),
}));
jest.mock("@/app/lib/hooks/useToast", () => ({
  useCustomToast: () => ({
    addToast: { success: jest.fn(), error: jest.fn() },
  }),
}));
jest.mock(
  "@/app/ui/components/_common/loading/ClassSettingLoading",
  // eslint-disable-next-line react/display-name
  () => () => <div data-testid="loading">Loading...</div>,
);
jest.mock("@/app/ui/components/admin/classes/setting/ClassForm", () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, react/display-name
  ({ classDetail, grades, courses, handleUpdate }: any) => (
    <form
      data-testid="class-form"
      onSubmit={(e) => {
        e.preventDefault();
        handleUpdate({ classId: classDetail.id, data: { name: "new name" } });
      }}
    >
      <button type="submit">Cập nhật</button>
      <div data-testid="class-name">{classDetail?.name}</div>
      <div data-testid="grades">{grades.length}</div>
      <div data-testid="courses">{courses.length}</div>
    </form>
  ),
);
// Mock next/navigation
jest.mock("next/navigation", () => ({
  useParams: () => ({ classId: "test-class-id" }),
}));
// Mock react-query
const mockUseQuery = jest.fn();
const mockUseQueries = jest.fn();
const mockUseMutation = jest.fn();
jest.mock("@tanstack/react-query", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useQuery: (...args: any) => mockUseQuery(...args),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useQueries: (...args: any) => mockUseQueries(...args),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useMutation: (...args: any) => mockUseMutation(...args),
  QueryClient: function () {
    return { invalidateQueries: jest.fn() };
  },
}));

describe("ClassSetting (admin)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders loading state", () => {
    mockUseQuery.mockReturnValue({ status: "pending" });
    mockUseQueries.mockReturnValue([{}, {}]);
    render(<ClassSetting />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders form with class detail, grades, courses", () => {
    mockUseQuery.mockReturnValue({
      status: "success",
      data: { id: "1", name: "Lớp 1" },
    });
    mockUseQueries.mockReturnValue([
      { data: { content: [{ id: "c1" }, { id: "c2" }] } },
      { data: { content: [{ id: "g1" }] } },
    ]);
    render(<ClassSetting />);
    expect(screen.getByTestId("class-form")).toBeInTheDocument();
    expect(screen.getByTestId("class-name")).toHaveTextContent("Lớp 1");
    expect(screen.getByTestId("grades")).toHaveTextContent("1");
    expect(screen.getByTestId("courses")).toHaveTextContent("2");
  });

  it("calls handleUpdate and mutation when submitting form", () => {
    mockUseQuery.mockReturnValue({
      status: "success",
      data: { id: "1", name: "Lớp 1" },
    });
    mockUseQueries.mockReturnValue([
      { data: { content: [{ id: "c1" }] } },
      { data: { content: [{ id: "g1" }] } },
    ]);
    const mutate = jest.fn();
    mockUseMutation.mockReturnValue({ mutate });
    render(<ClassSetting />);
    fireEvent.submit(screen.getByTestId("class-form"));
    expect(mutate).toHaveBeenCalled();
  });
});
