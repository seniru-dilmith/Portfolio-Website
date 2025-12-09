import React from "react";
import { render, screen } from "@testing-library/react";
import HeroForProjects from "./HeroForProjects";
import "@testing-library/jest-dom";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: Object.assign(({
      children,
      ...props
    }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>, { displayName: "MockMotionDiv" }),
    h1: Object.assign(({
      children,
      ...props
    }: React.HTMLAttributes<HTMLHeadingElement>) => <h1 {...props}>{children}</h1>, { displayName: "MockMotionH1" }),
    p: Object.assign(({
      children,
      ...props
    }: React.HTMLAttributes<HTMLParagraphElement>) => <p {...props}>{children}</p>, { displayName: "MockMotionP" }),
  },
}));

// Mock next/link
jest.mock("next/link", () => {
  const MockNextLink = ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href} data-testid="next-link">{children}</a>;
  MockNextLink.displayName = "MockNextLink";
  return MockNextLink;
});

describe("HeroForProjects", () => {
  it("renders the main heading, subtitle, and contact link", () => {
    render(<HeroForProjects />);
    expect(screen.getByRole("heading", { name: /my projects/i })).toBeInTheDocument();
    expect(screen.getByText(/explore my portfolio/i)).toBeInTheDocument();
    const contactLink = screen.getByRole("link", { name: /contact me/i });
    expect(contactLink).toHaveAttribute("href", "/contact");
    expect(contactLink).toHaveTextContent(/contact me/i);
  });
}); 