import { render, screen } from "@testing-library/react";
import { Component } from "@/components/component";
import "@testing-library/jest-dom";

describe("Component", () => {
  it("renders login form", () => {
    render(<Component />);
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  });

  it("renders email and password inputs", () => {
    render(<Component />);
    expect(screen.getByLabelText(/login/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("renders sign in button", () => {
    render(<Component />);
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });
});
