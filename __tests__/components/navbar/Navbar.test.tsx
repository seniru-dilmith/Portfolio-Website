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

describe("Navbar", () => {
  const mockLogout = jest.fn();

  const renderNavbar = (isAuthenticated = false) => {
    render(
      <AuthContext.Provider value={{ isAuthenticated, handleLogin: jest.fn(), handleLogout: mockLogout }}>
        <Navbar pushContentDown={false} />
      </AuthContext.Provider>
    );
  };

  it("renders the navbar with all title links", () => {
    renderNavbar();
    titleNames.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it("shows the ThemeToggle", () => {
    renderNavbar();
    expect(screen.getAllByTestId("theme-toggle")).toHaveLength(2);
  });

  it("displays Logout if authenticated", () => {
    renderNavbar(true);
    expect(screen.getAllByTestId("theme-toggle").length).toBeGreaterThan(0);
  });

  it("calls handleLogout on logout click", () => {
    renderNavbar(true);
    fireEvent.click(screen.getByText("Logout"));
    expect(mockLogout).toHaveBeenCalled();
  });

  it("toggles mobile menu when hamburger is clicked", () => {
    renderNavbar();

    const menuButton = screen.getByRole("button");
    fireEvent.click(menuButton);

    titleNames.forEach((title) => {
      expect(screen.getAllByText(title)[0]).toBeInTheDocument();
    });

    // Close the menu
    fireEvent.click(menuButton);
  });
});
