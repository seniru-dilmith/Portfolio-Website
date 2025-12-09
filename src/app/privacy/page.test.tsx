import React from "react";
import { render, screen } from "@testing-library/react";
import PrivacyContent from "@/components/privacy/PrivacyContent";
import "@testing-library/jest-dom";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    div: ({ children, className, ...props }: any) => (
      <div className={className} {...props}>{children}</div>
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    h1: ({ children, className, ...props }: any) => (
      <h1 className={className} {...props}>{children}</h1>
    ),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    p: ({ children, className, ...props }: any) => (
      <p className={className} {...props}>{children}</p>
    ),
  },
}));

// Mock Link if used, but currently just <a> tags.

describe("PrivacyContent", () => {
  it("renders without crashing", () => {
    render(<PrivacyContent />);
    expect(screen.getByRole("heading", { level: 1, name: /privacy policy/i })).toBeInTheDocument();
  });

  it("renders all main section headings", () => {
    render(<PrivacyContent />);
    expect(screen.getByRole("heading", { name: /introduction/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /information we collect/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /how we use your information/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /contact us/i })).toBeInTheDocument();
  });

  it("renders the main introductory text", () => {
    render(<PrivacyContent />);
    expect(
      screen.getByText(/your privacy is important to us/i)
    ).toBeInTheDocument();
  });
});