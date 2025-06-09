import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ArticleList from "@/components/articles/ArticleList";
import "@testing-library/jest-dom";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
}));

// Mock AuthContext hook
jest.mock("@/context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

import { useAuth } from "@/context/AuthContext";

const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

const mockArticles = [
  { _id: "1", title: "Test Article 1", content: "This is test content for article 1", tags: ["React", "Testing"] },
  { _id: "2", title: "Test Article 2", content: "This is test content for article 2", tags: ["JavaScript", "Node.js"] },
];

const defaultProps = {
  articles: mockArticles,
  onEdit: jest.fn(),
  onDelete: jest.fn(),
};

describe("ArticleList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders article titles and content", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      handleLogin: jest.fn(),
      handleLogout: jest.fn(),
    });

    render(<ArticleList {...defaultProps} />);
    
    expect(screen.getByText("Test Article 1")).toBeInTheDocument();
    expect(screen.getByText("Test Article 2")).toBeInTheDocument();
    expect(screen.getByText("This is test content for article 1")).toBeInTheDocument();
    expect(screen.getByText("This is test content for article 2")).toBeInTheDocument();
  });

  it("shows edit and delete buttons when authenticated", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      handleLogin: jest.fn(),
      handleLogout: jest.fn(),
    });

    render(<ArticleList {...defaultProps} />);
    
    const editButtons = screen.getAllByText("Edit");
    const deleteButtons = screen.getAllByText("Delete");
    
    expect(editButtons).toHaveLength(2);
    expect(deleteButtons).toHaveLength(2);
  });

  it("hides edit and delete buttons when not authenticated", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      handleLogin: jest.fn(),
      handleLogout: jest.fn(),
    });

    render(<ArticleList {...defaultProps} />);
    
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
  });

  it("calls onEdit when edit button is clicked", () => {
    const mockOnEdit = jest.fn();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      handleLogin: jest.fn(),
      handleLogout: jest.fn(),
    });

    render(<ArticleList {...defaultProps} onEdit={mockOnEdit} />);
    
    const editButtons = screen.getAllByText("Edit");
    fireEvent.click(editButtons[0]);
    
    expect(mockOnEdit).toHaveBeenCalledWith(mockArticles[0]);
  });

  it("calls onDelete when delete button is clicked", () => {
    const mockOnDelete = jest.fn();
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      handleLogin: jest.fn(),
      handleLogout: jest.fn(),
    });

    render(<ArticleList {...defaultProps} onDelete={mockOnDelete} />);
    
    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);
    
    expect(mockOnDelete).toHaveBeenCalledWith("1");
  });

  it("renders empty state gracefully when no articles", () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      handleLogin: jest.fn(),
      handleLogout: jest.fn(),
    });

    render(<ArticleList {...defaultProps} articles={[]} />);
    
    // Component should render without errors
    const container = document.querySelector('.grid');
    expect(container).toBeInTheDocument();
  });
});
