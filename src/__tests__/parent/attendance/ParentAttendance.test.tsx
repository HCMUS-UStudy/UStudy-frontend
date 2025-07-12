/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ParentAttendance from "@/app/ui/components/user/parent/attendance/ParentAttendance";
import { getListUserClass } from "@/app/lib/services/class";
import { getAttendanceListByStudent } from "@/app/lib/services/attendance";

// Mock the services
jest.mock("@/app/lib/services/class");
jest.mock("@/app/lib/services/attendance");

// Mock the child components
jest.mock(
  "@/app/ui/components/user/parent/attendance/AttendanceCalendar",
  () => {
    return function MockAttendanceCalendar({
      mockAttendanceData,
      selectedMonth,
      selectedYear,
    }: any) {
      return (
        <div data-testid="attendance-calendar">
          <div data-testid="calendar-data">
            {JSON.stringify(mockAttendanceData)}
          </div>
          <div data-testid="calendar-month">{selectedMonth}</div>
          <div data-testid="calendar-year">{selectedYear}</div>
        </div>
      );
    };
  },
);

jest.mock("@/app/ui/components/user/parent/attendance/AttendanceList", () => {
  return function MockAttendanceList({
    mockAttendanceData,
    selectedMonth,
    selectedYear,
  }: any) {
    return (
      <div data-testid="attendance-list">
        <div data-testid="list-data">{JSON.stringify(mockAttendanceData)}</div>
        <div data-testid="list-month">{selectedMonth}</div>
        <div data-testid="list-year">{selectedYear}</div>
      </div>
    );
  };
});

jest.mock(
  "@/app/ui/components/user/parent/attendance/AttendanceSummary",
  () => {
    return function MockAttendanceSummary({
      mockAttendanceData,
      selectedMonth,
      selectedYear,
    }: any) {
      return (
        <div data-testid="attendance-summary">
          <div data-testid="summary-data">
            {JSON.stringify(mockAttendanceData)}
          </div>
          <div data-testid="summary-month">{selectedMonth}</div>
          <div data-testid="summary-year">{selectedYear}</div>
        </div>
      );
    };
  },
);

// Mock the Select component
jest.mock("@/app/ui/components/_common/Select", () => {
  function extractText(node: any): string {
    if (typeof node === "string") return node;
    if (Array.isArray(node)) return node.map(extractText).join(" ");
    if (node && node.props && node.props.children)
      return extractText(node.props.children);
    return "";
  }

  const SelectItem = ({ children, value }: any) => (
    <option value={value}>{extractText(children)}</option>
  );

  return {
    Select: ({
      children,
      onValueChange,
      defaultValue,
      defaultLabel,
      className,
    }: any) => (
      <select
        data-testid="select"
        onChange={(e) => onValueChange?.(e.target.value)}
        defaultValue={defaultValue}
        className={className}
      >
        <option value="" disabled>
          {defaultLabel}
        </option>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === SelectItem) {
            const childValue = (child.props as any).value;
            const childText = extractText((child.props as any).children);
            return (
              <option key={childValue} value={childValue}>
                {childText}
              </option>
            );
          }
          return null;
        })}
      </select>
    ),
    SelectItem,
  };
});

// Mock the Tabs component
jest.mock("@/app/ui/components/_common/Tabs", () => {
  const Tab = ({ label, value }: any) => (
    <button data-testid={`tab-${value}`} data-value={value} onClick={() => {}}>
      {label}
    </button>
  );

  const TabList = ({ children, className }: any) => (
    <div data-testid="tab-list" className={className}>
      {children}
    </div>
  );

  const TabPanel = ({ children, value }: any) => (
    <div data-testid={`tab-panel-${value}`}>{children}</div>
  );

  return {
    Tab,
    TabList,
    TabPanel,
    Tabs: ({ children, className }: any) => (
      <div data-testid="tabs" className={className}>
        {children}
      </div>
    ),
  };
});

// Mock Redux store
const mockStore = configureStore({
  reducer: {
    children: (state = { selectedChild: null }, action: any) => {
      switch (action.type) {
        case "children/setSelectedChild":
          return { ...state, selectedChild: action.payload };
        default:
          return state;
      }
    },
  },
  preloadedState: {
    children: {
      selectedChild: {
        id: "child-1",
        name: "Nguyễn Văn A",
        email: "child@example.com",
      },
    },
  },
});

// Mock data
const mockClasses = {
  content: [
    {
      id: "class-1",
      name: "Lớp Toán 10A",
      course: { name: "Toán học" },
      grade: { name: "Lớp 10" },
      description: "Lớp học toán nâng cao",
    },
    {
      id: "class-2",
      name: "Lớp Văn 10B",
      course: { name: "Ngữ văn" },
      grade: { name: "Lớp 10" },
      description: "Lớp học văn học",
    },
  ],
  totalElements: 2,
  totalPages: 1,
  size: 10,
  number: 0,
};

const mockAttendanceData = {
  data: [
    {
      id: "att-1",
      date: "2024-01-15T08:00:00Z",
      status: "PRESENT",
      note: "Đi học đúng giờ",
      classSession: {
        session: {
          name: "Toán học",
          startTime: "08:00",
          endTime: "09:30",
        },
      },
    },
    {
      id: "att-2",
      date: "2024-01-16T08:00:00Z",
      status: "ABSENT",
      note: "Nghỉ ốm",
      classSession: {
        session: {
          name: "Văn học",
          startTime: "10:00",
          endTime: "11:30",
        },
      },
    },
  ],
};

// Mock the services
const mockGetListUserClass = getListUserClass as jest.MockedFunction<
  typeof getListUserClass
>;
const mockGetAttendanceListByStudent =
  getAttendanceListByStudent as jest.MockedFunction<
    typeof getAttendanceListByStudent
  >;

describe("ParentAttendance", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    mockGetListUserClass.mockResolvedValue(mockClasses as any);
    mockGetAttendanceListByStudent.mockResolvedValue(mockAttendanceData as any);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <Provider store={mockStore}>
        <QueryClientProvider client={queryClient}>
          <ParentAttendance />
        </QueryClientProvider>
      </Provider>,
    );
  };

  describe("Rendering", () => {
    it("renders the component with header", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Trang điểm danh")).toBeInTheDocument();
      });

      expect(
        screen.getByText(/Theo dõi tình hình điểm danh của/),
      ).toBeInTheDocument();
    });

    it("shows child name in the description", async () => {
      renderComponent();

      await waitFor(() => {
        expect(
          screen.getByText(/Theo dõi tình hình điểm danh của Nguyễn Văn A/),
        ).toBeInTheDocument();
      });
    });

    it("renders class selection dropdown", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId("select")).toBeInTheDocument();
      });
    });

    it("renders tabs when class is selected", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId("select")).toBeInTheDocument();
      });

      // Select a class
      const select = screen.getByTestId("select");
      fireEvent.change(select, { target: { value: "class-1" } });

      await waitFor(() => {
        expect(screen.getByTestId("tabs")).toBeInTheDocument();
      });

      expect(screen.getByText("Lịch điểm danh")).toBeInTheDocument();
      expect(screen.getByText("Danh sách điểm danh")).toBeInTheDocument();
      expect(screen.getByText("Nhận xét & Thống kê")).toBeInTheDocument();
    });
  });

  describe("Class Selection", () => {
    it("loads and displays classes in dropdown", async () => {
      renderComponent();

      await waitFor(() => {
        expect(mockGetListUserClass).toHaveBeenCalledWith(
          "child-1",
          "",
          0,
          100,
        );
      });

      await waitFor(() => {
        expect(screen.getByText(/Lớp Toán 10A/)).toBeInTheDocument();
        expect(screen.getByText(/Lớp Văn 10B/)).toBeInTheDocument();
      });
    });

    it("shows loading state while fetching classes", async () => {
      mockGetListUserClass.mockImplementation(() => new Promise(() => {}));

      renderComponent();

      await waitFor(() => {
        expect(
          screen.getByText("Đang tải danh sách lớp..."),
        ).toBeInTheDocument();
      });
    });

    it("shows empty state when no classes available", async () => {
      mockGetListUserClass.mockResolvedValue({
        content: [],
        totalElements: 0,
        totalPages: 0,
        size: 10,
        number: 0,
      } as any);

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Chưa chọn lớp học")).toBeInTheDocument();
      });
    });

    it("fetches attendance data when class is selected", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId("select")).toBeInTheDocument();
      });

      // Select a class
      const select = screen.getByTestId("select");
      fireEvent.change(select, { target: { value: "class-1" } });

      await waitFor(() => {
        expect(mockGetAttendanceListByStudent).toHaveBeenCalledWith({
          classId: "class-1",
          month: expect.any(Number),
          year: expect.any(Number),
          studentId: "child-1",
        });
      });
    });
  });

  describe("Loading States", () => {
    it("shows loading state for attendance data", async () => {
      mockGetAttendanceListByStudent.mockImplementation(
        () => new Promise(() => {}),
      );

      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId("select")).toBeInTheDocument();
      });

      // Select a class
      const select = screen.getByTestId("select");
      fireEvent.change(select, { target: { value: "class-1" } });

      await waitFor(() => {
        expect(screen.getByText("Đang tải...")).toBeInTheDocument();
      });
    });
  });

  describe("Empty States", () => {
    it("shows no child selected state when no child is selected", () => {
      const storeWithoutChild = configureStore({
        reducer: {
          children: (state = { selectedChild: null }, action: any) => {
            switch (action.type) {
              case "children/setSelectedChild":
                return { ...state, selectedChild: action.payload };
              default:
                return state;
            }
          },
        },
        preloadedState: {
          children: {
            selectedChild: null,
          },
        },
      });

      render(
        <Provider store={storeWithoutChild}>
          <QueryClientProvider client={queryClient}>
            <ParentAttendance />
          </QueryClientProvider>
        </Provider>,
      );

      expect(screen.getByText("Chưa chọn học sinh")).toBeInTheDocument();
      expect(
        screen.getByText(
          /Vui lòng chọn học sinh từ danh sách để xem thông tin điểm danh/,
        ),
      ).toBeInTheDocument();
    });

    it("shows no class selected state when no class is selected", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Chưa chọn lớp học")).toBeInTheDocument();
      });

      expect(
        screen.getByText(
          /Vui lòng chọn lớp học từ danh sách bên trên để xem thông tin điểm danh chi tiết/,
        ),
      ).toBeInTheDocument();
    });
  });

  describe("Data Conversion", () => {
    it("converts API data to component format correctly", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId("select")).toBeInTheDocument();
      });

      // Select a class
      const select = screen.getByTestId("select");
      fireEvent.change(select, { target: { value: "class-1" } });

      await waitFor(() => {
        expect(
          screen.getAllByTestId("attendance-calendar")[0],
        ).toBeInTheDocument();
      });

      const calendarData = screen.getByTestId("calendar-data");
      const data = JSON.parse(calendarData.textContent || "{}");

      expect(data.summary).toBeDefined();
      expect(data.summary.totalClasses).toBe(2);
      expect(data.summary.present).toBe(1);
      expect(data.summary.absent).toBe(1);
      expect(data.dates).toBeDefined();
      expect(Object.keys(data.dates)).toHaveLength(2);
    });
  });

  describe("Tab Navigation", () => {
    it("switches between tabs correctly", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId("select")).toBeInTheDocument();
      });

      // Select a class
      const select = screen.getByTestId("select");
      fireEvent.change(select, { target: { value: "class-1" } });

      await waitFor(() => {
        expect(screen.getByTestId("tabs")).toBeInTheDocument();
      });

      // Click on list tab
      fireEvent.click(screen.getAllByTestId("tab-list")[1]);

      await waitFor(() => {
        expect(screen.getByTestId("attendance-list")).toBeInTheDocument();
      });

      // Click on summary tab
      fireEvent.click(screen.getByTestId("tab-summary"));

      await waitFor(() => {
        expect(screen.getByTestId("attendance-summary")).toBeInTheDocument();
      });
    });
  });

  describe("Child Component Integration", () => {
    it("passes correct props to AttendanceCalendar", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId("select")).toBeInTheDocument();
      });

      // Select a class
      const select = screen.getByTestId("select");
      fireEvent.change(select, { target: { value: "class-1" } });

      await waitFor(() => {
        expect(
          screen.getAllByTestId("attendance-calendar")[0],
        ).toBeInTheDocument();
      });

      const currentDate = new Date();
      expect(screen.getByTestId("calendar-month")).toHaveTextContent(
        String(currentDate.getMonth() + 1),
      );
      expect(screen.getByTestId("calendar-year")).toHaveTextContent(
        String(currentDate.getFullYear()),
      );
    });

    it("passes correct props to AttendanceList", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId("select")).toBeInTheDocument();
      });

      // Select a class
      const select = screen.getByTestId("select");
      fireEvent.change(select, { target: { value: "class-1" } });

      // Switch to list tab
      fireEvent.click(screen.getAllByTestId("tab-list")[1]);

      await waitFor(() => {
        expect(screen.getByTestId("attendance-list")).toBeInTheDocument();
      });

      const currentDate = new Date();
      expect(screen.getByTestId("list-month")).toHaveTextContent(
        String(currentDate.getMonth() + 1),
      );
      expect(screen.getByTestId("list-year")).toHaveTextContent(
        String(currentDate.getFullYear()),
      );
    });

    it("passes correct props to AttendanceSummary", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId("select")).toBeInTheDocument();
      });

      // Select a class
      const select = screen.getByTestId("select");
      fireEvent.change(select, { target: { value: "class-1" } });

      // Switch to summary tab
      fireEvent.click(screen.getByTestId("tab-summary"));

      await waitFor(() => {
        expect(screen.getByTestId("attendance-summary")).toBeInTheDocument();
      });

      const currentDate = new Date();
      expect(screen.getByTestId("summary-month")).toHaveTextContent(
        String(currentDate.getMonth() + 1),
      );
      expect(screen.getByTestId("summary-year")).toHaveTextContent(
        String(currentDate.getFullYear()),
      );
    });
  });

  describe("Error Handling", () => {
    it("handles API errors gracefully", async () => {
      mockGetListUserClass.mockRejectedValue(new Error("API Error"));

      renderComponent();

      await waitFor(() => {
        expect(screen.getByTestId("select")).toBeInTheDocument();
      });

      // Should still render the component even with API errors
      expect(screen.getByText("Trang điểm danh")).toBeInTheDocument();
    });
  });
});
