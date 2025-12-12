import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ArticleDetail from "@/app/articles/[id]/page";
import "@testing-library/jest-dom";

// --- Mocks ---

// Mock Next.js navigation
const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockParams = { id: "test-id" };

jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockPush, replace: mockReplace }),
    useParams: () => mockParams,
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

// Mock react-markdown and remark-gfm to prevent ESM errors
jest.mock('react-markdown', () => {
    const MockReactMarkdown = ({ children }: { children: React.ReactNode }) => {
        return <div data-testid="mock-markdown">{children}</div>;
    };
    MockReactMarkdown.displayName = "MockReactMarkdown";
    return MockReactMarkdown;
});
jest.mock('remark-gfm', () => () => { }); // Mock the plugin with an empty function

// Mock AuthContext hook
jest.mock("@/context/AuthContext", () => ({ useAuth: jest.fn() }));

import { useAuth } from "@/context/AuthContext";
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

// Mock other components
jest.mock("@/components/LoadingSpinner", () => {
    const MockLoadingSpinner = () => <div data-testid="loading-spinner">Loading...</div>;
    MockLoadingSpinner.displayName = "MockLoadingSpinner";
    return MockLoadingSpinner;
});
jest.mock("@/components/articles/ArticleForm", () => {
    return jest.fn((props) => <div data-testid="article-form" data-article-id={props.articleId}>Article Form</div>);
});
jest.mock("@/components/footer/Footer", () => {
    const MockFooter = () => <footer data-testid="footer">Footer</footer>;
    MockFooter.displayName = "MockFooter";
    return MockFooter;
});

// Mock fetch API
global.fetch = jest.fn();

const mockArticle = {
    _id: "test-id",
    title: "Test Article",
    content: "This is test content.",
    tags: ["React", "Testing"],
    author: "Test Author",
    createdAt: new Date().toISOString(),
};

describe("ArticleDetail Page", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockUseAuth.mockReturnValue({
            isAuthenticated: false,
            handleLogin: jest.fn(),
            handleLogout: jest.fn(),
        });
    });

    it("renders article content when loaded successfully", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ success: true, data: mockArticle }),
        });

        render(<ArticleDetail />);

        await waitFor(() => {
            expect(screen.getByText("Test Article")).toBeInTheDocument();
        });

        const markdownContainer = screen.getByTestId("mock-markdown");
        expect(markdownContainer).toHaveTextContent(mockArticle.content);
    });

    it("passes articleId to ArticleForm when editing", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ success: true, data: mockArticle }),
        });
        mockUseAuth.mockReturnValue({
            isAuthenticated: true, // Authenticated to see Edit button
            handleLogin: jest.fn(),
            handleLogout: jest.fn(),
        });

        render(<ArticleDetail />);

        await waitFor(() => screen.getByText("Test Article"));

        const editButton = screen.getByText("Edit Article");
        editButton.click();

        const form = await screen.findByTestId("article-form");
        expect(form).toHaveAttribute("data-article-id", "test-id");
    });
});
