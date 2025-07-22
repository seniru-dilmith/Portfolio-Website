import { render, screen, fireEvent } from "@testing-library/react";
import Navbar from "@/components/navbar/Navbar";
import { AuthContext } from "@/context/AuthContext";
import { titleNames } from "@/components/navbar/titles";
import "@testing-library/jest-dom";

// Mock the ThemeToggle component to avoid rendering it
jest.mock("@/components/navbar/ThemeToggle", () => {
  const ThemeToggleMock = () => <div data-testid="theme-toggle" />;
  ThemeToggleMock.displayName = "ThemeToggle";
  return ThemeToggleMock;
});

// Mock usePathname from next/navigation
jest.mock("next/navigation", () => ({
  usePathname: jest.fn().mockReturnValue("/"),
}));

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

describe("Navbar", () => {
  const mockLogout = jest.fn();

  beforeEach(() => {
    mockLogout.mockClear();
  });

  const renderNavbar = (isAuthenticated = false) => {
    render(
      <AuthContext.Provider value={{ isAuthenticated, handleLogin: jest.fn(), handleLogout: mockLogout }}>
        <Navbar />
      </AuthContext.Provider>
    );
  };

  it("renders the navbar with all title links", () => {
    renderNavbar();
    titleNames.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it("shows the ThemeToggle components", () => {
    renderNavbar();
    expect(screen.getAllByTestId("theme-toggle")).toHaveLength(2);
  });

  it("displays Logout when authenticated", () => {
    renderNavbar(true);
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("calls handleLogout on logout click", () => {
    renderNavbar(true);
    fireEvent.click(screen.getByText("Logout"));
    expect(mockLogout).toHaveBeenCalled();
  });

  it("toggles mobile menu when hamburger is clicked", () => {
    renderNavbar();

    const menuButton = screen.getByLabelText("Open menu");
    fireEvent.click(menuButton);

    // After clicking, menu should be open and have close label
    expect(screen.getByLabelText("Close menu")).toBeInTheDocument();
  });

  it("renders home icon correctly", () => {
    renderNavbar();
    expect(screen.getByText("🏠")).toBeInTheDocument();
  });
});
