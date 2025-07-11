import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { ChatMessage } from "@/app/ui/components/contact/ChatMessage";
import "@testing-library/jest-dom";
const div = document.createElement("div");
div.scrollIntoView = jest.fn();
jest.spyOn(React, "useRef").mockReturnValue({ current: div });
beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});
const mockReducer = (
  state = { chat: { chatHistory: [], status: "idle", room: { id: 1 } } },
) => state;
const store = configureStore({ reducer: mockReducer });
describe("ChatMessage", () => {
  it("renders input and send button", () => {
    render(
      <Provider store={store}>
        <ChatMessage
          messageInput=""
          setMessageInput={() => {}}
          showEmojiPicker={false}
          setShowEmojiPicker={() => {}}
          emojiRef={{ current: div }}
          handleSendMessage={() => {}}
          openList={() => {}}
        />
      </Provider>,
    );
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getAllByRole("button").length).toBeGreaterThanOrEqual(2);
  });
});
