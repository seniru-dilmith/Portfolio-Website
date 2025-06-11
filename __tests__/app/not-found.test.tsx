import React from "react";
import { render, screen } from "@testing-library/react";
import Custom404 from "@/app/not-found";
import "@testing-library/jest-dom";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div className={className} {...props}>
        {children}
      </div>
    ),
    button: ({ children, className, onClick, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
      <button className={className} onClick={onClick} {...props}>
        {children}
      </button>
    ),
  },
}));

// Mock Next.js Link
jest.mock("next/link", () => {
  return function MockLink({ 
    href, 
    children 
  }: { 
    href: string; 
    children: React.ReactNode; 
  }) {
    return (
      <a href={href} data-testid={`link-${href}`}>
        {children}
      </a>
    );
  };
});

// Mock Next.js Image
jest.mock("next/image", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return function MockImage(props: any) {
    const { src, alt, ...rest } = props;
    return <div data-testid="404-image" data-src={src} data-alt={alt} {...rest} />;
  };
});

describe("Custom404 Page", () => {
  it("renders without crashing", () => {
    render(<Custom404 />);
    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("displays 404 error message", () => {
    render(<Custom404 />);
    expect(screen.getByText("404")).toBeInTheDocument();
    expect(screen.getByText("Oops! Page not found")).toBeInTheDocument();
  });

  it("displays appropriate error description", () => {
    render(<Custom404 />);
    expect(
      screen.getByText(/The page you're looking for doesn't exist or has been moved/)
    ).toBeInTheDocument();
  });

  it("renders 404 illustration", () => {
    render(<Custom404 />);
    const image = screen.getByTestId("404-image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("data-src", "/404-illustration.svg");
    expect(image).toHaveAttribute("data-alt", "Lost astronaut illustration");
  });

  it("renders a link back to home", () => {
    render(<Custom404 />);
    const homeLink = screen.getByTestId("link-/");
    expect(homeLink).toBeInTheDocument();
    expect(screen.getByText("Go Back Home")).toBeInTheDocument();
  });

  it("has correct container styling classes", () => {
    const { container } = render(<Custom404 />);
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass("min-h-screen");
    expect(mainDiv).toHaveClass("flex");
    expect(mainDiv).toHaveClass("flex-col");
    expect(mainDiv).toHaveClass("items-center");
    expect(mainDiv).toHaveClass("justify-center");
  });
});
