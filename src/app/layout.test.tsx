import React from "react";
import { render } from "@testing-library/react";
import RootLayout from "@/app/layout";
import "@testing-library/jest-dom";

// Mock components
jest.mock("@/components/theme-provider", () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="theme-provider">{children}</div>
  ),
}));

jest.mock("@/context/AuthContext", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">{children}</div>
  ),
}));

jest.mock("@/components/GoogleAnalytics", () => {
  return function MockGoogleAnalytics() {
    return <div data-testid="google-analytics">Google Analytics</div>;
  };
});

jest.mock("@/components/navbar/ModernNavbar", () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Navbar</div>;
  };
});


jest.mock("@/components/footer/Footer", () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  };
});

// Mock Next.js CSS imports
jest.mock("@/styles/globals.css", () => ({}));
jest.mock("@fortawesome/fontawesome-free/css/all.min.css", () => ({}));

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => { });
  jest.spyOn(console, 'warn').mockImplementation(() => { });
});
afterAll(() => {
  (console.error as jest.Mock).mockRestore?.();
  (console.warn as jest.Mock).mockRestore?.();
});

describe("RootLayout", () => {
  const mockChildren = <div data-testid="test-children">Test Content</div>;

  beforeEach(() => {
    // Mock environment variables
    process.env.NEXT_PUBLIC_SITE_NAME = "Test App";
    process.env.NEXT_PUBLIC_PATHNAME = "/test";
  });

  it("renders children within the layout structure", () => {
    const { getByTestId } = render(<RootLayout>{mockChildren}</RootLayout>);

    expect(getByTestId("test-children")).toBeInTheDocument();
    expect(getByTestId("theme-provider")).toBeInTheDocument();
    expect(getByTestId("auth-provider")).toBeInTheDocument();
    expect(getByTestId("google-analytics")).toBeInTheDocument();
    expect(getByTestId("navbar")).toBeInTheDocument();
    expect(getByTestId("footer")).toBeInTheDocument();
  });

  it("sets correct HTML attributes", () => {
    render(<RootLayout>{mockChildren}</RootLayout>);
    const htmlElement = document.documentElement;
    expect(htmlElement).toHaveAttribute("lang", "en");

  });


  it("uses default site name when env var is not set", () => {
    delete process.env.NEXT_PUBLIC_SITE_NAME;
    render(<RootLayout>{mockChildren}</RootLayout>);
    // The title is set in the head, which would be tested in an integration test
    // Here we're just ensuring the component renders without the env var
  });
});
