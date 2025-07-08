import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock Button component
jest.mock("@/app/ui/components/_common/Button", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Button: (props: any) => {
    // Extract text content from children for test ID
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getTextContent = (children: any): string => {
      if (typeof children === "string" || typeof children === "number")
        return String(children);
      if (Array.isArray(children)) {
        return children.map(getTextContent).join("");
      }
      if (children && typeof children === "object" && children.props) {
        return getTextContent(children.props.children);
      }
      return "";
    };
    const textContent = getTextContent(props.children).replace(/\s+/g, "");
    let testId = "button-unknown";
    if (/^\d+$/.test(textContent)) testId = `button-${textContent}`;
    else if (textContent.includes("Trước")) testId = "button-Trước";
    else if (textContent.includes("Sau")) testId = "button-Sau";
    return (
      <button
        data-testid={testId}
        onClick={props.onClick || (() => {})}
        disabled={props.disabled}
        className={props.className}
      >
        {props.children}
      </button>
    );
  },
}));

const Pagination =
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require("@/app/ui/components/_common/Pagination").default;

describe("Pagination", () => {
  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    handlePageClick: jest.fn(),
    handlePreviousPage: jest.fn(),
    handleNextPage: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders pagination container", () => {
    render(<Pagination {...defaultProps} />);

    const container = screen.getByTestId("button-Trước").closest("div");
    expect(container).toHaveClass(
      "flex",
      "justify-end",
      "mt-4",
      "space-x-1",
      "h-8",
      "md:h-auto",
    );
  });

  it("renders previous button with correct text and functionality", () => {
    render(<Pagination {...defaultProps} currentPage={2} />);

    const prevButton = screen.getByTestId("button-Trước");
    expect(prevButton).toBeInTheDocument();
    expect(prevButton).not.toBeDisabled();

    fireEvent.click(prevButton);
    expect(defaultProps.handlePreviousPage).toHaveBeenCalled();
  });

  it("renders next button with correct text and functionality", () => {
    render(<Pagination {...defaultProps} currentPage={1} />);

    const nextButton = screen.getByTestId("button-Sau");
    expect(nextButton).toBeInTheDocument();
    expect(nextButton).not.toBeDisabled();

    fireEvent.click(nextButton);
    expect(defaultProps.handleNextPage).toHaveBeenCalled();
  });

  it("disables previous button when on first page", () => {
    render(<Pagination {...defaultProps} currentPage={1} />);

    const prevButton = screen.getByTestId("button-Trước");
    expect(prevButton).toBeDisabled();
  });

  it("disables next button when on last page", () => {
    render(<Pagination {...defaultProps} currentPage={5} />);

    const nextButton = screen.getByTestId("button-Sau");
    expect(nextButton).toBeDisabled();
  });

  it("renders page numbers correctly", () => {
    render(<Pagination {...defaultProps} />);

    // Should show pages 1, 2, 3 (MAX_DISPLAY_PAGES = 3)
    expect(screen.getByTestId("button-1")).toBeInTheDocument();
    expect(screen.getByTestId("button-2")).toBeInTheDocument();
    expect(screen.getByTestId("button-3")).toBeInTheDocument();
  });

  it("handles page click correctly", () => {
    render(<Pagination {...defaultProps} />);

    const page2Button = screen.getByTestId("button-2");
    fireEvent.click(page2Button);

    expect(defaultProps.handlePageClick).toHaveBeenCalledWith(2);
  });

  it("shows ellipsis when there are more pages than MAX_DISPLAY_PAGES", () => {
    render(<Pagination {...defaultProps} totalPages={10} currentPage={5} />);

    const ellipsisElements = screen.getAllByText("...");
    expect(ellipsisElements.length).toBeGreaterThan(0);
  });

  it("shows first page button when current page is far from start", () => {
    render(<Pagination {...defaultProps} totalPages={10} currentPage={8} />);

    const firstPageButton = screen.getByTestId("button-1");
    expect(firstPageButton).toBeInTheDocument();
  });

  it("shows last page button when current page is far from end", () => {
    render(<Pagination {...defaultProps} totalPages={10} currentPage={3} />);

    const lastPageButton = screen.getByTestId("button-10");
    expect(lastPageButton).toBeInTheDocument();
  });

  it("applies correct styling to current page button", () => {
    render(<Pagination {...defaultProps} currentPage={2} />);

    const currentPageButton = screen.getByTestId("button-2");
    expect(currentPageButton).toHaveClass(
      "bg-primary-dark",
      "text-white",
      "hover:bg-primary-darker",
      "shadow-md",
    );
  });

  it("applies correct styling to non-current page buttons", () => {
    render(<Pagination {...defaultProps} currentPage={1} />);

    const nonCurrentPageButton = screen.getByTestId("button-2");
    expect(nonCurrentPageButton).toHaveClass(
      "hover:bg-primary-lighter",
      "hover:text-primary-darkest",
    );
  });

  it("renders mobile version of previous button", () => {
    render(<Pagination {...defaultProps} />);
    const mobilePrevButton = screen.getAllByTestId("button-unknown")[0];
    expect(mobilePrevButton).toBeInTheDocument();
  });

  it("renders mobile version of next button", () => {
    render(<Pagination {...defaultProps} />);
    const mobileNextButton = screen.getAllByTestId("button-unknown")[1];
    expect(mobileNextButton).toBeInTheDocument();
  });

  it("does not render pagination when totalPages is 0", () => {
    render(<Pagination {...defaultProps} totalPages={0} />);

    expect(screen.queryByTestId("button-Trước")).not.toBeInTheDocument();
    expect(screen.queryByTestId("button-Sau")).not.toBeInTheDocument();
  });

  it("handles single page correctly", () => {
    render(<Pagination {...defaultProps} totalPages={1} />);

    expect(screen.getByTestId("button-1")).toBeInTheDocument();
    expect(screen.getByTestId("button-Trước")).toBeDisabled();
    expect(screen.getByTestId("button-Sau")).toBeDisabled();
  });

  it("shows correct page numbers when current page is in middle", () => {
    render(<Pagination {...defaultProps} totalPages={7} currentPage={4} />);

    // Should show pages 3, 4, 5 (centered around current page)
    expect(screen.getByTestId("button-3")).toBeInTheDocument();
    expect(screen.getByTestId("button-4")).toBeInTheDocument();
    expect(screen.getByTestId("button-5")).toBeInTheDocument();
  });

  it("shows correct page numbers when current page is near start", () => {
    render(<Pagination {...defaultProps} totalPages={7} currentPage={2} />);

    // Should show pages 1, 2, 3
    expect(screen.getByTestId("button-1")).toBeInTheDocument();
    expect(screen.getByTestId("button-2")).toBeInTheDocument();
    expect(screen.getByTestId("button-3")).toBeInTheDocument();
  });

  it("shows correct page numbers when current page is near end", () => {
    render(<Pagination {...defaultProps} totalPages={7} currentPage={6} />);

    // Should show pages 5, 6, 7
    expect(screen.getByTestId("button-5")).toBeInTheDocument();
    expect(screen.getByTestId("button-6")).toBeInTheDocument();
    expect(screen.getByTestId("button-7")).toBeInTheDocument();
  });
});
