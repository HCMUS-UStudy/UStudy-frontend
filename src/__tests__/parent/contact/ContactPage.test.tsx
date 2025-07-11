import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { ContactPage } from "@/app/ui/components/contact/ContactPage";
import "@testing-library/jest-dom";
jest.mock("@/app/ui/components/contact/ContactList", () => ({
  ContactList: () => <div>ContactList</div>,
}));
jest.mock("@/app/ui/components/contact/ChatMessage", () => ({
  ChatMessage: () => <div>ChatMessage</div>,
}));
jest.mock("@/app/ui/components/_common/Dialog", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Dialog: (props: any) => (
    <div>
      {props.isOpen ? "DialogOpen" : "DialogClosed"}
      {props.children}
    </div>
  ),
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

const mockReducer = (state = { chat: { room: null, userId: "1" } }) => state;
const store = configureStore({ reducer: mockReducer });

describe("ContactPage", () => {
  it("renders ContactList and ChatMessage", () => {
    render(
      <Provider store={store}>
        <ContactPage />
      </Provider>,
    );
    expect(screen.getAllByText("ContactList").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("ChatMessage")).toBeInTheDocument();
  });
});
