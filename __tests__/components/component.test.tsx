import { render, screen } from "@testing-library/react";
import { Component } from "@/components/component";
import "@testing-library/jest-dom";

describe("Component", () => {
  it("renders login title", () => {
    render(<Component />);
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
  });
});
