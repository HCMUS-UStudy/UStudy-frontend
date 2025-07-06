import "@testing-library/jest-dom";
import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import NotificationDetailPage from "@/app/(admin)/admin/notifications/[notificationId]/page";
import {
  getNotificationDetails,
  getListNotification,
} from "@/app/lib/services/notification";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

jest.mock("@/app/lib/services/notification", () => ({
  getNotificationDetails: jest.fn(),
  getListNotification: jest.fn(),
}));
jest.mock("next/navigation", () => ({
  useParams: jest.fn(),
  useRouter: jest.fn(),
}));
jest.mock("@tanstack/react-query", () => ({
  useQueryClient: jest.fn(),
}));
// eslint-disable-next-line react/display-name
jest.mock("@/app/ui/components/_common/loading/Loading", () => () => (
  <div data-testid="loading">Loading...</div>
));
jest.mock(
  "@/app/ui/components/admin/notifications/NotificationDetailHeader",
  () =>
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, react/display-name
    ({ onBack, sidebarOpen, onToggleSidebar }: any) => (
      <div data-testid="header">
        <button onClick={onBack}>Back</button>
        <button onClick={onToggleSidebar}>ToggleSidebar</button>
      </div>
    ),
);
jest.mock(
  "@/app/ui/components/admin/notifications/NotificationSidebar",
  () =>
    // eslint-disable-next-line react/display-name
    ({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      sidebarOpen,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      allNotifications,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      currentNotificationId,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      navigating,
      onNotificationClick,
      onCloseSidebar,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }: any) => (
      <div data-testid="sidebar">
        Sidebar<button onClick={() => onNotificationClick("2")}>Go 2</button>
        <button onClick={onCloseSidebar}>CloseSidebar</button>
      </div>
    ),
);
jest.mock(
  "@/app/ui/components/admin/notifications/NotificationDetailContent",
  () =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, react/display-name
    ({ notification }: any) => (
      <div data-testid="detail-content">{notification.title}</div>
    ),
);
jest.mock("@/app/ui/components/admin/notifications/NotificationNotFound", () =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, react/display-name
  ({ onBackToList }: any) => (
    <div data-testid="not-found">
      <button onClick={onBackToList}>BackToList</button>
    </div>
  ),
);

const mockGetNotificationDetails =
  getNotificationDetails as jest.MockedFunction<typeof getNotificationDetails>;
const mockGetListNotification = getListNotification as jest.MockedFunction<
  typeof getListNotification
>;
const mockUseParams = useParams as jest.MockedFunction<typeof useParams>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUseQueryClient = useQueryClient as jest.MockedFunction<
  typeof useQueryClient
>;

describe("NotificationDetailPage", () => {
  const mockPush = jest.fn();
  const mockSetQueryData = jest.fn();
  const notification = {
    id: "1",
    title: "Detail Notification",
    content: "Content detail",
    sender: { name: "Admin" },
    receiverType: "STUDENT",
    sendDate: "2024-01-01T10:00:00Z",
    read: false,
  };
  const allNotifications = [
    notification,
    { ...notification, id: "2", title: "Other" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseParams.mockReturnValue({ notificationId: "1" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockUseRouter.mockReturnValue({ push: mockPush } as any);
    mockUseQueryClient.mockReturnValue({
      getQueryData: jest.fn(() => allNotifications),
      setQueryData: mockSetQueryData,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    mockGetNotificationDetails.mockResolvedValue(notification);
    mockGetListNotification.mockResolvedValue(allNotifications);
  });

  it("renders loading state", () => {
    render(<NotificationDetailPage />);
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("fetches and displays notification detail", async () => {
    await act(async () => {
      render(<NotificationDetailPage />);
    });
    await waitFor(() => {
      expect(mockGetNotificationDetails).toHaveBeenCalledWith("1");
      expect(screen.getByTestId("detail-content")).toHaveTextContent(
        "Detail Notification",
      );
    });
  });

  it("shows not found if notification is null", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockGetNotificationDetails.mockResolvedValueOnce(null as any);
    await act(async () => {
      render(<NotificationDetailPage />);
    });
    await waitFor(() => {
      expect(screen.getByTestId("not-found")).toBeInTheDocument();
    });
  });

  it("marks notification as read if unread", async () => {
    await act(async () => {
      render(<NotificationDetailPage />);
    });
    await waitFor(() => {
      expect(mockSetQueryData).toHaveBeenCalled();
    });
  });

  it("sidebar open/close and overlay", async () => {
    await act(async () => {
      render(<NotificationDetailPage />);
    });
    // Toggle sidebar
    fireEvent.click(screen.getByText("ToggleSidebar"));
    // Close sidebar
    fireEvent.click(screen.getByText("CloseSidebar"));
    // Overlay click (simulate sidebarOpen true)
    // (Không test trực tiếp overlay vì đã mock sidebar)
  });

  it("click notification in sidebar chuyển trang", async () => {
    await act(async () => {
      render(<NotificationDetailPage />);
    });
    fireEvent.click(screen.getByText("Go 2"));
    expect(mockPush).toHaveBeenCalledWith("/admin/notifications/2");
  });

  it("back to list", async () => {
    await act(async () => {
      render(<NotificationDetailPage />);
    });
    fireEvent.click(screen.getByText("Back"));
    expect(mockPush).toHaveBeenCalledWith("/admin/notifications");
  });

  it("back to list from not found", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockGetNotificationDetails.mockResolvedValueOnce(null as any);
    await act(async () => {
      render(<NotificationDetailPage />);
    });
    fireEvent.click(screen.getByText("BackToList"));
    expect(mockPush).toHaveBeenCalledWith("/admin/notifications");
  });

  it("handles error in fetch", async () => {
    mockGetNotificationDetails.mockRejectedValueOnce(new Error("Failed"));
    await act(async () => {
      render(<NotificationDetailPage />);
    });
    await waitFor(() => {
      expect(screen.getByTestId("not-found")).toBeInTheDocument();
    });
  });
});
