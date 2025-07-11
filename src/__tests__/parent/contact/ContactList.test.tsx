import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ContactList } from "@/app/ui/components/contact/ContactList";
import "@testing-library/jest-dom";
jest.mock("@tanstack/react-query", () => {
  const actual = jest.requireActual("@tanstack/react-query");
  return {
    ...actual,
    useQuery: () => ({
      data: {
        content: [
          {
            id: 1,
            user: { avatar: "/avatar.png", name: "GV A" },
            roomChatId: "room1",
          },
          {
            id: 2,
            user: { avatar: "/avatar2.png", name: "GV B" },
            roomChatId: "room2",
          },
        ],
      },
      status: "success",
    }),
  };
});
const mockReducer = (state = { chat: { room: null } }) => state;
const store = configureStore({ reducer: mockReducer });
const queryClient = new QueryClient();
describe("ContactList", () => {
  it("renders teacher buttons and names", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <ContactList searchQuery="" />
        </Provider>
      </QueryClientProvider>,
    );
    // Kiểm tra có 2 nút chọn giáo vụ
    expect(screen.getAllByRole("button").length).toBeGreaterThanOrEqual(2);
    // Kiểm tra tên giáo vụ
    expect(screen.getByText("GV A")).toBeInTheDocument();
    expect(screen.getByText("GV B")).toBeInTheDocument();
  });
});
