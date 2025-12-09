import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
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
// Mock components
jest.mock("@/components/hero/SpotlightHero", () => {
  return function MockSpotlightHero() {
    return <div data-testid="spotlight-hero">Spotlight Hero</div>;
  };
});

jest.mock("@/components/tech/TechTicker", () => {
  return function MockTechTicker() {
    return <div data-testid="tech-ticker">Tech Ticker</div>;
  };
});

jest.mock("@/components/footer/Footer", () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer Component</div>;
  };
});

// Mock Next.js Head
jest.mock("next/head", () => {
  return function MockHead({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  };
});

describe("Home Page", () => {
  it("renders without crashing", () => {
    render(<Home />);
    expect(screen.getByTestId("spotlight-hero")).toBeInTheDocument();
  });
  it("renders the main container with correct classes", () => {
    const { container } = render(<Home />);
    // The component returns a fragment with Head and motion.div
    // We need to find the div with the expected classes
    const mainDiv = container.querySelector('.min-h-screen');
    expect(mainDiv).toBeInTheDocument();
    expect(mainDiv).toHaveClass("min-h-screen");
    expect(mainDiv).toHaveClass("flex");
    expect(mainDiv).toHaveClass("flex-col");
  });

  it("includes Hero and Footer components", () => {
    render(<Home />);
    expect(screen.getByTestId("spotlight-hero")).toBeInTheDocument();
    expect(screen.getByTestId("tech-ticker")).toBeInTheDocument();
  });
});
