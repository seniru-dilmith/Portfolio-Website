import React from "react";
import { render, screen } from "@testing-library/react";
import Contact from "@/components/contact/Contact";
import "@testing-library/jest-dom";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
    a: ({ children, className, href, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a className={className} href={href} {...props}>
        {children}
      </a>
    ),
    section: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <section className={className} {...props}>
        {children}
      </section>
    ),
    ul: ({ children, className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
      <ul className={className} {...props}>
        {children}
      </ul>
    ),
    li: ({ children, className, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
      <li className={className} {...props}>
        {children}
      </li>
    ),
    h3: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
      <h3 className={className} {...props}>
        {children}
      </h3>
    ),
  },
}));

describe("Contact", () => {
  it("renders contact email link", () => {
    render(<Contact />);
    const link = screen.getByRole("link", { name: /contact me/i });
    expect(link).toHaveAttribute("href", "mailto:dilmithseniru@gmail.com");
  });

  it("displays personal details section", () => {
    render(<Contact />);
    expect(screen.getByText("Personal Details")).toBeInTheDocument();
  });

  it("shows email in personal details", () => {
    render(<Contact />);
    expect(screen.getByText("Email:")).toBeInTheDocument();
    expect(screen.getByText("dilmithseniru@gmail.com")).toBeInTheDocument();
  });

  it("shows phone number in personal details", () => {
    render(<Contact />);
    expect(screen.getByText("Phone:")).toBeInTheDocument();
    expect(screen.getByText("+94 71 462 5671")).toBeInTheDocument();
  });

  it("shows location in personal details", () => {
    render(<Contact />);
    expect(screen.getByText("Location:")).toBeInTheDocument();
    expect(screen.getByText("Horana, Sri Lanka")).toBeInTheDocument();
  });

  it("renders social media links", () => {
    render(<Contact />);
    
    // Check for social media icons (FontAwesome classes)
    const socialLinks = document.querySelectorAll('a[target="_blank"]');
    expect(socialLinks.length).toBeGreaterThan(0);
  });
});
