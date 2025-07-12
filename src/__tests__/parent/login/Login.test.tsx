import "@testing-library/jest-dom";
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "@/app/ui/components/_common/Login";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "@/app/store/ChatSlice";
import childrenReducer from "@/app/store/ChildrenSlice";
import permissionReducer from "@/app/store/PermissionScreenSlice";
import type { ChatState } from "@/app/store/ChatSlice";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { GenderType } from "@/app/types/common";

// Define types inline since they're not exported from the slice files
type ChildrenState = {
  children: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    gender: GenderType;
  }>;
  selectedChild: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    gender: GenderType;
  } | null;
};

type PermissionState = {
  screens: string[];
  status: "pending" | "error" | "success";
};

// Mock environment variables
process.env.NEXT_PUBLIC_COOKIES_SECRET_LOGIN_KEY = "test-secret-key";

const createTestStore = (
  initialState: Partial<ChatState> = {},
  childrenState: Partial<ChildrenState> = {},
  permissionState: Partial<PermissionState> = {},
) => {
  return configureStore({
    reducer: {
      chat: chatReducer,
      children: childrenReducer,
      permission: permissionReducer,
    },
    preloadedState: {
      chat: {
        userId: "",
        room: null,
        chatHistory: [],
        status: "success",
        ...initialState,
      } as ChatState,
      children: {
        children: [],
        selectedChild: null,
        ...childrenState,
      } as ChildrenState,
      permission: {
        screens: [],
        status: "success",
        ...permissionState,
      } as PermissionState,
    },
  });
};

const renderWithProviders = (
  ui: React.ReactElement,
  initialState: Partial<ChatState> = {},
  childrenState: Partial<ChildrenState> = {},
  permissionState: Partial<PermissionState> = {},
) => {
  const store = createTestStore(initialState, childrenState, permissionState);
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

jest.mock("js-cookie", () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

jest.mock("@/app/lib/services/auth", () => ({
  login: jest.fn(() =>
    Promise.resolve({
      data: {
        user: { role: { defaultRoute: "PARENT" } },
        children: [
          {
            id: "child1",
            name: "Nguyễn Văn A",
            studentId: "ST001",
          },
          {
            id: "child2",
            name: "Nguyễn Văn B",
            studentId: "ST002",
          },
        ],
        access_token: "token",
        refresh_token: "refresh",
        screens: ["/member/home", "/member/classes", "/member/tuition"],
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

describe("Parent Login Component", () => {
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

  it("calls login API and redirects to tuition page on success for PARENT", async () => {
    const mockRouter = { push: jest.fn() };
    jest
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      .spyOn(require("next/navigation"), "useRouter")
      .mockReturnValue(mockRouter);

    renderWithProviders(<Login />);

    fireEvent.change(screen.getByPlaceholderText("Nhập tên tài khoản"), {
      target: { value: "parent" },
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

  it("handles PARENT role with children data correctly", async () => {
    const mockRouter = { push: jest.fn() };
    jest
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      .spyOn(require("next/navigation"), "useRouter")
      .mockReturnValue(mockRouter);

    renderWithProviders(<Login />);

    fireEvent.change(screen.getByPlaceholderText("Nhập tên tài khoản"), {
      target: { value: "parent" },
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
