import { render, screen } from "@testing-library/react";
import Contact from "@/components/contact/Contact";
import "@testing-library/jest-dom";

describe("Contact", () => {
  it("renders contact email link", () => {
    render(<Contact />);
    const link = screen.getByRole("link", { name: /contact me/i });
    expect(link).toHaveAttribute("href", expect.stringContaining("mailto:"));
  });
});
