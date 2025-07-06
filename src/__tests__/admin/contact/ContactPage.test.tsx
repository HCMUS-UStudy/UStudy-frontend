import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AdminContact from "@/app/(admin)/admin/contact/page";

// Mock các component con và hook liên quan
jest.mock("@/app/ui/components/contact/ContactList", () => ({
  ContactList: () => <div data-testid="contact-list">ContactList</div>,
}));
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
      <button data-testid="send-btn" onClick={handleSendMessage}>
        Send
      </button>
      <button data-testid="open-list" onClick={openList}>
        OpenList
      </button>
    </div>
  ),
}));
jest.mock("@/app/ui/components/_common/Dialog", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Dialog: ({ isOpen, onClose, children }: any) =>
    isOpen ? (
      <div data-testid="dialog">
        {children}
        <button data-testid="close-dialog" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
}));
jest.mock("@/app/hooks/use-web-socket", () => ({
  useWebSocketService: () => ({
    connect: jest.fn(),
    subscribe: jest.fn(),
    send: jest.fn(),
    unsubscribe: jest.fn(),
    disconnect: jest.fn(),
  }),
}));
jest.mock("@/app/store/store", () => ({
  useAppDispatch: () => jest.fn(),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useAppSelector: (fn: any) =>
    fn({
      chat: {
        room: { roomChatId: "room1", user: { id: "user2" } },
        userId: "user1",
      },
    }),
}));
jest.mock("@/app/store/ChatSlice", () => ({ addMessage: jest.fn() }));

describe("AdminContact page", () => {
  it("renders ContactList and ChatMessage", () => {
    render(<AdminContact />);
    expect(screen.getByTestId("contact-list")).toBeInTheDocument();
    expect(screen.getByTestId("chat-message")).toBeInTheDocument();
  });

  it("can type and send a message", () => {
    render(<AdminContact />);
    const input = screen.getByTestId("message-input");
    fireEvent.change(input, { target: { value: "hello" } });
    expect(input).toHaveValue("hello");
    const sendBtn = screen.getByTestId("send-btn");
    fireEvent.click(sendBtn);
    // Không expect side effect vì send đã mock, chỉ kiểm tra không lỗi
  });

  it("can open and close contact list dialog (mobile)", () => {
    render(<AdminContact />);
    const openBtn = screen.getByTestId("open-list");
    fireEvent.click(openBtn);
    expect(screen.getByTestId("dialog")).toBeInTheDocument();
    const closeBtn = screen.getByTestId("close-dialog");
    fireEvent.click(closeBtn);
    expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
  });
});
