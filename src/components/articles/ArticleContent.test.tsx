import React from "react";
import { render, screen } from "@testing-library/react";
import ArticleContent from "@/components/articles/ArticleContent";
import "@testing-library/jest-dom";

// --- Mocks ---

// Mock Next.js navigation
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockRefresh = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush, replace: mockReplace, refresh: mockRefresh }),
}));

// Mock framer-motion
jest.mock("framer-motion", () => {
    const MotionMock = ({ children, ...props }: { children: React.ReactNode }) => <div {...props}>{children}</div>;
    return {
        motion: {
            div: MotionMock,
            button: MotionMock,
            article: MotionMock,
            h1: MotionMock,
        }
    };
});

// Mock react-markdown and remark-gfm
jest.mock('react-markdown', () => {
    const MockReactMarkdown = ({ children }: { children: React.ReactNode }) => {
        return <div data-testid="mock-markdown">{children}</div>;
    };
    MockReactMarkdown.displayName = "MockReactMarkdown";
    return MockReactMarkdown;
});
jest.mock('remark-gfm', () => () => { });

// Mock AuthContext
jest.mock("@/context/AuthContext", () => ({ useAuth: jest.fn() }));

import { useAuth } from "@/context/AuthContext";
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Mock ArticleForm
jest.mock("@/components/articles/ArticleForm", () => {
    return jest.fn((props) => <div data-testid="article-form" data-article-id={props.articleId}>Article Form</div>);
});

// Mock fetch API
global.fetch = jest.fn();

const mockArticle = {
    _id: "test-id",
    title: "Test Article",
    content: "This is test content.",
    summary: "Test summary",
    tags: ["React", "Testing"],
    author: "Test Author",
    createdAt: new Date().toISOString(),
    seoTitle: "Test SEO Title",
    seoDescription: "Test SEO Description",
    seoKeywords: "test, seo",
};

describe("ArticleContent Component", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            isLoading: false,
            handleLogin: jest.fn(),
            handleLogout: jest.fn(),
        });
    });

    it("renders article content from props", () => {
        render(<ArticleContent initialArticle={mockArticle} />);

        expect(screen.getByText("Test Article")).toBeInTheDocument();
        const markdownContainer = screen.getByTestId("mock-markdown");
        expect(markdownContainer).toHaveTextContent(mockArticle.content);
    });

    it("renders Edit button when authenticated", () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            isLoading: false,
            handleLogin: jest.fn(),
            handleLogout: jest.fn(),
        });

        render(<ArticleContent initialArticle={mockArticle} />);

        expect(screen.getByText("Edit Article")).toBeInTheDocument();
    });

    it("switches to edit mode when Edit button is clicked", async () => {
        mockUseAuth.mockReturnValue({
            isAuthenticated: true,
            isLoading: false,
            handleLogin: jest.fn(),
            handleLogout: jest.fn(),
        });

        render(<ArticleContent initialArticle={mockArticle} />);

        const editButton = screen.getByText("Edit Article");
        editButton.click();

        const form = await screen.findByTestId("article-form");
        expect(form).toBeInTheDocument();
        expect(form).toHaveAttribute("data-article-id", "test-id");
    });
});

import { CustomImageRenderer } from './markdownRenderers';

describe("CustomImageRenderer", () => {
    it("renders with default classes", () => {
        render(<CustomImageRenderer src="test.jpg" alt="Test Image" />);
        const img = screen.getByRole("img");
        expect(img).toHaveClass("max-w-full");
        expect(img).toHaveAttribute("alt", "Test Image");
    });

    it("renders with #left classes", () => {
        render(<CustomImageRenderer src="test.jpg" alt="Test Image#left" />);
        const img = screen.getByRole("img");
        expect(img).toHaveClass("float-left");
        expect(img).not.toHaveClass("float-right");
        expect(img).toHaveAttribute("alt", "Test Image");
    });

    it("renders with #right classes", () => {
        render(<CustomImageRenderer src="test.jpg" alt="Test Image#right" />);
        const img = screen.getByRole("img");
        expect(img).toHaveClass("float-right");
        expect(img).toHaveAttribute("alt", "Test Image");
    });

    it("renders with #center classes", () => {
        render(<CustomImageRenderer src="test.jpg" alt="Test Image#center" />);
        const img = screen.getByRole("img");
        expect(img).toHaveClass("mx-auto");
        expect(img).toHaveAttribute("alt", "Test Image");
    });
});
