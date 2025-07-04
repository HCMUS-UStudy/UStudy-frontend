import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import AdminLogin from "@/app/(admin)/admin/login/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import permissionScreenReducer from "@/app/store/PermissionScreenSlice";
import childrenReducer from "@/app/store/ChildrenSlice";
import * as authService from "@/app/lib/services/auth";
import * as actionService from "@/app/lib/action";
import * as cookieService from "js-cookie";
import { TextEncoder, TextDecoder } from "util";

// Fix for TextEncoder/TextDecoder in Node.js test environment
if (typeof global.TextEncoder === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  global.TextEncoder = TextEncoder as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  global.TextDecoder = TextDecoder as any;
}

// Mock TextEncoder and TextDecoder for Node.js environment
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.TextEncoder = TextEncoder as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
global.TextDecoder = TextDecoder as any;

// Mock next/navigation
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
};

jest.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => "/admin/login",
}));

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Define addToast mock at the top
const addToast = {
  success: jest.fn(),
  error: jest.fn(),
  warning: jest.fn(),
  info: jest.fn(),
};

// Mock useCustomToast to always return the same addToast instance
jest.mock("@/app/lib/hooks/useToast", () => ({
  useCustomToast: () => ({
    addToast,
  }),
}));

// Mock js-cookie
jest.mock("js-cookie", () => ({
  get: jest.fn(),
  set: jest.fn(),
  remove: jest.fn(),
}));

// Mock the auth service
jest.mock("@/app/lib/services/auth", () => ({
  login: jest.fn(),
}));

// Mock the action for setting cookies
jest.mock("@/app/lib/action", () => ({
  setTokensAndUserDataCookies: jest.fn(),
}));

// Mock crypto for encryption/decryption
Object.defineProperty(window, "crypto", {
  value: {
    getRandomValues: jest.fn(() => new Uint8Array(12)),
    subtle: {
      importKey: jest.fn(),
      encrypt: jest.fn(),
      decrypt: jest.fn(),
    },
  },
});

// Mock environment variables
process.env.NEXT_PUBLIC_COOKIES_SECRET_LOGIN_KEY = "test-secret-key";

// Create a test store
const createTestStore = () => {
  return configureStore({
    reducer: {
      permissionScreen: permissionScreenReducer,
      children: childrenReducer,
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
      mutations: {
        retry: false,
      },
    },
  });
};

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const store = createTestStore();
  const queryClient = createTestQueryClient();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
};

describe("Admin Login Page", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockLogin: jest.MockedFunction<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockSetTokensAndUserDataCookies: jest.MockedFunction<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let mockCookies: any;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Get mocked functions
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockLogin = authService.login as jest.MockedFunction<any>;
    mockSetTokensAndUserDataCookies =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      actionService.setTokensAndUserDataCookies as jest.MockedFunction<any>;
    mockCookies = cookieService;

    // Reset router mock
    mockRouter.push.mockClear();
    mockRouter.replace.mockClear();
  });

  const renderAdminLogin = () => {
    return render(
      <TestWrapper>
        <AdminLogin />
      </TestWrapper>,
    );
  };

  describe("Component Rendering", () => {
    it("renders admin login page with correct title", () => {
      renderAdminLogin();

      // Use getAllByText since there might be multiple elements with "Đăng nhập"
      const loginElements = screen.getAllByText("Đăng nhập");
      expect(loginElements.length).toBeGreaterThan(0);
      expect(
        screen.getByText("Chào mừng đến với trang quản lý hệ thống"),
      ).toBeInTheDocument();
    });

    it("renders all form elements", () => {
      renderAdminLogin();

      expect(
        screen.getByPlaceholderText("Nhập tên tài khoản"),
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Nhập mật khẩu")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Đăng nhập" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("checkbox", { name: /ghi nhớ đăng nhập/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Quên mật khẩu?" }),
      ).toBeInTheDocument();
    });

    it("renders logo and background images", () => {
      renderAdminLogin();

      const logo = screen.getByAltText("Logo");
      const intersectImages = screen.getAllByAltText("Intersect");

      expect(logo).toBeInTheDocument();
      expect(intersectImages).toHaveLength(5);
    });
  });

  describe("Form Validation", () => {
    it("shows validation error when username is empty", async () => {
      const user = userEvent.setup();
      renderAdminLogin();

      const submitButton = screen.getByRole("button", { name: "Đăng nhập" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Vui lòng nhập tên tài khoản"),
        ).toBeInTheDocument();
      });
    });

    it("shows validation error when password is empty", async () => {
      const user = userEvent.setup();
      renderAdminLogin();

      const usernameInput = screen.getByPlaceholderText("Nhập tên tài khoản");
      const submitButton = screen.getByRole("button", { name: "Đăng nhập" });

      await user.type(usernameInput, "admin");
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText("Vui lòng nhập mật khẩu")).toBeInTheDocument();
      });
    });

    it("shows validation errors when both fields are empty", async () => {
      const user = userEvent.setup();
      renderAdminLogin();

      const submitButton = screen.getByRole("button", { name: "Đăng nhập" });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Vui lòng nhập tên tài khoản"),
        ).toBeInTheDocument();
        expect(screen.getByText("Vui lòng nhập mật khẩu")).toBeInTheDocument();
      });
    });

    it("clears validation errors when user starts typing", async () => {
      const user = userEvent.setup();
      renderAdminLogin();

      const usernameInput = screen.getByPlaceholderText("Nhập tên tài khoản");
      const passwordInput = screen.getByPlaceholderText("Nhập mật khẩu");
      const submitButton = screen.getByRole("button", { name: "Đăng nhập" });

      // Submit empty form to trigger errors
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText("Vui lòng nhập tên tài khoản"),
        ).toBeInTheDocument();
        expect(screen.getByText("Vui lòng nhập mật khẩu")).toBeInTheDocument();
      });

      // Start typing to clear errors
      await user.type(usernameInput, "a");
      await user.type(passwordInput, "p");

      await waitFor(() => {
        expect(
          screen.queryByText("Vui lòng nhập tên tài khoản"),
        ).not.toBeInTheDocument();
        expect(
          screen.queryByText("Vui lòng nhập mật khẩu"),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe("Login API Integration", () => {
    it("calls login API with correct parameters when form is submitted", async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValue({
        data: {
          user: {
            role: { defaultRoute: "ADMIN" },
            hadClass: false,
          },
          screens: ["dashboard"],
          access_token: "access-token",
          refresh_token: "refresh-token",
          children: null,
        },
      });

      renderAdminLogin();

      const usernameInput = screen.getByPlaceholderText("Nhập tên tài khoản");
      const passwordInput = screen.getByPlaceholderText("Nhập mật khẩu");
      const submitButton = screen.getByRole("button", { name: "Đăng nhập" });

      await user.type(usernameInput, "admin");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith("admin", "password123", false);
      });
    });

    it("handles successful admin login and redirects to dashboard", async () => {
      const user = userEvent.setup();
      const mockResponse = {
        data: {
          user: {
            role: { defaultRoute: "ADMIN" },
            hadClass: false,
          },
          screens: ["dashboard", "accounts"],
          access_token: "access-token",
          refresh_token: "refresh-token",
          children: null,
        },
      };

      mockLogin.mockResolvedValue(mockResponse);

      renderAdminLogin();

      const usernameInput = screen.getByPlaceholderText("Nhập tên tài khoản");
      const passwordInput = screen.getByPlaceholderText("Nhập mật khẩu");
      const submitButton = screen.getByRole("button", { name: "Đăng nhập" });

      await user.type(usernameInput, "admin");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockSetTokensAndUserDataCookies).toHaveBeenCalledWith(
          "access-token",
          "refresh-token",
          expect.any(String),
          expect.any(String),
        );
        expect(addToast.success).toHaveBeenCalledWith("Đăng nhập thành công");
        expect(mockRouter.push).toHaveBeenCalledWith("/admin/dashboard");
      });
    });

    it("handles successful teacher login and redirects to teacher classes", async () => {
      const user = userEvent.setup();
      const mockResponse = {
        data: {
          user: {
            role: { defaultRoute: "TEACHER" },
            hadClass: false,
          },
          screens: ["classes"],
          access_token: "access-token",
          refresh_token: "refresh-token",
          children: null,
        },
      };

      mockLogin.mockResolvedValue(mockResponse);

      renderAdminLogin();

      const usernameInput = screen.getByPlaceholderText("Nhập tên tài khoản");
      const passwordInput = screen.getByPlaceholderText("Nhập mật khẩu");
      const submitButton = screen.getByRole("button", { name: "Đăng nhập" });

      await user.type(usernameInput, "teacher");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith("/teacher/classes");
      });
    });

    it("handles successful student login with class and redirects to home", async () => {
      const user = userEvent.setup();
      const mockResponse = {
        data: {
          user: {
            role: { defaultRoute: "STUDENT" },
            hadClass: true,
          },
          screens: ["home"],
          access_token: "access-token",
          refresh_token: "refresh-token",
          children: null,
        },
      };

      mockLogin.mockResolvedValue(mockResponse);

      renderAdminLogin();

      const usernameInput = screen.getByPlaceholderText("Nhập tên tài khoản");
      const passwordInput = screen.getByPlaceholderText("Nhập mật khẩu");
      const submitButton = screen.getByRole("button", { name: "Đăng nhập" });

      await user.type(usernameInput, "student");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith("/member/home");
      });
    });

    it("handles successful student login without class and redirects to class register", async () => {
      const user = userEvent.setup();
      const mockResponse = {
        data: {
          user: {
            role: { defaultRoute: "STUDENT" },
            hadClass: false,
          },
          screens: ["class-register"],
          access_token: "access-token",
          refresh_token: "refresh-token",
          children: null,
        },
      };

      mockLogin.mockResolvedValue(mockResponse);

      renderAdminLogin();

      const usernameInput = screen.getByPlaceholderText("Nhập tên tài khoản");
      const passwordInput = screen.getByPlaceholderText("Nhập mật khẩu");
      const submitButton = screen.getByRole("button", { name: "Đăng nhập" });

      await user.type(usernameInput, "student");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith("/member/class-register");
      });
    });

    it("handles successful parent login and redirects to tuition", async () => {
      const user = userEvent.setup();
      const mockResponse = {
        data: {
          user: {
            role: { defaultRoute: "PARENT" },
            hadClass: false,
          },
          screens: ["tuition"],
          access_token: "access-token",
          refresh_token: "refresh-token",
          children: [{ id: "1", name: "Child 1" }],
        },
      };

      mockLogin.mockResolvedValue(mockResponse);

      renderAdminLogin();

      const usernameInput = screen.getByPlaceholderText("Nhập tên tài khoản");
      const passwordInput = screen.getByPlaceholderText("Nhập mật khẩu");
      const submitButton = screen.getByRole("button", { name: "Đăng nhập" });

      await user.type(usernameInput, "parent");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith("/member/tuition");
      });
    });
  });

  describe("Error Handling", () => {
    it("displays error message when login fails", async () => {
      const user = userEvent.setup();
      const errorMessage = "Tên đăng nhập hoặc mật khẩu không đúng";

      mockLogin.mockRejectedValue({
        data: errorMessage,
      });

      renderAdminLogin();

      const usernameInput = screen.getByPlaceholderText("Nhập tên tài khoản");
      const passwordInput = screen.getByPlaceholderText("Nhập mật khẩu");
      const submitButton = screen.getByRole("button", { name: "Đăng nhập" });

      await user.type(usernameInput, "wronguser");
      await user.type(passwordInput, "wrongpass");
      await user.click(submitButton);

      await waitFor(() => {
        // Use getAllByText since there are multiple error messages
        const errorMessages = screen.getAllByText(errorMessage);
        expect(errorMessages.length).toBeGreaterThan(0);
      });
    });

    it("displays error message in both username and password fields on login failure", async () => {
      const user = userEvent.setup();
      const errorMessage = "Thông tin đăng nhập không hợp lệ";

      mockLogin.mockRejectedValue({
        data: errorMessage,
      });

      renderAdminLogin();

      const usernameInput = screen.getByPlaceholderText("Nhập tên tài khoản");
      const passwordInput = screen.getByPlaceholderText("Nhập mật khẩu");
      const submitButton = screen.getByRole("button", { name: "Đăng nhập" });

      await user.type(usernameInput, "wronguser");
      await user.type(passwordInput, "wrongpass");
      await user.click(submitButton);

      await waitFor(() => {
        const errorMessages = screen.getAllByText(errorMessage);
        expect(errorMessages).toHaveLength(2);
      });
    });

    it("handles network error gracefully", async () => {
      const user = userEvent.setup();
      renderAdminLogin();
      // Mock network error
      (mockLogin as jest.Mock).mockRejectedValue(new Error("Network error"));
      const usernameInput = screen.getByPlaceholderText("Nhập tên tài khoản");
      const passwordInput = screen.getByPlaceholderText("Nhập mật khẩu");
      const submitButton = screen.getByRole("button", { name: /đăng nhập/i });
      await user.type(usernameInput, "testuser");
      await user.type(passwordInput, "testpass");
      await user.click(submitButton);
      // Wait for error to be displayed
      await waitFor(() => {
        // Check for error border on input fields
        const errorBorders = document.querySelectorAll(".border-error");
        expect(errorBorders.length).toBeGreaterThan(0);
      });
    });
  });

  describe("Remember Me Functionality", () => {
    it("saves login credentials when remember me is checked", async () => {
      // Reset and mock cookies.set
      mockCookies.set.mockClear();
      // Mock btoa, atob, and encrypt to return valid base64
      window.btoa = jest.fn(() => "ZW5jcnlwdGVk"); // 'encrypted' in base64
      window.atob = jest.fn(() => "decrypted");
      window.crypto.subtle.encrypt = jest
        .fn()
        .mockResolvedValue(new Uint8Array([1, 2, 3, 4]).buffer);
      const user = userEvent.setup();
      // Mock successful login
      (mockLogin as jest.Mock).mockResolvedValue({
        data: {
          user: { id: 1, username: "testuser", role: "admin" },
          token: "test-token",
        },
      });
      renderAdminLogin();
      const usernameInput = screen.getByPlaceholderText("Nhập tên tài khoản");
      const passwordInput = screen.getByPlaceholderText("Nhập mật khẩu");
      const rememberMeCheckbox = screen.getByRole("checkbox", {
        name: /ghi nhớ đăng nhập/i,
      });
      const submitButton = screen.getByRole("button", { name: /đăng nhập/i });
      await user.type(usernameInput, "testuser");
      await user.type(passwordInput, "testpass");
      await user.click(rememberMeCheckbox);
      await user.click(submitButton);
      await waitFor(() => {
        expect(mockCookies.set).toHaveBeenCalledWith(
          "admin_rememberedLogin",
          expect.any(String),
          expect.objectContaining({
            expires: 3,
            sameSite: "strict",
            secure: true,
          }),
        );
      });
    });

    it("does not save credentials when remember me is unchecked", async () => {
      const user = userEvent.setup();
      const mockResponse = {
        data: {
          user: {
            role: { defaultRoute: "ADMIN" },
            hadClass: false,
          },
          screens: ["dashboard"],
          access_token: "access-token",
          refresh_token: "refresh-token",
          children: null,
        },
      };

      mockLogin.mockResolvedValue(mockResponse);
      renderAdminLogin();

      const usernameInput = screen.getByPlaceholderText("Nhập tên tài khoản");
      const passwordInput = screen.getByPlaceholderText("Nhập mật khẩu");
      const submitButton = screen.getByRole("button", { name: "Đăng nhập" });

      await user.type(usernameInput, "admin");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockCookies.remove).toHaveBeenCalledWith(
          "admin_rememberedLogin",
        );
        expect(mockCookies.remove).toHaveBeenCalledWith(
          "admin_rememberedLogin_iv",
        );
      });
    });

    it("loads saved credentials on component mount", async () => {
      const savedCredentials = {
        username: "savedadmin",
        password: "savedpass",
      };

      mockCookies.get
        .mockReturnValueOnce("encrypted-data") // admin_rememberedLogin
        .mockReturnValueOnce("encrypted-iv"); // admin_rememberedLogin_iv
      // Mock atob and decrypt
      window.atob = jest.fn(() => "abcd");
      window.crypto.subtle.importKey = jest.fn().mockResolvedValue("key");
      window.crypto.subtle.decrypt = jest
        .fn()
        .mockResolvedValue(
          new Uint8Array([
            123, 34, 117, 115, 101, 114, 110, 97, 109, 101, 34, 58, 34, 115, 97,
            118, 101, 100, 97, 100, 109, 105, 110, 34, 44, 34, 112, 97, 115,
            115, 119, 111, 114, 100, 34, 58, 34, 115, 97, 118, 101, 100, 112,
            97, 115, 115, 34, 125,
          ]).buffer,
        ); // JSON: {"username":"savedadmin","password":"savedpass"}
      window.TextDecoder = function () {
        return { decode: () => JSON.stringify(savedCredentials) };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;
      renderAdminLogin();
      await waitFor(() => {
        const usernameInput = screen.getByPlaceholderText(
          "Nhập tên tài khoản",
        ) as HTMLInputElement;
        const passwordInput = screen.getByPlaceholderText(
          "Nhập mật khẩu",
        ) as HTMLInputElement;
        const rememberMeCheckbox = screen.getByRole("checkbox", {
          name: /ghi nhớ đăng nhập/i,
        }) as HTMLInputElement;
        expect(usernameInput.value).toBe("savedadmin");
        expect(passwordInput.value).toBe("savedpass");
        expect(rememberMeCheckbox.checked).toBe(true);
      });
    });

    it("clears invalid saved credentials on component mount", async () => {
      mockCookies.get
        .mockReturnValueOnce("invalid-data") // admin_rememberedLogin
        .mockReturnValueOnce("invalid-iv"); // admin_rememberedLogin_iv
      // Mock crypto functions to throw error
      window.atob = jest.fn(() => "abcd");
      window.crypto.subtle.importKey = jest.fn().mockResolvedValue("key");
      window.crypto.subtle.decrypt = jest
        .fn()
        .mockRejectedValue(new Error("Decryption failed"));
      renderAdminLogin();
      await waitFor(() => {
        expect(mockCookies.remove).toHaveBeenCalledWith(
          "admin_rememberedLogin",
        );
        expect(mockCookies.remove).toHaveBeenCalledWith(
          "admin_rememberedLogin_iv",
        );
      });
    });
  });

  describe("Forgot Password Navigation", () => {
    it("navigates to admin forgot password page when forgot password is clicked", async () => {
      const user = userEvent.setup();
      renderAdminLogin();

      const forgotPasswordButton = screen.getByRole("button", {
        name: "Quên mật khẩu?",
      });
      await user.click(forgotPasswordButton);

      expect(mockRouter.push).toHaveBeenCalledWith("/admin/forgot-password");
    });

    it("shows loading state when forgot password button is clicked", async () => {
      const user = userEvent.setup();
      renderAdminLogin();

      const forgotPasswordButton = screen.getByRole("button", {
        name: "Quên mật khẩu?",
      });
      await user.click(forgotPasswordButton);

      // The button should be disabled during loading
      expect(forgotPasswordButton).toBeDisabled();
    });
  });

  describe("Loading States", () => {
    it("shows loading state during login submission", async () => {
      const user = userEvent.setup();

      // Mock a delayed response
      mockLogin.mockImplementation(
        () => new Promise((resolve) => setTimeout(resolve, 100)),
      );

      renderAdminLogin();

      const usernameInput = screen.getByPlaceholderText("Nhập tên tài khoản");
      const passwordInput = screen.getByPlaceholderText("Nhập mật khẩu");
      const submitButton = screen.getByRole("button", { name: "Đăng nhập" });

      await user.type(usernameInput, "admin");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      // Check if button shows loading state (might not be disabled but should show loading)
      expect(submitButton).toHaveClass("cursor-progress");
    });

    it("enables submit button after login completes", async () => {
      const user = userEvent.setup();
      const mockResponse = {
        data: {
          user: {
            role: { defaultRoute: "ADMIN" },
            hadClass: false,
          },
          screens: ["dashboard"],
          access_token: "access-token",
          refresh_token: "refresh-token",
          children: null,
        },
      };

      mockLogin.mockResolvedValue(mockResponse);

      renderAdminLogin();

      const usernameInput = screen.getByPlaceholderText("Nhập tên tài khoản");
      const passwordInput = screen.getByPlaceholderText("Nhập mật khẩu");
      const submitButton = screen.getByRole("button", { name: "Đăng nhập" });

      await user.type(usernameInput, "admin");
      await user.type(passwordInput, "password123");
      await user.click(submitButton);

      await waitFor(() => {
        expect(submitButton).not.toHaveClass("cursor-progress");
      });
    });
  });

  describe("Form Accessibility", () => {
    it("has proper form labels and associations", () => {
      renderAdminLogin();

      const usernameInput = screen.getByPlaceholderText("Nhập tên tài khoản");
      const passwordInput = screen.getByPlaceholderText("Nhập mật khẩu");
      const rememberMeCheckbox = screen.getByRole("checkbox", {
        name: /ghi nhớ đăng nhập/i,
      });

      expect(usernameInput).toHaveAttribute("type", "text");
      expect(passwordInput).toHaveAttribute("type", "password");
      expect(rememberMeCheckbox).toBeInTheDocument();
    });

    it("supports keyboard navigation", async () => {
      const user = userEvent.setup();
      renderAdminLogin();
      const usernameInput = screen.getByPlaceholderText("Nhập tên tài khoản");
      const passwordInput = screen.getByPlaceholderText("Nhập mật khẩu");
      // Select the eye button by DOM traversal
      const passwordInputDiv = passwordInput.closest(".relative");
      const eyeButton = passwordInputDiv
        ? passwordInputDiv.querySelector('button[type="button"]')
        : null;
      const rememberMeCheckbox = screen.getByRole("checkbox", {
        name: /ghi nhớ đăng nhập/i,
      });
      const forgotPasswordButton = screen.getByRole("button", {
        name: /quên mật khẩu/i,
      });
      const submitButton = screen.getByRole("button", { name: /đăng nhập/i });
      // Start with username input
      usernameInput.focus();
      expect(usernameInput).toHaveFocus();
      await user.tab(); // password
      expect(passwordInput).toHaveFocus();
      await user.tab(); // eye button
      expect(document.activeElement).toBe(eyeButton);
      await user.tab(); // checkbox
      expect(rememberMeCheckbox).toHaveFocus();
      await user.tab(); // forgot password
      expect(forgotPasswordButton).toHaveFocus();
      await user.tab(); // submit
      expect(submitButton).toHaveFocus();
    });

    it("submits form when Enter key is pressed", async () => {
      const user = userEvent.setup();
      mockLogin.mockResolvedValue({
        data: {
          user: {
            role: { defaultRoute: "ADMIN" },
            hadClass: false,
          },
          screens: ["dashboard"],
          access_token: "access-token",
          refresh_token: "refresh-token",
          children: null,
        },
      });

      renderAdminLogin();

      const usernameInput = screen.getByPlaceholderText("Nhập tên tài khoản");
      const passwordInput = screen.getByPlaceholderText("Nhập mật khẩu");

      await user.type(usernameInput, "admin");
      await user.type(passwordInput, "password123");
      await user.keyboard("{Enter}");

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith("admin", "password123", false);
      });
    });
  });
});
