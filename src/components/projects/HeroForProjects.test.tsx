import React from "react";
import { render, screen } from "@testing-library/react";
import HeroForProjects from "./HeroForProjects";
import "@testing-library/jest-dom";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => <p {...props}>{children}</p>,
  },
}));

// Mock next/link
jest.mock("next/link", () => {
  return ({ href, children }: { href: string; children: React.ReactNode }) => <a href={href} data-testid="next-link">{children}</a>;
});

describe("HeroForProjects", () => {
  it("renders the main heading, subtitle, and contact link", () => {
    render(<HeroForProjects />);
    expect(screen.getByRole("heading", { name: /check out my projects/i })).toBeInTheDocument();
    expect(screen.getByText(/explore my portfolio/i)).toBeInTheDocument();
    const contactLink = screen.getByTestId("next-link");
    expect(contactLink).toHaveAttribute("href", "/contact");
    expect(contactLink).toHaveTextContent(/contact me/i);
  });
}); 