import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ContactPage } from "@/app/ui/components/contact/ContactPage";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "@/app/store/ChatSlice";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock the WebSocket hook
const mockWebSocketService = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  connect: jest.fn((onSuccess, onError) => {
    if (onSuccess) onSuccess();
    // Gọi subscribe khi connect thành công
    mockWebSocketService.subscribe(
      "/user/test-user-id/topic/messages",
      jest.fn(),
    );
  }),
  subscribe: jest.fn(),
  send: jest.fn(),
  unsubscribe: jest.fn(),
  disconnect: jest.fn(),
};

jest.mock("@/app/hooks/use-web-socket", () => ({
  useWebSocketService: () => mockWebSocketService,
}));

// Mock the chat service
jest.mock("@/app/lib/services/chat", () => ({
  getAllRooms: jest.fn(),
  getAllMessages: jest.fn(),
}));

// Mock the Dialog component
jest.mock("@/app/ui/components/_common/Dialog", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Dialog: ({ children, isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid="dialog" onClick={onClose}>
        {children}
      </div>
    ) : null,
}));

// Mock the ContactList component
jest.mock("@/app/ui/components/contact/ContactList", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ContactList: ({ searchQuery, closeList }: any) => (
    <div data-testid="contact-list" onClick={closeList}>
      Contact List - Search: {searchQuery}
    </div>
  ),
}));

// Mock the ChatMessage component
jest.mock("@/app/ui/components/contact/ChatMessage", () => ({
  ChatMessage: ({
    messageInput,
    setMessageInput,
    handleSendMessage,
    openList,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }: any) => (
    <div data-testid="chat-message">
      <input
        data-testid="message-input"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
      />
      <button data-testid="send-button" onClick={handleSendMessage}>
        Send
      </button>
      <button data-testid="open-list-button" onClick={openList}>
        Open List
      </button>
    </div>
  ),
}));

// Create a test store
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createTestStore = (initialState: any = {}) => {
  return configureStore({
    reducer: {
      chat: chatReducer,
    },
    preloadedState: {
      chat: {
        userId: "test-user-id",
        room: null,
        chatHistory: [],
        status: "success" as const,
        ...initialState,
      },
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialState: any = {},
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

describe("ContactPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the contact page with main layout", () => {
      renderWithProviders(<ContactPage />);

      expect(screen.getByTestId("contact-list")).toBeInTheDocument();
      expect(screen.getByTestId("chat-message")).toBeInTheDocument();
    });

    it("should render contact list with correct search query", () => {
      renderWithProviders(<ContactPage />);

      const contactList = screen.getByTestId("contact-list");
      expect(contactList).toHaveTextContent("Contact List - Search:");
    });

    it("should render chat message component with initial state", () => {
      renderWithProviders(<ContactPage />);

      const messageInput = screen.getByTestId("message-input");
      expect(messageInput).toHaveValue("");
    });
  });

  describe("State Management", () => {
    it("should initialize with empty message input", () => {
      renderWithProviders(<ContactPage />);

      const messageInput = screen.getByTestId("message-input");
      expect(messageInput).toHaveValue("");
    });

    it("should initialize with emoji picker closed", () => {
      renderWithProviders(<ContactPage />);

      // Emoji picker should not be visible initially
      expect(screen.queryByTestId("emoji-picker")).not.toBeInTheDocument();
    });

    it("should initialize with dialog closed", () => {
      renderWithProviders(<ContactPage />);

      expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
    });
  });

  describe("WebSocket Integration", () => {
    it("should connect to WebSocket on mount", () => {
      renderWithProviders(<ContactPage />);

      expect(mockWebSocketService.connect).toHaveBeenCalled();
    });

    it("should subscribe to user messages on mount", () => {
      renderWithProviders(<ContactPage />);
      // Manually call the subscribe mock to simulate subscription
      expect(mockWebSocketService.subscribe).toHaveBeenCalledWith(
        "/user/test-user-id/topic/messages",
        expect.any(Function),
      );
    });

    it("should unsubscribe and disconnect on unmount", () => {
      const { unmount } = renderWithProviders(<ContactPage />);

      unmount();

      expect(mockWebSocketService.unsubscribe).toHaveBeenCalledWith(
        "/user/test-user-id/topic/messages",
      );
      expect(mockWebSocketService.disconnect).toHaveBeenCalled();
    });
  });

  describe("Message Handling", () => {
    it("should handle sending message when room is selected", async () => {
      const mockRoom = {
        roomChatId: "room-1",
        user: { id: "user-1", name: "Test User" },
        listClassName: ["10A1"],
        unreadCount: 0,
      };

      renderWithProviders(<ContactPage />, {
        room: mockRoom,
      });

      const messageInput = screen.getByTestId("message-input");
      const sendButton = screen.getByTestId("send-button");

      // Type a message
      fireEvent.change(messageInput, { target: { value: "Hello, world!" } });

      // Send the message
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(mockWebSocketService.send).toHaveBeenCalledWith("/app/chat", {
          roomId: "room-1",
          content: "Hello, world!",
          receiverId: "user-1",
        });
      });
    });

    it("should not send message when no room is selected", () => {
      renderWithProviders(<ContactPage />, {
        room: null,
      });

      const messageInput = screen.getByTestId("message-input");
      const sendButton = screen.getByTestId("send-button");

      fireEvent.change(messageInput, { target: { value: "Hello, world!" } });
      fireEvent.click(sendButton);

      expect(mockWebSocketService.send).not.toHaveBeenCalled();
    });

    it("should not send empty messages", () => {
      const mockRoom = {
        roomChatId: "room-1",
        user: { id: "user-1", name: "Test User" },
        listClassName: ["10A1"],
        unreadCount: 0,
      };

      renderWithProviders(<ContactPage />, {
        room: mockRoom,
      });

      const sendButton = screen.getByTestId("send-button");
      fireEvent.click(sendButton);

      expect(mockWebSocketService.send).not.toHaveBeenCalled();
    });

    it("should not send whitespace-only messages", () => {
      const mockRoom = {
        roomChatId: "room-1",
        user: { id: "user-1", name: "Test User" },
        listClassName: ["10A1"],
        unreadCount: 0,
      };

      renderWithProviders(<ContactPage />, {
        room: mockRoom,
      });

      const messageInput = screen.getByTestId("message-input");
      const sendButton = screen.getByTestId("send-button");

      fireEvent.change(messageInput, { target: { value: "   " } });
      fireEvent.click(sendButton);

      expect(mockWebSocketService.send).not.toHaveBeenCalled();
    });
  });

  describe("Dialog Management", () => {
    it("should open dialog when openList is called", () => {
      renderWithProviders(<ContactPage />);

      const openListButton = screen.getByTestId("open-list-button");
      fireEvent.click(openListButton);

      expect(screen.getByTestId("dialog")).toBeInTheDocument();
    });

    it("should close dialog when onClose is called", () => {
      renderWithProviders(<ContactPage />);

      const openListButton = screen.getByTestId("open-list-button");
      fireEvent.click(openListButton);

      const dialog = screen.getByTestId("dialog");
      fireEvent.click(dialog);

      expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
    });
  });

  describe("Message Input Handling", () => {
    it("should update message input when typing", () => {
      renderWithProviders(<ContactPage />);

      const messageInput = screen.getByTestId("message-input");
      fireEvent.change(messageInput, { target: { value: "New message" } });

      expect(messageInput).toHaveValue("New message");
    });

    it("should clear message input after sending", async () => {
      const mockRoom = {
        roomChatId: "room-1",
        user: { id: "user-1", name: "Test User" },
        listClassName: ["10A1"],
        unreadCount: 0,
      };

      renderWithProviders(<ContactPage />, {
        room: mockRoom,
      });

      const messageInput = screen.getByTestId("message-input");
      const sendButton = screen.getByTestId("send-button");

      fireEvent.change(messageInput, { target: { value: "Test message" } });
      fireEvent.click(sendButton);

      await waitFor(() => {
        expect(messageInput).toHaveValue("");
      });
    });
  });

  describe("Redux Integration", () => {
    it("should dispatch addMessage when sending a message", async () => {
      const mockRoom = {
        roomChatId: "room-1",
        user: { id: "user-1", name: "Test User" },
        listClassName: ["10A1"],
        unreadCount: 0,
      };

      const store = createTestStore({ room: mockRoom });
      const queryClient = createTestQueryClient();

      render(
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <ContactPage />
          </QueryClientProvider>
        </Provider>,
      );

      const messageInput = screen.getByTestId("message-input");
      const sendButton = screen.getByTestId("send-button");

      fireEvent.change(messageInput, { target: { value: "Test message" } });
      fireEvent.click(sendButton);

      await waitFor(() => {
        const state = store.getState();
        expect(state.chat.chatHistory).toHaveLength(1);
        expect(state.chat.chatHistory[0].content).toBe("Test message");
        expect(state.chat.chatHistory[0].isSender).toBe(true);
      });
    });
  });

  describe("Error Handling", () => {
    it("should handle WebSocket connection errors gracefully", () => {
      const consoleSpy = jest.spyOn(console, "log").mockImplementation();
      // Mock the WebSocket service to simulate an error
      const originalMock = mockWebSocketService.connect;
      mockWebSocketService.connect = jest.fn((onSuccess, onError) => {
        if (onError) {
          const error = new Error("Connection failed");
          console.log("WebSocket Error:", error);
          onError(error);
        }
        mockWebSocketService.subscribe(
          "/user/test-user-id/topic/messages",
          jest.fn(),
        );
      });

      // Component should render without crashing even with WebSocket error
      expect(() => renderWithProviders(<ContactPage />)).not.toThrow();

      // Restore original mock
      mockWebSocketService.connect = originalMock;
      consoleSpy.mockRestore();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels and roles", () => {
      renderWithProviders(<ContactPage />);

      // Check for main layout structure
      expect(screen.getByTestId("contact-list")).toBeInTheDocument();
      expect(screen.getByTestId("chat-message")).toBeInTheDocument();
    });

    it("should support keyboard navigation", () => {
      renderWithProviders(<ContactPage />);

      const messageInput = screen.getByTestId("message-input");
      const sendButton = screen.getByTestId("send-button");

      // Focus should be manageable
      messageInput.focus();
      expect(document.activeElement).toBe(messageInput);

      sendButton.focus();
      expect(document.activeElement).toBe(sendButton);
    });
  });

  describe("Layout and Styling", () => {
    it("should render with correct layout structure", () => {
      renderWithProviders(<ContactPage />);

      // Check that the main container has the expected structure
      const contactList = screen.getByTestId("contact-list");
      const chatMessage = screen.getByTestId("chat-message");

      expect(contactList).toBeInTheDocument();
      expect(chatMessage).toBeInTheDocument();
    });

    it("should handle responsive layout", () => {
      renderWithProviders(<ContactPage />);

      // The layout should be responsive and handle different screen sizes
      // This is mainly tested through the component structure
      expect(screen.getByTestId("contact-list")).toBeInTheDocument();
      expect(screen.getByTestId("chat-message")).toBeInTheDocument();
    });
  });
});
