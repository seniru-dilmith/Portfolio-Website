import React from "react";
import { render, screen } from "@testing-library/react";
import PrivacyPolicy from "./page";
import "@testing-library/jest-dom";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    main: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <main className={className} {...props}>{children}</main>
    ),
    section: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => (
      <section className={className} {...props}>{children}</section>
    ),
  },
}));

// Mock Footer
jest.mock("@/components/footer/Footer", () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer</div>;
  };
});

// Mock Next.js Head
jest.mock("next/head", () => {
  return function MockHead({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  };
});

describe("PrivacyPolicy Page", () => {
  it("renders without crashing", () => {
    render(<PrivacyPolicy />);
    // Main heading (h1)
    expect(screen.getByRole("heading", { level: 1, name: /privacy policy/i })).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });

  it("renders all main section headings", () => {
    render(<PrivacyPolicy />);
    // Section headings (h2)
    expect(screen.getByRole("heading", { name: /information we collect/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /how we use your information/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /information sharing and disclosure/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /data security/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /your rights/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /^cookies$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /changes to this privacy policy/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /contact us/i })).toBeInTheDocument();
  });

  it("renders the main introductory paragraph", () => {
    render(<PrivacyPolicy />);
    expect(
      screen.getByText(/your privacy is of utmost importance to us/i)
    ).toBeInTheDocument();
  });
}); 