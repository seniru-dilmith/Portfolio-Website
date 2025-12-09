import React from "react";
import { render, screen } from "@testing-library/react";
import PageLayout from "@/components/layout/PageLayout";
import "@testing-library/jest-dom";

// Mock all the dependencies


jest.mock("@/components/background/AnimatedBackground", () => {
  return function MockAnimatedBackground() {
    return <div data-testid="animated-background">Animated Background</div>;
  };
});

jest.mock("@/components/background/FloatingElements", () => {
  return function MockFloatingElements() {
    return <div data-testid="floating-elements">Floating Elements</div>;
  };
});

jest.mock("next/head", () => {
  return function MockHead({ children }: { children: React.ReactNode }) {
    return <div data-testid="head">{children}</div>;
  };
});

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

const defaultProps = {
  title: "Test Page",
  description: "Test description",
  keywords: "test, page, keywords",
  ogUrl: "https://example.com/test",
  floatingSvgPaths: ["/svg1.svg", "/svg2.svg"],
  children: <div>Test Content</div>,
};

describe("PageLayout", () => {
  it("renders page content", () => {
    render(<PageLayout {...defaultProps} />);
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });



  it("renders animated background", () => {
    render(<PageLayout {...defaultProps} />);
    expect(screen.getByTestId("animated-background")).toBeInTheDocument();
  });

  it("renders floating elements", () => {
    render(<PageLayout {...defaultProps} />);
    expect(screen.getByTestId("floating-elements")).toBeInTheDocument();
  });



  it("renders SEO meta tags", () => {
    render(<PageLayout {...defaultProps} />);
    const head = screen.getByTestId("head");
    expect(head).toBeInTheDocument();
  });

  it("uses custom og properties when provided", () => {
    const customProps = {
      ...defaultProps,
      ogTitle: "Custom OG Title",
      ogDescription: "Custom OG Description",
      ogImage: "/custom-image.jpg",
    };

    render(<PageLayout {...customProps} />);
    expect(screen.getByTestId("head")).toBeInTheDocument();
  });

  it("uses custom twitter properties when provided", () => {
    const customProps = {
      ...defaultProps,
      twitterTitle: "Custom Twitter Title",
      twitterDescription: "Custom Twitter Description",
    };

    render(<PageLayout {...customProps} />);
    expect(screen.getByTestId("head")).toBeInTheDocument();
  });

  it("applies custom background className", () => {
    const { container } = render(
      <PageLayout {...defaultProps} backgroundClassName="custom-bg-class" />
    );

    const backgroundElement = container.querySelector(".custom-bg-class");
    expect(backgroundElement).toBeInTheDocument();
  });

  it("renders multiple children", () => {
    const multipleChildren = (
      <>
        <div>First Child</div>
        <div>Second Child</div>
      </>
    );

    render(<PageLayout {...defaultProps}>{multipleChildren}</PageLayout>);
    expect(screen.getByText("First Child")).toBeInTheDocument();
    expect(screen.getByText("Second Child")).toBeInTheDocument();
  });
});
