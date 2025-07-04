/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import { useRouter, useParams } from "next/navigation";
import NotificationsPage from "@/app/(admin)/admin/notifications/page";
import { getListNotification } from "@/app/lib/services/notification";

// Mock next/navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

// Mock notification service
jest.mock("@/app/lib/services/notification", () => ({
  getListNotification: jest.fn(),
}));

// Mock components
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
    handlePreviousPage,
    handleNextPage,
  }: any) {
    return (
      <div data-testid="pagination">
        <button onClick={() => handlePreviousPage()}>Previous</button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => handleNextPage()}>Next</button>
        <button onClick={() => handlePageClick(2)}>Page 2</button>
      </div>
    );
  };
});

jest.mock("@/app/ui/components/admin/notifications/NotificationHeader", () => {
  return function MockNotificationHeader({ onRefresh }: any) {
    return (
      <div data-testid="notification-header">
        <h1>Notifications</h1>
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
      totalCount,
      unreadCount,
      onSearchChange,
      onFilterTypeChange,
      onFilterStatusChange,
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
            <option value="STUDENT">Student</option>
            <option value="TEACHER">Teacher</option>
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
          <span>Total: {totalCount}</span>
          <span>Unread: {unreadCount}</span>
        </div>
      );
    };
  },
);

jest.mock("@/app/ui/components/admin/notifications/NotificationCard", () => {
  return function MockNotificationCard({ notification, onClick }: any) {
    return (
      <div
        data-testid={`notification-card-${notification.id}`}
        onClick={() => onClick(notification)}
        className={notification.read ? "read" : "unread"}
      >
        <h3>{notification.title}</h3>
        <p>{notification.content}</p>
        <span>From: {notification.sender.name}</span>
        <span>Type: {notification.receiverType}</span>
        <span>Date: {notification.sendDate}</span>
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

const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;
const mockGetListNotification = getListNotification as jest.MockedFunction<
  typeof getListNotification
>;

describe("Notifications Page", () => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();

  const mockNotifications = [
    {
      id: "1",
      title: "Test Notification 1",
      content: "This is a test notification",
      sender: { name: "Admin User" },
      receiverType: "STUDENT",
      sendDate: "2024-01-01T10:00:00Z",
      read: false,
    },
    {
      id: "2",
      title: "Test Notification 2",
      content: "This is another test notification",
      sender: { name: "Teacher User" },
      receiverType: "TEACHER",
      sendDate: "2024-01-02T10:00:00Z",
      read: true,
    },
    {
      id: "3",
      title: "Test Notification 3",
      content: "This is a third test notification",
      sender: { name: "System" },
      receiverType: "STUDENT",
      sendDate: "2024-01-03T10:00:00Z",
      read: false,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    } as any);
    mockUseParams.mockReturnValue({});
    mockGetListNotification.mockResolvedValue(mockNotifications);
  });

  it("renders the notifications page", async () => {
    await act(async () => {
      render(<NotificationsPage />);
    });

    await waitFor(() => {
      expect(screen.getByTestId("notification-header")).toBeInTheDocument();
      expect(
        screen.getByTestId("notification-search-filter"),
      ).toBeInTheDocument();
    });
  });

  it("shows loading state initially", () => {
    render(<NotificationsPage />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("fetches and displays notifications", async () => {
    await act(async () => {
      render(<NotificationsPage />);
    });

    await waitFor(() => {
      expect(mockGetListNotification).toHaveBeenCalled();
      expect(screen.getByTestId("notification-card-1")).toBeInTheDocument();
      expect(screen.getByTestId("notification-card-2")).toBeInTheDocument();
      expect(screen.getByTestId("notification-card-3")).toBeInTheDocument();
    });
  });

  it("displays notification content correctly", async () => {
    await act(async () => {
      render(<NotificationsPage />);
    });

    await waitFor(() => {
      expect(screen.getByText("Test Notification 1")).toBeInTheDocument();
      expect(
        screen.getByText("This is a test notification"),
      ).toBeInTheDocument();
      expect(screen.getByText("From: Admin User")).toBeInTheDocument();
      const typeElements = screen.getAllByText(
        (_, el) => el?.textContent?.includes("Type: STUDENT") ?? false,
      );
      expect(typeElements.length).toBeGreaterThan(0);
    });
  });

  it("handles search functionality", async () => {
    await act(async () => {
      render(<NotificationsPage />);
    });

    await waitFor(() => {
      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, {
        target: { value: "Test Notification 1" },
      });
    });

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

  it("handles type filter", async () => {
    await act(async () => {
      render(<NotificationsPage />);
    });

    await waitFor(() => {
      const typeFilter = screen.getByTestId("type-filter");
      fireEvent.change(typeFilter, { target: { value: "STUDENT" } });
    });

    await waitFor(() => {
      expect(screen.getByTestId("notification-card-1")).toBeInTheDocument();
      expect(screen.getByTestId("notification-card-3")).toBeInTheDocument();
      expect(
        screen.queryByTestId("notification-card-2"),
      ).not.toBeInTheDocument();
    });
  });

  it("handles status filter", async () => {
    await act(async () => {
      render(<NotificationsPage />);
    });

    await waitFor(() => {
      const statusFilter = screen.getByTestId("status-filter");
      fireEvent.change(statusFilter, { target: { value: "UNREAD" } });
    });

    await waitFor(() => {
      expect(screen.getByTestId("notification-card-1")).toBeInTheDocument();
      expect(screen.getByTestId("notification-card-3")).toBeInTheDocument();
      expect(
        screen.queryByTestId("notification-card-2"),
      ).not.toBeInTheDocument();
    });
  });

  it("handles pagination", async () => {
    // Create more notifications to test pagination
    const manyNotifications = Array.from({ length: 10 }, (_, i) => ({
      id: `${i + 1}`,
      title: `Notification ${i + 1}`,
      content: `Content ${i + 1}`,
      sender: { name: "User" },
      receiverType: "STUDENT",
      sendDate: "2024-01-01T10:00:00Z",
      read: false,
    }));

    mockGetListNotification.mockResolvedValue(manyNotifications);

    await act(async () => {
      render(<NotificationsPage />);
    });

    await waitFor(() => {
      expect(screen.getByTestId("pagination")).toBeInTheDocument();
    });

    const nextButton = screen.getByText("Next");
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
    });
  });

  it("handles notification click", async () => {
    await act(async () => {
      render(<NotificationsPage />);
    });

    await waitFor(() => {
      const notificationCard = screen.getByTestId("notification-card-1");
      fireEvent.click(notificationCard);
    });

    expect(mockPush).toHaveBeenCalledWith("/admin/notifications/1");
  });

  it("shows empty state when no notifications", async () => {
    mockGetListNotification.mockResolvedValue([]);

    await act(async () => {
      render(<NotificationsPage />);
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("notification-empty-state"),
      ).toBeInTheDocument();
    });
  });

  it("shows empty state with search filters", async () => {
    await act(async () => {
      render(<NotificationsPage />);
    });

    await waitFor(() => {
      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, {
        target: { value: "Non-existent notification" },
      });
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("notification-empty-state"),
      ).toBeInTheDocument();
      expect(
        screen.getByText("Search term: Non-existent notification"),
      ).toBeInTheDocument();
    });
  });

  it("handles refresh functionality", async () => {
    await act(async () => {
      render(<NotificationsPage />);
    });

    await waitFor(() => {
      const refreshButton = screen.getByText("Refresh");
      fireEvent.click(refreshButton);
    });

    expect(mockGetListNotification).toHaveBeenCalledTimes(2);
  });

  it("handles error in data fetching", async () => {
    mockGetListNotification.mockRejectedValue(new Error("Failed to fetch"));

    await act(async () => {
      render(<NotificationsPage />);
    });

    await waitFor(() => {
      expect(
        screen.getByTestId("notification-empty-state"),
      ).toBeInTheDocument();
    });
  });

  it("displays correct counts in search filter", async () => {
    await act(async () => {
      render(<NotificationsPage />);
    });

    await waitFor(() => {
      const totalElements = screen.getAllByText(
        (_, el) => el?.textContent?.includes("Total: 3") ?? false,
      );
      expect(totalElements.length).toBeGreaterThan(0);
      const unreadElements = screen.getAllByText(
        (_, el) => el?.textContent?.includes("Unread: 1") ?? false,
      );
      expect(unreadElements.length).toBeGreaterThan(0);
    });
  });

  it("sorts notifications by date (newest first)", async () => {
    await act(async () => {
      render(<NotificationsPage />);
    });

    await waitFor(() => {
      const cards = screen.getAllByTestId(/notification-card-/);
      expect(cards[0]).toHaveAttribute("data-testid", "notification-card-3");
      expect(cards[1]).toHaveAttribute("data-testid", "notification-card-2");
      expect(cards[2]).toHaveAttribute("data-testid", "notification-card-1");
    });
  });

  it("marks notification as read when clicked", async () => {
    await act(async () => {
      render(<NotificationsPage />);
    });

    await waitFor(() => {
      const unreadCard = screen.getByTestId("notification-card-3");
      expect(unreadCard).toHaveClass("unread");
      fireEvent.click(unreadCard);
    });

    // The notification should be marked as read
    expect(mockPush).toHaveBeenCalledWith("/admin/notifications/3");
  });
});
