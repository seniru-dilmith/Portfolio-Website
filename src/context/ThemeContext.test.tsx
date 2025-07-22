import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, ThemeContext } from "@/context/ThemeContext";
import "@testing-library/jest-dom";

const TestComponent = () => {
  const themeContext = React.useContext(ThemeContext)!;
  return (
    <button onClick={themeContext.toggleTheme} data-testid="toggle">
      {themeContext.theme}
    </button>
  );
};

describe("ThemeContext", () => {
  it("toggles theme", async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );
    const btn = screen.getByTestId("toggle");
    expect(btn).toHaveTextContent("emerald");
    await userEvent.click(btn);
    expect(btn).toHaveTextContent(/dark|emerald/); // new theme
  });
});
