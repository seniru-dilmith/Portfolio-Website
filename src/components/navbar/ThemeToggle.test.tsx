import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "@/components/navbar/ThemeToggle";
import { ThemeContext } from "@/context/ThemeContext";
import "@testing-library/jest-dom";

// Mock ThemeContext
const mockToggleTheme = jest.fn();

const renderWithTheme = (theme: "light" | "dark" = "light") => {
  const mockThemeContext = {
    theme,
    toggleTheme: mockToggleTheme,
  };

  return render(
    <ThemeContext.Provider value={mockThemeContext}>
      <ThemeToggle />
    </ThemeContext.Provider>
  );
};

describe("ThemeToggle", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders theme toggle switch", () => {
    renderWithTheme();
    const input = screen.getByRole("checkbox", { name: /toggle dark mode/i });
    expect(input).toBeInTheDocument();
  });

  it("shows light theme when theme is light", () => {
    renderWithTheme("light");
    const input = screen.getByRole("checkbox", { name: /toggle dark mode/i });
    expect(input).not.toBeChecked();
  });

  it("shows dark theme when theme is dark", () => {
    renderWithTheme("dark");
    const input = screen.getByRole("checkbox", { name: /toggle dark mode/i });
    expect(input).toBeChecked();
  });

  it("calls toggleTheme when clicked", async () => {
    const user = userEvent.setup();
    renderWithTheme();
    
    const input = screen.getByRole("checkbox", { name: /toggle dark mode/i });
    await user.click(input);
    
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it("calls toggleTheme when using fireEvent", () => {
    renderWithTheme();
    
    const input = screen.getByRole("checkbox", { name: /toggle dark mode/i });
    fireEvent.click(input);
    
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it("has proper accessibility attributes", () => {
    renderWithTheme();
    
    const input = screen.getByRole("checkbox", { name: /toggle dark mode/i });
    expect(input).toHaveAttribute("aria-label", "Toggle dark mode");
    expect(input).toHaveAttribute("type", "checkbox");
  });

  it("renders without crashing when theme context is null", () => {
    render(
      <ThemeContext.Provider value={undefined}>
        <ThemeToggle />
      </ThemeContext.Provider>
    );
    
    // Should render without errors but not show the toggle
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
  });
});
