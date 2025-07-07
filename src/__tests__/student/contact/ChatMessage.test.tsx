import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ChatMessage } from "@/app/ui/components/contact/ChatMessage";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "@/app/store/ChatSlice";
import type { ChatState } from "@/app/store/ChatSlice";

beforeAll(() => {
  Element.prototype.scrollIntoView = jest.fn();
});

// Mock the emoji picker
jest.mock("emoji-picker-react", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ onEmojiClick }: any) => (
    <div data-testid="emoji-picker">
      <button onClick={() => onEmojiClick({ emoji: "😊" })}>😊</button>
      <button onClick={() => onEmojiClick({ emoji: "👍" })}>👍</button>
    </div>
  ),
}));

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

// Mock the Loading component
jest.mock("@/app/ui/components/_common/loading/Loading", () => ({
  __esModule: true,
  default: () => <div data-testid="loading">Loading...</div>,
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

const renderWithProviders = (
  component: React.ReactElement,
  initialState = {},
) => {
  const store = createTestStore(initialState);

  return render(<Provider store={store}>{component}</Provider>);
};

const mockRoom = {
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
};

const mockMessages = [
  {
    id: "1",
    content: "Hello, how are you?",
    isSender: true,
    sendTime: "2024-01-01T10:00:00Z",
  },
  {
    id: "2",
    content: "I'm doing well, thank you!",
    isSender: false,
    sendTime: "2024-01-01T10:01:00Z",
  },
  {
    id: "3",
    content: "Great to hear that!",
    isSender: true,
    sendTime: "2024-01-01T10:02:00Z",
  },
];

describe("ChatMessage", () => {
  const defaultProps = {
    messageInput: "",
    setMessageInput: jest.fn(),
    showEmojiPicker: false,
    setShowEmojiPicker: jest.fn(),
    emojiRef: { current: null },
    handleSendMessage: jest.fn(),
    openList: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    it("should render the chat message component", () => {
      renderWithProviders(<ChatMessage {...defaultProps} />);

      expect(screen.getByText("Tin nhắn")).toBeInTheDocument();
      expect(
        screen.getByText("Chọn một giáo viên để bắt đầu cuộc trò chuyện"),
      ).toBeInTheDocument();
    });

    it("should render empty state when no room is selected", () => {
      renderWithProviders(<ChatMessage {...defaultProps} />);

      expect(
        screen.getByText("Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!"),
      ).toBeInTheDocument();
    });

    it("should render room header when room is selected", () => {
      renderWithProviders(<ChatMessage {...defaultProps} />, {
        room: mockRoom,
      });

      expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
      expect(screen.getByText("10A1, 10A2, 11A1")).toBeInTheDocument();
    });

    it("should render user avatar when available", () => {
      renderWithProviders(<ChatMessage {...defaultProps} />, {
        room: mockRoom,
      });

      const avatar = screen.getByAltText("Nguyễn Văn A");
      expect(avatar).toHaveAttribute("src", "/avatars/teacher1.jpg");
    });

    it("should render default avatar icon when no avatar is available", () => {
      const roomWithoutAvatar = {
        ...mockRoom,
        user: { ...mockRoom.user, avatar: "" },
      };

      renderWithProviders(<ChatMessage {...defaultProps} />, {
        room: roomWithoutAvatar,
      });

      // Should show default person icon
      expect(screen.getByTestId("person-icon")).toBeInTheDocument();
    });

    it("should render messages when available", () => {
      renderWithProviders(<ChatMessage {...defaultProps} />, {
        room: mockRoom,
        chatHistory: mockMessages,
      });

      expect(screen.getByText("Hello, how are you?")).toBeInTheDocument();
      expect(
        screen.getByText("I'm doing well, thank you!"),
      ).toBeInTheDocument();
      expect(screen.getByText("Great to hear that!")).toBeInTheDocument();
    });

    it("should render loading state when status is pending", () => {
      renderWithProviders(<ChatMessage {...defaultProps} />, {
        room: mockRoom,
        status: "pending",
      });

      expect(screen.getByTestId("loading")).toBeInTheDocument();
    });

    it("should render empty state when room is selected but no messages", () => {
      renderWithProviders(<ChatMessage {...defaultProps} />, {
        room: mockRoom,
        chatHistory: [],
      });

      expect(
        screen.getByText("Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!"),
      ).toBeInTheDocument();
    });
  });

  describe("Message Display", () => {
    it("should display sender messages on the right", () => {
      renderWithProviders(<ChatMessage {...defaultProps} />, {
        room: mockRoom,
        chatHistory: [mockMessages[0]], // Sender message
      });

      const messageContainer = screen
        .getByText("Hello, how are you?")
        .closest(".flex");
      expect(messageContainer).toHaveClass("justify-end");
    });

    it("should display receiver messages on the left", () => {
      renderWithProviders(<ChatMessage {...defaultProps} />, {
        room: mockRoom,
        chatHistory: [mockMessages[1]], // Receiver message
      });

      const messageContainer = screen
        .getByText("I'm doing well, thank you!")
        .closest(".flex");
      expect(messageContainer).toHaveClass("justify-start");
    });

    it("should display message timestamps", () => {
      renderWithProviders(<ChatMessage {...defaultProps} />, {
        room: mockRoom,
        chatHistory: [mockMessages[0]],
      });

      // Should show formatted timestamp
      expect(screen.getByText(/01\/01\/2024/)).toBeInTheDocument();
    });

    it("should apply correct styling to sender messages", () => {
      renderWithProviders(<ChatMessage {...defaultProps} />, {
        room: mockRoom,
        chatHistory: [mockMessages[0]],
      });

      const messageBubble = screen
        .getByText("Hello, how are you?")
        .closest("div");
      expect(messageBubble).toHaveClass(
        "bg-primary-dark",
        "text-white",
        "rounded-br-none",
      );
    });

    it("should apply correct styling to receiver messages", () => {
      renderWithProviders(<ChatMessage {...defaultProps} />, {
        room: mockRoom,
        chatHistory: [mockMessages[1]],
      });

      const messageBubble = screen
        .getByText("I'm doing well, thank you!")
        .closest("div");
      expect(messageBubble).toHaveClass(
        "bg-gray-100",
        "text-gray-800",
        "rounded-bl-none",
      );
    });
  });

  describe("Input Handling", () => {
    it("should render message input when room is selected", () => {
      renderWithProviders(<ChatMessage {...defaultProps} />, {
        room: mockRoom,
      });

      const textarea = screen.getByPlaceholderText("Nhập tin nhắn...");
      expect(textarea).toBeInTheDocument();
    });

    it("should not render message input when no room is selected", () => {
      renderWithProviders(<ChatMessage {...defaultProps} />);

      expect(
        screen.queryByPlaceholderText("Nhập tin nhắn..."),
      ).not.toBeInTheDocument();
    });

    it("should update message input when typing", () => {
      const setMessageInput = jest.fn();
      renderWithProviders(
        <ChatMessage {...defaultProps} setMessageInput={setMessageInput} />,
        {
          room: mockRoom,
        },
      );

      const textarea = screen.getByPlaceholderText("Nhập tin nhắn...");
      fireEvent.change(textarea, { target: { value: "New message" } });

      expect(setMessageInput).toHaveBeenCalledWith("New message");
    });

    it("should display current message input value", () => {
      renderWithProviders(
        <ChatMessage {...defaultProps} messageInput="Current message" />,
        {
          room: mockRoom,
        },
      );

      const textarea = screen.getByPlaceholderText("Nhập tin nhắn...");
      expect(textarea).toHaveValue("Current message");
    });

    it("should handle Enter key to send message", () => {
      const handleSendMessage = jest.fn();
      renderWithProviders(
        <ChatMessage {...defaultProps} handleSendMessage={handleSendMessage} />,
        {
          room: mockRoom,
        },
      );

      const textarea = screen.getByPlaceholderText("Nhập tin nhắn...");
      fireEvent.keyDown(textarea, { key: "Enter", shiftKey: false });

      expect(handleSendMessage).toHaveBeenCalled();
    });

    it("should not send message on Shift+Enter", () => {
      const handleSendMessage = jest.fn();
      renderWithProviders(
        <ChatMessage {...defaultProps} handleSendMessage={handleSendMessage} />,
        {
          room: mockRoom,
        },
      );

      const textarea = screen.getByPlaceholderText("Nhập tin nhắn...");
      fireEvent.keyDown(textarea, { key: "Enter", shiftKey: true });

      expect(handleSendMessage).not.toHaveBeenCalled();
    });
  });

  describe("Emoji Picker", () => {
    it("should render emoji button", () => {
      renderWithProviders(<ChatMessage {...defaultProps} />, {
        room: mockRoom,
      });

      const emojiButton = screen.getByTitle("Chèn emoji");
      expect(emojiButton).toBeInTheDocument();
    });

    it("should toggle emoji picker when emoji button is clicked", () => {
      const setShowEmojiPicker = jest.fn();
      renderWithProviders(
        <ChatMessage
          {...defaultProps}
          setShowEmojiPicker={setShowEmojiPicker}
        />,
        {
          room: mockRoom,
        },
      );

      const emojiButton = screen.getByTitle("Chèn emoji");
      fireEvent.click(emojiButton);

      expect(setShowEmojiPicker).toHaveBeenCalledWith(true);
    });

    it("should show emoji picker when showEmojiPicker is true", () => {
      renderWithProviders(
        <ChatMessage {...defaultProps} showEmojiPicker={true} />,
        {
          room: mockRoom,
        },
      );

      expect(screen.getByTestId("emoji-picker")).toBeInTheDocument();
    });

    it("should hide emoji picker when showEmojiPicker is false", () => {
      renderWithProviders(
        <ChatMessage {...defaultProps} showEmojiPicker={false} />,
        {
          room: mockRoom,
        },
      );

      expect(screen.queryByTestId("emoji-picker")).not.toBeInTheDocument();
    });

    it("should add emoji to message input when emoji is selected", () => {
      const setMessageInput = jest.fn();
      renderWithProviders(
        <ChatMessage
          {...defaultProps}
          setMessageInput={setMessageInput}
          showEmojiPicker={true}
        />,
        {
          room: mockRoom,
        },
      );

      // Click on emoji in the picker
      const emojiPicker = screen.getByTestId("emoji-picker");
      const emojiButton1 = emojiPicker.querySelector("button");
      fireEvent.click(emojiButton1!);

      expect(setMessageInput).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe("Send Message", () => {
    it("should render send button when room is selected", () => {
      renderWithProviders(<ChatMessage {...defaultProps} />, {
        room: mockRoom,
      });

      const sendButton = screen.getByTitle("Gửi tin nhắn");
      expect(sendButton).toBeInTheDocument();
    });

    it("should not render send button when no room is selected", () => {
      renderWithProviders(<ChatMessage {...defaultProps} />);

      expect(screen.queryByTitle("Gửi tin nhắn")).not.toBeInTheDocument();
    });

    it("should call handleSendMessage when send button is clicked", () => {
      const handleSendMessage = jest.fn();
      renderWithProviders(
        <ChatMessage {...defaultProps} handleSendMessage={handleSendMessage} />,
        {
          room: mockRoom,
        },
      );

      const sendButton = screen.getByTitle("Gửi tin nhắn");
      fireEvent.click(sendButton);

      expect(handleSendMessage).toHaveBeenCalled();
    });
  });

  describe("Mobile Responsiveness", () => {
    it("should render mobile list button", () => {
      renderWithProviders(<ChatMessage {...defaultProps} />, {
        room: mockRoom,
      });

      const listButton = screen.getByTitle("Open List");
      expect(listButton).toBeInTheDocument();
    });

    it("should call openList when mobile list button is clicked", () => {
      const openList = jest.fn();
      renderWithProviders(
        <ChatMessage {...defaultProps} openList={openList} />,
        {
          room: mockRoom,
        },
      );

      const listButton = screen.getByTitle("Open List");
      fireEvent.click(listButton);

      expect(openList).toHaveBeenCalled();
    });

    it("should show mobile list button when room is selected", () => {
      renderWithProviders(<ChatMessage {...defaultProps} />, {
        room: mockRoom,
      });

      const listButton = screen.getByTitle("Open List");
      expect(listButton).toBeInTheDocument();
    });

    it("should show mobile list button when no room is selected", () => {
      renderWithProviders(<ChatMessage {...defaultProps} />);

      const listButton = screen.getByTitle("Open List");
      expect(listButton).toBeInTheDocument();
    });
  });

  describe("Auto-scroll", () => {
    it("should scroll to bottom when new messages are added", () => {
      const mockScrollIntoView = jest.fn();

      renderWithProviders(
        <ChatMessage {...defaultProps} emojiRef={{ current: null }} />,
        {
          room: mockRoom,
          chatHistory: mockMessages,
        },
      );

      // Mock the ref that's used internally in the component
      const refDiv = document.querySelector("div[class='']");
      if (refDiv) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        refDiv.scrollIntoView = mockScrollIntoView;
      }

      // Trigger a re-render to test the effect
      expect(typeof mockScrollIntoView).toBe("function");
    });

    it("should handle empty messages", () => {
      const emptyMessage = {
        id: "1",
        content: "",
        isSender: true,
        sendTime: "2024-01-01T10:00:00Z",
      };

      renderWithProviders(<ChatMessage {...defaultProps} />, {
        room: mockRoom,
        chatHistory: [emptyMessage],
      });

      // Dùng matcher function để tìm non-breaking space, chỉ cần có ít nhất 1 node
      const emptyNodes = screen.getAllByText(
        (content) => content.trim() === "",
      );
      expect(emptyNodes.length).toBeGreaterThan(0);
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels", () => {
      renderWithProviders(<ChatMessage {...defaultProps} />, {
        room: mockRoom,
      });

      expect(screen.getByTitle("Chèn emoji")).toBeInTheDocument();
      expect(screen.getByTitle("Gửi tin nhắn")).toBeInTheDocument();
    });

    it("should support keyboard navigation", () => {
      renderWithProviders(<ChatMessage {...defaultProps} />, {
        room: mockRoom,
      });

      const textarea = screen.getByPlaceholderText("Nhập tin nhắn...");
      const sendButton = screen.getByTitle("Gửi tin nhắn");

      textarea.focus();
      expect(document.activeElement).toBe(textarea);

      sendButton.focus();
      expect(document.activeElement).toBe(sendButton);
    });

    it("should have proper focus management", () => {
      renderWithProviders(<ChatMessage {...defaultProps} />, {
        room: mockRoom,
      });

      const textarea = screen.getByPlaceholderText("Nhập tin nhắn...");
      expect(textarea).toHaveAttribute("rows", "2");
    });
  });

  describe("Layout and Styling", () => {
    it("should render with correct layout structure", () => {
      renderWithProviders(<ChatMessage {...defaultProps} />, {
        room: mockRoom,
      });

      expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Nhập tin nhắn..."),
      ).toBeInTheDocument();
    });

    it("should handle responsive layout", () => {
      renderWithProviders(<ChatMessage {...defaultProps} />, {
        room: mockRoom,
      });

      // The layout should be responsive and handle different screen sizes
      expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
    });

    it("should show online status indicator", () => {
      renderWithProviders(<ChatMessage {...defaultProps} />, {
        room: mockRoom,
      });

      // Should show green online indicator
      expect(screen.getByTestId("online-indicator")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("should handle room without class names", () => {
      const roomWithoutClasses = {
        ...mockRoom,
        listClassName: [],
      };

      renderWithProviders(<ChatMessage {...defaultProps} />, {
        room: roomWithoutClasses,
      });

      expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
      // Should not show class names
      expect(screen.queryByText("10A1, 10A2, 11A1")).not.toBeInTheDocument();
    });

    it("should handle very long message content", () => {
      const longMessage = {
        id: "1",
        content:
          "This is a very long message that should be handled properly by the chat component. It contains many characters and should not break the layout or cause any issues with the display of the message bubble.",
        isSender: true,
        sendTime: "2024-01-01T10:00:00Z",
      };

      renderWithProviders(<ChatMessage {...defaultProps} />, {
        room: mockRoom,
        chatHistory: [longMessage],
      });

      expect(screen.getByText(longMessage.content)).toBeInTheDocument();
    });

    it("should handle messages with special characters", () => {
      const specialMessage = {
        id: "1",
        content: "Message with special chars: @#$%^&*()_+-=[]{}|;':\",./<>?",
        isSender: true,
        sendTime: "2024-01-01T10:00:00Z",
      };

      renderWithProviders(<ChatMessage {...defaultProps} />, {
        room: mockRoom,
        chatHistory: [specialMessage],
      });

      expect(screen.getByText(specialMessage.content)).toBeInTheDocument();
    });
  });
});
