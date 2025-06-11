import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ArticleDetail from "@/app/articles/[id]/page";
import "@testing-library/jest-dom";

// Mock Next.js navigation
const mockPush = jest.fn();
const mockParams = { id: "test-id" };

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useParams: () => mockParams,
}));

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
    button: ({ children, className, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button className={className} onClick={onClick} {...props}>
        {children}
      </button>
    ),
    article: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <article className={className} {...props}>
        {children}
      </article>
    ),
    h1: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h1 className={className} {...props}>
        {children}
      </h1>
    ),
  },
}));

// Mock AuthContext hook
jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

import { useAuth } from "@/context/AuthContext";

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Mock LoadingSpinner
jest.mock("@/components/LoadingSpinner", () => {
  return function LoadingSpinner() {
    return <div data-testid="loading-spinner">Loading...</div>;
  };
});

// Mock ArticleForm
jest.mock("@/components/articles/ArticleForm", () => {
  return function ArticleForm() {
    return <div data-testid="article-form">Article Form</div>;
  };
});

// Mock Footer
jest.mock("@/components/footer/Footer", () => {
  return function Footer() {
    return <footer data-testid="footer">Footer</footer>;
  };
});

// Mock fetch
global.fetch = jest.fn();

const mockArticle = {
  _id: "test-id",
  title: "Test Article",
  content: "This is test content for the article.\n\nThis is a second paragraph.",
  tags: ["React", "Testing"],
};

describe("ArticleDetail", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      handleLogin: jest.fn(),
      handleLogout: jest.fn(),
    });
  });

  it("shows loading spinner initially", () => {
    (fetch as jest.Mock).mockImplementation(() => new Promise(() => {})); // Never resolves
    
    render(<ArticleDetail />);
    
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("renders article content when loaded successfully", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockArticle }),
    });

    render(<ArticleDetail />);

    await waitFor(() => {
      expect(screen.getByText("Test Article")).toBeInTheDocument();
    });

    expect(screen.getByText("This is test content for the article.")).toBeInTheDocument();
    expect(screen.getByText("This is a second paragraph.")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Testing")).toBeInTheDocument();
  });

  it("shows error when article not found", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ success: false, message: "Article not found" }),
    });

    render(<ArticleDetail />);

    await waitFor(() => {
      expect(screen.getByText("Article Not Found")).toBeInTheDocument();
    });

    expect(screen.getByText("Article not found")).toBeInTheDocument();
  });

  it("navigates back to articles list when back button is clicked", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true, data: mockArticle }),
    });

    render(<ArticleDetail />);

    await waitFor(() => {
      expect(screen.getByText("Test Article")).toBeInTheDocument();
    });

    const backButton = screen.getByText("← Back to Articles");
    backButton.click();

    expect(mockPush).toHaveBeenCalledWith("/articles");
  });

  it("handles fetch error gracefully", async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error("Network error"));

    render(<ArticleDetail />);

    await waitFor(() => {
      expect(screen.getByText("Article Not Found")).toBeInTheDocument();
    });

    expect(screen.getByText("Failed to load article")).toBeInTheDocument();
  });
});
