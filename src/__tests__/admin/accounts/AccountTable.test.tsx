import { render, screen, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import AccountTable from "@/app/ui/components/admin/accounts/AccountTable";
import * as userService from "@/app/lib/services/user";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AccountData } from "@/app/types/account";
import { AccountStatus, DefaultRoute, GenderType } from "@/app/types/common";
import userEvent from "@testing-library/user-event";

// Mock the user service
jest.mock("@/app/lib/services/user");
const mockedUserService = userService as jest.Mocked<typeof userService>;

// Mock utils
jest.mock("@/app/lib/utils", () => ({
  ...jest.requireActual("@/app/lib/utils"), // Keep original functions
  accountStatus: {
    ACTIVE: { label: "Hoạt động", color: "text-green-500" },
    INACTIVE: { label: "Không hoạt động", color: "text-red-500" },
    // Add other statuses if necessary
  },
}));

// Mock hooks used by the component
jest.mock("@/app/lib/hooks", () => ({
  useEncodedRoute: () => ({
    handleNavigate: jest.fn(),
  }),
}));

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Turn off retries for testing
      },
    },
  });

const renderWithProviders = (ui: React.ReactElement, client: QueryClient) => {
  return render(
    <QueryClientProvider client={client}>
      {ui}
      <ToastContainer />
    </QueryClientProvider>,
  );
};

const mockSuccessData: AccountData = {
  content: [
    {
      id: "1",
      genId: "USR001",
      name: "Nghia",
      email: "nghia@test.com",
      avatar: "",
      gender: "MALE" as GenderType,
      address: "123 Test St",
      phone: "0123456789",
      birthday: new Date().toISOString(),
      role: {
        id: "1",
        name: "ADMIN",
        defaultRoute: "/admin/dashboard" as DefaultRoute,
      },
      status: "ACTIVE" as AccountStatus,
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      genId: "USR002",
      name: "Test User 2",
      email: "test2@test.com",
      avatar: "",
      gender: "FEMALE" as GenderType,
      address: "456 Test Ave",
      phone: "0987654321",
      birthday: new Date().toISOString(),
      role: {
        id: "2",
        name: "STUDENT",
        defaultRoute: "/member/home" as DefaultRoute,
      },
      status: "INACTIVE" as AccountStatus,
      createdAt: new Date().toISOString(),
    },
  ],
  totalPages: 1,
};

describe("Admin AccountTable Component", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it("TC_ACC_001: should show loading skeleton initially", async () => {
    mockedUserService.getAllAccount.mockReturnValue(new Promise(() => {})); // Never resolves

    const { container } = renderWithProviders(
      <AccountTable searchQuery="" roleQuery="All" />,
      queryClient,
    );

    // The loading state is a skeleton. We check for the presence of one of the skeleton rows.
    // The tbody has 'animate-pulse' and the cells contain divs with 'bg-slate-200'
    const tableBody = container.querySelector("tbody");
    expect(tableBody).toHaveClass("animate-pulse");
    const skeletonCells = await screen.findAllByRole("cell");
    expect(skeletonCells[0].querySelector(".bg-slate-200")).toBeInTheDocument();
  });

  it("TC_ACC_002: should display data correctly on successful fetch", async () => {
    mockedUserService.getAllAccount.mockResolvedValue(mockSuccessData);

    const { container } = renderWithProviders(
      <AccountTable searchQuery="" roleQuery="All" />,
      queryClient,
    );

    // Wait for the data to be loaded and displayed
    await waitFor(() => {
      expect(screen.getByText("Nghia")).toBeInTheDocument();
    });

    expect(screen.getByText("nghia@test.com")).toBeInTheDocument();
    expect(screen.getByText("ADMIN")).toBeInTheDocument();
    // Check for the status label which is now available from our mock
    expect(screen.getByText("Hoạt động")).toBeInTheDocument();
    expect(screen.getByText("Test User 2")).toBeInTheDocument();
    const tableBody = container.querySelector("tbody");
    expect(tableBody).not.toHaveClass("animate-pulse");
    expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
  });

  it("TC_ACC_003: should display an error message when fetch fails", async () => {
    const errorMessage = "Failed to fetch accounts";
    mockedUserService.getAllAccount.mockRejectedValue(new Error(errorMessage));

    renderWithProviders(
      <AccountTable searchQuery="" roleQuery="All" />,
      queryClient,
    );

    // Wait for the error message to be displayed
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(screen.queryByText("Nghia")).not.toBeInTheDocument();
  });

  it("TC_ACC_005: should handle pagination correctly", async () => {
    // 1. Setup: Mock API to return data with multiple pages
    const multiPageData = { ...mockSuccessData, totalPages: 3 };
    mockedUserService.getAllAccount.mockResolvedValue(multiPageData);
    const user = userEvent.setup();

    renderWithProviders(
      <AccountTable searchQuery="" roleQuery="All" />,
      queryClient,
    );

    // 2. Wait for initial data to load
    await screen.findByText("Nghia");

    // Ensure the first call is for page 0
    expect(mockedUserService.getAllAccount).toHaveBeenCalledWith(
      "", // searchQuery
      5, // page size
      "", // roleQuery
      0, // page index
    );

    // 3. Find and click the 'Next' button
    const nextPageButton = screen.getByRole("button", { name: /sau/i });
    await user.click(nextPageButton);

    // 4. Assertions
    // Wait for the query to be refetched
    await waitFor(() => {
      // Check that getAllAccount was called again, this time for page 2 (index 1)
      expect(mockedUserService.getAllAccount).toHaveBeenCalledWith(
        "", // searchQuery
        5, // page size
        "", // roleQuery
        1, // page index for the second page
      );
    });

    // The total number of calls should be 2 (initial fetch + pagination fetch)
    expect(mockedUserService.getAllAccount).toHaveBeenCalledTimes(2);
  });

  it("TC_ACC_004: should handle successful deletion of an account", async () => {
    // 1. Setup initial state: data is fetched successfully
    mockedUserService.getAllAccount.mockResolvedValue(mockSuccessData);
    // Mock the delete mutation to succeed
    mockedUserService.deleteUser.mockResolvedValue({
      message: "Success",
      statusCode: "200",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {} as any,
    });
    const user = userEvent.setup();
    renderWithProviders(
      <AccountTable searchQuery="" roleQuery="All" />,
      queryClient,
    );
    // 2. Wait for the table to load data
    const userRow = await screen.findByText("Nghia");
    const row = userRow.closest("tr") as HTMLTableRowElement;

    // 3. Find and click the delete button within that specific row
    const deleteButton = within(row).getByRole("button", {
      name: /xóa tài khoản/i,
    });
    await user.click(deleteButton);

    // 4. Assertions
    // Check that the success toast message appears
    expect(
      await screen.findByText("Xóa tài khoản thành công"),
    ).toBeInTheDocument();

    // Check that the deleteUser function was called with the correct ID
    expect(mockedUserService.deleteUser).toHaveBeenCalledWith("1");
    expect(mockedUserService.deleteUser).toHaveBeenCalledTimes(1);
  });
});
