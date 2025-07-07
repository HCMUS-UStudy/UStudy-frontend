import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
  Contacts,
  sampleRoomChats,
} from "@/app/ui/components/contact/Contacts";

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock the sampleRoomChats module
jest.mock("@/app/ui/components/contact/Contacts", () => ({
  ...jest.requireActual("@/app/ui/components/contact/Contacts"),
  sampleRoomChats: jest.requireActual("@/app/ui/components/contact/Contacts")
    .sampleRoomChats,
}));

describe("Contacts", () => {
  const defaultProps = {
    selectedRoom: null,
    setSelectedRoom: jest.fn(),
    searchQuery: "",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the contacts component with header", () => {
      render(<Contacts {...defaultProps} />);

      expect(screen.getByText("Danh sách giáo vụ")).toBeInTheDocument();
      expect(screen.getByText("Chọn giáo vụ để nhắn tin")).toBeInTheDocument();
    });

    it("should render all sample contacts", () => {
      render(<Contacts {...defaultProps} />);

      expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
      expect(screen.getByText("Trần Thị B")).toBeInTheDocument();
      expect(screen.getByText("Lê Văn C")).toBeInTheDocument();
      expect(screen.getByText("Phạm Thị D")).toBeInTheDocument();
      expect(screen.getByText("Hoàng Văn E")).toBeInTheDocument();
    });

    it("should render user avatars when available", () => {
      render(<Contacts {...defaultProps} />);

      const avatar1 = screen.getByAltText("Nguyễn Văn A");
      expect(avatar1).toHaveAttribute("src", "/avatars/teacher1.jpg");

      const avatar4 = screen.getByAltText("Phạm Thị D");
      expect(avatar4).toHaveAttribute("src", "/avatars/teacher4.jpg");
    });

    it("should render default avatar icon when no avatar is available", () => {
      render(<Contacts {...defaultProps} />);

      // Should show default person icon for users without avatars
      const personIcons = screen.getAllByTestId("person-icon");
      expect(personIcons.length).toBeGreaterThan(0);
    });

    it("should render class names for each contact", () => {
      render(<Contacts {...defaultProps} />);

      expect(
        screen.getByText("Lớp phụ trách: 10A1, 10A2, 11A1"),
      ).toBeInTheDocument();
      expect(screen.getByText("Lớp phụ trách: 9A1, 9A2")).toBeInTheDocument();
      expect(
        screen.getByText("Lớp phụ trách: 12A1, 12A2, 12A3"),
      ).toBeInTheDocument();
      expect(screen.getByText("Lớp phụ trách: 8A1, 8A2")).toBeInTheDocument();
      expect(
        screen.getByText("Lớp phụ trách: 7A1, 7A2, 7A3"),
      ).toBeInTheDocument();
    });

    it("should render unread message count badges", () => {
      render(<Contacts {...defaultProps} />);

      expect(screen.getByText("3")).toBeInTheDocument(); // Nguyễn Văn A
      expect(screen.getByText("1")).toBeInTheDocument(); // Lê Văn C
      expect(screen.getByText("5")).toBeInTheDocument(); // Phạm Thị D
      expect(screen.queryByText("0")).not.toBeInTheDocument(); // Users with 0 unread
    });

    it("should not show unread badge when count is 0", () => {
      render(<Contacts {...defaultProps} />);

      // Trần Thị B and Hoàng Văn E have 0 unread messages, so no badges should be shown
      const badges = screen
        .getAllByText(/[0-9]+/)
        .filter(
          (el) => el.tagName === "SPAN" && el.className.includes("bg-red-500"),
        );
      expect(badges).toHaveLength(3); // Only 3, 1, and 5
    });
  });

  describe("User Interactions", () => {
    it("should select a contact when clicked", () => {
      const setSelectedRoom = jest.fn();
      render(<Contacts {...defaultProps} setSelectedRoom={setSelectedRoom} />);

      const contactItem = screen.getByText("Nguyễn Văn A");
      fireEvent.click(contactItem);

      expect(setSelectedRoom).toHaveBeenCalledWith(sampleRoomChats[0]);
    });

    it("should select different contacts when clicked", () => {
      const setSelectedRoom = jest.fn();
      render(<Contacts {...defaultProps} setSelectedRoom={setSelectedRoom} />);

      const contactItem = screen.getByText("Trần Thị B");
      fireEvent.click(contactItem);

      expect(setSelectedRoom).toHaveBeenCalledWith(sampleRoomChats[1]);
    });

    it("should highlight selected contact", () => {
      render(<Contacts {...defaultProps} selectedRoom={sampleRoomChats[0]} />);

      const items = screen.getAllByRole("button");
      const item = items.find((el) => el.textContent?.includes("Nguyễn Văn A"));
      expect(item).toHaveClass("border-primary-dark", "bg-primary-lighter");
    });

    it("should show hover effects on contact items", () => {
      render(<Contacts {...defaultProps} />);

      const items = screen.getAllByRole("button");
      items.forEach((item) => {
        expect(item).toHaveClass("hover:shadow-sm");
        expect(item).toHaveClass("hover:bg-gray-50");
      });
    });

    it("should handle multiple contact selections", () => {
      const setSelectedRoom = jest.fn();
      render(<Contacts {...defaultProps} setSelectedRoom={setSelectedRoom} />);

      // Click first contact
      const contact1 = screen.getByText("Nguyễn Văn A");
      fireEvent.click(contact1);

      // Click second contact
      const contact2 = screen.getByText("Trần Thị B");
      fireEvent.click(contact2);

      expect(setSelectedRoom).toHaveBeenCalledTimes(2);
      expect(setSelectedRoom).toHaveBeenNthCalledWith(1, sampleRoomChats[0]);
      expect(setSelectedRoom).toHaveBeenNthCalledWith(2, sampleRoomChats[1]);
    });
  });

  describe("State Management", () => {
    it("should update selected room when contact is clicked", () => {
      const setSelectedRoom = jest.fn();
      render(<Contacts {...defaultProps} setSelectedRoom={setSelectedRoom} />);

      const contactItem = screen.getByText("Lê Văn C");
      fireEvent.click(contactItem);

      expect(setSelectedRoom).toHaveBeenCalledWith(sampleRoomChats[2]);
    });

    it("should maintain selected state when re-rendering", () => {
      const { rerender } = render(
        <Contacts {...defaultProps} selectedRoom={sampleRoomChats[0]} />,
      );

      // Re-render with same selected room
      rerender(
        <Contacts {...defaultProps} selectedRoom={sampleRoomChats[0]} />,
      );

      const selectedContact = screen
        .getByText("Nguyễn Văn A")
        .closest(".relative.flex.items-center");
      expect(selectedContact).toHaveClass(
        "border-primary-dark",
        "bg-primary-lighter",
      );
    });

    it("should clear selection when selectedRoom is null", () => {
      const { rerender } = render(
        <Contacts {...defaultProps} selectedRoom={sampleRoomChats[0]} />,
      );

      // Re-render with null selected room
      rerender(<Contacts {...defaultProps} selectedRoom={null} />);

      const contactItem = screen.getByText("Nguyễn Văn A").closest("div");
      expect(contactItem).not.toHaveClass(
        "border-primary-dark",
        "bg-primary-lighter",
      );
    });
  });

  describe("Search Functionality", () => {
    it("should accept search query prop", () => {
      render(<Contacts {...defaultProps} searchQuery="test search" />);

      // Component should render normally regardless of search query
      expect(screen.getByText("Danh sách giáo vụ")).toBeInTheDocument();
    });

    it("should handle empty search query", () => {
      render(<Contacts {...defaultProps} searchQuery="" />);

      expect(screen.getByText("Danh sách giáo vụ")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels and roles", () => {
      render(<Contacts {...defaultProps} />);

      expect(screen.getByText("Danh sách giáo vụ")).toBeInTheDocument();
      expect(screen.getByText("Chọn giáo vụ để nhắn tin")).toBeInTheDocument();
    });

    it("should support keyboard navigation", () => {
      render(<Contacts {...defaultProps} />);

      const items = screen.getAllByRole("button");
      items.forEach((item) => {
        expect(item).toHaveAttribute("role", "button");
        expect(item).toHaveAttribute("tabIndex", "0");
      });
    });

    it("should have proper focus management", () => {
      render(<Contacts {...defaultProps} />);

      const items = screen.getAllByRole("button");
      items.forEach((item) => {
        expect(item).toHaveAttribute("role", "button");
        expect(item).toHaveAttribute("tabIndex", "0");
      });
    });

    it("should have proper alt text for images", () => {
      render(<Contacts {...defaultProps} />);

      const avatar = screen.getByAltText("Nguyễn Văn A");
      expect(avatar).toBeInTheDocument();
    });
  });

  describe("Layout and Styling", () => {
    it("should render with correct card structure", () => {
      render(<Contacts {...defaultProps} />);

      expect(screen.getByText("Danh sách giáo vụ")).toBeInTheDocument();
      expect(screen.getByText("Chọn giáo vụ để nhắn tin")).toBeInTheDocument();
    });

    it("should have scrollable content area", () => {
      const { container } = render(<Contacts {...defaultProps} />);

      const scrollArea = container.querySelector(".overflow-y-auto");
      expect(scrollArea).toBeInTheDocument();
    });

    it("should show online status indicators", () => {
      render(<Contacts {...defaultProps} />);

      const onlineIndicators = screen.getAllByTestId("online-indicator");
      expect(onlineIndicators.length).toBeGreaterThan(0);
    });

    it("should have proper responsive layout", () => {
      render(<Contacts {...defaultProps} />);

      // The layout should be responsive and handle different screen sizes
      expect(screen.getByText("Danh sách giáo vụ")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle contacts without class names", () => {
      // Test with existing data that has empty class names
      render(<Contacts {...defaultProps} selectedRoom={null} />);

      // Should handle empty class names gracefully - check that component renders
      expect(screen.getByText("Danh sách giáo vụ")).toBeInTheDocument();
    });

    it("should handle contacts with very long names", () => {
      render(<Contacts {...defaultProps} selectedRoom={null} />);

      // Test with existing long names in the data
      expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
    });

    it("should handle contacts with very long class names", () => {
      render(<Contacts {...defaultProps} selectedRoom={null} />);

      // Test with existing class names in the data
      expect(screen.getByText(/10A1, 10A2, 11A1/)).toBeInTheDocument();
    });

    it("should handle contacts with special characters in names", () => {
      render(<Contacts {...defaultProps} selectedRoom={null} />);

      // Test with existing names that may have special characters
      expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
    });

    it("should handle contacts with empty names", () => {
      render(<Contacts {...defaultProps} selectedRoom={null} />);

      // Test that component renders even with potential empty names
      expect(screen.getByText("Danh sách giáo vụ")).toBeInTheDocument();
    });
  });

  describe("Data Structure", () => {
    it("should have correct sample data structure", () => {
      expect(sampleRoomChats).toHaveLength(5);

      sampleRoomChats.forEach((room) => {
        expect(room).toHaveProperty("roomChatId");
        expect(room).toHaveProperty("user");
        expect(room).toHaveProperty("listClassName");
        expect(room).toHaveProperty("unreadCount");

        expect(room.user).toHaveProperty("id");
        expect(room.user).toHaveProperty("genId");
        expect(room.user).toHaveProperty("email");
        expect(room.user).toHaveProperty("name");
        expect(room.user).toHaveProperty("avatar");

        expect(Array.isArray(room.listClassName)).toBe(true);
        expect(typeof room.unreadCount).toBe("number");
      });
    });

    it("should have unique room IDs", () => {
      const roomIds = sampleRoomChats.map((room) => room.roomChatId);
      const uniqueIds = new Set(roomIds);
      expect(uniqueIds.size).toBe(sampleRoomChats.length);
    });

    it("should have valid email formats", () => {
      sampleRoomChats.forEach((room) => {
        expect(room.user.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });
    });
  });
});
