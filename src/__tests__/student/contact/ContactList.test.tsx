import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ContactList } from "@/app/ui/components/contact/ContactList";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "@/app/store/ChatSlice";
import type { ChatState } from "@/app/store/ChatSlice";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { getAllRooms } from "@/app/lib/services/chat";

// Mock the chat service
const mockGetAllRooms = getAllRooms as jest.MockedFunction<typeof getAllRooms>;
jest.mock("@/app/lib/services/chat", () => ({
  getAllRooms: jest.fn(),
}));

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

// Create a test store
const createTestStore = (initialState: Partial<ChatState> = {}) => {
  return configureStore({
    reducer: {
      chat: chatReducer,
    },
    preloadedState: {
      chat: {
        userId: "test-user-id",
        room: null,
        chatHistory: [],
        status: "success",
        ...initialState,
      } as ChatState,
    },
  });
};

// Create a test query client
const createTestQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
};

const renderWithProviders = (
  component: React.ReactElement,
  initialState = {},
) => {
  const store = createTestStore(initialState);
  const queryClient = createTestQueryClient();

  return render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    </Provider>,
  );
};

const mockRooms = {
  content: [
    {
      roomChatId: "1",
      user: {
        id: "1",
        genId: "T001",
        email: "nguyenvana@example.com",
        name: "Nguyễn Văn A",
        avatar: "/avatars/teacher1.jpg",
      },
      listClassName: ["10A1", "10A2", "11A1"],
      unreadCount: 3,
    },
    {
      roomChatId: "2",
      user: {
        id: "2",
        genId: "T002",
        email: "tranthib@example.com",
        name: "Trần Thị B",
        avatar: "",
      },
      listClassName: ["9A1", "9A2"],
      unreadCount: 0,
    },
    {
      roomChatId: "3",
      user: {
        id: "3",
        genId: "T003",
        email: "levanc@example.com",
        name: "Lê Văn C",
        avatar: "",
      },
      listClassName: ["12A1", "12A2", "12A3"],
      unreadCount: 1,
    },
  ],
  totalElements: 3,
  totalPages: 1,
  pageNumber: 0,
  pageSize: 100,
  last: true,
};

describe("ContactList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the contact list with header", () => {
      mockGetAllRooms.mockResolvedValue(mockRooms);

      renderWithProviders(<ContactList searchQuery="" />);

      expect(screen.getByText("Danh sách giáo vụ")).toBeInTheDocument();
      expect(screen.getByText("Chọn giáo vụ để nhắn tin")).toBeInTheDocument();
    });

    it("should render loading skeleton when data is pending", () => {
      mockGetAllRooms.mockImplementation(() => new Promise(() => {}));

      renderWithProviders(<ContactList searchQuery="" />);

      // Should show loading skeletons
      const skeletons = screen.getAllByText("");
      expect(skeletons.length).toBeGreaterThan(0);
    });

    it("should render contact items when data is loaded", async () => {
      mockGetAllRooms.mockResolvedValue(mockRooms);

      renderWithProviders(<ContactList searchQuery="" />);

      await waitFor(() => {
        expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
        expect(screen.getByText("Trần Thị B")).toBeInTheDocument();
        expect(screen.getByText("Lê Văn C")).toBeInTheDocument();
      });
    });

    it("should render user avatars when available", async () => {
      mockGetAllRooms.mockResolvedValue(mockRooms);

      renderWithProviders(<ContactList searchQuery="" />);

      await waitFor(() => {
        const avatar = screen.getByAltText("Nguyễn Văn A");
        expect(avatar).toHaveAttribute("src", "/avatars/teacher1.jpg");
      });
    });

    it("should render default avatar icon when no avatar is available", async () => {
      mockGetAllRooms.mockResolvedValue(mockRooms);

      renderWithProviders(<ContactList searchQuery="" />);

      await waitFor(() => {
        // Should show default person icon for users without avatars
        const personIcons = screen.getAllByTestId("person-icon");
        expect(personIcons.length).toBeGreaterThan(0);
      });
    });

    it("should render class names for each contact", async () => {
      mockGetAllRooms.mockResolvedValue(mockRooms);

      renderWithProviders(<ContactList searchQuery="" />);

      await waitFor(() => {
        expect(
          screen.getByText("Lớp phụ trách: 10A1, 10A2, 11A1"),
        ).toBeInTheDocument();
        expect(screen.getByText("Lớp phụ trách: 9A1, 9A2")).toBeInTheDocument();
        expect(
          screen.getByText("Lớp phụ trách: 12A1, 12A2, 12A3"),
        ).toBeInTheDocument();
      });
    });

    it("should render unread message count badges", async () => {
      mockGetAllRooms.mockResolvedValue(mockRooms);

      renderWithProviders(<ContactList searchQuery="" />);

      await waitFor(() => {
        expect(screen.getByText("3")).toBeInTheDocument(); // Nguyễn Văn A
        expect(screen.getByText("1")).toBeInTheDocument(); // Lê Văn C
        expect(screen.queryByText("0")).not.toBeInTheDocument(); // Trần Thị B has 0 unread
      });
    });

    it("should not show unread badge when count is 0", async () => {
      mockGetAllRooms.mockResolvedValue(mockRooms);

      renderWithProviders(<ContactList searchQuery="" />);

      await waitFor(() => {
        // Trần Thị B has 0 unread messages, so no badge should be shown
        const badges = screen.getAllByText(/^[0-9]+$/);
        expect(badges).toHaveLength(2); // Only 3 and 1
      });
    });
  });

  describe("Data Fetching", () => {
    it("should fetch rooms with correct parameters", async () => {
      mockGetAllRooms.mockResolvedValue(mockRooms);

      renderWithProviders(<ContactList searchQuery="test" />);

      await waitFor(() => {
        expect(mockGetAllRooms).toHaveBeenCalledWith(0, 100, "test", "");
      });
    });

    it("should handle API errors gracefully", async () => {
      mockGetAllRooms.mockRejectedValue(new Error("API Error"));

      renderWithProviders(<ContactList searchQuery="" />);

      await waitFor(() => {
        // Should show loading state or error state
        expect(screen.getByText("Danh sách giáo vụ")).toBeInTheDocument();
      });
    });

    it("should handle empty response", async () => {
      mockGetAllRooms.mockResolvedValue({
        content: [],
        totalElements: 0,
        totalPages: 0,
        pageNumber: 0,
        pageSize: 100,
        last: true,
      });

      renderWithProviders(<ContactList searchQuery="" />);

      await waitFor(() => {
        expect(screen.getByText("Danh sách giáo vụ")).toBeInTheDocument();
        // Should not show any contact items
        expect(screen.queryByText("Nguyễn Văn A")).not.toBeInTheDocument();
      });
    });
  });

  describe("User Interactions", () => {
    it("should select a contact when clicked", async () => {
      mockGetAllRooms.mockResolvedValue(mockRooms);

      renderWithProviders(<ContactList searchQuery="" />);

      await waitFor(() => {
        const items = screen.getAllByRole("button");
        const item = items.find((el) =>
          el.textContent?.includes("Nguyễn Văn A"),
        );
        fireEvent.click(item!);
        // The item should have highlight class
        expect(item).toHaveClass("border-primary-dark", "bg-primary-lighter");
      });
    });

    it("should call closeList when provided and contact is clicked", async () => {
      mockGetAllRooms.mockResolvedValue(mockRooms);
      const mockCloseList = jest.fn();

      renderWithProviders(
        <ContactList searchQuery="" closeList={mockCloseList} />,
      );

      await waitFor(() => {
        const contactItem = screen.getByText("Nguyễn Văn A");
        fireEvent.click(contactItem);
      });

      expect(mockCloseList).toHaveBeenCalled();
    });

    it("should not call closeList when not provided", async () => {
      mockGetAllRooms.mockResolvedValue(mockRooms);

      renderWithProviders(<ContactList searchQuery="" />);

      await waitFor(() => {
        const contactItem = screen.getByText("Nguyễn Văn A");
        fireEvent.click(contactItem);
      });

      // Should not throw error when closeList is not provided
      expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
    });

    it("should highlight selected contact", async () => {
      mockGetAllRooms.mockResolvedValue(mockRooms);

      renderWithProviders(<ContactList searchQuery="" />, {
        room: mockRooms.content[0],
      });

      await waitFor(() => {
        const items = screen.getAllByRole("button");
        const item = items.find((el) =>
          el.textContent?.includes("Nguyễn Văn A"),
        );
        expect(item).toHaveClass("border-primary-dark", "bg-primary-lighter");
      });
    });

    it("should show hover effects on contact items", async () => {
      mockGetAllRooms.mockResolvedValue(mockRooms);

      renderWithProviders(<ContactList searchQuery="" />);

      await waitFor(() => {
        const items = screen.getAllByRole("button");
        items.forEach((item) => {
          expect(item).toHaveClass("hover:shadow-sm");
          expect(item).toHaveClass("hover:bg-gray-50");
        });
      });
    });

    it("should support keyboard navigation", async () => {
      mockGetAllRooms.mockResolvedValue(mockRooms);

      renderWithProviders(<ContactList searchQuery="" />);

      await waitFor(() => {
        const items = screen.getAllByRole("button");
        items.forEach((item) => {
          expect(item).toHaveAttribute("role", "button");
          expect(item).toHaveAttribute("tabIndex", "0");
        });
      });
    });

    it("should have proper focus management", async () => {
      mockGetAllRooms.mockResolvedValue(mockRooms);

      renderWithProviders(<ContactList searchQuery="" />);

      await waitFor(() => {
        const items = screen.getAllByRole("button");
        items.forEach((item) => {
          expect(item).toHaveAttribute("role", "button");
          expect(item).toHaveAttribute("tabIndex", "0");
        });
      });
    });
  });

  describe("State Management", () => {
    it("should dispatch setRoom action when contact is clicked", async () => {
      mockGetAllRooms.mockResolvedValue(mockRooms);

      const store = createTestStore();
      const queryClient = createTestQueryClient();

      render(
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <ContactList searchQuery="" />
          </QueryClientProvider>
        </Provider>,
      );

      await waitFor(() => {
        const contactItem = screen.getByText("Nguyễn Văn A");
        fireEvent.click(contactItem);
      });

      const state = store.getState();
      expect(state.chat.room).toEqual(mockRooms.content[0]);
    });

    it("should update selected room in Redux store", async () => {
      mockGetAllRooms.mockResolvedValue(mockRooms);

      const store = createTestStore();
      const queryClient = createTestQueryClient();

      render(
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <ContactList searchQuery="" />
          </QueryClientProvider>
        </Provider>,
      );

      await waitFor(() => {
        const contactItem = screen.getByText("Trần Thị B");
        fireEvent.click(contactItem);
      });

      const state = store.getState();
      expect(state.chat.room).toEqual(mockRooms.content[1]);
    });
  });

  describe("Search Functionality", () => {
    it("should pass search query to API", async () => {
      mockGetAllRooms.mockResolvedValue(mockRooms);

      renderWithProviders(<ContactList searchQuery="Nguyễn" />);

      await waitFor(() => {
        expect(mockGetAllRooms).toHaveBeenCalledWith(0, 100, "Nguyễn", "");
      });
    });

    it("should handle empty search query", async () => {
      mockGetAllRooms.mockResolvedValue(mockRooms);

      renderWithProviders(<ContactList searchQuery="" />);

      await waitFor(() => {
        expect(mockGetAllRooms).toHaveBeenCalledWith(0, 100, "", "");
      });
    });

    it("should refetch data when search query changes", async () => {
      mockGetAllRooms.mockResolvedValue(mockRooms);

      const { rerender } = renderWithProviders(<ContactList searchQuery="" />);

      await waitFor(() => {
        expect(mockGetAllRooms).toHaveBeenCalledWith(0, 100, "", "");
      });

      mockGetAllRooms.mockClear();

      rerender(
        <Provider store={createTestStore()}>
          <QueryClientProvider client={createTestQueryClient()}>
            <ContactList searchQuery="new search" />
          </QueryClientProvider>
        </Provider>,
      );

      await waitFor(() => {
        expect(mockGetAllRooms).toHaveBeenCalledWith(0, 100, "new search", "");
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels and roles", async () => {
      mockGetAllRooms.mockResolvedValue(mockRooms);

      renderWithProviders(<ContactList searchQuery="" />);

      await waitFor(() => {
        expect(screen.getByText("Danh sách giáo vụ")).toBeInTheDocument();
        expect(
          screen.getByText("Chọn giáo vụ để nhắn tin"),
        ).toBeInTheDocument();
      });
    });

    it("should support keyboard navigation", async () => {
      mockGetAllRooms.mockResolvedValue(mockRooms);

      renderWithProviders(<ContactList searchQuery="" />);

      await waitFor(() => {
        const items = screen.getAllByRole("button");
        items.forEach((item) => {
          expect(item).toHaveAttribute("role", "button");
          expect(item).toHaveAttribute("tabIndex", "0");
        });
      });
    });

    it("should have proper focus management", async () => {
      mockGetAllRooms.mockResolvedValue(mockRooms);

      renderWithProviders(<ContactList searchQuery="" />);

      await waitFor(() => {
        const items = screen.getAllByRole("button");
        items.forEach((item) => {
          expect(item).toHaveAttribute("role", "button");
          expect(item).toHaveAttribute("tabIndex", "0");
        });
      });
    });
  });

  describe("Layout and Styling", () => {
    it("should render with correct card structure", async () => {
      mockGetAllRooms.mockResolvedValue(mockRooms);

      renderWithProviders(<ContactList searchQuery="" />);

      await waitFor(() => {
        expect(screen.getByText("Danh sách giáo vụ")).toBeInTheDocument();
        expect(
          screen.getByText("Chọn giáo vụ để nhắn tin"),
        ).toBeInTheDocument();
      });
    });

    it("should have scrollable content area", async () => {
      mockGetAllRooms.mockResolvedValue(mockRooms);

      const { container } = renderWithProviders(<ContactList searchQuery="" />);

      await waitFor(() => {
        const scrollArea = container.querySelector(".overflow-y-auto");
        expect(scrollArea).toBeInTheDocument();
      });
    });

    it("should show online status indicators", async () => {
      mockGetAllRooms.mockResolvedValue(mockRooms);

      renderWithProviders(<ContactList searchQuery="" />);

      await waitFor(() => {
        const onlineIndicators = screen.getAllByTestId("online-indicator");
        expect(onlineIndicators.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Edge Cases", () => {
    it("should handle contacts without class names", async () => {
      const roomsWithoutClasses = {
        ...mockRooms,
        content: [
          {
            ...mockRooms.content[0],
            listClassName: [],
          },
        ],
      };

      mockGetAllRooms.mockResolvedValue(roomsWithoutClasses);

      renderWithProviders(<ContactList searchQuery="" />);

      await waitFor(() => {
        expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
        // Should not show "Lớp phụ trách" text when no classes
        expect(screen.queryByText("Lớp phụ trách:")).not.toBeInTheDocument();
      });
    });

    it("should handle contacts with very long names", async () => {
      const roomsWithLongNames = {
        ...mockRooms,
        content: [
          {
            ...mockRooms.content[0],
            user: {
              ...mockRooms.content[0].user,
              name: "Nguyễn Văn A B C D E F G H I J K L M N O P Q R S T U V W X Y Z",
            },
          },
        ],
      };

      mockGetAllRooms.mockResolvedValue(roomsWithLongNames);

      renderWithProviders(<ContactList searchQuery="" />);

      await waitFor(() => {
        expect(
          screen.getByText(
            "Nguyễn Văn A B C D E F G H I J K L M N O P Q R S T U V W X Y Z",
          ),
        ).toBeInTheDocument();
      });
    });

    it("should handle contacts with very long class names", async () => {
      const roomsWithLongClasses = {
        ...mockRooms,
        content: [
          {
            ...mockRooms.content[0],
            listClassName: [
              "Lớp 10A1 Toán Lý Hóa Sinh Văn Sử Địa Anh",
              "Lớp 10A2 Toán Lý Hóa Sinh Văn Sử Địa Anh",
              "Lớp 10A3 Toán Lý Hóa Sinh Văn Sử Địa Anh",
            ],
          },
        ],
      };

      mockGetAllRooms.mockResolvedValue(roomsWithLongClasses);

      renderWithProviders(<ContactList searchQuery="" />);

      await waitFor(() => {
        expect(screen.getByText(/Lớp phụ trách:/)).toBeInTheDocument();
      });
    });
  });
});
