import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Switch from "@/components/navbar/ThemeToggle";
import { ThemeProvider } from "@/context/ThemeContext";
import "@testing-library/jest-dom";

describe("ThemeToggle", () => {
  it("toggles theme", async () => {
    render(
      <ThemeProvider>
        <Switch />
      </ThemeProvider>
    );
    const input = screen.getByRole("checkbox");
    await userEvent.click(input);
    expect(input).toBeChecked();
  });
});
