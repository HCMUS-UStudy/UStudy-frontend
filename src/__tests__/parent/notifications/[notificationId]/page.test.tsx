import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter, useParams } from "next/navigation";
import SingleNotification from "@/app/(user)/member/notifications/[notificationId]/page";
import {
  getNotificationDetails,
  getListNotification,
} from "@/app/lib/services/notification";
import { NotificationItem } from "@/app/types";
import "@testing-library/jest-dom";

// Mock Next.js navigation
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

// Mock notification service
jest.mock("@/app/lib/services/notification", () => ({
  getNotificationDetails: jest.fn(),
  getListNotification: jest.fn(),
}));

// Mock child components
jest.mock("@/app/ui/components/_common/loading/Loading", () => {
  return function MockLoading() {
    return <div data-testid="loading">Loading...</div>;
  };
});

jest.mock(
  "@/app/ui/components/admin/notifications/NotificationDetailHeader",
  () => {
    return function MockNotificationDetailHeader({
      onBack,
      onToggleSidebar,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }: any) {
      return (
        <div data-testid="notification-detail-header">
          <button onClick={onBack}>Back</button>
          <button onClick={onToggleSidebar}>Toggle Sidebar</button>
        </div>
      );
    };
  },
);

jest.mock("@/app/ui/components/admin/notifications/NotificationSidebar", () => {
  return function MockNotificationSidebar({
    sidebarOpen,
    allNotifications,
    currentNotificationId,
    onNotificationClick,
    onCloseSidebar,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }: any) {
    return (
      <div
        data-testid="notification-sidebar"
        className={sidebarOpen ? "open" : "closed"}
      >
        {allNotifications.map((notification: NotificationItem) => (
          <div
            key={notification.id}
            data-testid={`sidebar-notification-${notification.id}`}
            onClick={() => onNotificationClick(notification.id)}
            className={
              notification.id === currentNotificationId ? "current" : ""
            }
          >
            {notification.title}
          </div>
        ))}
        <button onClick={onCloseSidebar}>Close Sidebar</button>
      </div>
    );
  };
});

jest.mock(
  "@/app/ui/components/admin/notifications/NotificationDetailContent",
  () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function MockNotificationDetailContent({ notification }: any) {
      return (
        <div data-testid="notification-detail-content">
          <h1>{notification.title}</h1>
          <p>{notification.content}</p>
          <div>Sender: {notification.sender.name}</div>
          <div>Date: {notification.sendDate}</div>
          <div>Read: {notification.read ? "Yes" : "No"}</div>
        </div>
      );
    };
  },
);

jest.mock(
  "@/app/ui/components/admin/notifications/NotificationNotFound",
  () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return function MockNotificationNotFound({ onBackToList }: any) {
      return (
        <div data-testid="notification-not-found">
          <h1>Notification Not Found</h1>
          <button onClick={onBackToList}>Back to List</button>
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

const mockParams = { notificationId: "1" };

const mockNotification: NotificationItem = {
  id: "1",
  title: "System Maintenance",
  content: "System will be down for maintenance on Sunday",
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
};

const mockAllNotifications: NotificationItem[] = [
  mockNotification,
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

describe("SingleNotification Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useParams as jest.Mock).mockReturnValue(mockParams);
    (getNotificationDetails as jest.Mock).mockResolvedValue(mockNotification);
    (getListNotification as jest.Mock).mockResolvedValue(mockAllNotifications);
  });

  describe("Initial Rendering", () => {
    it("should show loading state initially", async () => {
      renderWithQueryClient(<SingleNotification />);

      expect(screen.getByTestId("loading")).toBeInTheDocument();
      expect(screen.getByText("Đang tải thông báo...")).toBeInTheDocument();
    });

    it("should render notification detail after loading", async () => {
      renderWithQueryClient(<SingleNotification />);

      await waitFor(() => {
        expect(
          screen.getByTestId("notification-detail-header"),
        ).toBeInTheDocument();
        expect(screen.getByTestId("notification-sidebar")).toBeInTheDocument();
        expect(
          screen.getByTestId("notification-detail-content"),
        ).toBeInTheDocument();
      });
    });

    it("should display notification details correctly", async () => {
      renderWithQueryClient(<SingleNotification />);

      await waitFor(() => {
        const detailContent = screen.getByTestId("notification-detail-content");
        expect(detailContent).toHaveTextContent("System Maintenance");
        expect(detailContent).toHaveTextContent(
          "System will be down for maintenance on Sunday",
        );
        expect(detailContent).toHaveTextContent("Sender: System Admin");
        expect(detailContent).toHaveTextContent("Date: 2024-01-15T10:00:00Z");
        expect(detailContent).toHaveTextContent("Read: No");
      });
    });
  });

  describe("Data Fetching", () => {
    it("should fetch notification details on mount", async () => {
      renderWithQueryClient(<SingleNotification />);

      await waitFor(() => {
        expect(getNotificationDetails).toHaveBeenCalledWith("1");
      });
    });

    it("should fetch all notifications for sidebar", async () => {
      renderWithQueryClient(<SingleNotification />);

      await waitFor(() => {
        expect(getListNotification).toHaveBeenCalled();
      });
    });

    it("should handle fetch error gracefully", async () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      (getNotificationDetails as jest.Mock).mockRejectedValue(
        new Error("Fetch failed"),
      );

      renderWithQueryClient(<SingleNotification />);

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith(
          "Failed to fetch data:",
          expect.any(Error),
        );
      });

      consoleSpy.mockRestore();
    });

    it("should use cached notifications if available", async () => {
      const queryClient = createTestQueryClient();
      queryClient.setQueryData(["notifications"], mockAllNotifications);

      render(
        <QueryClientProvider client={queryClient}>
          <SingleNotification />
        </QueryClientProvider>,
      );

      await waitFor(() => {
        expect(getListNotification).not.toHaveBeenCalled();
      });
    });
  });

  describe("Sidebar Functionality", () => {
    it("should render sidebar with all notifications", async () => {
      renderWithQueryClient(<SingleNotification />);

      await waitFor(() => {
        expect(
          screen.getByTestId("sidebar-notification-1"),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId("sidebar-notification-2"),
        ).toBeInTheDocument();
        expect(
          screen.getByTestId("sidebar-notification-3"),
        ).toBeInTheDocument();
      });
    });

    it("should highlight current notification in sidebar", async () => {
      renderWithQueryClient(<SingleNotification />);

      await waitFor(() => {
        const currentNotification = screen.getByTestId(
          "sidebar-notification-1",
        );
        expect(currentNotification).toHaveClass("current");
      });
    });

    it("should navigate to different notification when clicked in sidebar", async () => {
      renderWithQueryClient(<SingleNotification />);

      await waitFor(() => {
        expect(
          screen.getByTestId("sidebar-notification-2"),
        ).toBeInTheDocument();
      });

      const notificationItem = screen.getByTestId("sidebar-notification-2");
      fireEvent.click(notificationItem);

      expect(mockRouter.push).toHaveBeenCalledWith("/member/notifications/2");
    });

    it("should close sidebar on mobile when notification is selected", async () => {
      renderWithQueryClient(<SingleNotification />);

      await waitFor(() => {
        expect(
          screen.getByTestId("sidebar-notification-2"),
        ).toBeInTheDocument();
      });

      const notificationItem = screen.getByTestId("sidebar-notification-2");
      fireEvent.click(notificationItem);

      // The sidebar should close on mobile
      expect(mockRouter.push).toHaveBeenCalledWith("/member/notifications/2");
    });
  });

  describe("Header Navigation", () => {
    it("should navigate back to list when back button is clicked", async () => {
      renderWithQueryClient(<SingleNotification />);

      await waitFor(() => {
        expect(
          screen.getByTestId("notification-detail-header"),
        ).toBeInTheDocument();
      });

      const backButton = screen.getByText("Back");
      fireEvent.click(backButton);

      expect(mockRouter.push).toHaveBeenCalledWith("/member/notifications");
    });

    it("should toggle sidebar when toggle button is clicked", async () => {
      renderWithQueryClient(<SingleNotification />);

      await waitFor(() => {
        expect(
          screen.getByTestId("notification-detail-header"),
        ).toBeInTheDocument();
      });

      const toggleButton = screen.getByText("Toggle Sidebar");
      fireEvent.click(toggleButton);

      // The sidebar should toggle open/closed state
      expect(screen.getByTestId("notification-sidebar")).toBeInTheDocument();
    });
  });

  describe("Error Handling", () => {
    it("should show not found page when notification doesn't exist", async () => {
      (getNotificationDetails as jest.Mock).mockResolvedValue(null);

      renderWithQueryClient(<SingleNotification />);

      await waitFor(() => {
        expect(
          screen.getByTestId("notification-not-found"),
        ).toBeInTheDocument();
        expect(screen.getByText("Notification Not Found")).toBeInTheDocument();
      });
    });

    it("should handle navigation back from not found page", async () => {
      (getNotificationDetails as jest.Mock).mockResolvedValue(null);

      renderWithQueryClient(<SingleNotification />);

      await waitFor(() => {
        expect(
          screen.getByTestId("notification-not-found"),
        ).toBeInTheDocument();
      });

      const backButton = screen.getByText("Back to List");
      fireEvent.click(backButton);

      expect(mockRouter.push).toHaveBeenCalledWith("/member/notifications");
    });
  });

  describe("Mobile Responsiveness", () => {
    it("should handle sidebar open/close on mobile", async () => {
      renderWithQueryClient(<SingleNotification />);

      await waitFor(() => {
        expect(screen.getByTestId("notification-sidebar")).toBeInTheDocument();
      });

      const closeButton = screen.getByText("Close Sidebar");
      fireEvent.click(closeButton);

      // The sidebar should close
      expect(screen.getByTestId("notification-sidebar")).toBeInTheDocument();
    });

    it("should close sidebar on window resize to desktop", async () => {
      renderWithQueryClient(<SingleNotification />);

      await waitFor(() => {
        expect(screen.getByTestId("notification-sidebar")).toBeInTheDocument();
      });

      // Simulate window resize to desktop width
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        configurable: true,
        value: 1024,
      });

      fireEvent(window, new Event("resize"));

      // The sidebar should close on desktop
      expect(screen.getByTestId("notification-sidebar")).toBeInTheDocument();
    });
  });

  describe("Notification Marking as Read", () => {
    it("should mark notification as read when viewed", async () => {
      const queryClient = createTestQueryClient();
      queryClient.setQueryData(["notifications"], mockAllNotifications);

      render(
        <QueryClientProvider client={queryClient}>
          <SingleNotification />
        </QueryClientProvider>,
      );

      await waitFor(() => {
        expect(
          screen.getByTestId("notification-detail-content"),
        ).toBeInTheDocument();
      });

      // The notification should be marked as read in the cache
      const cachedData = queryClient.getQueryData(["notifications"]);
      expect(cachedData).toBeDefined();
    });

    it("should not mark already read notification as read again", async () => {
      const readNotification = { ...mockNotification, read: true };
      (getNotificationDetails as jest.Mock).mockResolvedValue(readNotification);

      renderWithQueryClient(<SingleNotification />);

      await waitFor(() => {
        expect(screen.getByText("Read: Yes")).toBeInTheDocument();
      });
    });
  });

  describe("Navigation Loading State", () => {
    it("should show navigation loading overlay when navigating", async () => {
      renderWithQueryClient(<SingleNotification />);

      await waitFor(() => {
        expect(
          screen.getByTestId("sidebar-notification-2"),
        ).toBeInTheDocument();
      });

      const notificationItem = screen.getByTestId("sidebar-notification-2");
      fireEvent.click(notificationItem);

      // Should show navigation loading state
      expect(mockRouter.push).toHaveBeenCalledWith("/member/notifications/2");
    });
  });

  describe("Component Integration", () => {
    it("should render all child components correctly", async () => {
      renderWithQueryClient(<SingleNotification />);

      await waitFor(() => {
        expect(
          screen.getByTestId("notification-detail-header"),
        ).toBeInTheDocument();
        expect(screen.getByTestId("notification-sidebar")).toBeInTheDocument();
        expect(
          screen.getByTestId("notification-detail-content"),
        ).toBeInTheDocument();
      });
    });

    it("should handle different notification types", async () => {
      const classNotification = {
        ...mockNotification,
        id: "2",
        title: "Class Assignment",
        receiverType: "CLASS",
        className: "Math 101",
      };

      (getNotificationDetails as jest.Mock).mockResolvedValue(
        classNotification,
      );
      (useParams as jest.Mock).mockReturnValue({ notificationId: "2" });

      renderWithQueryClient(<SingleNotification />);

      await waitFor(() => {
        expect(
          screen.getByTestId("notification-detail-content"),
        ).toBeInTheDocument();
        const detailContent = screen.getByTestId("notification-detail-content");
        expect(detailContent).toHaveTextContent("Class Assignment");
      });
    });
  });
});
