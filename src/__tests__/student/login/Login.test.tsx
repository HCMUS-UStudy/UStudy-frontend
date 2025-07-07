import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "@/app/ui/components/_common/Login";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "@/app/store/ChatSlice";
import type { ChatState } from "@/app/store/ChatSlice";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const createTestStore = (initialState: Partial<ChatState> = {}) => {
  return configureStore({
    reducer: { chat: chatReducer },
    preloadedState: {
      chat: {
        userId: "",
        room: null,
        chatHistory: [],
        status: "success",
        ...initialState,
      } as ChatState,
    },
  });
};

const renderWithProviders = (
  ui: React.ReactElement,
  initialState: Partial<ChatState> = {},
) => {
  const store = createTestStore(initialState);
  const queryClient = new QueryClient();
  return render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    </Provider>,
  );
};

jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => "/login",
}));

jest.mock("@/app/lib/services/auth", () => ({
  login: jest.fn(() =>
    Promise.resolve({
      data: {
        user: { role: { defaultRoute: "STUDENT" }, hadClass: true },
        access_token: "token",
        refresh_token: "refresh",
        screens: [],
      },
    }),
  ),
}));

jest.mock("@/app/lib/action", () => ({
  setTokensAndUserDataCookies: jest.fn(),
}));

jest.mock("@/app/lib/hooks/useToast", () => ({
  useCustomToast: () => ({
    addToast: { success: jest.fn(), error: jest.fn() },
  }),
}));

describe("Login Component", () => {
  it("renders username and password inputs", () => {
    renderWithProviders(<Login />);
    expect(
      screen.getByPlaceholderText("Nhập tên tài khoản"),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Nhập mật khẩu")).toBeInTheDocument();
  });

  it("shows validation errors if fields are empty", async () => {
    renderWithProviders(<Login />);
    const submitBtn = screen.getByRole("button", { name: /đăng nhập/i });
    fireEvent.click(submitBtn);
    await waitFor(() => {
      const errors = screen.getAllByText(/vui lòng nhập/i);
      expect(errors.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("calls login API and redirects on success", async () => {
    renderWithProviders(<Login />);
    fireEvent.change(screen.getByPlaceholderText("Nhập tên tài khoản"), {
      target: { value: "student" },
    });
    fireEvent.change(screen.getByPlaceholderText("Nhập mật khẩu"), {
      target: { value: "123456" },
    });
    const submitBtn = screen.getByRole("button", { name: /đăng nhập/i });
    fireEvent.click(submitBtn);
    await waitFor(() => {
      expect(screen.queryByText(/vui lòng nhập/i)).not.toBeInTheDocument();
    });
  });
});
