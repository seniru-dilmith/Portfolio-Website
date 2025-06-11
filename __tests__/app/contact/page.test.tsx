import React from "react";
import { render, screen } from "@testing-library/react";
import ContactMe from "@/app/contact/page";
import "@testing-library/jest-dom";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
  },
}));

// Mock components
jest.mock("@/components/contact/HeroForContact", () => {
  return function MockHeroForContact() {
    return <div data-testid="hero-for-contact">Hero for Contact</div>;
  };
});

jest.mock("@/components/footer/Footer", () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  };
});

jest.mock("@/components/contact/Contact", () => {
  return function MockContact() {
    return <div data-testid="contact-component">Contact Component</div>;
  };
});

// Mock Next.js Head
jest.mock("next/head", () => {
  return function MockHead({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  };
});

describe("ContactMe Page", () => {
  it("renders without crashing", () => {
    render(<ContactMe />);
    expect(screen.getByTestId("hero-for-contact")).toBeInTheDocument();
    expect(screen.getByTestId("contact-component")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("renders all main components", () => {
    render(<ContactMe />);
    
    expect(screen.getByTestId("hero-for-contact")).toBeInTheDocument();
    expect(screen.getByTestId("contact-component")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("has correct page structure", () => {
    const { container } = render(<ContactMe />);
    
    // Check that the page has the expected structure
    expect(container.firstChild).toBeInTheDocument();
  });
});
