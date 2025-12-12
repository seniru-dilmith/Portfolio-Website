import React from "react";
import { render, screen, waitFor, act } from "@testing-library/react";
import Articles from "@/app/articles/page";
import "@testing-library/jest-dom";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} {...props}>{children}</div>
    ),
    button: ({ children, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button className={className} {...props}>{children}</button>
    ),
  },
}));

// Mock Next.js navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock AuthContext
jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

import { useAuth } from "@/context/AuthContext";
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Mock components
jest.mock("@/components/articles/ArticleHero", () => {
  return function MockArticleHero() {
    return <div data-testid="article-hero">Article Hero</div>;
  };
});

jest.mock("@/components/articles/ArticleSearch", () => {
  return function MockArticleSearch({ searchQuery, setSearchQuery }: { searchQuery: string, setSearchQuery: (q: string) => void }) {
    return (
      <input
        data-testid="article-search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    );
  };
});

jest.mock("@/components/ui/LoadingIndicator", () => {
  return function MockLoadingIndicator({ show }: { show: boolean }) {
    if (!show) return null;
    return <div data-testid="loading-spinner">Loading Indicator</div>;
  };
});

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe("Articles Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      handleLogin: jest.fn(),
      handleLogout: jest.fn(),
      isLoading: false,
    });
  });

  it("renders without crashing", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    } as Response);

    await act(async () => {
      render(<Articles />);
    });

    expect(screen.getByTestId("article-hero")).toBeInTheDocument();
  });

  it("fetches and displays articles on mount", async () => {
    const mockArticles = [
      { _id: "1", title: "Test Article", content: "Test content", tags: ["test"], author: "Test User", createdAt: new Date().toISOString(), summary: "Summary" },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockArticles }),
    } as Response);

    render(<Articles />);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/articles", {});
    });

    await waitFor(() => {
      expect(screen.getByText("Test Article")).toBeInTheDocument();
      expect(screen.getByText("Summary")).toBeInTheDocument();
    });
  });

  it("shows loading spinner while fetching articles", async () => {
    mockFetch.mockImplementation(() => new Promise(() => { })); // Never resolves

    render(<Articles />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("shows 'Write Article' button when authenticated", async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      handleLogin: jest.fn(),
      handleLogout: jest.fn(),
      isLoading: false,
    });

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: [] }),
    } as Response);

    await act(async () => {
      render(<Articles />);
    });

    // Check for the button/link to create new article
    expect(screen.getByText(/Write Article/i)).toBeInTheDocument();
  });
});
