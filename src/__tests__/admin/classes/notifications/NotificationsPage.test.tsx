import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Notification from "@/app/(admin)/admin/classes/[classId]/notifications/page";
import * as notificationService from "@/app/lib/services/notification";
import * as action from "@/app/lib/action";
import { useCustomToast } from "@/app/lib/hooks/useToast";

// Mock các dependencies
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useParams: () => ({
    classId: "encoded-class-id",
  }),
}));

jest.mock("@/app/lib/hooks/useEncodedRoute", () => ({
  useEncodedRoute: () => ({
    decodeId: jest.fn(() => "decoded-class-id"),
  }),
}));

jest.mock("@/app/lib/hooks/useToast", () => ({
  useCustomToast: jest.fn(),
}));

jest.mock("@/app/lib/services/notification");
jest.mock("@/app/lib/action");
jest.mock("@/app/ui/components/user/teacher/NotificationModal", () => {
  return function MockNotificationModal({
    onClose,
  }: {
    onClose: (value: boolean) => void;
  }) {
    return (
      <div data-testid="notification-modal">
        <button onClick={() => onClose(false)}>Close Modal</button>
      </div>
    );
  };
});

jest.mock("@/app/ui/components/_common/Checkbox", () => {
  return function MockCheckbox({
    checked,
    onChange,
  }: {
    checked: boolean;
    onChange: (checked: boolean) => void;
  }) {
    return (
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        data-testid="checkbox"
      />
    );
  };
});

jest.mock("@/app/ui/components/_common/Tooltip", () => {
  return function MockTooltip({
    children,
    text,
  }: {
    children: React.ReactNode;
    text: string;
  }) {
    return <div data-testid={`tooltip-${text}`}>{children}</div>;
  };
});

jest.mock("@/app/ui/components/_common/loading/Loading", () => {
  return function MockLoading() {
    return <div data-testid="loading">Loading...</div>;
  };
});

jest.mock("next/image", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function MockImage({ src, alt, width, height, className }: any) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
      />
    );
  };
});

// Mock react-icons
jest.mock("react-icons/io", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  IoIosAdd: ({ onClick, className }: any) => (
    <svg onClick={onClick} className={className} data-testid="add-icon" />
  ),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  IoMdMore: ({ onClick, className }: any) => (
    <svg onClick={onClick} className={className} data-testid="more-icon" />
  ),
}));

jest.mock("react-icons/ri", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RiDeleteBinLine: ({ onClick, className }: any) => (
    <svg onClick={onClick} className={className} data-testid="delete-icon" />
  ),
}));

jest.mock("react-icons/rx", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  RxCross1: ({ onClick, className }: any) => (
    <svg onClick={onClick} className={className} data-testid="cross-icon" />
  ),
}));

const mockToast = {
  success: jest.fn(),
  error: jest.fn(),
};

const mockNotifications = [
  {
    id: "1",
    title: "Thông báo 1",
    content: "Nội dung thông báo 1",
    sendDate: "2024-01-01T10:00:00Z",
    read: false,
    sender: {
      genId: "user1",
      name: "User 1",
      avatar: "/avatar1.jpg",
    },
  },
  {
    id: "2",
    title: "Thông báo 2",
    content: "Nội dung thông báo 2",
    sendDate: "2024-01-02T10:00:00Z",
    read: true,
    sender: {
      genId: "user2",
      name: "User 2",
      avatar: "/avatar2.jpg",
    },
  },
];

const mockUserData = {
  genId: "user1",
  name: "User 1",
  avatar: "/avatar1.jpg",
};

describe("Notification Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useCustomToast as jest.Mock).mockReturnValue({ addToast: mockToast });
    (action.getUserDataFromCookies as jest.Mock).mockResolvedValue(
      mockUserData,
    );
    (
      notificationService.getListNotificationByClass as jest.Mock
    ).mockResolvedValue(mockNotifications);
  });

  it("should render loading state initially", async () => {
    (
      notificationService.getListNotificationByClass as jest.Mock
    ).mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );

    render(<Notification />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("should render notifications list after loading", async () => {
    render(<Notification />);

    await waitFor(() => {
      expect(screen.getByText("Thông báo 1")).toBeInTheDocument();
      expect(screen.getByText("Thông báo 2")).toBeInTheDocument();
    });

    expect(screen.getByText("Thêm thông báo")).toBeInTheDocument();
  });

  it("should open notification modal when add button is clicked", async () => {
    render(<Notification />);

    await waitFor(() => {
      expect(screen.getByText("Thêm thông báo")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Thêm thông báo"));

    expect(screen.getByTestId("notification-modal")).toBeInTheDocument();
  });

  it("should handle checkbox selection", async () => {
    render(<Notification />);

    await waitFor(() => {
      expect(screen.getByText("Thông báo 1")).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByTestId("checkbox");
    fireEvent.click(checkboxes[0]);

    expect(screen.getByText("Xóa")).toBeInTheDocument();
    expect(screen.getByText("Hủy chọn")).toBeInTheDocument();
  });

  it("should show select all option for user's notifications", async () => {
    render(<Notification />);

    await waitFor(() => {
      expect(screen.getByText("Chọn tất cả")).toBeInTheDocument();
    });
  });

  it("should handle select all functionality", async () => {
    render(<Notification />);

    await waitFor(() => {
      expect(screen.getByText("Chọn tất cả")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Chọn tất cả"));

    expect(screen.getByText("Xóa")).toBeInTheDocument();
    expect(screen.getByText("Hủy chọn")).toBeInTheDocument();
  });

  it("should show delete confirmation modal", async () => {
    render(<Notification />);

    await waitFor(() => {
      expect(screen.getByText("Thông báo 1")).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByTestId("checkbox");
    fireEvent.click(checkboxes[0]);

    // Click the delete button in the header (not the modal)
    const deleteButtons = screen.getAllByText("Xóa");
    fireEvent.click(deleteButtons[0]); // First "Xóa" is in the header

    expect(screen.getByText("Xác nhận xóa")).toBeInTheDocument();
    expect(
      screen.getByText("Bạn có chắc chắn muốn xóa tài liệu này không?"),
    ).toBeInTheDocument();
  });

  it("should handle delete confirmation", async () => {
    (notificationService.deleteClassNotiForUser as jest.Mock).mockResolvedValue(
      undefined,
    );

    render(<Notification />);

    await waitFor(() => {
      expect(screen.getByText("Thông báo 1")).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByTestId("checkbox");
    fireEvent.click(checkboxes[0]);

    // Click the delete button in the header
    const deleteButtons = screen.getAllByText("Xóa");
    fireEvent.click(deleteButtons[0]);

    // Re-mock useCustomToast to ensure the reference is up to date
    (useCustomToast as jest.Mock).mockReturnValue({ addToast: mockToast });

    // Click the confirm delete button in the modal - use a more specific selector
    const modalButtons = screen.getAllByText("Xóa");
    const confirmDeleteButton = modalButtons[modalButtons.length - 1]; // Last "Xóa" is in the modal
    fireEvent.click(confirmDeleteButton);

    await waitFor(() => {
      expect(notificationService.deleteClassNotiForUser).toHaveBeenCalledWith(
        "decoded-class-id",
        ["1"],
      );
      expect(mockToast.success).toHaveBeenCalledWith(
        "Xóa thông báo thành công",
      );
    });
  });

  it("should handle delete error", async () => {
    (notificationService.deleteClassNotiForUser as jest.Mock).mockRejectedValue(
      new Error("Delete failed"),
    );

    render(<Notification />);

    await waitFor(() => {
      expect(screen.getByText("Thông báo 1")).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByTestId("checkbox");
    fireEvent.click(checkboxes[0]);

    // Click the delete button in the header
    const deleteButtons = screen.getAllByText("Xóa");
    fireEvent.click(deleteButtons[0]);

    // Re-mock useCustomToast to ensure the reference is up to date
    (useCustomToast as jest.Mock).mockReturnValue({ addToast: mockToast });

    // Click the confirm delete button in the modal - use a more specific selector
    const modalButtons = screen.getAllByText("Xóa");
    const confirmDeleteButton = modalButtons[modalButtons.length - 1]; // Last "Xóa" is in the modal
    fireEvent.click(confirmDeleteButton);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith("Xóa thông báo thất bại");
    });
  });

  it("should show empty state when no notifications", async () => {
    (
      notificationService.getListNotificationByClass as jest.Mock
    ).mockResolvedValue([]);

    render(<Notification />);

    await waitFor(() => {
      expect(screen.getByText("Không có thông báo nào")).toBeInTheDocument();
    });
  });

  it("should handle cancel selection", async () => {
    render(<Notification />);

    await waitFor(() => {
      expect(screen.getByText("Thông báo 1")).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByTestId("checkbox");
    fireEvent.click(checkboxes[0]);

    expect(screen.getByText("Hủy chọn")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Hủy chọn"));

    expect(screen.queryByText("Xóa")).not.toBeInTheDocument();
    expect(screen.queryByText("Hủy chọn")).not.toBeInTheDocument();
  });

  it("should handle options menu for user's notifications", async () => {
    render(<Notification />);

    await waitFor(() => {
      expect(screen.getByText("Thông báo 1")).toBeInTheDocument();
    });

    // Find the more options icon for the first notification (user's notification)
    const moreIcons = screen.getAllByTestId("more-icon");
    fireEvent.click(moreIcons[0]);

    // The dropdown should now be visible with edit and delete options
    expect(screen.getByText("Chỉnh sửa")).toBeInTheDocument();
    expect(screen.getByText("Xóa")).toBeInTheDocument();
  });

  it("should handle edit notification from options menu", async () => {
    render(<Notification />);

    await waitFor(() => {
      expect(screen.getByText("Thông báo 1")).toBeInTheDocument();
    });

    // Find the more options icon for the first notification
    const moreIcons = screen.getAllByTestId("more-icon");
    fireEvent.click(moreIcons[0]);

    // Click the edit option
    fireEvent.click(screen.getByText("Chỉnh sửa"));

    expect(screen.getByTestId("notification-modal")).toBeInTheDocument();
  });
});
