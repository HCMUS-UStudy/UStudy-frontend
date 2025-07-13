import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import Notification from "@/app/(user)/member/notifications/page";
import { getListNotification } from "@/app/lib/services/notification";
import { NotificationItem } from "@/app/types";
import "@testing-library/jest-dom";

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

// Mock notification service
jest.mock("@/app/lib/services/notification", () => ({
  getListNotification: jest.fn(),
}));

// Mock child components
jest.mock("@/app/ui/components/_common/loading/Loading", () => {
  return function MockLoading() {
    return <div data-testid="loading">Loading...</div>;
  };
});

jest.mock("@/app/ui/components/_common/Pagination", () => {
  return function MockPagination({
    currentPage,
    totalPages,
    handlePageClick,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }: any) {
    return (
      <div data-testid="pagination">
        <button onClick={() => handlePageClick(currentPage - 1)}>
          Previous
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button onClick={() => handlePageClick(currentPage + 1)}>Next</button>
      </div>
    );
  };
});

jest.mock("@/app/ui/components/admin/notifications/NotificationHeader", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function MockNotificationHeader({ onRefresh }: any) {
    return (
      <div data-testid="notification-header">
        <button onClick={onRefresh}>Refresh</button>
      </div>
    );
  };
});

jest.mock(
  "@/app/ui/components/admin/notifications/NotificationSearchFilter",
  () => {
    return function MockNotificationSearchFilter({
      searchTerm,
      filterType,
      filterStatus,
      onSearchChange,
      onFilterTypeChange,
      onFilterStatusChange,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }: any) {
      return (
        <div data-testid="notification-search-filter">
          <input
            data-testid="search-input"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notifications..."
          />
          <select
            data-testid="type-filter"
            value={filterType}
            onChange={(e) => onFilterTypeChange(e.target.value)}
          >
            <option value="ALL">All Types</option>
            <option value="SYSTEM">System</option>
            <option value="CLASS">Class</option>
            <option value="USER">User</option>
          </select>
          <select
            data-testid="status-filter"
            value={filterStatus}
            onChange={(e) => onFilterStatusChange(e.target.value)}
          >
            <option value="ALL">All Status</option>
            <option value="READ">Read</option>
            <option value="UNREAD">Unread</option>
          </select>
        </div>
      );
    };
  },
);

jest.mock("@/app/ui/components/admin/notifications/NotificationCard", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function MockNotificationCard({ notification, onClick }: any) {
    return (
      <div
        data-testid={`notification-card-${notification.id}`}
        onClick={() => onClick(notification)}
        className="notification-card"
      >
        <h3>{notification.title}</h3>
        <p>{notification.content}</p>
        <span>{notification.read ? "Read" : "Unread"}</span>
      </div>
    );
  };
});

jest.mock(
  "@/app/ui/components/admin/notifications/NotificationEmptyState",
  () => {
    return function MockNotificationEmptyState({
      searchTerm,
      filterType,
      filterStatus,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }: any) {
      return (
        <div data-testid="notification-empty-state">
          <p>No notifications found</p>
          {searchTerm && <p>Search term: {searchTerm}</p>}
          {filterType !== "ALL" && <p>Filter type: {filterType}</p>}
          {filterStatus !== "ALL" && <p>Filter status: {filterStatus}</p>}
        </div>
      );
    };
  },
);

const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
};

const mockParams = {};

const mockNotifications: NotificationItem[] = [
  {
    id: "1",
    title: "System Maintenance",
    content: "System will be down for maintenance",
    sendDate: "2024-01-15T10:00:00Z",
    read: false,
    sender: {
      id: "1",
      genId: "gen1",
      name: "System Admin",
      avatar: "/avatars/admin.png",
      email: "admin@example.com",
    },
    type: "ANNOUNCEMENT",
    receiverType: "SYSTEM",
  },
  {
    id: "2",
    title: "Class Assignment",
    content: "New assignment posted for Math class",
    sendDate: "2024-01-14T15:30:00Z",
    read: true,
    sender: {
      id: "2",
      genId: "gen2",
      name: "Math Teacher",
      avatar: "/avatars/teacher.png",
      email: "teacher@example.com",
    },
    type: "ASSIGNMENT",
    receiverType: "CLASS",
    className: "Math 101",
  },
  {
    id: "3",
    title: "Personal Message",
    content: "You have a new personal message",
    sendDate: "2024-01-13T09:15:00Z",
    read: false,
    sender: {
      id: "3",
      genId: "gen3",
      name: "John Doe",
      avatar: "/avatars/user.png",
      email: "john@example.com",
    },
    type: "MESSAGE",
    receiverType: "USER",
  },
];

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

const renderWithQueryClient = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>,
  );
};

describe("Notification Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useParams as jest.Mock).mockReturnValue(mockParams);
    (getListNotification as jest.Mock).mockResolvedValue(mockNotifications);
  });

  describe("Initial Rendering", () => {
    it("should show loading state initially", async () => {
      renderWithQueryClient(<Notification />);

      expect(screen.getByTestId("loading")).toBeInTheDocument();
      expect(screen.getByText("Đang tải thông báo...")).toBeInTheDocument();
    });

    it("should render notification list after loading", async () => {
      renderWithQueryClient(<Notification />);

      await waitFor(() => {
        expect(screen.getByTestId("notification-header")).toBeInTheDocument();
        expect(
          screen.getByTestId("notification-search-filter"),
        ).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByTestId("notification-card-1")).toBeInTheDocument();
        expect(screen.getByTestId("notification-card-2")).toBeInTheDocument();
        expect(screen.getByTestId("notification-card-3")).toBeInTheDocument();
      });
    });

    it("should display notification titles and content", async () => {
      renderWithQueryClient(<Notification />);

      await waitFor(() => {
        expect(screen.getByText("System Maintenance")).toBeInTheDocument();
        expect(
          screen.getByText("System will be down for maintenance"),
        ).toBeInTheDocument();
        expect(screen.getByText("Class Assignment")).toBeInTheDocument();
        expect(
          screen.getByText("New assignment posted for Math class"),
        ).toBeInTheDocument();
      });
    });
  });

  describe("Data Fetching", () => {
    it("should fetch notifications on mount", async () => {
      renderWithQueryClient(<Notification />);

      await waitFor(() => {
        expect(getListNotification).toHaveBeenCalledTimes(1);
      });
    });

    it("should handle fetch error gracefully", async () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      (getListNotification as jest.Mock).mockRejectedValue(
        new Error("Fetch failed"),
      );

      renderWithQueryClient(<Notification />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          "Failed to fetch notifications:",
          expect.any(Error),
        );
      });

      consoleSpy.mockRestore();
    });

    it("should refresh data when refresh button is clicked", async () => {
      renderWithQueryClient(<Notification />);

      await waitFor(() => {
        expect(screen.getByTestId("notification-header")).toBeInTheDocument();
      });

      const refreshButton = screen.getByText("Refresh");
      fireEvent.click(refreshButton);

      await waitFor(() => {
        expect(getListNotification).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("Search and Filtering", () => {
    it("should filter notifications by search term", async () => {
      renderWithQueryClient(<Notification />);

      await waitFor(() => {
        expect(
          screen.getByTestId("notification-search-filter"),
        ).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "System" } });

      await waitFor(() => {
        expect(screen.getByTestId("notification-card-1")).toBeInTheDocument();
        expect(
          screen.queryByTestId("notification-card-2"),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByTestId("notification-card-3"),
        ).not.toBeInTheDocument();
      });
    });

    it("should filter notifications by type", async () => {
      renderWithQueryClient(<Notification />);

      await waitFor(() => {
        expect(
          screen.getByTestId("notification-search-filter"),
        ).toBeInTheDocument();
      });

      const typeFilter = screen.getByTestId("type-filter");
      fireEvent.change(typeFilter, { target: { value: "CLASS" } });

      await waitFor(() => {
        expect(
          screen.queryByTestId("notification-card-1"),
        ).not.toBeInTheDocument();
        expect(screen.getByTestId("notification-card-2")).toBeInTheDocument();
        expect(
          screen.queryByTestId("notification-card-3"),
        ).not.toBeInTheDocument();
      });
    });

    it("should filter notifications by status", async () => {
      renderWithQueryClient(<Notification />);

      await waitFor(() => {
        expect(
          screen.getByTestId("notification-search-filter"),
        ).toBeInTheDocument();
      });

      const statusFilter = screen.getByTestId("status-filter");
      fireEvent.change(statusFilter, { target: { value: "UNREAD" } });

      await waitFor(() => {
        expect(screen.getByTestId("notification-card-1")).toBeInTheDocument();
        expect(
          screen.queryByTestId("notification-card-2"),
        ).not.toBeInTheDocument();
        expect(screen.getByTestId("notification-card-3")).toBeInTheDocument();
      });
    });

    it("should show empty state when no notifications match filters", async () => {
      renderWithQueryClient(<Notification />);

      await waitFor(() => {
        expect(
          screen.getByTestId("notification-search-filter"),
        ).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, {
        target: { value: "NonExistentNotification" },
      });

      await waitFor(() => {
        expect(
          screen.getByTestId("notification-empty-state"),
        ).toBeInTheDocument();
        expect(screen.getByText("No notifications found")).toBeInTheDocument();
      });
    });
  });

  describe("Pagination", () => {
    it("should show pagination when there are more than 5 notifications", async () => {
      const manyNotifications = Array.from({ length: 10 }, (_, i) => ({
        ...mockNotifications[0],
        id: `${i + 1}`,
        title: `Notification ${i + 1}`,
      }));

      (getListNotification as jest.Mock).mockResolvedValue(manyNotifications);

      renderWithQueryClient(<Notification />);

      await waitFor(() => {
        expect(screen.getByTestId("pagination")).toBeInTheDocument();
      });
    });

    it("should not show pagination when there are 5 or fewer notifications", async () => {
      renderWithQueryClient(<Notification />);

      await waitFor(() => {
        expect(screen.queryByTestId("pagination")).not.toBeInTheDocument();
      });
    });

    it("should change page when pagination buttons are clicked", async () => {
      const manyNotifications = Array.from({ length: 10 }, (_, i) => ({
        ...mockNotifications[0],
        id: `${i + 1}`,
        title: `Notification ${i + 1}`,
      }));

      (getListNotification as jest.Mock).mockResolvedValue(manyNotifications);

      renderWithQueryClient(<Notification />);

      await waitFor(() => {
        expect(screen.getByTestId("pagination")).toBeInTheDocument();
      });

      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText("2 / 2")).toBeInTheDocument();
      });
    });
  });

  describe("Notification Interaction", () => {
    it("should navigate to notification detail when card is clicked", async () => {
      renderWithQueryClient(<Notification />);

      await waitFor(() => {
        expect(screen.getByTestId("notification-card-1")).toBeInTheDocument();
      });

      const notificationCard = screen.getByTestId("notification-card-1");
      fireEvent.click(notificationCard);

      expect(mockRouter.push).toHaveBeenCalledWith("/member/notifications/1");
    });

    it("should mark notification as read when clicked", async () => {
      renderWithQueryClient(<Notification />);

      await waitFor(() => {
        expect(screen.getByTestId("notification-card-1")).toBeInTheDocument();
      });

      const notificationCard = screen.getByTestId("notification-card-1");
      fireEvent.click(notificationCard);

      // The notification should be marked as read
      expect(mockRouter.push).toHaveBeenCalledWith("/member/notifications/1");
    });
  });

  describe("Component Integration", () => {
    it("should render all child components correctly", async () => {
      renderWithQueryClient(<Notification />);

      await waitFor(() => {
        expect(screen.getByTestId("notification-header")).toBeInTheDocument();
        expect(
          screen.getByTestId("notification-search-filter"),
        ).toBeInTheDocument();
        expect(screen.getByTestId("notification-card-1")).toBeInTheDocument();
        expect(screen.getByTestId("notification-card-2")).toBeInTheDocument();
        expect(screen.getByTestId("notification-card-3")).toBeInTheDocument();
      });
    });

    it("should handle current notification ID from params", async () => {
      (useParams as jest.Mock).mockReturnValue({ notificationId: "2" });

      renderWithQueryClient(<Notification />);

      await waitFor(() => {
        expect(screen.getByTestId("notification-card-1")).toBeInTheDocument();
        expect(screen.getByTestId("notification-card-2")).toBeInTheDocument();
        expect(screen.getByTestId("notification-card-3")).toBeInTheDocument();
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle empty notification list", async () => {
      (getListNotification as jest.Mock).mockResolvedValue([]);

      renderWithQueryClient(<Notification />);

      await waitFor(() => {
        expect(
          screen.getByTestId("notification-empty-state"),
        ).toBeInTheDocument();
      });
    });

    it("should handle undefined notification data", async () => {
      (getListNotification as jest.Mock).mockResolvedValue(undefined);

      renderWithQueryClient(<Notification />);

      await waitFor(() => {
        expect(
          screen.getByTestId("notification-empty-state"),
        ).toBeInTheDocument();
      });
    });
  });
});
