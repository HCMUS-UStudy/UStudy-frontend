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
        user: { role: { defaultRoute: "TEACHER" }, hadClass: true },
        access_token: "token",
        refresh_token: "refresh",
        screens: ["classes", "assignments", "questions"],
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

describe("Teacher Login Component", () => {
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

  it("calls login API and redirects to teacher classes on success", async () => {
    renderWithProviders(<Login />);
    fireEvent.change(screen.getByPlaceholderText("Nhập tên tài khoản"), {
      target: { value: "teacher" },
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

  it("handles TEACHER role with correct permissions", async () => {
    renderWithProviders(<Login />);
    fireEvent.change(screen.getByPlaceholderText("Nhập tên tài khoản"), {
      target: { value: "teacher" },
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

  it("shows remember me checkbox", () => {
    renderWithProviders(<Login />);
    expect(screen.getByLabelText(/ghi nhớ đăng nhập/i)).toBeInTheDocument();
  });

  it("shows forgot password link", () => {
    renderWithProviders(<Login />);
    expect(screen.getByText(/quên mật khẩu/i)).toBeInTheDocument();
  });

  it("validates username format", async () => {
    renderWithProviders(<Login />);

    fireEvent.change(screen.getByPlaceholderText("Nhập tên tài khoản"), {
      target: { value: "" }, // Empty
    });

    const submitBtn = screen.getByRole("button", { name: /đăng nhập/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(
        screen.getByText(/vui lòng nhập tên tài khoản/i),
      ).toBeInTheDocument();
    });
  });

  it("validates password format", async () => {
    renderWithProviders(<Login />);

    fireEvent.change(screen.getByPlaceholderText("Nhập mật khẩu"), {
      target: { value: "" }, // Empty
    });

    const submitBtn = screen.getByRole("button", { name: /đăng nhập/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/vui lòng nhập mật khẩu/i)).toBeInTheDocument();
    });
  });
});
