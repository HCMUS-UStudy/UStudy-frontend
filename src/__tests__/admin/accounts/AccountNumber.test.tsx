import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AccountNumber from "@/app/ui/components/admin/accounts/AccountNumber";
import * as userService from "@/app/lib/services/user";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock the user service
jest.mock("@/app/lib/services/user");
const mockedUserService = userService as jest.Mocked<typeof userService>;

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithProviders = (ui: React.ReactElement, client: QueryClient) => {
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>,
  );
};

describe("Admin AccountNumber Component", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    jest.clearAllMocks();
  });

  it("should show loading state initially", () => {
    mockedUserService.getAllAccount.mockReturnValue(new Promise(() => {})); // Never resolves

    renderWithProviders(
      <AccountNumber searchQuery="" roleQuery="All" />,
      queryClient,
    );

    const heading = screen.getByRole("heading");
    expect(heading).toHaveTextContent("Đang tải...");
    expect(heading).toHaveClass("animate-pulse");
  });

  it("should display the total number of users on successful fetch", async () => {
    const mockData = {
      content: new Array(123), // 123 users
      totalPages: 1,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockedUserService.getAllAccount.mockResolvedValue(mockData as any);

    renderWithProviders(
      <AccountNumber searchQuery="" roleQuery="All" />,
      queryClient,
    );

    await waitFor(() => {
      const heading = screen.getByRole("heading");
      expect(heading).toHaveTextContent("Tổng số người dùng (123)");
      expect(heading).not.toHaveClass("animate-pulse");
    });
  });

  it("should display 0 when the fetch is successful but returns no users", async () => {
    const mockData = {
      content: [], // 0 users
      totalPages: 1,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mockedUserService.getAllAccount.mockResolvedValue(mockData as any);

    renderWithProviders(
      <AccountNumber searchQuery="" roleQuery="All" />,
      queryClient,
    );

    await waitFor(() => {
      const heading = screen.getByRole("heading");
      expect(heading).toHaveTextContent("Tổng số người dùng (0)");
    });
  });

  it("should handle fetch error gracefully", async () => {
    // tanstack-query will not set an error state for the component in this case,
    // but the count will not be displayed. It will fall back to placeholder or initial data.
    // Here we check if it remains in a loading-like or empty state.
    mockedUserService.getAllAccount.mockRejectedValue(new Error("API Error"));

    renderWithProviders(
      <AccountNumber searchQuery="" roleQuery="All" />,
      queryClient,
    );

    // After the query fails, it should not display a number.
    // In the current implementation, it shows an empty value inside the parenthesis.
    await waitFor(() => {
      const heading = screen.getByRole("heading");
      expect(heading).toHaveTextContent("Tổng số người dùng ()");
    });
  });
});
